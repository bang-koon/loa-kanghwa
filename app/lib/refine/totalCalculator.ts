import calculator from "./calculator";
import { MaterialCost } from "../types";
import { SupportMode } from "../supportSettings";

// Finds contiguous ranges from a sorted set of numbers
// e.g., {11, 12, 14, 15} -> [[11, 12], [14, 15]]
function parseRanges(grades: Set<number>): number[][] {
  if (!grades || grades.size === 0) return [];

  const sorted = Array.from(grades).sort((a, b) => a - b);
  const ranges: number[][] = [];
  if (sorted.length === 0) return ranges;

  let currentRange: number[] = [sorted[0], sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === currentRange[1] + 1) {
      currentRange[1] = sorted[i];
    } else {
      ranges.push(currentRange);
      currentRange = [sorted[i], sorted[i]];
    }
  }
  ranges.push(currentRange);

  return ranges;
}

export default function totalCalculator(
  selection: Record<string, Set<number>>,
  subTierId: string,
  priceMap: Record<string, number>,
  supportMode: SupportMode
) {
  const result: {
    weapon: MaterialCost;
    armor: MaterialCost;
  } = {
    weapon: { cost: 0, materials: {} },
    armor: { cost: 0, materials: {} },
  };

  const memo: Record<string, { cost: number; materials: Record<string, number> }> = {};

  for (const part in selection) {
    const grades = selection[part];
    const ranges = parseRanges(grades);
    const itemType = part === "무기" ? "weapon" : "armor";
    const category = itemType as "weapon" | "armor";

    for (const range of ranges) {
      const [startGrade, endGrade] = range;
      const cacheKey = `${itemType}-${subTierId}-${startGrade}-${endGrade}-${supportMode}`;

      let partResult = memo[cacheKey];
      if (!partResult) {
        partResult = calculator(subTierId, itemType, startGrade - 1, endGrade, priceMap, supportMode);
        memo[cacheKey] = partResult;
      }

      result[category].cost += partResult.cost;
      for (const mat in partResult.materials) {
        result[category].materials[mat] = (result[category].materials[mat] || 0) + partResult.materials[mat];
      }
    }
  }

  return result;
}
