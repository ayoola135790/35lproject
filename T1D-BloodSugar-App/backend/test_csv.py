import pandas as pd
from pymongo import MongoClient

# Step 1: Check if CSV loads
try:
    df = pd.read_csv("blood_sugar_data.csv", parse_dates=["timestamp"])
    print("✅ CSV Loaded Successfully!")
    print(df.head())  # Show first 5 rows
except Exception as e:
    print("❌ Error loading CSV:", e)

# Step 2: Verify column names
print("📌 CSV Columns:", df.columns)

# Step 3: Check for missing data
print("🔍 Missing Data Per Column:\n", df.isnull().sum())

# Step 4: Connect to MongoDB
try:
    client = MongoClient("mongodb+srv://kingayoola18:sarah@cluster0.ktnpb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    db = client["health_monitor"]
    collection = db["blood_sugar_data"]
    print("✅ Connected to MongoDB Successfully!")
except Exception as e:
    print("❌ MongoDB Connection Error:", e)

# Step 5: Test inserting one record
try:
    one_record = df.iloc[0].to_dict()  # Convert first row to dictionary
    result = collection.insert_one(one_record)
    print(f"✅ Test insert successful! ID: {result.inserted_id}")
except Exception as e:
    print("❌ Error inserting test record:", e)
