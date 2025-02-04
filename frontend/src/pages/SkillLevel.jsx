import { useNavigate } from "react-router-dom";
import * as styles from "../style/SkillLevel.module.css";
import { useEffect, useState } from "react";
import beginnerIcon from "../assets/beginnerIcon.png";
import intermediateIcon from "../assets/intermediateIcon.png";
import advancedIcon from "../assets/advancedIcon.webp";

export default function SkillLevel() {
  let navigate = useNavigate();

  const [skillLevel, setSkilllevel] = useState("");

  const goToVocabAmount = () => {
    navigate(`/${skillLevel}`);
  };

  useEffect(() => {
    if (skillLevel != "") {
      goToVocabAmount();
    }
  }, [skillLevel]);

  return (
    <div className={styles.skillLevelPage}>
      <h1 className={styles.title}>Choose a Skill Level</h1>
      <div className={styles.skillLevelSection}>
        <div
          className={styles.skillLevelBox}
          onClick={() => setSkilllevel("beginner")}
        >
          <div className={styles.skillLevelTitle}>
            <h2>Beginner</h2>
          </div>
          <div className={styles.skillLevelBody}>
            <img
              src={beginnerIcon}
              alt="Beginner Icon"
              className={styles.skillLevelIcon}
            />
          </div>
        </div>
        <div
          className={styles.skillLevelBox}
          onClick={() => setSkilllevel("intermediate")}
        >
          <div className={styles.skillLevelTitle}>
            <h2>Intermediate</h2>
          </div>
          <div className={styles.skillLevelBody}>
            <img
              src={intermediateIcon}
              alt="Intermediate Icon"
              className={styles.skillLevelIcon}
            />
          </div>
        </div>
        <div
          className={styles.skillLevelBox}
          onClick={() => setSkilllevel("advanced")}
        >
          <div className={styles.skillLevelTitle}>
            <h2>Advanced</h2>
          </div>
          <div className={styles.skillLevelBody}>
            <img
              src={advancedIcon}
              alt="Advanced Icon"
              className={styles.skillLevelIcon}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
