// src/api/server.js
import express from 'express';
import cors from 'cors';
import { API_SERVER_PORT } from '../config/config.js';

const app = express();
let fetchedData = []; // Global store for parsed data

app.use(cors());
app.use(express.json());

// GET /fetchData: Return stored data
app.get('/fetchData', (req, res) => {
  res.json(fetchedData);
});

// POST /updateData: Update data (remove duplicates)
app.post('/updateData', (req, res) => {
  const newData = req.body;
  if (newData) {
    fetchedData.push(newData);
    // Remove duplicate entries (using JSON stringification)
    fetchedData = [...new Set(fetchedData.map(JSON.stringify))].map(JSON.parse);
    console.log('[INFO] Data updated:', newData);
    res.sendStatus(200);
  } else {
    console.error('[ERROR] Invalid data received.');
    res.status(400).send('Invalid data');
  }
});

// POST /clearData: Clear stored data
app.post('/clearData', (req, res) => {
  fetchedData = [];
  console.log('[INFO] API data has been cleared.');
  res.status(200).json({ message: 'API data cleared successfully.' });
});

app.listen(API_SERVER_PORT, () => {
  console.log(`[INFO] API running on port ${API_SERVER_PORT}. Access via /fetchData`);
});
