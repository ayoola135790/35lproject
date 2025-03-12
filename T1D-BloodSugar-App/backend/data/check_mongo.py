#used to retrieve and print that the words are inserted

import pandas as pd
from pymongo import MongoClient

# Connect to MongoDB
client =
MongoClient("mongodb+srv://<ka18>:<user>cluster0.ktnpb.mongodb.net/?
retryWrites=true&w=majority&appName=Cluster0") # Replace with your
MongoDB URI
db = client["health_monitor"]
collection = db["blood_sugar_data"]

# Read CSV file
df = pd.read_csv("blood_sugar_data.csv", parse_dates=["timestamp"])

# Convert DataFrame to dictionary format
data = df.to_dict(orient="records")

# Insert into MongoDB
collection.insert_many(data)

print("Data successfully inserted into MongoDB!")