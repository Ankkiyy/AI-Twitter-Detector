from pymongo import MongoClient

# Initialize MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['ai_tweet']  # Using the 'furniture' database

# Define collections
rooms_collection = db['rooms']
devices_collection = db['devices']
users_collection = db['users']
otp_collection = db['otps']
