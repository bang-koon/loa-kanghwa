"use client";

import { useState, useEffect } from "react";
import totalCalculator from "../../lib/refine/totalCalculator";
import RefineSelector from "../RefineSelector/RefineSelector";
import Reward from "../Reward/Reward";
import Board from "../Board/Board";
import Filter from "../Filter/Filter";
import styles from "./HomeClient.module.scss";
import { tierInfo } from "@/app/lib/refine/data";
import FilterMobile from "@/app/components/Filter/FilterMobile";

import { AdvancedRefine } from "@/app/lib/types";

import useFilterStore from "../../lib/store";

interface MainContentProps {
  materials?: Record<string, number>;
  permanentAdvancedRefineData?: AdvancedRefine;
  mokokoAdvancedRefineData?: AdvancedRefine;
  activeView: "reward" | "calculator";
}

export default function HomeClient({
  materials,
  permanentAdvancedRefineData,
  mokokoAdvancedRefineData,
  activeView,
}: MainContentProps) {
  const [owned, setOwned] = useState<Record<string, number>>({});
  const [refineSelection, setRefineSelection] = useState<Record<string, Set<number>>>({});
  const [tier, setTier] = useState<"T3" | "T4">("T4");
  const [subTier, setSubTier] = useState(tierInfo.T4[0].id);
  const [showFilter, setShowFilter] = useState(false);

  // Filter Store에서 모코코 상태 가져오기
  const { selected } = useFilterStore();
  const isMokoko = selected.mokoko;
  const supportMode = isMokoko ? "mokoko" : "permanent";
  const currentAdvancedRefineData = isMokoko ? mokokoAdvancedRefineData : permanentAdvancedRefineData;

  const [calculationResult, setCalculationResult] = useState({
    weapon: { cost: 0, materials: {} },
    armor: { cost: 0, materials: {} },
  });

  const toggleFilter = () => {
    setShowFilter(prev => !prev);
  };

  useEffect(() => {
    if (materials && Object.keys(refineSelection).length > 0) {
      const res = totalCalculator(refineSelection, subTier, materials, supportMode);
      setCalculationResult(res);
    } else {
      setCalculationResult({
        weapon: { cost: 0, materials: {} },
        armor: { cost: 0, materials: {} },
      });
    }
  }, [refineSelection, subTier, materials, supportMode]);

  return (
    <div className={styles.homeClientContainer}>
      {activeView === "reward" ? (
        <Reward />
      ) : materials && currentAdvancedRefineData ? (
        <>
          <RefineSelector
            selection={refineSelection}
            setSelection={setRefineSelection}
            tier={tier}
            setTier={setTier}
            subTier={subTier}
            setSubTier={setSubTier}
            toggleFilter={toggleFilter}
          />
          <Board
            calculationResult={calculationResult}
            advancedRefineData={currentAdvancedRefineData}
            materialsPrice={materials}
            owned={owned}
            setOwned={setOwned}
          />
          <Filter />
        </>
      ) : null}
      {showFilter && <FilterMobile setShowFilter={setShowFilter} />}
    </div>
  );
}
