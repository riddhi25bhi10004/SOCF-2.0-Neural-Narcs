import express from 'express';
import cors from 'cors';
import authRouter from './src/routes/auth.js';
import telemetryRouter from './src/routes/telemetry.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api', telemetryRouter);

app.get('/', (_, res) => {
  res.json({ status: 'OK', message: 'EcoPulse AI server is running' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

