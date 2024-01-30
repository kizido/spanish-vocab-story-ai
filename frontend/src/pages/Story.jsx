import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as storyStyles from "../style/Story.module.css";
import frequencyList from "../vocab_lists/spanishfrequency.json";
import * as LangApi from "../network/LangApi";

export default function Story() {
  const { skillLevel, wordsToLearn } = useParams();
  const words = decodeURIComponent(wordsToLearn);
  const wordsArray = words.split(/[,/]+/);
  const [story, setStory] = useState("No story found");
  // const [storyTitle, setStoryTitle] = useState("Untitled");
  const [storyLoading, setStoryLoading] = useState(true);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showTranslationBox, setShowTranslationBox] = useState(false);
  const [wordTranslation, setWordTranslation] = useState("");

  let navigate = useNavigate();

  useEffect(() => {
    generateChat();
  }, []);
  useEffect(() => {
    processStory();
  }, [story]);

  const translateText = async (text, targetLang) => {
    try {
      console.log("WORDS: " + text + "\nSKILL LEVEL: " + targetLang)
      const translatedText = await LangApi.translateText(text, targetLang);
      return translatedText;
    } catch (error) {
      console.error("TRANSLATED TEXT NOT FOUND: " + error);
      return null;
    }
  };

  const capitalizeFirstLetter = (word) => {
    if (word.length < 1) {
      return "";
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  };
  const handleMouseDown = (e, word) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
    setShowTranslationBox(true);
    word = word.toLowerCase();
    const foundWord = frequencyList.find((item) => item.spanish == word);
    if (foundWord != undefined) {
      setWordTranslation(foundWord.english);
    } else {
      translateText(word, "en").then((translation) =>
        setWordTranslation(translation)
      );
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
    textAlign: "center",
    lineHeight: "5rem",
  };
  const generateChat = async () => {
    setStoryLoading(true);
    try {
      const generatedStory = await LangApi.generateChat(skillLevel, words);
      setStory(generatedStory);
      // console.log(generatedStory);
      // const storyAndTitle = generatedStory.split("|");
      // setStoryTitle(storyAndTitle[0].trim());
      // setStory(storyAndTitle[1].trim());
    } catch (error) {
      console.error("Story could not be generated: " + error);
      setStory("Story loading failed");
    } finally {
      setStoryLoading(false);
    }
  };

  const processStory = () => {
    // Split story into words and process each word
    const processedStory = story.split(/\s+/).map((word, index) => {
      // Separate the word from its surrounding punctuation
      const match = word.match(
        /([^\wáéíóúÁÉÍÓÚñÑ]*)([\wáéíóúÁÉÍÓÚñÑ]+)([^\wáéíóúÁÉÍÓÚñÑ]*)/
      );
      const prefix = match[1]; // Punctuation before the word
      const coreWord = match[2]; // The actual word
      const suffix = match[3]; // Punctuation after the word
      const wordToCheck = coreWord.toLowerCase();
      const key = `${coreWord}-${index}`;
      const isHighlighted = wordsArray.includes(wordToCheck);

      // Render the word with its punctuation, highlighting only the word
      return (
        <span key={key} className={storyStyles.storyText}>
          {prefix}
          <span
            className={isHighlighted ? storyStyles.wordLearning : ""}
            onMouseDown={(e) => handleMouseDown(e, coreWord)}
            onMouseLeave={handleMouseLeave}
          >
            {coreWord}
          </span>
          {suffix}{" "}
        </span>
      );
    });

    // Combine words into a single JSX element, preserving spaces
    return processedStory.reduce((acc, curr) => (
      <>
        {acc}
        {curr}
      </>
    ));
  };

  // const processStoryTitle = () => {
  //   // Split story into words and process each word
  //   const processedStoryTitle = storyTitle.split(/\s+/).map((word, index) => {
  //     // Separate the word from its surrounding punctuation
  //     const match = word.match(
  //       /([^\wáéíóúÁÉÍÓÚñÑ]*)([\wáéíóúÁÉÍÓÚñÑ]+)([^\wáéíóúÁÉÍÓÚñÑ]*)/
  //     );
  //     const prefix = match[1]; // Punctuation before the word
  //     const coreWord = match[2]; // The actual word
  //     const suffix = match[3]; // Punctuation after the word
  //     const wordToCheck = coreWord.toLowerCase();
  //     const key = `${coreWord}-${index}`;
  //     const isHighlighted = wordsArray.includes(wordToCheck);

  //     // Render the word with its punctuation, highlighting only the word
  //     return (
  //       <span key={key} className={storyStyles.storyText}>
  //         {prefix}
  //         <span
  //           className={
  //             isHighlighted
  //               ? `${storyStyles.wordLearning} ${storyStyles.title}`
  //               : `${storyStyles.title}`
  //           }
  //           onMouseDown={(e) => handleMouseDown(e, coreWord)}
  //           onMouseLeave={handleMouseLeave}
  //         >
  //           {coreWord}
  //         </span>
  //         {suffix}{" "}
  //       </span>
  //     );
  //   });

  //   // Combine words into a single JSX element, preserving spaces
  //   return processedStoryTitle.reduce((acc, curr) => (
  //     <>
  //       {acc}
  //       {curr}
  //     </>
  //   ));
  // };

  return (
    <div>
      <div style={boxStyle}>
        <p>{wordTranslation}</p>
      </div>
      {/* <div className={storyStyles.storyContainer}>{processStory()}</div> */}
      {storyLoading ? (
        <div className={storyStyles.pageContainer}>
          <div className={storyStyles.spinnerContainer}>
            <h2>
              {capitalizeFirstLetter(skillLevel)} Spanish Story Generating...
            </h2>
            <div className={storyStyles.spinner}></div>
          </div>
        </div>
      ) : (
        <div className={storyStyles.pageContainer}>
          {/* <h1>{processStoryTitle()}</h1> */}
          <div className={storyStyles.storyContainer}>{processStory()}</div>
          <div className={storyStyles.buttonContainer}>
            <button onClick={generateChat}>Regenerate</button>
            <button onClick={() => navigate(`/${skillLevel}/vocabAmount`)}>Learn New Words</button>
          </div>
        </div>
      )}
    </div>
  );
}
