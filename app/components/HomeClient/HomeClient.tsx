"use client";

import { useState, useEffect } from "react";
import totalCalculator from "../../lib/refine/totalCalculator";
import RefineSelector from "../RefineSelector/RefineSelector";
import styles from "../../page.module.scss";
import Reward from "../Reward/Reward";
import { useView } from "../../lib/ViewContext";
import Board from "../Board/Board";
import Filter from "../Filter/Filter";
import { tierInfo } from "@/app/lib/refine/data";

import { AdvancedRefine } from "@/app/lib/types";

interface MainContentProps {
  materials: Record<string, number>;
  advancedRefineData: AdvancedRefine;
}

export default function HomeClient({ materials, advancedRefineData }: MainContentProps) {
  const { activeView } = useView();
  const [owned, setOwned] = useState<Record<string, number>>({});
  const [refineSelection, setRefineSelection] = useState<Record<string, Set<number>>>({});
  const [tier, setTier] = useState<"T3" | "T4">("T4");
  const [subTier, setSubTier] = useState(tierInfo.T4[0].id);

  const [calculationResult, setCalculationResult] = useState({
    weapon: { cost: 0, materials: {} },
    armor: { cost: 0, materials: {} },
  });

  useEffect(() => {
    if (materials && Object.keys(refineSelection).length > 0) {
      const res = totalCalculator(refineSelection, subTier, materials);
      setCalculationResult(res);
    } else {
      setCalculationResult({
        weapon: { cost: 0, materials: {} },
        armor: { cost: 0, materials: {} },
      });
    }
  }, [refineSelection, subTier, materials]);

  return (
    <div className={styles.container}>
      {activeView === "reward" ? (
        <Reward />
      ) : (
        <>
          <RefineSelector
            selection={refineSelection}
            setSelection={setRefineSelection}
            tier={tier}
            setTier={setTier}
            subTier={subTier}
            setSubTier={setSubTier}
          />
          <Board
            calculationResult={calculationResult}
            advancedRefineData={advancedRefineData}
            materialsPrice={materials}
            owned={owned}
            setOwned={setOwned}
          />
          <Filter />
        </>
      )}
    </div>
  );
}
