import { useNavigate } from "react-router-dom";
import * as styles from "../style/SkillLevel.module.css";
import { useEffect, useState } from "react";

export default function SkillLevel() {
  let navigate = useNavigate();

  const [skillLevel, setSkilllevel] = useState("");

  const goToVocabAmount = () => {
    navigate(`/${skillLevel}/vocabAmount`);
  };

  useEffect(() => {
    if(skillLevel != "") {
        goToVocabAmount();
    }
  }, [skillLevel])

  return (
    <div className={styles.skillLevelSection}>
      <div
        className={styles.skillLevelBox}
        onClick={() => setSkilllevel('beginner')}
      >
        <div className={styles.skillLevelTitle}>
          <h2>Beginner</h2>
        </div>
      </div>
      <div className={styles.skillLevelBox} onClick={() => setSkilllevel('intermediate')}>
        <div className={styles.skillLevelTitle}>
          <h2>Intermediate</h2>
        </div>
      </div>
      <div className={styles.skillLevelBox} onClick={() => setSkilllevel('advanced')}>
        <div className={styles.skillLevelTitle}>
          <h2>Advanced</h2>
        </div>
      </div>
    </div>
  );
}
