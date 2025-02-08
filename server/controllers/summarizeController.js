import pdfParse from 'pdf-parse';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const summarizeDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No PDF file provided' 
      });
    }

    // 1. Parse PDF text from buffer
    const pdfBuffer = req.file.buffer;
    const data = await pdfParse(pdfBuffer);
    const fullText = data.text;

    // 2. Use GPT to summarize
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a professional document summarizer. Create a clear, concise, and well-structured summary of the provided text. Focus on key points and maintain a professional tone."
        },
        {
          role: "user",
          content: `Please summarize the following text:\n\n${fullText}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    const summaryText = response.choices[0].message.content.trim();

    // 3. Return summary to the client
    res.json({
      success: true,
      summary: summaryText
    });
  } catch (error) {
    console.error('Error processing document:', error);
    res.status(500).json({ 
      success: false, 
      error: 'An error occurred while processing the document' 
    });
  }
};