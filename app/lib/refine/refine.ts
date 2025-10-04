import { RefineTable } from './data';

const JANGIN_ACCUMULATE_DIVIDER = 2.15;

// Helper types
type MaterialChoice = {
  name: string;
  price: number;
  prob: number;
  amount: number;
};
type Combination = {
  price: number;
  prob: number;
  breathes: Record<string, number>;
};

// Result types
export interface OptimalResult {
  cost: number;
  materials: Record<string, number>;
  path: { choice: Combination; prob: number }[];
}

// --- Helper Functions ---
function getPrice(
  priceMap: Record<string, number>,
  amountMap: Record<string, number>
): number {
  return Object.entries(amountMap)
    .map(([key, amount]) => (priceMap[key] || 0) * amount)
    .reduce((sum, x) => sum + x, 0);
}

// Returns a list of individual supplemental materials
function getIndividualMaterials(
  priceMap: Record<string, number>,
  breathMap: Record<string, [number, number]>
): MaterialChoice[] {
  return Object.keys(breathMap)
    .filter((name) => priceMap[name] > 0)
    .map((name) => {
      const [amount, prob] = breathMap[name];
      return {
        name,
        amount,
        prob: prob * amount,
        price: (priceMap[name] || 0) * amount,
      };
    });
}

// Generates all 2^n combinations (power set) from the list of materials
function generateAllCombinations(materials: MaterialChoice[]): Combination[] {
  const powerSet: Combination[] = [];
  const numCombinations = 1 << materials.length;

  for (let i = 0; i < numCombinations; i++) {
    const subset: Combination = { price: 0, prob: 0, breathes: {} };
    for (let j = 0; j < materials.length; j++) {
      if ((i & (1 << j)) > 0) {
        const material = materials[j];
        subset.price += material.price;
        subset.prob += material.prob;
        subset.breathes[material.name] = material.amount;
      }
    }
    powerSet.push(subset);
  }
  return powerSet;
}

// --- DP with Memoization ---
let memo: Record<string, OptimalResult>;

function findOptimalStrategy(
  table: RefineTable,
  priceMap: Record<string, number>,
  currentProb: number,
  currentJangin: number
): OptimalResult {
  if (currentJangin >= 1) {
    return { cost: 0, materials: {}, path: [] };
  }

  const memoKey = `${Math.round(currentProb * 1000)}-${Math.round(
    currentJangin * 10000
  )}`;
  if (memo[memoKey]) {
    return memo[memoKey];
  }

  const baseTurnCost = getPrice(priceMap, table.amount);
  const individualMaterials = getIndividualMaterials(priceMap, table.breath);
  const allCombinations = generateAllCombinations(individualMaterials);

  let minExpectedCost = Infinity;
  let bestResult: OptimalResult = { cost: Infinity, materials: {}, path: [] };

  for (const combination of allCombinations) {
    const turnCost = baseTurnCost + combination.price;
    const turnMaterials = { ...table.amount, ...combination.breathes };

    const totalProb = Math.min(
      currentProb + table.additionalProb + combination.prob,
      1
    );

    let expectedFutureCost = 0;
    const expectedFutureMaterials: Record<string, number> = {};

    if (totalProb < 1) {
      const failProb = 1 - totalProb;
      const nextProb = Math.min(
        currentProb + table.baseProb * 0.1,
        table.baseProb * 2
      );
      const nextJangin =
        currentJangin +
        (totalProb / JANGIN_ACCUMULATE_DIVIDER) * table.janginMultiplier;

      const futureResult = findOptimalStrategy(
        table,
        priceMap,
        nextProb,
        nextJangin
      );

      expectedFutureCost = failProb * futureResult.cost;
      for (const material in futureResult.materials) {
        if (table.amount[material] || combination.breathes[material]) {
            expectedFutureMaterials[material] =
                (expectedFutureMaterials[material] || 0) +
                failProb * futureResult.materials[material];
        }
      }
    }

    const totalExpectedCost = turnCost + expectedFutureCost;

    if (totalExpectedCost < minExpectedCost) {
      minExpectedCost = totalExpectedCost;

      const totalExpectedMaterials: Record<string, number> = {};
      for (const mat in turnMaterials) {
        totalExpectedMaterials[mat] = (totalExpectedMaterials[mat] || 0) + turnMaterials[mat];
      }
      for (const mat in expectedFutureMaterials) {
        totalExpectedMaterials[mat] = (totalExpectedMaterials[mat] || 0) + expectedFutureMaterials[mat];
      }

      bestResult = {
        cost: minExpectedCost,
        materials: totalExpectedMaterials,
        path: [{ choice: combination, prob: totalProb }],
      };
    }
  }

  memo[memoKey] = bestResult;
  return bestResult;
}

export default function calculateRefine(
  table: RefineTable,
  priceMap: Record<string, number>
): OptimalResult {
  memo = {}; // Clear memoization cache for each new calculation
  return findOptimalStrategy(table, priceMap, table.baseProb, 0);
}
