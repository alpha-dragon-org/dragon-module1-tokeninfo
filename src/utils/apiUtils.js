// src/utils/apiUtils.js
import axios from 'axios';
import { API_SERVER_PORT } from '../config/config.js';

export async function sendToAPI(data) {
  // Only send data if pumpFunLink exists
  if (!data.pumpFunLink) {
    console.log('[INFO] Skipping data due to missing pumpFunLink.');
    return;
  }
  try {
    const apiEndpoint = `http://localhost:${API_SERVER_PORT}/updateData`;
    console.log('[INFO] Sending data to:', apiEndpoint);
    console.log('[INFO] Payload:', JSON.stringify(data, null, 2));
    const response = await axios.post(apiEndpoint, data, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('[INFO] Data successfully sent to API:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('[ERROR] API error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('[ERROR] No response from API:', error.request);
    } else {
      console.error('[ERROR] Failed to send data:', error.message);
    }
  }
}
