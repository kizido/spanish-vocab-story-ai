import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAIKEY,
  dangerouslyAllowBrowser: true,
});

export default function Story() {
  const { wordsToLearn } = useParams();
  const words = decodeURIComponent(wordsToLearn);
  const [story, setStory] = useState("");

  const generateChat = async () => {
    try {
      const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: "user", content: "Say this is a test" }],
        model: "gpt-3.5-turbo",
      });
      console.log("Response:", chatCompletion); // Log the entire response
      setStory(chatCompletion.choices[0].message.content); // Accessing the content correctly
    } catch (error) {
      console.error("Error fetching chat completion:", error);
      setStory("Failed to fetch story");
    }
  };

  return (
    <div>
      <button onClick={generateChat}>Click me</button>
      <p>Story: {story}</p>
    </div>
  );
}
