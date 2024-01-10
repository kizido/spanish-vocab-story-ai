import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import wordList from "../vocab_lists/spanishnouns.json";
import * as flashcardStyles from "../style/Flashcards.module.css";

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};
const getRandomWordIndex = () => {
  return getRandomInt(wordList.length);
}

export default function Flashcards() {
  let { vocabAmount } = useParams();
  vocabAmount = parseInt(vocabAmount);

  const [vocabLeft, setVocabLeft] = useState(vocabAmount);
  const [wordIndex, setWordIndex] = useState();
  const [wordsToLearn, setWordsToLearn] = useState([]);

  useEffect(() => {
    setWordIndex(getRandomWordIndex());
  }, [])

  return (
    <div className={flashcardStyles.pageContainer}>
      <h1>Vocab Left: {vocabLeft}</h1>
      <div className={flashcardStyles.flashcardContainer}>
        <h2>{wordList[getRandomWordIndex()].spanish}</h2>
      </div>
      <div className={flashcardStyles.wordConfirmationContainer}>
        <button className={flashcardStyles.wordPassButton}>
          I know this already...
        </button>
        <button className={flashcardStyles.wordConfirmButton}>
          Let's learn it!
        </button>
      </div>
      {/* <h1>Current Word: {word ?? 'N/A'}</h1>
      <button onClick={() => setWord(wordList[getRandomInt(wordList.length)].spanish)}>
        Select New Word
      </button> */}
    </div>
  );
}
