// server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 8080;

// Needed for ES modules to get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve all files in the public folder
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Front-end server running on http://localhost:${port}`);
});
