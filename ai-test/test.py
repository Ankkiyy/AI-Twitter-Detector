import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
import asyncio

# Load the saved vectorizer and model
tfidf_binary = joblib.load('tfidf_binary_vectorizer.pkl')
binary_model = joblib.load('binary_classification_model.pkl')

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
    print("Predicted Label for the tweet:", prediction)

# Run the main function
asyncio.run(main())
