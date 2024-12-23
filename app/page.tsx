"use client";

import { useEffect, useState } from "react";
import totalCalculator from "./lib/refine/totalCalculator";
import Input from "./components/Input/Input";
import Board from "./components/Board/Board";
import Filter from "./components/Filter/Filter";
import styles from "./page.module.css";

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState({
    current: "",
    target: "",
  });
  const [materials, setMaterials] = useState<Record<string, number>>({});

  const [owned, setOwned] = useState<Record<string, number>>({});
  const [result, setResult] = useState({ cost: 0, materials: {} });

  useEffect(() => {
    const fetchMaterials = async () => {
      const res = await fetch("/api/getMaterialPrice").then(res => res.json());
      setMaterials(res);
    };

    fetchMaterials();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (materials) {
      const res = totalCalculator(level.current, level.target, materials);
      console.log(res, "result");
      setResult(res);
    }
  };

  return (
    <div className={styles.container}>
      <Input level={level} setLevel={setLevel} onSubmit={handleSubmit} />
      <Board
        materials={result.materials}
        materialsPrice={materials}
        totalGold={result.cost}
        owned={owned}
        setOwned={setOwned}
      />
      <Filter />
    </div>
  );
}
