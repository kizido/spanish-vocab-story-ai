import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import wordList from "../vocab_lists/spanishnouns.json";
import * as flashcardStyles from "../style/Flashcards.module.css";

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};
const getRandomWordIndex = () => {
  return getRandomInt(wordList.length);
};

export default function Flashcards() {
  let navigate = useNavigate();

  let { vocabAmount } = useParams();
  vocabAmount = parseInt(vocabAmount);

  const [vocabLeft, setVocabLeft] = useState(vocabAmount);
  const [wordIndex, setWordIndex] = useState(getRandomWordIndex());
  const [wordsToLearn, setWordsToLearn] = useState([]);
  const [cardFlipped, setCardFlipped] = useState(false);

  useEffect(() => {
    console.log(wordsToLearn);
    if (vocabLeft < 1) {
      navigate(`/story/${encodeURIComponent(wordsToLearn)}`);
    }
  }, [wordsToLearn]);

  return (
    <div className={flashcardStyles.pageContainer}>
      <h1>Vocab Left: {vocabLeft}</h1>
      <div
        className={flashcardStyles.flashcardContainer}
        onClick={() => setCardFlipped(!cardFlipped)}
      >
        <h4></h4>
        <div>
          <h3 className={flashcardStyles.wordClass}>
            ({wordList[wordIndex].wordClass})
          </h3>
          <h2>
            {cardFlipped
              ? wordList[wordIndex].english
              : wordList[wordIndex].spanish}
          </h2>
        </div>
        <h4>{cardFlipped ? "english" : "español"}</h4>
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
            setWordsToLearn([...wordsToLearn, wordList[wordIndex].spanish]);
            setVocabLeft(vocabLeft - 1);
            setWordIndex(getRandomWordIndex());
            setCardFlipped(false);
          }}
        >
          Let's learn it!
        </button>
      </div>
    </div>
  );
}
