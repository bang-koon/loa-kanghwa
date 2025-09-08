import { advancedRefineTable } from "./data";
import { MaterialCost, RefineTierKey } from "../types";

// --- Types and Interfaces ---
type TurnChoice =
  | "normal"
  | "breath1"
  | "breath2"
  | "breath3"
  | "book"
  | "breath1book"
  | "breath2book"
  | "breath3book";
interface Strategy {
  normalTurn: TurnChoice;
  ancestorTurn: TurnChoice;
}
interface TierProbabilities {
  success: Partial<Record<TurnChoice, number[]>>;
  ancestor: { names: string[]; probs: number[] };
  naber: { names: string[]; probs: number[] };
}

// --- Probability & Constant Definitions ---
const EXP_GAINS = [10, 20, 40];

const T4_HIGH_PROBS: TierProbabilities = {
  // For tier4_3, tier4_4
  success: {
    normal: [0.8, 0.15, 0.05],
    breath1: [0.5, 0.3, 0.2],
    book: [0.3, 0.45, 0.25],
    breath1book: [0, 0.6, 0.4],
  },
  ancestor: {
    names: ["갈라트루", "겔라르", "쿠훔바르", "테메르", "나베르", "에베르"],
    probs: [0.125, 0.25, 0.125, 0.25, 0.125, 0.125],
  },
  naber: {
    names: [
      "나베르-갈라트루",
      "나베르-겔라르",
      "나베르-쿠훔바르",
      "나베르-테메르",
      "나베르-에베르",
    ],
    probs: [0.2, 0.2, 0.2, 0.2, 0.2],
  },
};

const T4_LOW_PROBS: TierProbabilities = {
  // For tier4_1, tier4_2
  ...T4_HIGH_PROBS,
  ancestor: {
    names: ["갈라트루", "겔라르", "쿠훔바르", "테메르"],
    probs: [0.1667, 0.3333, 0.1667, 0.3333],
  }, // Renormalized
};

const T3_PROBS: TierProbabilities = {
  success: {
    normal: [0.8, 0.15, 0.05],
    breath1: [0.7, 0.2, 0.1],
    breath2: [0.6, 0.25, 0.15],
    breath3: [0.5, 0.3, 0.2],
    book: [0.3, 0.45, 0.25],
    breath1book: [0, 0.6, 0.4],
    breath2book: [0, 0.6, 0.4],
    breath3book: [0, 0.6, 0.4],
  },
  ancestor: {
    names: ["갈라트루", "겔라르", "쿠훔바르", "테메르"],
    probs: [0.1765, 0.4118, 0.1765, 0.4118],
  }, // Renormalized
  naber: { names: [], probs: [] },
};

// --- Simulation Core ---
const getOutcome = (probs: number[]): number => {
  const roll = Math.random();
  let cumulativeProb = 0;
  for (let i = 0; i < probs.length; i++) {
    cumulativeProb += probs[i];
    if (roll < cumulativeProb) return i;
  }
  return probs.length - 1;
};

