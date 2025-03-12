#this test script is used to check if mongodb uploaded the info

import pandas as pd
from pymongo import MongoClient
#step 1: check if csv loads
try:
df = pd.read_csv("blood_sugar_data.csv", parse_dates=["timestamp"])
print("✅ CSV Loaded Successfully!")
print(df.head()) # show first 5 rows
except Exception as e:
print("❌ Error loading CSV:", e)
#step 2: verify column Names
print("📌 CSV Columns:", df.columns)
#step 3: check for missing data
print("🔍 Missing Data Per Column:\n", df.isnull().sum())
#step 4: connect to mongoDB
try:
client =
MongoClient("mongodb+srv://kingayoola18:sarah@cluster0.ktnpb.mongodb.net/?
retryWrites=true&w=majority&appName=Cluster0")
db = client["health_monitor"]
collection = db["blood_sugar_data"]
print("✅ Connected to MongoDB Successfully!")
except Exception as e:
print("❌ MongoDB Connection Error:", e)
#step 5: test inserting one record
try:
one_record = df.iloc[0].to_dict() #convert first row to dictionary
result = collection.insert_one(one_record)
print(f"✅ Test insert successful! ID: {result.inserted_id}")
except Exception as e:
print("❌ Error inserting test record:", e)