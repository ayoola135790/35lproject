const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const { bloodSugarFunctions } = require('../db/database');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Sample blood sugar data for demo purposes in case there is no data
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


exports.getUserBloodSugarData = async (req, res) => {

  try {
    const userId = req.params.userId;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const result = await bloodSugarFunctions.getBloodSugarReadings(userId);
    
    if (result.success) {
      if (result.data && result.data.length > 0) {
        res.json(result.data);
      } else {
        try {
          const csvPath = path.join(__dirname, '../data/blood_sugar_data.csv');
          if (fs.existsSync(csvPath)) {
            const csvData = fs.readFileSync(csvPath, 'utf8');
            const parsedData = parseCSV(csvData);
            res.json(parsedData);
          } else {
            // If no CSV file, use the sample data
            res.json(sampleBloodSugarData);
          }
        } catch (fileError) {
          console.error('Error reading CSV file:', fileError);
          res.json(sampleBloodSugarData);
        }
      }
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error fetching blood sugar data:', error);
    res.status(500).json({ error: 'Failed to fetch blood sugar data' });
  }
};

exports.addBloodSugarData = async (req, res) => {
  try {
    const { userId, bloodSugarLevel, timestamp } = req.body;
    
    if (!userId || !bloodSugarLevel || !timestamp) {
      return res.status(400).json({ error: 'User ID, blood sugar level, and timestamp are required' });
    }
    
    let formattedTimestamp;
    if (timestamp.includes('T')) {
      const [datePart, timePart] = timestamp.split('T');
      formattedTimestamp = `${datePart} ${timePart}:00`;
    } else {
      formattedTimestamp = timestamp;
    }
    
    const result = await bloodSugarFunctions.addBloodSugarReading(
      userId, 
      bloodSugarLevel, 
      formattedTimestamp
    );
    
    if (result.success) {
      res.status(201).json({ 
        success: true, 
        message: 'Blood sugar data added successfully',
        id: result.id
      });
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error adding blood sugar data:', error);
    res.status(500).json({ error: 'Failed to add blood sugar data' });
  }
};

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

exports.deleteBloodSugarData = async (req, res) => {
  try {
    const { userId, timestamp, bloodSugarLevel } = req.body;
    
    if (!userId || !timestamp) {
      return res.status(400).json({ error: 'User ID and timestamp are required' });
    }
    
    const result = await bloodSugarFunctions.deleteBloodSugarReading(userId, timestamp, bloodSugarLevel);
    
    if (result.success) {
      res.status(200).json({ 
        success: true, 
        message: 'Blood sugar reading deleted successfully'
      });
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error deleting blood sugar data:', error);
    res.status(500).json({ error: 'Failed to delete blood sugar data' });
  }
};