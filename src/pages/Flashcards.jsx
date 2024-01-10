import React, { useState } from "react";
import { useParams } from "react-router-dom";
import wordList from "../vocab_lists/spanishnouns.json";

const getRandomInt = (max) => {
  const num = Math.floor(Math.random() * max);
  return num;
};

export default function Flashcards() {
  let { vocabAmount } = useParams();
  vocabAmount = parseInt(vocabAmount);

  const [word, setWord] = useState();

  return (
    <div>
      <h1>Current Word: {word ?? 'N/A'}</h1>
      <button onClick={() => setWord(wordList[getRandomInt(wordList.length)].spanish)}>
        Select New Word
      </button>
    </div>
  );
}
