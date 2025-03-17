"use client";

import { useEffect, useState } from "react";
import totalCalculator from "./lib/refine/totalCalculator";
import Input from "./components/Input/Input";
import Board from "./components/Board/Board";
import Filter from "./components/Filter/Filter";
import styles from "./page.module.scss";

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState({
    current: "",
    target: "",
  });
  const [materials, setMaterials] = useState<Record<string, number>>({});
  const [owned, setOwned] = useState<Record<string, number>>({});
  const [calculationResult, setCalculationResult] = useState({
    total: { cost: 0, materials: {} },
    weapon: { cost: 0, materials: {} },
    armor: { cost: 0, materials: {} },
  });
  const [advancedRefineData, setAdvancedRefineData] = useState({
    weapon: {
      tier3_1: { cost: 0, materials: {} },
      tier3_2: { cost: 0, materials: {} },
      tier4_1: { cost: 0, materials: {} },
      tier4_2: { cost: 0, materials: {} },
      tier4_3: { cost: 0, materials: {} },
      tier4_4: { cost: 0, materials: {} },
    },
    armor: {
      tier3_1: { cost: 0, materials: {} },
      tier3_2: { cost: 0, materials: {} },
      tier4_1: { cost: 0, materials: {} },
      tier4_2: { cost: 0, materials: {} },
      tier4_3: { cost: 0, materials: {} },
      tier4_4: { cost: 0, materials: {} },
    },
  });

  useEffect(() => {
    const fetchMaterials = async () => {
      const res = await fetch("/api/getMaterialPrice").then(res => res.json());
      setMaterials(res);
    };

    fetchMaterials();
    const fetchAdvancedRefine = async () => {
      const res = await fetch("/api/getAdvancedRefineData").then(res =>
        res.json()
      );
      setAdvancedRefineData(res);
    };

    fetchAdvancedRefine();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (materials) {
      const res = totalCalculator(level.current, level.target, materials);
      setCalculationResult(res);
    }
  };

  return (
    <div className={styles.container}>
      <Input level={level} setLevel={setLevel} onSubmit={handleSubmit} />
      <Board
        calculationResult={calculationResult}
        advancedRefineData={advancedRefineData}
        materialsPrice={materials}
        owned={owned}
        setOwned={setOwned}
      />
      <Filter />
    </div>
  );
}
