import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import OpenAI from "openai";
import * as storyStyles from "../style/Story.module.css";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAIKEY,
  dangerouslyAllowBrowser: true,
});

export default function Story() {
  const { wordsToLearn } = useParams();
  const words = decodeURIComponent(wordsToLearn);
  const [story, setStory] = useState(
    "Había una vez una chica llamada Ana. Un día, ella decidió ir de aventura. Al inicio, caminó mucho pero luego vio un carro. Ana pensó: ¡Qué suerte! y subió al carro. Condujo por el bosque, cantando y riendo. De repente, el carro se paró. Ana miró el motor y vio que estaba roto. ¡Oh no! Estaba perdida en medio del bosque. Pero la chica no se preocupó, ella era valiente. Decidió explorar y encontró un río. Vio un bote y pensó: ¡Lo usaré para escapar! Ana remó y remó hasta llegar a casa. Su mamá se alegró mucho de verla sana y salva. Desde ese día, Ana aprendió que aventurarse sola no siempre es seguro. Y prometió siempre revisar su carro antes de salir."
  );
  const [storyLoading, setStoryLoading] = useState(true);

  useEffect(() => {
    generateChat();
  }, [])

  const generateChat = async () => {
    setStoryLoading(true);
    try {
      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "I want you to tell a story using only elementary and below spanish that is less than 175 words. You must include the following words: " +
              words,
          },
        ],
        temperature: 0.8,
        max_tokens: 250,
      });
      console.log("Response:", chatCompletion); // Log the entire response
      setStory(chatCompletion.choices[0].message.content); // Accessing the content correctly
    } catch (error) {
      console.error("Error fetching chat completion:", error);
      setStory("Failed to fetch story");
    } finally {
      setStoryLoading(false);
    }
  };

  return (
    <div className={storyStyles.pageContainer}>
      {storyLoading ? (
        <div className={storyStyles.spinnerContainer}>
          <h2>Spanish story generating...</h2>
          <div className={storyStyles.spinner}></div>
        </div>
      ) : (
        <div className={storyStyles.storyContainer}>
          <p>{story}</p>
        </div>
      )}
    </div>
  );
}
