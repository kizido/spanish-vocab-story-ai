import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import OpenAI from "openai";
import * as storyStyles from "../style/Story.module.css";
import frequencyList from "../vocab_lists/spanishfrequency.json";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAIKEY,
  dangerouslyAllowBrowser: true,
});

export default function Story() {
  const { wordsToLearn } = useParams();
  const words = decodeURIComponent(wordsToLearn);
  const wordsArray = words.split(/[,/]+/);
  const [story, setStory] = useState(
    "En el corazón de la ciudad, había un pequeño negocio conocido por todos. La gente acudía cada día, atraída por su encanto y sus productos únicos. Un día, un golpe fuerte sorprendió a todos: la puerta se cerró de repente con el viento. Desde ese momento, el negocio se convirtió en leyenda, un lugar donde la gente se reunía no solo para comprar, sino para compartir historias y sonrisas."
  );
  const [storyLoading, setStoryLoading] = useState(true);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showTranslationBox, setShowTranslationBox] = useState(false);
  const [wordTranslation, setWordTranslation] = useState("");

  useEffect(() => {
    generateChat();
  }, []);
  useEffect(() => {
    processStory();
  }, [story])

  const translateText = async (text, targetLang) => {
    const endpoint = "https://translation.googleapis.com/language/translate/v2";
    const params = new URLSearchParams({
      key: import.meta.env.VITE_GOOGLE_CLOUD_TRANSLATION_API_KEY,
    });

    const data = {
      q: text,
      target: targetLang,
      source: "es", // Optional: remove if you want Google to auto-detect the source language
    };

    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.post(
        `${endpoint}?${params.toString()}`,
        data,
        { headers }
      );
      return response.data.data.translations[0].translatedText;
    } catch (error) {
      console.error("Error during translation:", error);
      return null;
    }
  };

  const handleMouseDown = (e, word) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
    setShowTranslationBox(true);
    word = word.toLowerCase();
    const foundWord = frequencyList.find((item) => item.spanish == word);
    if (foundWord != undefined) {
      setWordTranslation(foundWord.english);
    } else {
      translateText(word, "en").then(translation => setWordTranslation(translation));
    }
  };

  const handleMouseLeave = () => {
    setShowTranslationBox(false);
    setWordTranslation("");
  };
  const boxStyle = {
    position: "fixed",
    left: `${mousePosition.x}px`,
    top: `${mousePosition.y}px`,
    width: "8rem",
    height: "5rem",
    backgroundColor: "white",
    display: showTranslationBox ? "block" : "none",
    transform: "translate(-50%, -125%)",
    pointerEvents: "none", // To prevent the box from interfering with the mouse events
  };
  const generateChat = async () => {
    setStoryLoading(true);
    try {
      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
            "In no more than 150 words, please create a short story in Spanish, suitable for beginner learners. The story must use only elementary-level vocabulary and simple sentences. It is crucial that the entire story is written in the present tense, without any past or future tense verbs. Please include these words: " + words + ". The story should be engaging but simple, designed for someone just starting to learn Spanish. Remember, only use present tense verbs to keep the story easy to understand."

          },
        ],
        temperature: 0.8,
        max_tokens: 300,
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

  const processStory = () => {
    // Split story into words and process each word
    const processedStory = story.split(/\s+/).map((word, index) => {
      // Remove punctuation for comparison, but keep original word for display
      const wordToCheck = word.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, "");
      const key = `${word}-${index}`;
      const isHighlighted = wordsArray.includes(wordToCheck.toLowerCase());

      // Check if word should be highlighted
      return (
        <span
          key={key}
          className={
            isHighlighted
              ? `${storyStyles.storyText} ${storyStyles.wordLearning}`
              : `${storyStyles.storyText}`
          }
          onMouseDown={(e) => handleMouseDown(e, word)}
          onMouseLeave={handleMouseLeave}
        >
          {word}
        </span>
      );
    });

    // Combine words into a single JSX element, preserving spaces
    return processedStory.reduce((acc, curr) => (
      <>
        {acc} {curr}{" "}
      </>
    ));
  };

  return (
    <div className={storyStyles.pageContainer}>
      <div style={boxStyle}>
        <p>{wordTranslation}</p>
      </div>
      {/* <div className={storyStyles.storyContainer}>{processStory()}</div> */}
      {storyLoading ? (
        <div className={storyStyles.spinnerContainer}>
          <h2>Spanish story generating...</h2>
          <div className={storyStyles.spinner}></div>
        </div>
      ) : (
        <div className={storyStyles.storyContainer}>
          {processStory()}
        </div>
      )}
    </div>
  );
}
