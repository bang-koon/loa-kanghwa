"use client";

import styles from "./GraphControls.module.scss";

export interface Toggles {
  shard: boolean;
  leapstone: boolean;
  fusion: boolean;
  breath: boolean;
  book: boolean;
  stones: boolean;
}

interface GraphControlsProps {
  toggles: Toggles;
  setToggles: React.Dispatch<React.SetStateAction<Toggles>>;
  isMokoko?: boolean;
  setIsMokoko?: (value: boolean) => void;
}

const GraphControls = ({ toggles, setToggles, isMokoko, setIsMokoko }: GraphControlsProps) => {
  const toggleItem = (key: keyof Toggles) => {
    setToggles(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const buttons: { key: keyof Toggles; label: string }[] = [
    { key: "stones", label: "강석" },
    { key: "shard", label: "파편" },
    { key: "leapstone", label: "돌파석" },
    { key: "fusion", label: "융화재료" },
    { key: "breath", label: "숨결" },
    { key: "book", label: "책" },
  ];

  return (
    <div className={styles.controlsContainer}>
      <div className={styles.section}>
        <span className={styles.label}>포함 재료:</span>
        {buttons.map(({ key, label }) => (
          <button
            key={key}
            className={`${styles.toggleButton} ${toggles[key] ? styles.active : ""}`}
            onClick={() => toggleItem(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {isMokoko !== undefined && setIsMokoko && (
        <div className={styles.section}>
          <span className={styles.label}>기타:</span>
          <button
            className={`${styles.toggleButton} ${styles.mokokoButton} ${isMokoko ? styles.active : ""}`}
            onClick={() => setIsMokoko(!isMokoko)}
          >
            모코코 챌린지
          </button>
        </div>
      )}
    </div>
  );
};

export default GraphControls;
