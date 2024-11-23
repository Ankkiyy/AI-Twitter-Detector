import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
import asyncio

# Load the saved vectorizer and model
tfidf_binary = joblib.load('api/extensions/ml/tfidf_binary_vectorizer.pkl')
binary_model = joblib.load('api/extensions/ml/binary_classification_model.pkl')

tfidf_sub = joblib.load('api/extensions/ml/tfidf_sub_vectorizer.pkl')
sub_model = joblib.load('api/extensions/ml/sub_classification_model.pkl')

async def predict_sub_hostile(text):

    # Preprocess the text (e.g., convert to lowercase)
    text = text.strip().lower()

    # Vectorize the tweet using the fitted vectorizer
    text_vectorized = tfidf_sub.transform([text])  # Use the fitted tfidf_binary

    # Predict using the trained model
    
    loop = asyncio.get_event_loop()
    prediction = await loop.run_in_executor(None, sub_model.predict, text_vectorized)

    # Return the prediction
    return prediction[0]

# True Means Hostile, False Means Non-Hostile
async def predict_tweet(text):
    # Preprocess the text (e.g., convert to lowercase)
    text = text.strip().lower()

    # Vectorize the tweet using the loaded vectorizer
    text_vectorized = tfidf_binary.transform([text])

    # Predict using the loaded model
    loop = asyncio.get_event_loop()
    prediction = await loop.run_in_executor(None, binary_model.predict, text_vectorized)

    # Convert the prediction to a boolean value
    return bool(prediction[0])

# Example usage:
async def main():
    tweet = """આ લોકો કેટલી બેભાખ છે, આ દુનિયામાં રહેવા લાયક નથી. તેમને બસ જવા દો."""
    prediction = await predict_tweet(tweet)
    if prediction:
        Sub = predict_sub_hostile(tweet)
    print("Predicted Label for the tweet:", prediction)

# Run the main function
# asyncio.run(main())

