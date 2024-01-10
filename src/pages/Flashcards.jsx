import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import wordList from "../vocab_lists/spanishnouns.json";
import * as flashcardStyles from "../style/Flashcards.module.css";

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};
const getRandomWordIndex = () => {
  return getRandomInt(wordList.length);
};

export default function Flashcards() {
  let { vocabAmount } = useParams();
  vocabAmount = parseInt(vocabAmount);

  const [vocabLeft, setVocabLeft] = useState(vocabAmount);
  const [wordIndex, setWordIndex] = useState(getRandomWordIndex());
  const [wordsToLearn, setWordsToLearn] = useState([]);
  const [cardFlipped, setCardFlipped] = useState(false);

  useEffect(() => {
    console.log(wordsToLearn);
  }, [wordsToLearn]);

  return (
    <div className={flashcardStyles.pageContainer}>
      <h1>Vocab Left: {vocabLeft}</h1>
      <div
        className={flashcardStyles.flashcardContainer}
        onClick={() => setCardFlipped(!cardFlipped)}
      >
        <h2>
          {cardFlipped
            ? wordList[wordIndex].english
            : wordList[wordIndex].spanish}
        </h2>
      </div>
      <div className={flashcardStyles.wordConfirmationContainer}>
        <button
          className={flashcardStyles.wordPassButton}
          onClick={() => {
            setWordIndex(getRandomWordIndex);
            setCardFlipped(false);
          }}
        >
          I know this already...
        </button>
        <button
          className={flashcardStyles.wordConfirmButton}
          onClick={() => {
            setWordsToLearn([...wordsToLearn, wordIndex]);
            setVocabLeft(vocabLeft - 1);
            setWordIndex(getRandomWordIndex());
            setCardFlipped(false);
          }}
        >
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
