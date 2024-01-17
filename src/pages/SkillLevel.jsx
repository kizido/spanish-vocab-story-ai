import { useNavigate } from "react-router-dom";
import * as styles from "../style/SkillLevel.module.css";
import { useState } from "react";

export default function SkillLevel() {
    let navigate = useNavigate();

    const [skillLevel, setSkilllevel] = useState('');

  return (
    <div className={styles.skillLevelSection}>
      <div className={styles.skillLevelBox} onClick={() => navigate(`/${skillLevel}/vocabAmount`)}>
        <div className={styles.skillLevelTitle}>
          <h2>Beginner</h2>
        </div>
      </div>
      <div className={styles.skillLevelBox}>
        <div className={styles.skillLevelTitle}>
          <h2>Intermediate</h2>
        </div>
      </div>
      <div className={styles.skillLevelBox}>
        <div className={styles.skillLevelTitle}>
          <h2>Advanced</h2>
        </div>
      </div>
    </div>
  );
}
