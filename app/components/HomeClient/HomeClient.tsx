"use client";

import { useState } from "react";
import totalCalculator from "../../lib/refine/totalCalculator";
import Input from "../Input/Input";
import Board from "../Board/Board";
import Filter from "../Filter/Filter";
import styles from "../../page.module.scss";
import Reward from "../Reward/Reward";
import { useView } from "../../lib/ViewContext";

import { AdvancedRefine } from "@/app/lib/types";

interface MainContentProps {
  materials: Record<string, number>;
  advancedRefineData: AdvancedRefine;
}

export default function HomeClient({ materials, advancedRefineData }: MainContentProps) {
  const { activeView } = useView();
  const [level, setLevel] = useState({
    current: "",
    target: "",
  });
  const [owned, setOwned] = useState<Record<string, number>>({});
  const [calculationResult, setCalculationResult] = useState({
    total: { cost: 0, materials: {} },
    weapon: { cost: 0, materials: {} },
    armor: { cost: 0, materials: {} },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (materials) {
      const res = totalCalculator(level.current, level.target, materials);
      setCalculationResult(res);
    }
  };

  return (
    <div className={styles.container}>
      {activeView === "reward" ? (
        <Reward />
      ) : (
        <>
          <Input level={level} setLevel={setLevel} onSubmit={handleSubmit} />
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
