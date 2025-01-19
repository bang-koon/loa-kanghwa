import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import styles from "./Board.module.scss";
import { reverseTransformMaterialName } from "@/app/lib/transformMaterialName";
import debounce from "lodash/debounce";
import useFilterStore from "@/app/lib/store";
import FilterMobile from "@/app/components/Filter/FilterMobile";

interface MaterialCost {
  materials: Record<string, number>;
  cost: number;
}

interface CalculationResult {
  total: MaterialCost;
  weapon: MaterialCost;
  armor: MaterialCost;
}

export interface AdvancedRefine {
  weapon: {
    tier3_1: MaterialCost;
    tier3_2: MaterialCost;
    tier4_1: MaterialCost;
    tier4_2: MaterialCost;
  };
  armor: {
    tier3_1: MaterialCost;
    tier3_2: MaterialCost;
    tier4_1: MaterialCost;
    tier4_2: MaterialCost;
  };
}

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

    const refineKeys = ["tier3_1", "tier3_2", "tier4_1", "tier4_2"] as const;

    const addMaterials = (
      category: "weapon" | "armor",
      key?: (typeof refineKeys)[number]
    ) => {
      const data = key
        ? advancedRefineData[category][key]
        : calculationResult[category];
      newCost += data.cost;
      for (const [materialName, quantity] of Object.entries(data.materials)) {
        newMaterials[materialName] =
          (newMaterials[materialName] || 0) + quantity;
      }
    };

    if (filter.weapon) addMaterials("weapon");
    if (filter.armor) addMaterials("armor");

    refineKeys.forEach(key => {
      if (filter[key]) {
        if (filter.weapon) addMaterials("weapon", key);
        if (filter.armor) addMaterials("armor", key);
      }
    });

    setCurrent({ cost: newCost, materials: newMaterials });
  }, [filter, weapon, armor]);

  const [inputValues, setInputValues] = useState<Record<string, number>>(owned);

  const adjustedTotalGold =
    current.cost -
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
          <div
            className={`${styles.image} ${styles.cell}`}
            onClick={toggleFilter}
          >
            <Image
              className={styles.filter}
              src="/button/hamburger.svg"
              alt="filter"
              width={34}
              height={34}
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
      {showFilter && <FilterMobile setShowFilter={setShowFilter} />}
    </div>
  ) : null;
};

export default Board;