const runSingleTrial = (
  strategy: Strategy,
  target: RefineTierKey,
  type: "armor" | "weapon",
  priceMap: Record<string, number>,
  tierProbs: TierProbabilities
): MaterialCost => {
  let totalExp = 0;
  let totalCost = 0;
  const materials: Record<string, number> = {};
  let attemptCount = 0;
  let isFreeRefine = false;
  let isNaberActive = false;
  let ancestorCycle = 7;

  const table = advancedRefineTable[type][target];

  const addMaterials = (choice: TurnChoice) => {
    for (const mat in table.amount) {
      materials[mat] = (materials[mat] || 0) + table.amount[mat];
    }
    let cost = 0;
    for (const mat in table.amount)
      cost += (table.amount[mat] || 0) * (priceMap[mat] || 0);

    if (choice.includes("breath")) {
      if (target.startsWith("tier4")) {
        for (const breathName in table.breath) {
          const quantity = table.breath[breathName];
          materials[breathName] = (materials[breathName] || 0) + quantity;
          cost += quantity * (priceMap[breathName] || 0);
        }
      } else {
        const breathNum = parseInt(choice.replace(/[^0-9]/g, ""), 10) as
          | 1
          | 2
          | 3;
        const breathOrder = ["가호", "축복", "은총"];
        const breathChoices = {
          breath1: [breathOrder[0]],
          breath2: breathOrder.slice(0, 2),
          breath3: breathOrder.slice(0, 3),
        };
        if (breathChoices[`breath${breathNum}`]) {
          for (const breathName of breathChoices[`breath${breathNum}`]) {
            if (table.breath[breathName]) {
              materials[breathName] =
                (materials[breathName] || 0) + table.breath[breathName];
              cost += table.breath[breathName] * (priceMap[breathName] || 0);
            }
          }
        }
      }
    }
    if (choice.includes("book") && table.book) {
      materials[table.book] = (materials[table.book] || 0) + 1;
      cost += priceMap[table.book] || 0;
    }
    return cost;
  };

  while (totalExp < 1000) {
    attemptCount++;
    ancestorCycle--;

    const isAncestorTurn = ancestorCycle === 0;
    const choice = isAncestorTurn ? strategy.ancestorTurn : strategy.normalTurn;
    const currentCost = isFreeRefine ? 0 : addMaterials(choice);
    if (!isFreeRefine) totalCost += currentCost;
    isFreeRefine = false;

    const probs = tierProbs.success[choice]!;
    const baseExpRoll = EXP_GAINS[getOutcome(probs)];

    if (isNaberActive) {
      isNaberActive = false;
      const effectName =
        tierProbs.naber.names[getOutcome(tierProbs.naber.probs)];
      if (effectName === "나베르-갈라트루") totalExp += baseExpRoll * 7;
      else if (effectName === "나베르-겔라르") totalExp += baseExpRoll * 5;
      else if (effectName === "나베르-쿠훔바르") totalExp += 80;
      else if (effectName === "나베르-테메르") {
        totalExp += 30;
        isFreeRefine = true;
      } else if (effectName === "나베르-에베르") totalExp += baseExpRoll + 200;
    } else if (isAncestorTurn) {
      const effectName =
        tierProbs.ancestor.names[getOutcome(tierProbs.ancestor.probs)];
      if (effectName === "갈라트루") totalExp += baseExpRoll * 5;
      else if (effectName === "겔라르") totalExp += baseExpRoll * 3;
      else if (effectName === "쿠훔바르") {
        totalExp += 30;
        ancestorCycle = 1;
      } else if (effectName === "테메르") {
        totalExp += 10;
        isFreeRefine = true;
      } else if (effectName === "나베르") isNaberActive = true;
      else if (effectName === "에베르") totalExp += baseExpRoll + 100;
      if (ancestorCycle === 0) ancestorCycle = 7;
    } else {
      totalExp += baseExpRoll;
    }
  }
  return { cost: totalCost, materials };
};

const simulateStrategyCost = (
  strategy: Strategy,
  target: RefineTierKey,
  type: "armor" | "weapon",
  priceMap: Record<string, number>,
  numTrials: number = 1000
): MaterialCost => {
  const tierProbs = target.startsWith("tier4")
    ? target === "tier4_3" || target === "tier4_4"
      ? T4_HIGH_PROBS
      : T4_LOW_PROBS
    : T3_PROBS;
  let totalCost = 0;
  const totalMaterials: Record<string, number> = {};

  for (let i = 0; i < numTrials; i++) {
    const result = runSingleTrial(strategy, target, type, priceMap, tierProbs);
    totalCost += result.cost;
    for (const mat in result.materials) {
      totalMaterials[mat] = (totalMaterials[mat] || 0) + result.materials[mat];
    }
  }

  const avgCost = totalCost / numTrials;
  const avgMaterials: Record<string, number> = {};
  for (const mat in totalMaterials) {
    avgMaterials[mat] = totalMaterials[mat] / numTrials;
  }

  return { cost: avgCost, materials: avgMaterials };
};

// --- Main Optimizer Function ---
export const findOptimalStrategy = (
  target: RefineTierKey,
  type: "armor" | "weapon",
  priceMap: Record<string, number>
): MaterialCost => {
  const isT4 = target.startsWith("tier4");
  const baseChoices: TurnChoice[] = ["normal", "book"];
  const t3BreathChoices: TurnChoice[] = [
    "breath1",
    "breath2",
    "breath3",
    "breath1book",
    "breath2book",
    "breath3book",
  ];
  const t4BreathChoices: TurnChoice[] = ["breath1", "breath1book"];

  const choices: TurnChoice[] = isT4
    ? [...baseChoices, ...t4BreathChoices]
    : [...baseChoices, ...t3BreathChoices];

  let bestStrategy: Strategy | null = null;
  let minCost: MaterialCost = { cost: Infinity, materials: {} };

  for (const normalTurn of choices) {
    for (const ancestorTurn of choices) {
      const currentStrategy: Strategy = { normalTurn, ancestorTurn };

      const table = advancedRefineTable[type][target];
      if (
        (normalTurn.includes("book") || ancestorTurn.includes("book")) &&
        !table.book
      ) {
        continue;
      }

      const result = simulateStrategyCost(
        currentStrategy,
        target,
        type,
        priceMap
      );

      if (result.cost < minCost.cost) {
        minCost = result;
        bestStrategy = currentStrategy;
      }
    }
  }

  console.log(
    `[Debug] Final best strategy for ${type} ${target}:`,
    bestStrategy
  );
  return minCost;
};
