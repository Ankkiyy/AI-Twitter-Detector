import pandas as pd
import torch
from torch.utils.data import Dataset, DataLoader
from transformers import AutoTokenizer, AutoModel
from transformers import TrainingArguments, Trainer
import torch.nn as nn
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

# Load datasets
non_hostile = pd.read_csv("./src/non_Hostile.csv")  # Contains 'Text', 'Label'
hostile = pd.read_csv("./src/ostile.csv")         # Contains 'Text', 'Label', 'SubLabel'

# Add SubLabel column to non-hostile and fill with 'None'
non_hostile['SubLabel'] = "None"

# Combine both datasets
data = pd.concat([non_hostile, hostile]).reset_index(drop=True)

# Encode Label and SubLabel as integers
label_encoder = LabelEncoder()
data['Label'] = label_encoder.fit_transform(data['Label'])  # Non-Hostile = 0, Hostile = 1
data['SubLabel'] = label_encoder.fit_transform(data['SubLabel'])  # Convert SubLabel categories to integers

# Split dataset into train and validation sets
train_texts, val_texts, train_labels, val_labels = train_test_split(
    data['Text'], data[['Label', 'SubLabel']], test_size=0.2, random_state=42
)

# Tokenizer
tokenizer = AutoTokenizer.from_pretrained("ai4bharat/indic-bert")

# Dataset class
class TweetDataset(Dataset):
    def __init__(self, texts, labels, sublabels, tokenizer, max_len=128):
        self.texts = texts
        self.labels = labels
        self.sublabels = sublabels
        self.tokenizer = tokenizer
        self.max_len = max_len

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):
        text = str(self.texts[idx])
        label = self.labels[idx]
        sublabel = self.sublabels[idx]
        encoding = self.tokenizer(
            text,
            padding="max_length",
            truncation=True,
            max_length=self.max_len,
            return_tensors="pt"
        )
        return {
            'input_ids': encoding['input_ids'].squeeze(0),
            'attention_mask': encoding['attention_mask'].squeeze(0),
            'label': torch.tensor(label, dtype=torch.long),
            'sublabel': torch.tensor(sublabel, dtype=torch.long)
        }

# Prepare datasets for DataLoader
train_dataset = TweetDataset(
    texts=train_texts.tolist(),
    labels=train_labels['Label'].tolist(),
    sublabels=train_labels['SubLabel'].tolist(),
    tokenizer=tokenizer
)

val_dataset = TweetDataset(
    texts=val_texts.tolist(),
    labels=val_labels['Label'].tolist(),
    sublabels=val_labels['SubLabel'].tolist(),
    tokenizer=tokenizer
)

# Model with Multi-Task Heads
class MultiTaskModel(nn.Module):
    def __init__(self, base_model_name, num_labels, num_sublabels):
        super(MultiTaskModel, self).__init__()
        self.base_model = AutoModel.from_pretrained(base_model_name)
        self.dropout = nn.Dropout(0.3)
        self.label_classifier = nn.Linear(self.base_model.config.hidden_size, num_labels)
        self.sublabel_classifier = nn.Linear(self.base_model.config.hidden_size, num_sublabels)

    def forward(self, input_ids, attention_mask):
        outputs = self.base_model(input_ids=input_ids, attention_mask=attention_mask)
        pooled_output = outputs[1]  # CLS token output
        pooled_output = self.dropout(pooled_output)

        label_logits = self.label_classifier(pooled_output)
        sublabel_logits = self.sublabel_classifier(pooled_output)
        return label_logits, sublabel_logits

# Initialize model
num_labels = len(data['Label'].unique())  # Hostile/Non-Hostile
num_sublabels = len(data['SubLabel'].unique())  # Sub-categories of hostility
model = MultiTaskModel("ai4bharat/indic-bert", num_labels, num_sublabels)

# Data collator for batching
def data_collator(batch):
    input_ids = torch.stack([item['input_ids'] for item in batch])
    attention_mask = torch.stack([item['attention_mask'] for item in batch])
    labels = torch.stack([item['label'] for item in batch])
    sublabels = torch.stack([item['sublabel'] for item in batch])
    return {
        'input_ids': input_ids,
        'attention_mask': attention_mask,
        'labels': labels,
        'sublabels': sublabels
    }

# Custom loss function for multi-task
class MultiTaskLoss(nn.Module):
    def __init__(self):
        super(MultiTaskLoss, self).__init__()
        self.label_loss = nn.CrossEntropyLoss()
        self.sublabel_loss = nn.CrossEntropyLoss()

    def forward(self, label_logits, sublabel_logits, labels, sublabels):
        loss1 = self.label_loss(label_logits, labels)
        loss2 = self.sublabel_loss(sublabel_logits, sublabels)
        return loss1 + loss2

# Training arguments
training_args = TrainingArguments(
    output_dir="./results",
    evaluation_strategy="epoch",
    save_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=16,
    num_train_epochs=3,
    weight_decay=0.01,
    logging_dir="./logs",
    logging_steps=10,
    load_best_model_at_end=True,
)

# Trainer
class MultiTaskTrainer(Trainer):
    def compute_loss(self, model, inputs, return_outputs=False):
        labels = inputs.pop("labels")
        sublabels = inputs.pop("sublabels")
        label_logits, sublabel_logits = model(**inputs)
        loss = MultiTaskLoss()(label_logits, sublabel_logits, labels, sublabels)
        return (loss, (label_logits, sublabel_logits)) if return_outputs else loss

trainer = MultiTaskTrainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
    tokenizer=tokenizer,
    data_collator=data_collator
)

# Train the model
trainer.train()
