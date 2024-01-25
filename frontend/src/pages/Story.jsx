import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import OpenAI from "openai";
import * as storyStyles from "../style/Story.module.css";
import frequencyList from "../vocab_lists/spanishfrequency.json";
import * as LangApi from "../network/LangApi";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAIKEY,
  dangerouslyAllowBrowser: true,
});

export default function Story() {
  const { skillLevel, wordsToLearn } = useParams();
  const words = decodeURIComponent(wordsToLearn);
  const wordsArray = words.split(/[,/]+/);
  const [story, setStory] = useState("No story found");
  const [storyTitle, setStoryTitle] = useState("Untitled");
  const [storyLoading, setStoryLoading] = useState(true);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showTranslationBox, setShowTranslationBox] = useState(false);
  const [wordTranslation, setWordTranslation] = useState("");

  useEffect(() => {
    generateChat();
  }, []);
  useEffect(() => {
    processStory();
  }, [story]);

  const translateText = async (text, targetLang) => {
    // const endpoint = "https://translation.googleapis.com/language/translate/v2";
    // const params = new URLSearchParams({
    //   key: import.meta.env.VITE_GOOGLE_CLOUD_TRANSLATION_API_KEY,
    // });

    // const data = {
    //   q: text,
    //   target: targetLang,
    //   source: "es", // Optional: remove if you want Google to auto-detect the source language
    // };

    // const headers = {
    //   "Content-Type": "application/json",
    // };

    // try {
    //   const response = await axios.post(
    //     `${endpoint}?${params.toString()}`,
    //     data,
    //     { headers }
    //   );
    //   console.log(response.data.data.translations.length);
    //   return response.data.data.translations[0].translatedText;
    // } catch (error) {
    //   console.error("Error during translation:", error);
    //   return null;
    // }
    try {
      const translatedText = LangApi.translateText(text, targetLang);
      return translateText;
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
      const generatedStory = LangApi.generateChat(skillLevel, words);
      const storyAndTitle = generatedStory.split("|");
      setStoryTitle(storyAndTitle[0].trim());
      setStory(storyAndTitle[1].trim());
    } catch (error) {
      console.error("Story could not be generated: " + error);
      setStory("Story loading failed");
    }
    finally {
      setStoryLoading(false);
    }
    // let prompt = "";
    // switch (skillLevel) {
    //   case "beginner":
    //     prompt =
    //       "In no more than 150 words, please create a short story in Mexican Spanish, ideal for beginner learners. The story should be engaging yet simple, using only elementary-level vocabulary and straightforward sentences. Crucially, the entire story must be in the present tense, with no past or future tense verbs. Incorporate each of these words seamlessly into the story: " +
    //       words +
    //       ". The words can be used in the title, but ensure every word is used at least once in the actual story, as each one is vital for the learner's vocabulary practice. Begin with a compelling story title (each word starting with a capital letter), followed by a | to separate it from the story. The narrative should be easy to understand for someone just starting to learn Spanish, integrating the given words naturally into the context.";
    //     break;
    //   case "intermediate":
    //     prompt =
    //       "In no more than 150 words, create an engaging short story in Mexican Spanish, aimed at intermediate learners. The narrative should primarily use elementary-level vocabulary, with occasional use of intermediate terms to enrich the language. Feel free to employ common verb conjugations such as the preterite, imperfect past, and gerund. Every word from this list must be included: " +
    //       words +
    //       ". Ensure each word is integrated thoughtfully, as they are crucial for developing the learner's vocabulary. The words can be used in the title, but ensure every word is used at least once in the actual story. Start with an intriguing story title (capitalize the initial letter of each word), followed by a | to separate it from the story. The story should be compelling yet accessible, offering intermediate learners a chance to practice and understand more varied Spanish structures.";
    //     break;
    //   case "advanced":
    //     prompt =
    //       "In no more than 200 words, craft a captivating short story in Mexican Spanish, suitable for advanced learners. The story should incorporate a wide range of conversational vocabulary, showcasing the richness of the language. You have the freedom to use any common verb tenses and conjugations. It is imperative to include each of these words: " +
    //       words +
    //       ". Weave these words seamlessly into your story, as each one forms a key part of the narrative and aids in vocabulary enhancement. The words can be used in the title, but ensure every word is used at least once in the actual story. Begin with an engaging title, with each word starting with a capital letter, and separate it from the story with a |. This story should challenge advanced learners with its diverse vocabulary and complex grammatical structures, while remaining coherent and intriguing.";
    //     break;
    //   default:
    //     prompt = "Please say hi";
    //     break;
    // }
    // try {
    //   const chatCompletion = await openai.chat.completions.create({
    //     model: "gpt-3.5-turbo",
    //     messages: [
    //       {
    //         role: "system",
    //         content: prompt,
    //       },
    //     ],
    //     temperature: 0.8,
    //     max_tokens: 350,
    //   });
    //   console.log("Response:", chatCompletion); // Log the entire response
    //   const storyAndTitle =
    //     chatCompletion.choices[0].message.content.split("|");
    //   console.log(storyAndTitle);
    //   setStory(storyAndTitle[1].trim()); // Accessing the content correctly
    //   setStoryTitle(storyAndTitle[0].trim());
    // } catch (error) {
    //   console.error("Error fetching chat completion:", error);
    //   setStory("Failed to fetch story");
    // } finally {
    //   setStoryLoading(false);
    // }
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

  const processStoryTitle = () => {
    // Split story into words and process each word
    const processedStoryTitle = storyTitle.split(/\s+/).map((word, index) => {
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
            className={
              isHighlighted
                ? `${storyStyles.wordLearning} ${storyStyles.title}`
                : `${storyStyles.title}`
            }
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
    return processedStoryTitle.reduce((acc, curr) => (
      <>
        {acc}
        {curr}
      </>
    ));
  };

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
          <h1>{processStoryTitle()}</h1>
          <div className={storyStyles.storyContainer}>{processStory()}</div>
          <button>Regenerate</button>
        </div>
      )}
    </div>
  );
}
