import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import beginnerVocabList from "../vocab_lists/learningListBeginner.json";
import intermediateVocabList from "../vocab_lists/learningListIntermediate.json";
import advancedVocabList from "../vocab_lists/learningListAdvanced.json";
import * as flashcardStyles from "../style/Flashcards.module.css";

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};
const getRandomWordIndex = (wordList) => {
  return getRandomInt(wordList.length);
};
const selectVocabList = (skillLevel) => {
  switch (skillLevel) {
    case "beginner":
      return beginnerVocabList;
    case "intermediate":
      return intermediateVocabList;
    case "advanced":
      return advancedVocabList;
    default:
      return [];
  }
};

export default function Flashcards() {
  let navigate = useNavigate();
  let { vocabAmount, skillLevel } = useParams();
  let wordList = selectVocabList(skillLevel);

  vocabAmount = parseInt(vocabAmount);

  const [vocabLeft, setVocabLeft] = useState(vocabAmount);
  const [wordIndex, setWordIndex] = useState(getRandomWordIndex(wordList));
  const [wordsToLearn, setWordsToLearn] = useState([]);
  const [wordsToNotLearn, setWordsToNotLearn] = useState([]);
  const [cardFlipped, setCardFlipped] = useState(false);

  useEffect(() => {
    console.log(wordsToLearn);
    findNewWordIndex();
    if (vocabLeft < 1) {
      navigate(`/${skillLevel}/story/${encodeURIComponent(wordsToLearn)}`);
    }
  }, [wordsToLearn]);

  const findNewWordIndex = () => {
    let searching = true;
    while (searching) {
      const index = getRandomWordIndex(wordList);
      if (
        !wordsToLearn.includes(wordList[index].spanish) &&
        !wordsToNotLearn.includes(wordList[index].spanish)
      ) {
        setWordIndex(index);
        searching = false;
      }
      if (wordsToLearn.length + wordsToNotLearn.length >= wordList.length) {
        searching = false;
      }
    }
  };

  return (
    <div className={flashcardStyles.pageContainer}>
      <h1 className={flashcardStyles.title}>Vocab Left: {vocabLeft}</h1>
      <div
        className={flashcardStyles.flashcardContainer}
        onClick={() => setCardFlipped(!cardFlipped)}
      >
        <h4></h4>
        <div>
          <h3 className={flashcardStyles.wordClass}>
            ({wordList[wordIndex].wordClass})
          </h3>
          <h2 className={flashcardStyles.word}>
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
            setWordsToNotLearn([
              ...wordsToNotLearn,
              wordList[wordIndex].spanish,
            ]);
            findNewWordIndex();
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
            setCardFlipped(false);
          }}
        >
          Let's learn it!
        </button>
      </div>
    </div>
  );
}
