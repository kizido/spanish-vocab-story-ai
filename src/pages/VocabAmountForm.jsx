import { useState } from "react";
import * as styles from "../style/Introduction.module.css";
import {
  UisAngleLeft,
  UisAngleRight,
  UisCheckCircle,
} from "@iconscout/react-unicons-solid";
import { useNavigate, useParams } from "react-router-dom";

export default function VocabAmountForm() {
  const [vocabAmount, setVocabAmount] = useState(5);

  let navigate = useNavigate();
  const { skillLevel } = useParams();

  const decrementVocabAmount = () => {
    if (vocabAmount > 1) {
      setVocabAmount(vocabAmount - 1);
    }
  };
  const incrementVocabAmount = () => {
    if(vocabAmount < 10) {
      setVocabAmount(vocabAmount + 1);
    }
  };
  const goToFlashCards = () => {
    navigate(`/${skillLevel}/flashcards/${vocabAmount}`);
  };
  return (
    <div className={styles.vocabAmountSection}>
      <h1 className={styles.vocabAmountQuestion}>
        How many Spanish words would you like to learn today?
      </h1>
      <div className={styles.vocabAmountInputSection}>
        <div className={styles.vocabAmountInputBox}>
          <UisAngleLeft
            size="70"
            className={styles.vocabAmountArrow}
            onClick={decrementVocabAmount}
          />
          <p>{vocabAmount}</p>
          <UisAngleRight
            size="70"
            className={styles.vocabAmountArrow}
            onClick={incrementVocabAmount}
          />
        </div>
        <UisCheckCircle
          className={styles.vocabAmountCheckmark}
          onClick={goToFlashCards}
        />
      </div>
    </div>
  );
}
