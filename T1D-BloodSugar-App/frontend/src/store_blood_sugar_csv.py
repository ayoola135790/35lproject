import csv

# Example API response (Replace with actual API call)
blood_sugar_data = [
    {"timestamp": "2025-02-23T10:30:00Z", "blood_sugar": 120, "source": "Dexcom"},
    {"timestamp": "2025-02-23T11:00:00Z", "blood_sugar": 110, "source": "Dexcom"},
]

csv_file = "blood_sugar_data.csv"

# Append new data to CSV
with open(csv_file, mode="a", newline="") as file:
    writer = csv.writer(file)
    
    # Write header only if the file is empty
    file.seek(0, 2)
    if file.tell() == 0:
        writer.writerow(["timestamp", "blood_sugar", "source"])
    
    # Write data
    for entry in blood_sugar_data:
        writer.writerow([entry["timestamp"], entry["blood_sugar"], entry["source"]])

print("Data saved to CSV successfully.")