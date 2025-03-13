#this is used to upload the blood sugar data csv into py
import pandas as pd
from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient("") 
db = client["health_monitor"]
collection = db["blood_sugar_data"]

# Read CSV file
df = pd.read_csv("blood_sugar_data.csv", parse_dates=["timestamp"])

# Convert DataFrame to dictionary format
data = df.to_dict(orient="records")

# Insert into MongoDB
collection.insert_many(data)

print("Data successfully inserted into MongoDB!")