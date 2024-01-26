import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export default async function translateText(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { text, targetLang } = req.body;
  const apiKey = process.env.GOOGLE_CLOUD_TRANSLATION_API_KEY;

  const endpoint = "https://translation.googleapis.com/language/translate/v2";
  const params = new URLSearchParams({ key: apiKey });
  const data = {
    q: text,
    target: targetLang,
    source: "es", // Optional: remove if you want Google to auto-detect the source language
  };

  try {
    const response = await axios.post(`${endpoint}?${params.toString()}`, data);
    const translatedText = response.data.data.translations[0].translatedText;
    res.status(200).json({ translatedText });
  } catch (error) {
    console.error("Error during translation:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
