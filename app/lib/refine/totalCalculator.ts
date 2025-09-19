import calculator from "./calculator";
import { MaterialCost } from "../types";

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
  priceMap: Record<string, number>
) {
  const result: {
    weapon: MaterialCost;
    armor: MaterialCost;
  } = {
    weapon: { cost: 0, materials: {} },
    armor: { cost: 0, materials: {} },
  };

  for (const part in selection) {
    const grades = selection[part];
    const ranges = parseRanges(grades);
    const itemType = part === '무기' ? 'weapon' : 'armor';
    const category = itemType as 'weapon' | 'armor';

    for (const range of ranges) {
      const [startGrade, endGrade] = range;
      const partResult = calculator(subTierId, itemType, startGrade - 1, endGrade, priceMap);
      
      result[category].cost += partResult.cost;
      for (const mat in partResult.materials) {
        result[category].materials[mat] =
          (result[category].materials[mat] || 0) + partResult.materials[mat];
      }
    }
  }

  return result;
}