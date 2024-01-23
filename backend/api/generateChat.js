const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { skillLevel, words } = req.body;
  const apiKey = process.env.OPENAIKEY;

  const openaiEndpoint = 'https://api.openai.com/v1/chat/completions'; // Adjust if using a different OpenAI endpoint
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };

  // Build the prompt based on skill level
  const prompt = buildPrompt(skillLevel, words);

  try {
    const response = await axios.post(openaiEndpoint, {
      model: "gpt-3.5-turbo", // Adjust model as necessary
      messages: [{ role: "system", content: prompt }],
      temperature: 0.8,
      max_tokens: 350,
    }, { headers });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching chat completion:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

function buildPrompt(skillLevel, words) {
  // Implement the logic to build your prompt based on skill level and words
  // Similar to what you have in your frontend generateChat function
  // Return the prompt string
}
