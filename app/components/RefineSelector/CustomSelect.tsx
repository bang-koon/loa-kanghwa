"use client";

import React, { useState, useRef, useEffect } from 'react';
import styles from './RefineSelector.module.scss'; // Use existing styles for now

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOptionLabel = options.find(option => option.value === value)?.label || '';

  return (
    <div className={styles.customSelect} ref={selectRef}>
      <div
        className={`${styles.selectedOption} ${isOpen ? styles.selectActive : ""}`}
        onClick={handleToggle}
      >
        {selectedOptionLabel}
        <span className={styles.dropdownArrow}></span>
      </div>
      {isOpen && (
        <ul className={styles.optionsList}>
          {options.map(option => (
            <li
              key={option.value}
              className={styles.optionItem}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
