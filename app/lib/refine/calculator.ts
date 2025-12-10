import { getRefineTable, tierInfo } from "./data";
import calculateRefine from "./refine";
import { getSupportEffect, SupportMode } from "../supportSettings";

const calculator = (
  itemTierId: string,
  itemType: string,
  startGrade: number,
  endGrade: number,
  priceMap: Record<string, number>,
  supportMode: SupportMode = "permanent" // 기본값 상시 지원
) => {
  let totalMaterials: Record<string, number> = {};
  let totalCost = 0;

  const applyResearch = false;
  const applyHyperExpress = false;

  for (let grade = startGrade; grade < endGrade; grade++) {
    const refineTarget = grade + 1;

    const baseTable = getRefineTable(itemType, itemTierId, refineTarget, applyResearch, applyHyperExpress);

    if (!baseTable) {
      console.error(`Could not find table for ${itemTierId} grade ${refineTarget}`);
      continue;
    }

    // Support Effect 적용 (Table 복사 후 수정)
    const effect = getSupportEffect(itemTierId, refineTarget, supportMode);
    const table = { ...baseTable, amount: { ...baseTable.amount } };

    // 1. 성공률 증가
    if (effect.successRateMultiplier > 1) {
      table.baseProb = Math.min(table.baseProb * effect.successRateMultiplier, 1);
    }

    // 2. 기본 비용(골드/재료) 감소
    if (table.amount["골드"]) {
      table.amount["골드"] = Math.round(table.amount["골드"] * effect.costMultiplier.gold);
    }

    for (const mat in table.amount) {
      if (mat === "골드") continue;

      let multiplier = effect.costMultiplier.materials;
      if (mat.includes("파편") || mat.includes("명예의 파편") || mat.includes("운명의 파편")) {
        multiplier = effect.costMultiplier.shard;
      }

      table.amount[mat] = Math.round(table.amount[mat] * multiplier);
    }

    const result = calculateRefine(table, priceMap);

    for (const key in result.materials) {
      totalMaterials[key] = (totalMaterials[key] || 0) + result.materials[key];
    }
    totalCost += result.cost;
  }

  return { materials: totalMaterials, cost: totalCost };
};

export default calculator;
