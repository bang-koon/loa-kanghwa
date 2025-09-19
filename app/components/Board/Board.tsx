import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import styles from "./Board.module.scss";
import { reverseTransformMaterialName } from "@/app/lib/transformMaterialName";
import debounce from "lodash/debounce";
import useFilterStore from "@/app/lib/store";
import FilterMobile from "@/app/components/Filter/FilterMobile";
import {
  MaterialCost,
  CalculationResult,
  AdvancedRefine,
} from "@/app/lib/types";

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
    // 1. 일반 재련 데이터 (필터링되지 않음)
    const { weapon, armor } = calculationResult;
    let newCost = weapon.cost + armor.cost;
    const newMaterials: Record<string, number> = { ...weapon.materials };

    for (const [material, quantity] of Object.entries(armor.materials)) {
      newMaterials[material] = (newMaterials[material] || 0) + quantity;
    }

    // 2. 상급 재련 데이터 (필터링됨)
    let advancedCost = 0;
    let advancedMaterials: Record<string, number> = {};

    const refineKeys = [
      "tier3_1",
      "tier3_2",
      "tier4_1",
      "tier4_2",
      "tier4_3",
      "tier4_4",
    ] as const;

    const addAdvancedMaterials = (
      category: "weapon" | "armor",
      key: (typeof refineKeys)[number]
    ) => {
      const data = advancedRefineData[category]?.[key];
      if (!data) return;

      advancedCost += data.cost;
      for (const [materialName, quantity] of Object.entries(data.materials)) {
        advancedMaterials[materialName] =
          (advancedMaterials[materialName] || 0) + quantity;
      }
    };

    refineKeys.forEach(key => {
      if (filter[key]) {
        if (filter.weapon) addAdvancedMaterials("weapon", key);
        if (filter.armor) addAdvancedMaterials("armor", key);
      }
    });

    // 상급 재련에만 5부위 증폭 처리
    if (filter.fiveParts) {
      advancedCost *= 5;
      for (const material in advancedMaterials) {
        advancedMaterials[material] *= 5;
      }
    }

    // 3. 일반 재련과 상급 재련 데이터 합산
    newCost += advancedCost;
    for (const material in advancedMaterials) {
      newMaterials[material] =
        (newMaterials[material] || 0) + advancedMaterials[material];
    }

    setCurrent({ cost: newCost, materials: newMaterials });
  }, [filter, calculationResult, advancedRefineData]);

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
                  {` (${(materialsPrice[name] || 0).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })})`}
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
