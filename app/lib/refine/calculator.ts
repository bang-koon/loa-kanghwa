import { getRefineTable, tierInfo } from "./data";
import calculateRefine from "./refine";

const calculator = (
  itemTierId: string,
  itemType: string,
  startGrade: number,
  endGrade: number,
  priceMap: Record<string, number>
) => {
  let totalMaterials: Record<string, number> = {};
  let totalCost = 0;

  const applyResearch = false;
  const applyHyperExpress = false;

  for (let grade = startGrade; grade < endGrade; grade++) {
    const refineTarget = grade + 1;

    const table = getRefineTable(
      itemType,
      itemTierId,
      refineTarget,
      applyResearch,
      applyHyperExpress
    );

    if (!table) {
      console.error(`Could not find table for ${itemTierId} grade ${refineTarget}`);
      continue;
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