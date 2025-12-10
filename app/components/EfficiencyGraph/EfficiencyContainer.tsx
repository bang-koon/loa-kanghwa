"use client";

import { useState, useMemo } from "react";
import GraphControls, { Toggles } from "./GraphControls";
import EfficiencyGraph from "./EfficiencyGraph";
import { EfficiencyData, EfficiencyDataItem, CostCategory } from "@/app/lib/efficiency/calculateEfficiencyData";
import styles from "./EfficiencyContainer.module.scss";

interface EfficiencyContainerProps {
  permanentData: EfficiencyData;
  mokokoData: EfficiencyData;
}

// 토글별 카테고리 매핑
const TOGGLE_CATEGORY_MAP: Record<keyof Toggles, CostCategory[]> = {
  stones: ["stones"],
  shard: ["shards"],
  leapstone: ["leapstones"],
  fusion: ["fusion"],
  breath: ["breath"],
  book: ["book"],
};

const EfficiencyContainer = ({ permanentData, mokokoData }: EfficiencyContainerProps) => {
  const [toggles, setToggles] = useState<Toggles>({
    stones: true,
    shard: true,
    leapstone: true,
    fusion: true,
    breath: true,
    book: true,
  });
  const [isMokoko, setIsMokoko] = useState(false);

  // 현재 모드에 따라 데이터 선택
  const currentData = isMokoko ? mokokoData : permanentData;

  // 토글 상태에 따라 비용 계산
  const getFilteredCost = (item: EfficiencyDataItem): number => {
    let cost = item.costs.gold; // 기본 골드는 항상 포함

    for (const [toggleKey, categories] of Object.entries(TOGGLE_CATEGORY_MAP)) {
      if (toggles[toggleKey as keyof Toggles]) {
        for (const cat of categories) {
          cost += item.costs[cat];
        }
      }
    }

    return cost;
  };

  // 정렬된 데이터 (비용 오름차순)
  const sortedData = useMemo(() => {
    const weaponWithCost = currentData.weapon.map(item => ({
      ...item,
      filteredCost: getFilteredCost(item),
    }));
    const armorWithCost = currentData.armor.map(item => ({
      ...item,
      filteredCost: getFilteredCost(item),
    }));

    return {
      weapon: weaponWithCost.sort((a, b) => a.filteredCost - b.filteredCost),
      armor: armorWithCost.sort((a, b) => a.filteredCost - b.filteredCost),
    };
  }, [currentData, toggles]); // Depend on currentData

  return (
    <div className={styles.container}>
      <GraphControls toggles={toggles} setToggles={setToggles} isMokoko={isMokoko} setIsMokoko={setIsMokoko} />

      <EfficiencyGraph title="무기 효율 (Weapon)" data={sortedData.weapon} />

      <div className={styles.spacer} />

      <EfficiencyGraph title="방어구 효율 (Armor)" data={sortedData.armor} />
    </div>
  );
};

export default EfficiencyContainer;
