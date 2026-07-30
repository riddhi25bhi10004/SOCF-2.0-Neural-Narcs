import express from 'express';
import cors from 'cors';
import telemetryRouter, { setState, getState } from './src/routes/telemetry';
import { createInitialState } from './src/data/telemetry';
import { updateTelemetry } from './src/services/telemetryService';
import authRouter from './src/routes/auth'; // ← ADD THIS

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', telemetryRouter);
app.use('/api/auth', authRouter); // ← ADD THIS

setState(createInitialState());

setInterval(() => {
  const current = getState();
  const updatedTelemetry = updateTelemetry(current.telemetry);
  setState({ ...current, telemetry: updatedTelemetry });
}, 5000);

app.listen(PORT, () => {
  console.log(`EcoPulse AI Server running on http://localhost:${PORT}`);
});