const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
require('dotenv').config();


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Sample blood sugar data for demo purposes in case there is no CSV file
const sampleBloodSugarData = [
  { timestamp: "2024-01-01 06:00:00", blood_sugar_level: 95 },
  { timestamp: "2024-01-01 08:30:00", blood_sugar_level: 145 },
  { timestamp: "2024-01-01 11:00:00", blood_sugar_level: 110 },
  { timestamp: "2024-01-01 13:30:00", blood_sugar_level: 165 },
  { timestamp: "2024-01-01 16:00:00", blood_sugar_level: 120 },
  { timestamp: "2024-01-01 18:30:00", blood_sugar_level: 155 },
  { timestamp: "2024-01-01 21:00:00", blood_sugar_level: 130 },
  { timestamp: "2024-01-02 06:00:00", blood_sugar_level: 92 },
  { timestamp: "2024-01-02 08:30:00", blood_sugar_level: 158 },
  { timestamp: "2024-01-02 11:00:00", blood_sugar_level: 115 },
  { timestamp: "2024-01-02 13:30:00", blood_sugar_level: 170 },
  { timestamp: "2024-01-02 16:00:00", blood_sugar_level: 125 },
  { timestamp: "2024-01-02 18:30:00", blood_sugar_level: 148 },
  { timestamp: "2024-01-02 21:00:00", blood_sugar_level: 135 },
  { timestamp: "2024-01-03 06:00:00", blood_sugar_level: 98 },
  { timestamp: "2024-01-03 08:30:00", blood_sugar_level: 152 },
  { timestamp: "2024-01-03 11:00:00", blood_sugar_level: 118 },
  { timestamp: "2024-01-03 13:30:00", blood_sugar_level: 162 },
  { timestamp: "2024-01-03 16:00:00", blood_sugar_level: 128 },
  { timestamp: "2024-01-03 18:30:00", blood_sugar_level: 150 },
  { timestamp: "2024-01-03 21:00:00", blood_sugar_level: 132 }
];

const parseCSV = (csvText) => {
  const cleanedCsv = csvText.replace(/\/\/.*$/, '').trim();
  
  const lines = cleanedCsv.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const row = {};
    headers.forEach((header, i) => {
      if (header === 'blood_sugar_level') {
        row[header] = parseInt(values[i]);
      } else {
        row[header] = values[i];
      }
    });
    return row;
  });
};

// Get blood sugar data
exports.getBloodSugarData = async (req, res) => {
  try {
    const csvPath = path.join(__dirname, '../data/blood_sugar_data.csv');
    console.log('Looking for CSV file at:', csvPath);
    
    if (fs.existsSync(csvPath)) {
      console.log('CSV file found');
      const csvData = fs.readFileSync(csvPath, 'utf8');
      console.log('CSV data (first 100 chars):', csvData.substring(0, 100));
      const parsedData = parseCSV(csvData);
      console.log('Parsed data (first 2 items):', parsedData.slice(0, 2));
      res.json(parsedData);
    } else {
      console.log('CSV file not found, using sample data');
      res.json(sampleBloodSugarData);
    }
  } catch (error) {
    console.error('Error fetching blood sugar data:', error);
    res.status(500).json({ error: 'Failed to fetch blood sugar data' });
  }
};

// Analyze blood sugar data by calling OpenAI api
exports.analyzeBloodSugar = async (req, res) => {
  try {
    console.log('Received analysis request with body:', req.body);
    const data = req.body.data || sampleBloodSugarData;
    console.log(`Analyzing ${data.length} blood sugar readings`);
    
    const readings = data.map(row => `Time: ${row.timestamp}, Blood Sugar: ${row.blood_sugar_level}mg/dL`);
    
    const prompt = `As a medical AI assistant, analyze the following blood sugar readings and provide personalized recommendations. Consider normal blood sugar ranges (70-140 mg/dL before meals, <180 mg/dL after meals) and identify any concerning patterns or trends.

Blood Sugar Readings:
${readings.join('\n')}

Please provide:
1. An analysis of the blood sugar patterns
2. Identification of any concerning trends
3. Specific recommendations for the patient
4. Whether the patient should consult a healthcare provider`;

    console.log('Sending request to OpenAI');
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const analysis = completion.choices[0].message.content;
    console.log('Received analysis from OpenAI, first 100 chars:', analysis.substring(0, 100));
    res.send(analysis);
  } catch (error) {
    console.error('Error analyzing blood sugar data:', error);
    console.error('Error details:', error.message);
    if (error.response) {
      console.error('OpenAI API error response:', error.response.data);
    }
    res.status(500).send('Failed to analyze blood sugar data');
  }
};