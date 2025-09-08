import { findOptimalStrategy } from "./optimizer";
import { advancedRefineTable } from "./data";
import { AdvancedRefine, RefineCategory, RefineTierKey } from "../types";

const getOptimalRefineData = (
  priceMap: Record<string, number>
): AdvancedRefine => {
  const allResults: AdvancedRefine = {
    weapon: {} as RefineCategory,
    armor: {} as RefineCategory,
  };

  for (const type of ["weapon", "armor"] as const) {
    for (const target in advancedRefineTable[type]) {
      const result = findOptimalStrategy(
        target as RefineTierKey,
        type,
        priceMap
      );
      allResults[type][target as RefineTierKey] = result;
    }
  }
  return allResults;
};

export default getOptimalRefineData;
