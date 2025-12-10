"use client";

import { useState, useEffect, useMemo } from "react";
import totalCalculator from "../../lib/refine/totalCalculator";
import RefineSelector from "../RefineSelector/RefineSelector";
import Reward from "../Reward/Reward";
import Board from "../Board/Board";
import Filter from "../Filter/Filter";
import styles from "./HomeClient.module.scss";
import { tierInfo } from "@/app/lib/refine/data";
import FilterMobile from "@/app/components/Filter/FilterMobile";
import { zeroBoundBookPrices } from "@/app/lib/utils";

import { AdvancedRefine } from "@/app/lib/types";

import useFilterStore from "../../lib/store";

interface MainContentProps {
  materials?: Record<string, number>;
  permanentAdvancedRefineData?: AdvancedRefine;
  permanentBoundBookAdvancedRefineData?: AdvancedRefine;
  mokokoAdvancedRefineData?: AdvancedRefine;
  mokokoBoundBookAdvancedRefineData?: AdvancedRefine;
  activeView: "reward" | "calculator";
}

export default function HomeClient({
  materials,
  permanentAdvancedRefineData,
  permanentBoundBookAdvancedRefineData,
  mokokoAdvancedRefineData,
  mokokoBoundBookAdvancedRefineData,
  activeView,
}: MainContentProps) {
  const [owned, setOwned] = useState<Record<string, number>>({});
  const [refineSelection, setRefineSelection] = useState<Record<string, Set<number>>>({});
  const [tier, setTier] = useState<"T3" | "T4">("T4");
  const [subTier, setSubTier] = useState(tierInfo.T4[0].id);
  const [showFilter, setShowFilter] = useState(false);

  // Filter Store에서 모코코 및 귀속책 상태 가져오기
  const { selected } = useFilterStore();
  const isMokoko = selected.mokoko;
  const isBoundBook = selected.boundBook;
  const supportMode = isMokoko ? "mokoko" : "permanent";

  // 4가지 시나리오에서 적절한 advancedRefineData 선택
  const currentAdvancedRefineData = useMemo(() => {
    if (isMokoko) {
      return isBoundBook ? mokokoBoundBookAdvancedRefineData : mokokoAdvancedRefineData;
    }
    return isBoundBook ? permanentBoundBookAdvancedRefineData : permanentAdvancedRefineData;
  }, [
    isMokoko,
    isBoundBook,
    permanentAdvancedRefineData,
    permanentBoundBookAdvancedRefineData,
    mokokoAdvancedRefineData,
    mokokoBoundBookAdvancedRefineData,
  ]);

  // 귀속책 필터 적용된 priceMap
  const effectivePriceMap = useMemo(() => {
    if (!materials) return materials;
    return isBoundBook ? zeroBoundBookPrices(materials) : materials;
  }, [materials, isBoundBook]);

  const [calculationResult, setCalculationResult] = useState({
    weapon: { cost: 0, materials: {} },
    armor: { cost: 0, materials: {} },
  });

  const toggleFilter = () => {
    setShowFilter(prev => !prev);
  };

  useEffect(() => {
    if (effectivePriceMap && Object.keys(refineSelection).length > 0) {
      const res = totalCalculator(refineSelection, subTier, effectivePriceMap, supportMode);
      setCalculationResult(res);
    } else {
      setCalculationResult({
        weapon: { cost: 0, materials: {} },
        armor: { cost: 0, materials: {} },
      });
    }
  }, [refineSelection, subTier, effectivePriceMap, supportMode]);

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
            materialsPrice={effectivePriceMap!}
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
