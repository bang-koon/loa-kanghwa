import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import styles from "./Board.module.scss";
import { reverseTransformMaterialName } from "@/app/lib/transformMaterialName";
import debounce from "lodash/debounce";
import useFilterStore from "@/app/lib/store";
import FilterMobile from "@/app/components/Filter/FilterMobile";
import { MaterialCost, CalculationResult, AdvancedRefine } from "@/app/lib/types";

interface BoardProps {
  calculationResult: CalculationResult;
  advancedRefineData: AdvancedRefine;
  materialsPrice: Record<string, number>;
  owned: Record<string, number>;
  setOwned: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

const Board = ({
  calculationResult,
  advancedRefineData,
  materialsPrice,
  owned,
  setOwned,
}: BoardProps) => {
  const { weapon, armor } = calculationResult;
  const filter = useFilterStore(state => state.selected);

  const [current, setCurrent] = useState<MaterialCost>({
    cost: 0,
    materials: {},
  });

  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    let newCost = 0;
    let newMaterials: Record<string, number> = {};

    const refineKeys = [
      "tier3_1",
      "tier3_2",
      "tier4_1",
      "tier4_2",
      "tier4_3",
      "tier4_4",
    ] as const;

    const addMaterials = (
      category: "weapon" | "armor",
      key?: (typeof refineKeys)[number],
      isOnePart: boolean = false
    ) => {
      const data = key
        ? { ...advancedRefineData[category][key] }
        : { ...calculationResult[category] };
      if (isOnePart) data.cost = data.cost / 5;
      newCost += data.cost;
      for (let [materialName, quantity] of Object.entries(data.materials)) {
        if (isOnePart) quantity /= 5;
        newMaterials[materialName] =
          (newMaterials[materialName] || 0) + quantity;
      }
    };

    if (filter.weapon) addMaterials("weapon");

    if (filter.armor) addMaterials("armor", undefined, filter.onePart);

    refineKeys.forEach(key => {
      if (filter[key]) {
        if (filter.weapon) addMaterials("weapon", key);
        if (filter.armor) addMaterials("armor", key, filter.onePart);
      }
    });

    setCurrent({ cost: newCost, materials: newMaterials });
  }, [filter, weapon, armor]);

  const [inputValues, setInputValues] = useState<Record<string, number>>(owned);

  const adjustedTotalGold =
    current.cost -
    Object.entries(owned).reduce((acc, [name, quantity]) => {
      return acc + (quantity || 0) * (materialsPrice[name] || 0);
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
    if (value > current.materials[name]) {
      debouncedSetOwned(name, current.materials[name]);
    } else {
      debouncedSetOwned(name, value);
    }
  };

  const toggleFilter = () => {
    setShowFilter(prev => !prev);
  };

  return current.cost ? (
    <div className={styles.board}>
      <div className={styles.materialContainer}>
        <div className={styles.materialHeader}>
          <div className={`${styles.image} ${styles.cell}`}>
            <Image
              className={styles.filter}
              src="/button/hamburger.svg"
              alt="filter"
              width={34}
              height={34}
              onClick={toggleFilter}
            />
          </div>
          <div className={`${styles.cell} ${styles.materialNameCell}`}>
            재료명
          </div>
          <div className={`${styles.cell} ${styles.requiredAmountCell}`}>
            필요량
          </div>
          <div className={styles.cell}>소유량</div>
          <div className={styles.cell}>재료별 가격(개당)</div>
        </div>
        {Object.entries(current.materials).map(([name, value], index) => {
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
                  materialsPrice[name] * value -
                  (owned[name] || 0) * materialsPrice[name]
                ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                <br />
                <div className={styles.peacePrice}>
                  {` (${materialsPrice[name]})`}
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
      {showFilter && <FilterMobile setShowFilter={setShowFilter} />}
    </div>
  ) : null;
};

export default Board;
