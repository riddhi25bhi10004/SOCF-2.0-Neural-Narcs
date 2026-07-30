import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import authRouter from './src/routes/auth.js';
import telemetryRouter, { setState } from './src/routes/telemetry.js';
import { createInitialState } from './src/data/telemetry.js';

const app = express();
const port = process.env.PORT || 3001;

const initialState = createInitialState();
setState(initialState);

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api', telemetryRouter);

// Serve frontend when built (client/dist)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('/*', (_, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.get('/', (_, res) => {
  res.json({ status: 'OK', message: 'PRITHVI server is running' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

