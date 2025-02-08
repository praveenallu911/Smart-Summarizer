import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { router as summarizeRoute } from './routes/summarizeRoute.js';

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/summarize', summarizeRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});