import express from 'express';
import multer from 'multer';
import { summarizeDocument } from '../controllers/summarizeController.js';

export const router = express.Router();

// Set up Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.single('pdfFile'), summarizeDocument);