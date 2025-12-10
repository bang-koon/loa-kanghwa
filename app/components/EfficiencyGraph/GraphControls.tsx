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
  isBoundBook?: boolean;
  setIsBoundBook?: (value: boolean) => void;
}

const GraphControls = ({ toggles, setToggles, isMokoko, setIsMokoko, isBoundBook, setIsBoundBook }: GraphControlsProps) => {
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
      {/* 모코코/귀속책 토글 그룹 */}
      <div className={styles.section}>
        {isMokoko !== undefined && setIsMokoko && (
          <button
            className={`${styles.toggleButton} ${styles.mokokoButton} ${isMokoko ? styles.active : ""}`}
            onClick={() => setIsMokoko(!isMokoko)}
          >
            모코코 챌린지
          </button>
        )}
        {isBoundBook !== undefined && setIsBoundBook && (
          <button
            className={`${styles.toggleButton} ${styles.boundBookButton} ${isBoundBook ? styles.active : ""}`}
            onClick={() => setIsBoundBook(!isBoundBook)}
          >
            귀속책
          </button>
        )}
      </div>
      <div className={styles.section}>
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
    </div>
  );
};

export default GraphControls;
