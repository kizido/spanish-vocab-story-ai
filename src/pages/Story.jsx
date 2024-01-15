import axios from "axios";
import { Fragment, useEffect, useState } from "react";
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

  // useEffect(() => {
  //   generateChat();
  // }, []);
  // useEffect(() => {
  //   processStory();
  // }, [story])

  const handleMouseEnter = (e, word) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
    setShowTranslationBox(true);
    word = word.toLowerCase();
    const foundWord = frequencyList.find((item) => item.spanish == word);
    if (foundWord != undefined) {
      setWordTranslation(foundWord.english);
    } else {
      setWordTranslation("N/A");
    }
  };

  const handleMouseLeave = () => {
    setShowTranslationBox(false);
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
              "I want you to tell a story using only elementary and below spanish, and only using present tense verbs. Use less than 200 tokens. You must include the following words: " +
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
          onMouseEnter={(e) => handleMouseEnter(e, word)}
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
      <div className={storyStyles.storyContainer}>{processStory()}</div>
      {/* {storyLoading ? (
        <div className={storyStyles.spinnerContainer}>
          <h2>Spanish story generating...</h2>
          <div className={storyStyles.spinner}></div>
        </div>
      ) : (
        <div className={storyStyles.storyContainer}>
          {processStory()}
        </div>
      )} */}
    </div>
  );
}
