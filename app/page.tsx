"use client";

import { useEffect, useState } from "react";
import totalCalculator from "./lib/refine/totalCalculator";
import Input from "./components/Input/Input";
import Board from "./components/Board/Board";
import styles from "./page.module.css";

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState({
    current: "",
    target: "",
  });
  const [materials, setMaterials] = useState<Record<string, number> | null>(
    null
  );

  const [owned, setOwned] = useState<Record<string, string>>({});
  const [result, setResult] = useState({ cost: 0, materials: {} });

  useEffect(() => {
    const fetchMaterials = async () => {
      const res = await fetch("/api/getMaterialPrice").then(res => res.json());
      setMaterials(res);
    };

    fetchMaterials();
  }, []); // 빈 배열로 설정하여 컴포넌트가 마운트될 때 한 번만 실행

  // const transformedMaterials = transformMaterialName(materials);
  // 가격 맵과 바인딩 맵 예시
  // const priceMap = {
  //   수호강석: 0.1,
  //   경명돌: 2.5,
  //   상급오레하: 20.8,
  //   파편: 0.3835,
  //   골드: 1,
  //   재봉술숙련: 26,
  //   은총: 17.3,
  //   축복: 37,
  //   가호: 94.4,
  //   // 필요한 다른 자원들 추가
  // };

  // const itemType = "armor";
  // const itemGrade = "t3_1525";
  // const refineTarget = 13;
  // const applyResearch = false;
  // const applyHyperExpress = false;

  // const refineTable = getRefineTable(
  //   itemType,
  //   itemGrade,
  //   refineTarget,
  //   applyResearch,
  //   applyHyperExpress
  // );

  // if (refineTable) {
  //   const averageCost = calculateRefine(
  //     refineTable,
  //     transformedMaterials,
  //     bindedMap
  //   );
  // } else {
  //   console.log("해당 레벨의 강화 테이블을 찾을 수 없습니다.");
  // }

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
        totalGold={result.cost}
        owned={owned}
        setOwned={setOwned}
      />
    </div>
  );
}
