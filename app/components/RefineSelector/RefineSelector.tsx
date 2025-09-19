"use client";

import React, { useState, MouseEvent } from "react";
import styles from "./RefineSelector.module.scss";
import { tierInfo } from "@/app/lib/refine/data";

const equipmentParts = ["투구", "견갑", "상의", "하의", "장갑", "무기"];

interface Cell {
  part: string;
  grade: number;
}

interface RefineSelectorProps {
  selection: Record<string, Set<number>>;
  setSelection: React.Dispatch<React.SetStateAction<Record<string, Set<number>>>>;
  tier: "T3" | "T4";
  setTier: React.Dispatch<React.SetStateAction<"T3" | "T4">>;
  subTier: string;
  setSubTier: React.Dispatch<React.SetStateAction<string>>;
}

const RefineSelector = ({ selection, setSelection, tier, setTier, subTier, setSubTier }: RefineSelectorProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<"add" | "subtract" | null>(null);
  const [startCell, setStartCell] = useState<Cell | null>(null);
  const [endCell, setEndCell] = useState<Cell | null>(null);

  const handleTierClick = (newTier: "T3" | "T4") => {
    setTier(newTier);
    if (newTier === "T3") {
      setSubTier(tierInfo.T3[0].id);
    } else {
      setSubTier(tierInfo.T4[0].id);
    }
    setSelection({}); // Clear selection when tier changes
  };

  const handleSubTierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSubTier(e.target.value);
    setSelection({}); // Clear selection when sub-tier changes
  };

  const gradesToRender = tierInfo[tier].find(t => t.id === subTier)?.grades || [];

  const gridStyles = {
    gridTemplateColumns: `80px repeat(${gradesToRender.length}, 40px)`,
  };

  const getCellsInRange = (start: Cell, end: Cell): Cell[] => {
    const cells: Cell[] = [];
    const minGrade = Math.min(start.grade, end.grade);
    const maxGrade = Math.max(start.grade, end.grade);
    const startIndex = equipmentParts.indexOf(start.part);
    const endIndex = equipmentParts.indexOf(end.part);
    if (startIndex === -1 || endIndex === -1) return [];
    const minPartIndex = Math.min(startIndex, endIndex);
    const maxPartIndex = Math.max(startIndex, endIndex);

    for (let i = minPartIndex; i <= maxPartIndex; i++) {
      const part = equipmentParts[i];
      for (let grade = minGrade; grade <= maxGrade; grade++) {
        if (gradesToRender.includes(grade)) {
          cells.push({ part, grade });
        }
      }
    }
    return cells;
  };

  const handleMouseDown = (part: string, grade: number) => {
    setIsDragging(true);
    const isAlreadySelected = selection[part]?.has(grade);
    setDragMode(isAlreadySelected ? "subtract" : "add");
    setStartCell({ part, grade });
    setEndCell({ part, grade });
  };

  const handleMouseMove = (part: string, grade: number) => {
    if (isDragging) {
      setEndCell({ part, grade });
    }
  };

  const handleMouseUp = () => {
    if (!isDragging || !startCell || !endCell) return;

    setSelection(currentSelection => {
      const newSelection = { ...currentSelection };
      const cellsToChange = getCellsInRange(startCell, endCell);
      const partsToUpdate = new Set(cellsToChange.map(c => c.part));

      partsToUpdate.forEach(part => {
        const newGrades = new Set(newSelection[part] || []);
        const partCells = cellsToChange.filter(c => c.part === part);
        if (dragMode === "add") {
          partCells.forEach(cell => newGrades.add(cell.grade));
        } else {
          partCells.forEach(cell => newGrades.delete(cell.grade));
        }
        newSelection[part] = newGrades;
      });

      return newSelection;
    });

    setIsDragging(false);
    setStartCell(null);
    setEndCell(null);
    setDragMode(null);
  };

  const getCellClassName = (part: string, grade: number) => {
    let className = styles.gradeCell;
    const isSelected = selection[part]?.has(grade);
    if (isSelected) className += ` ${styles.selected}`;

    if (isDragging && startCell && endCell) {
      const range = getCellsInRange(startCell, endCell);
      if (range.some(cell => cell.part === part && cell.grade === grade)) {
        className += ` ${dragMode === "add" ? styles.draggingAdd : styles.draggingSubtract}`;
      }
    }
    return className;
  };

  return (
    <div className={styles.selectorContainer} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      <div className={styles.tierControl}>
        <div className={styles.tierButtons}>
          <button onClick={() => handleTierClick("T3")} className={tier === "T3" ? styles.active : ""}>
            3티어
          </button>
          <button onClick={() => handleTierClick("T4")} className={tier === "T4" ? styles.active : ""}>
            4티어
          </button>
        </div>
        {tier === "T3" && (
          <div className={styles.selectWrapper}>
            <select className={styles.subTierSelect} value={subTier} onChange={handleSubTierChange}>
              {tierInfo.T3.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className={styles.gridContainer}>
        <div className={styles.grid} style={gridStyles}>
          <div className={styles.partCell}></div>
          {gradesToRender.map(grade => (
            <div key={`header-${grade}`} className={styles.gradeCellHeader}>
              +{grade}
            </div>
          ))}
          {equipmentParts.map(part => (
            <React.Fragment key={part}>
              <div className={styles.partCell}>{part}</div>
              {gradesToRender.map(grade => (
                <div
                  key={`${part}-${grade}`}
                  className={getCellClassName(part, grade)}
                  onMouseDown={() => handleMouseDown(part, grade)}
                  onMouseMove={() => handleMouseMove(part, grade)}
                ></div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RefineSelector;
