import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import styles from "./Board.module.scss";
import { reverseTransformMaterialName } from "@/app/lib/transformMaterialName";
import debounce from "lodash/debounce";
import useFilterStore from "@/app/lib/store";

interface BoardProps {
  calculationResult: Record<string, any>;
  materialsPrice: Record<string, number>;
  owned: Record<string, number>;
  setOwned: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

const Board = ({
  calculationResult,
  materialsPrice,
  owned,
  setOwned,
}: BoardProps) => {
  const { total, weapon, armor } = calculationResult;
  const filter = useFilterStore(state => state.selected);

  const selectedMaterials: Record<string, number> =
    filter.weapon && filter.armor
      ? total.materials
      : filter.weapon
      ? weapon.materials
      : filter.armor
      ? armor.materials
      : {};

  const selectedCost =
    filter.weapon && filter.armor
      ? total.cost
      : filter.weapon
      ? weapon.cost
      : filter.armor
      ? armor.cost
      : 0;

  const [inputValues, setInputValues] = useState<Record<string, number>>(owned);

  const adjustedTotalGold =
    selectedCost -
    Object.entries(owned).reduce((acc, [name, quantity]) => {
      const transformedName = reverseTransformMaterialName(name);
      return acc + (quantity || 0) * (materialsPrice[transformedName] || 0);
    }, 0);

  const debouncedSetOwned = useCallback(
    debounce((name: string, value: number) => {
      setOwned(prevOwned => ({
        ...prevOwned,
        [name]: value,
      }));
    }, 100),
    []
  );

  const onChange = (name: string, value: number) => {
    setInputValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
    if (value > selectedMaterials[name]) {
      debouncedSetOwned(name, selectedMaterials[name]);
    } else {
      debouncedSetOwned(name, value);
    }
  };

  useEffect(() => {
    Object.entries(inputValues).forEach(([name, value]) => {
      if (value > selectedMaterials[name]) {
        setOwned(prevOwned => ({
          ...prevOwned,
          [name]: selectedMaterials[name],
        }));
      } else {
        setOwned(prevOwned => ({
          ...prevOwned,
          [name]: value,
        }));
      }
    });
  }, [selectedCost]);

  return selectedCost ? (
    <div className={styles.board}>
      <div className={styles.materialContainer}>
        <div className={styles.materialHeader}>
          <div className={`${styles.image} ${styles.cell}`}></div>
          <div className={`${styles.cell} ${styles.materialNameCell}`}>
            재료명
          </div>
          <div className={`${styles.cell} ${styles.requiredAmountCell}`}>
            필요량
          </div>
          <div className={styles.cell}>소유량</div>
          <div className={styles.cell}>재료별 가격(개당)</div>
        </div>
        {Object.entries(selectedMaterials).map(([name, value], index) => {
          const transformedName = reverseTransformMaterialName(name);
          return (
            <div key={index} className={styles.materialColumn}>
              <div className={`${styles.image} ${styles.cell}`}>
                <Image
                  src={`/images/${name}.png`}
                  alt={name}
                  width={44}
                  height={44}
                />
              </div>
              <div className={styles.cell}>{transformedName}</div>
              <div className={styles.cell}>
                {value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className={styles.cell}>
                <input
                  className={styles.owned}
                  type="text"
                  value={inputValues[name] || ""}
                  onChange={e => onChange(name, parseInt(e.target.value))}
                />
              </div>
              <div className={styles.materialPriceCell}>
                {(
                  materialsPrice[transformedName] * value -
                  (owned[name] || 0) * materialsPrice[transformedName]
                ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                <br />
                <div className={styles.peacePrice}>
                  {` (${materialsPrice[transformedName]})`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.totalGold}>
        평균 비용:{" "}
        {adjustedTotalGold.toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })}
      </div>
    </div>
  ) : null;
};

export default Board;
