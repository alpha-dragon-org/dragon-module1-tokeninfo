// src/telegram/telegramClient.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import promptSync from 'prompt-sync';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';
import { NewMessage } from 'telegram/events/index.js';
import axios from 'axios';
import puppeteer from 'puppeteer';

import { TELEGRAM_SERVER_PORT, TELEGRAM_API_ID, TELEGRAM_API_HASH } from '../config/config.js';
import { extractLinksFromEntities, parseMessageToJSON } from '../utils/telegramUtils.js';
import { sendToAPI } from '../utils/apiUtils.js';
import { fetchBundleData } from '../modules/bundleAnalysis.js';
import { fetchWalletListFromBubblemaps } from '../modules/clusterAnalysis.js';

const app = express();
const prompt = promptSync();

app.use(cors());
app.use(bodyParser.json());

// Express endpoint to receive a contract address and forward it to a bot on Telegram
app.post('/sendContractAddress', async (req, res) => {
  console.log('[DEBUG] Received body:', req.body);
  const { contractAddress } = req.body;
  if (!contractAddress) {
    console.warn('[WARN] Missing contract address in request.');
    return res.status(400).json({ error: 'Contract address is required.' });
  }
  console.log(`[INFO] Received contract address: ${contractAddress}`);
  try {
    // Ensure the Telegram client is ready before sending
    await ensureClientInitialized();
    const botUsername = 'TrenchyBot'; // Replace with your bot's username
    await client.sendMessage(botUsername, { message: contractAddress });
    console.log('[INFO] Contract address sent to Telegram.');
    res.status(200).json({ success: true, message: 'Contract address sent successfully.' });
  } catch (error) {
    console.error('[ERROR] Failed to send contract address:', error.message);
    res.status(500).json({ error: 'Failed to send contract address to Telegram.' });
  }
});

app.listen(TELEGRAM_SERVER_PORT, () => {
  console.log(`[INFO] Telegram API server running on port ${TELEGRAM_SERVER_PORT}`);
});

// --------------------------
// Telegram Client Setup
// --------------------------
let client; // Global Telegram client variable

// Utility to wait until the client is connected
const ensureClientInitialized = async () => {
  if (!client) {
    console.log('[INFO] Waiting for Telegram client to initialize...');
    while (!client || !client.connected) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    console.log('[INFO] Telegram client is now initialized.');
  }
};

(async () => {
  console.log('[INFO] Initializing Telegram Client...');
  const sessionFile = './telegram-session.txt';
  const savedSession = fs.existsSync(sessionFile) ? fs.readFileSync(sessionFile, 'utf8') : '';
  const stringSession = new StringSession(savedSession);
  
  client = new TelegramClient(stringSession, TELEGRAM_API_ID, TELEGRAM_API_HASH, {
    connectionRetries: 5,
    autoReconnect: true,
    useWSS: true
  });
  
  try {
    if (!savedSession) {
      console.log('[INFO] No saved session found. Logging in...');
      await client.start({
        phoneNumber: async () => prompt('[PROMPT] Enter phone number: '),
        password: async () => prompt('[PROMPT] Enter password (if enabled): '),
        phoneCode: async () => prompt('[PROMPT] Enter the code you received: '),
        onError: (error) => console.error('[ERROR]', error)
      });
      fs.writeFileSync(sessionFile, client.session.save());
      console.log('[INFO] Session saved successfully.');
    } else {
      console.log('[INFO] Found saved session. Connecting...');
      await client.connect();
    }
    const me = await client.getMe();
    console.log(`[INFO] Connected as ${me.username || me.id}`);
    
    // Listen for incoming messages from specific bots
    const botUsernames = ['SyraxScannerBot', 'soul_scanner_bot', 'TrenchyBot'];
    client.addEventHandler(async (event) => {
      const message = event.message;
      if (!message) return;
      const sender = await message.getSender();
      const senderUsername = sender?.username || 'Unknown';
      if (!botUsernames.includes(senderUsername)) {
        console.warn(`[WARN] Ignoring message from @${senderUsername}`);
        return;
      }
      console.log(`[INFO] Message received from @${senderUsername}`);
      
      // Use utility functions to parse the message
      const links = extractLinksFromEntities(message);
      const parsedJSON = parseMessageToJSON(senderUsername, message.message, links);
      
      // Optionally, enrich the parsed JSON with additional data...
      console.log('[INFO] Fetching wallet list from Bubblemaps...');
      const walletListData = await fetchWalletListFromBubblemaps(parsedJSON);
      if (walletListData) {
        parsedJSON.walletList = walletListData.walletList;
        parsedJSON.clusters = walletListData.clusters;
      }
      
      console.log('[INFO] Fetching bundle data...');
      const bundleData = await fetchBundleData(parsedJSON);
      if (bundleData) {
        parsedJSON.bundleData = bundleData;
      }
      
      console.log('[INFO] Final Parsed Message JSON:', JSON.stringify(parsedJSON, null, 2));
      
      // Send the parsed data to the API server
      await sendToAPI(parsedJSON);
      
    }, new NewMessage({ incoming: true }));
    
    console.log('[INFO] Telegram Client is now listening for messages...');
  } catch (error) {
    console.error('[ERROR] Failed to initialize Telegram Client:', error.message);
    process.exit(1);
  }
  
  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('[INFO] Shutting down Telegram Client...');
    await client.disconnect();
    process.exit(0);
  });
})();
