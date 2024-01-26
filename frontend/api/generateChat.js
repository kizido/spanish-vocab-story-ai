import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config();

export default async function generateChat(req, res) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAIKEY,
  });

  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }
  const { skillLevel, words } = req.body;

  // Build the prompt based on skill level
  const prompt = buildPrompt(skillLevel, words);

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 350,
    });
    const message = chatCompletion.choices[0].message.content;
    res.status(200).json({message});
  } catch (error) {
    console.error("Error fetching chat completion:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

function buildPrompt(skillLevel, words) {
  let prompt = "";
  switch (skillLevel) {
    case "beginner":
      prompt =
        "In no more than 150 words, please create a short story in Mexican Spanish, ideal for beginner learners. The story should be engaging yet simple, using only elementary-level vocabulary and straightforward sentences. Crucially, the entire story must be in the present tense, with no past or future tense verbs. Incorporate each of these words seamlessly into the story: " +
        words +
        ". The words can be used in the title, but ensure every word is used at least once in the actual story, as each one is vital for the learner's vocabulary practice. Begin with a compelling story title (each word starting with a capital letter), followed by a | to separate it from the story. The narrative should be easy to understand for someone just starting to learn Spanish, integrating the given words naturally into the context.";
      break;
    case "intermediate":
      prompt =
        "In no more than 150 words, create an engaging short story in Mexican Spanish, aimed at intermediate learners. The narrative should primarily use elementary-level vocabulary, with occasional use of intermediate terms to enrich the language. Feel free to employ common verb conjugations such as the preterite, imperfect past, and gerund. Every word from this list must be included: " +
        words +
        ". Ensure each word is integrated thoughtfully, as they are crucial for developing the learner's vocabulary. The words can be used in the title, but ensure every word is used at least once in the actual story. Start with an intriguing story title (capitalize the initial letter of each word), followed by a | to separate it from the story. The story should be compelling yet accessible, offering intermediate learners a chance to practice and understand more varied Spanish structures.";
      break;
    case "advanced":
      prompt =
        "In no more than 200 words, craft a captivating short story in Mexican Spanish, suitable for advanced learners. The story should incorporate a wide range of conversational vocabulary, showcasing the richness of the language. You have the freedom to use any common verb tenses and conjugations. It is imperative to include each of these words: " +
        words +
        ". Weave these words seamlessly into your story, as each one forms a key part of the narrative and aids in vocabulary enhancement. The words can be used in the title, but ensure every word is used at least once in the actual story. Begin with an engaging title, with each word starting with a capital letter, and separate it from the story with a |. This story should challenge advanced learners with its diverse vocabulary and complex grammatical structures, while remaining coherent and intriguing.";
      break;
    default:
      prompt = "Please say hi";
      break;
  }
  return prompt;
}
