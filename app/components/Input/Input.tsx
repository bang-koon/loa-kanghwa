import React from "react";
import styles from "./Input.module.scss";

interface InputProps {
  level: {
    current: string;
    target: string;
  };
  setLevel: React.Dispatch<
    React.SetStateAction<{
      current: string;
      target: string;
    }>
  >;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const Input = ({ level, setLevel, onSubmit }: InputProps) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) {
      setLevel({ ...level, [name]: value });
    }
  };

  const isActive = level.current.length >= 3 && level.target.length >= 3;

  return (
    <form onSubmit={onSubmit} className={styles.inputContainer}>
      <input
        className={styles.inputField}
        type="text"
        name="current"
        value={level.current ?? ""}
        onChange={onChange}
        maxLength={4}
        placeholder="현재 레벨"
      />
      <input
        className={styles.inputField}
        type="text"
        name="target"
        value={level.target ?? ""}
        onChange={onChange}
        maxLength={4}
        placeholder="목표 레벨"
      />
      <button
        type="submit"
        className={`${styles.submitButton} ${isActive ? styles.active : ""}`}
      >
        제출
      </button>
    </form>
  );
};

export default Input;
