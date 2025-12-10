import { advancedRefineTable, AdvancedRefineTable } from "./data";
import { MaterialCost, RefineTierKey } from "../types";
import { getSupportEffect, SupportMode } from "../supportSettings";

// --- Types and Interfaces ---
type TurnChoice = "normal" | "breath1" | "breath2" | "breath3" | "book" | "breath1book" | "breath2book" | "breath3book" | "none";

interface TierProbabilities {
  success: Partial<Record<TurnChoice, number[]>>;
  ancestor: { names: string[]; probs: number[] };
  naber: { names: string[]; probs: number[] };
}

interface OptimalResult {
  cost: number;
  materials: Record<string, number>;
  bestChoice: TurnChoice;
}

// --- Probability & Constant Definitions ---
const EXP_GAINS = [10, 20, 40];
const MAX_EXP = 1000;

const T4_HIGH_PROBS: TierProbabilities = {
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
    names: ["나베르-갈라트루", "나베르-겔라르", "나베르-쿠훔바르", "나베르-테메르", "나베르-에베르"],
    probs: [0.2, 0.2, 0.2, 0.2, 0.2],
  },
};

const T4_LOW_PROBS: TierProbabilities = {
  ...T4_HIGH_PROBS,
  success: {
    normal: [0.8, 0.15, 0.05],
    breath1: [0.5, 0.3, 0.2],
    book: [0.3, 0.45, 0.25],
    breath1book: [0, 0.6, 0.4],
  },
  ancestor: {
    names: ["갈라트루", "겔라르", "쿠훔바르", "테메르"],
    probs: [0.15, 0.35, 0.15, 0.35],
  },
};

const T3_PROBS: TierProbabilities = {
  success: {
    normal: [0.8, 0.15, 0.05],
    breath1: [0.7, 0.2, 0.1],
    breath2: [0.6, 0.25, 0.15],
    breath3: [0.5, 0.3, 0.2],
    book: [0.3, 0.45, 0.25],
    breath1book: [0.2, 0.5, 0.3],
    breath2book: [0.1, 0.55, 0.35],
    breath3book: [0, 0.6, 0.4],
  },
  ancestor: {
    names: ["갈라트루", "겔라르", "쿠훔바르", "테메르"],
    probs: [0.15, 0.35, 0.15, 0.35],
  },
  naber: { names: [], probs: [] },
};

// --- Memoization Cache ---
let memo: {
  [key: string]: OptimalResult;
};

// --- Cost Calculation ---
const calculateCost = (
  choice: TurnChoice,
  table: AdvancedRefineTable,
  priceMap: Record<string, number>,
  isFreeRefine: boolean,
  target: RefineTierKey, // Add target to check reduction
  supportMode: SupportMode
): { cost: number; materials: Record<string, number> } => {
  const materials: Record<string, number> = {};
  let cost = 0;

  // Support Effect 가져오기 (상급 재련이므로 grade는 임의값 0)
  const effect = getSupportEffect(target, 0, supportMode);

  // Base materials - Conditionally add cost and materials
  if (!isFreeRefine) {
    if (table.amount["골드"]) {
      const goldAmount = Math.round(table.amount["골드"] * effect.advancedRefineCostMultiplier.gold);
      cost += goldAmount;
      materials["골드"] = (materials["골드"] || 0) + goldAmount;
    }
    for (const mat in table.amount) {
      if (mat === "골드") continue;

      let multiplier = effect.advancedRefineCostMultiplier.materials;
      if (mat.includes("파편") || mat.includes("명예의 파편") || mat.includes("운명의 파편")) {
        multiplier = effect.advancedRefineCostMultiplier.shard;
      }

      const amount = Math.round(table.amount[mat] * multiplier);
      materials[mat] = (materials[mat] || 0) + amount;
      cost += amount * (priceMap[mat] || 0);
    }
  }

  // Breath materials
  if (choice.includes("breath")) {
    if (table.breath) {
      if ("빙하" in table.breath || "용암" in table.breath) {
        // T4
        for (const breathName in table.breath) {
          const quantity = table.breath[breathName];
          materials[breathName] = (materials[breathName] || 0) + quantity;
          cost += quantity * (priceMap[breathName] || 0);
        }
      } else {
        // T3
        const breathNum = parseInt(choice.replace(/[^0-9]/g, ""), 10) as 1 | 2 | 3;

        // Sort breaths by price to ensure we add the cheapest ones first.
        const sortedBreaths = Object.entries(table.breath)
          .map(([name, amount]) => ({
            name,
            amount,
            price: (priceMap[name] || 0) * amount,
          }))
          .sort((a, b) => a.price - b.price);

        const selectedBreaths = sortedBreaths.slice(0, breathNum);

        for (const breath of selectedBreaths) {
          materials[breath.name] = (materials[breath.name] || 0) + breath.amount;
          cost += breath.price;
        }
      }
    }
  }

  // Book material
  if (choice.includes("book") && table.book) {
    materials[table.book] = (materials[table.book] || 0) + 1;
    cost += priceMap[table.book] || 0;
  }

  return { cost, materials };
};

// --- Dynamic Programming Core ---
const findOptimalRecursive = (
  currentExp: number,
  ancestorCycle: number,
  isNaberActive: boolean,
  isFreeRefine: boolean,
  target: RefineTierKey,
  type: "armor" | "weapon",
  priceMap: Record<string, number>,
  tierProbs: TierProbabilities,
  supportMode: SupportMode,
  beadGain: number
): OptimalResult => {
  if (currentExp >= MAX_EXP) {
    return { cost: 0, materials: {}, bestChoice: "none" };
  }

  const memoKey = `${currentExp}-${ancestorCycle}-${isNaberActive}-${isFreeRefine}`;
  if (memo[memoKey]) {
    return memo[memoKey];
  }

  const isAncestorTurn = ancestorCycle < beadGain; // Cycle 이 beadGain 보다 작으면 조상의 가호 발동 (예: beadGain=2이면 1 이하일 때 발동?)
  // 기존 로직: ancestorCycle === 1 일 때 발동. 매 턴 1씩 감소.
  // beadGain=2 이면 매 턴 2씩 감소해야 함.

  // 수정된 로직: ancestorCycle이 0 이하가 되면 조상의 가호 턴.
  // 초기값 70 (x10 scaling) -> 매 턴 10 * beadGain 감소?
  // 기존 코드: ancestorCycle 1~7.
  // 심플하게: beadGain=1 -> cycle 1 감소. cycle이 0이 되면 조상 턴.
  // 여기서는 로직을 유지하되, parameter 감소량을 조절.

  // NOTE: 기존 코드 분석
  // ancestorCycle === 1 이면 조상의 가호 턴.
  // 일반 턴에서는 ancestorCycle - 1 을 넘김.
  // beadGain=2 라면 ancestorCycle - 2 를 넘기고, 1 이하가 되면 조상 턴으로 처리?
  // 그런데 ancestorCycle 은 정확히 7주기여야 함.

  // 모챌익 설명: "구슬 2개씩 획득" -> 조상 턴이 2배 빨리 옴.
  // 즉, ancestorCycle 감소량을 beadGain으로 함.

  const isAncestorReady = ancestorCycle <= 0;

  const table = advancedRefineTable[type][target];

  const baseChoices: TurnChoice[] = ["normal"];
  if (table.book) baseChoices.push("book");

  const t3BreathChoices: TurnChoice[] = ["breath1", "breath2", "breath3"];
  if (table.book) t3BreathChoices.push("breath1book", "breath2book", "breath3book");

  const t4BreathChoices: TurnChoice[] = ["breath1"];
  if (table.book) t4BreathChoices.push("breath1book");

  const choices: TurnChoice[] = target.startsWith("tier4")
    ? [...baseChoices, ...t4BreathChoices]
    : [...baseChoices, ...t3BreathChoices];

  let bestChoice: TurnChoice = "normal";
  let minExpectedCost = Infinity;
  let bestMaterials: Record<string, number> = {};

  // 조상 턴 처리
  if (isAncestorReady) {
    let ancestorExpectedCost = 0;
    let ancestorExpectedMaterials: Record<string, number> = {};

    for (let j = 0; j < tierProbs.ancestor.probs.length; j++) {
      const ancestorProb = tierProbs.ancestor.probs[j];
      const ancestorName = tierProbs.ancestor.names[j];
      let ancestorResult: OptimalResult;

      // Reset cycle to 7 after ancestor turn
      // 나베르 로직 등은 복잡하므로 그대로 유지하되 재귀 호출 시 param 전달
      const nextCycle = 7;

      if (isNaberActive) {
        // 나베르 로직 (생략 없이 param 추가)
        let naberExpectedCost = 0;
        let naberExpectedMaterials: Record<string, number> = {};
        for (let k = 0; k < tierProbs.naber.probs.length; k++) {
          const naberProb = tierProbs.naber.probs[k];
          const naberName = tierProbs.naber.names[k];
          let naberResult: OptimalResult;

          // 나베르 결과에 따른 Exp 증가 및 사이클 리셋
          if (naberName === "나베르-갈라트루")
            naberResult = findOptimalRecursive(
              currentExp + EXP_GAINS[0] * 7,
              7,
              false,
              false,
              target,
              type,
              priceMap,
              tierProbs,
              supportMode,
              beadGain
            );
          else if (naberName === "나베르-겔라르")
            naberResult = findOptimalRecursive(
              currentExp + EXP_GAINS[0] * 5,
              7,
              false,
              false,
              target,
              type,
              priceMap,
              tierProbs,
              supportMode,
              beadGain
            );
          else if (naberName === "나베르-쿠훔바르")
            naberResult = findOptimalRecursive(
              currentExp + EXP_GAINS[0] + 80,
              1,
              false,
              false,
              target,
              type,
              priceMap,
              tierProbs,
              supportMode,
              beadGain
            );
          else if (naberName === "나베르-테메르")
            naberResult = findOptimalRecursive(
              currentExp + EXP_GAINS[0] + 30,
              7,
              false,
              true,
              target,
              type,
              priceMap,
              tierProbs,
              supportMode,
              beadGain
            );
          // 에베르
          else
            naberResult = findOptimalRecursive(
              Math.floor((currentExp + EXP_GAINS[0]) / 100) * 100 + 200,
              7,
              false,
              false,
              target,
              type,
              priceMap,
              tierProbs,
              supportMode,
              beadGain
            );

          naberExpectedCost += naberProb * naberResult.cost;
          for (const mat in naberResult.materials)
            naberExpectedMaterials[mat] = (naberExpectedMaterials[mat] || 0) + naberProb * naberResult.materials[mat];
        }
        ancestorResult = { cost: naberExpectedCost, materials: naberExpectedMaterials, bestChoice: "none" };
      } else if (ancestorName === "갈라트루")
        ancestorResult = findOptimalRecursive(
          currentExp + EXP_GAINS[0] * 5,
          7,
          false,
          false,
          target,
          type,
          priceMap,
          tierProbs,
          supportMode,
          beadGain
        );
      else if (ancestorName === "겔라르")
        ancestorResult = findOptimalRecursive(
          currentExp + EXP_GAINS[0] * 3,
          7,
          false,
          false,
          target,
          type,
          priceMap,
          tierProbs,
          supportMode,
          beadGain
        );
      else if (ancestorName === "쿠훔바르")
        ancestorResult = findOptimalRecursive(
          currentExp + EXP_GAINS[0] + 30,
          1,
          false,
          false,
          target,
          type,
          priceMap,
          tierProbs,
          supportMode,
          beadGain
        );
      else if (ancestorName === "테메르")
        ancestorResult = findOptimalRecursive(
          currentExp + EXP_GAINS[0] + 10,
          7,
          false,
          true,
          target,
          type,
          priceMap,
          tierProbs,
          supportMode,
          beadGain
        );
      else if (ancestorName === "나베르")
        ancestorResult = findOptimalRecursive(
          currentExp + EXP_GAINS[0],
          1,
          true,
          false,
          target,
          type,
          priceMap,
          tierProbs,
          supportMode,
          beadGain
        );
      // 에베르
      else
        ancestorResult = findOptimalRecursive(
          Math.floor((currentExp + EXP_GAINS[0]) / 100) * 100 + 100,
          7,
          false,
          false,
          target,
          type,
          priceMap,
          tierProbs,
          supportMode,
          beadGain
        );

      ancestorExpectedCost += ancestorProb * ancestorResult.cost;
      for (const mat in ancestorResult.materials) {
        ancestorExpectedMaterials[mat] = (ancestorExpectedMaterials[mat] || 0) + ancestorProb * ancestorResult.materials[mat];
      }
    }
    return { cost: ancestorExpectedCost, materials: ancestorExpectedMaterials, bestChoice: "none" };
  }

  // 일반 턴
  for (const choice of choices) {
    const turnCostResult = calculateCost(choice, table, priceMap, isFreeRefine, target, supportMode);
    const turnCost = turnCostResult.cost;
    const turnMaterials = turnCostResult.materials;

    const successProbs = tierProbs.success[choice]!;
    if (!successProbs) continue;

    let expectedFutureCost = 0;
    let expectedFutureMaterials: Record<string, number> = {};

    for (let i = 0; i < successProbs.length; i++) {
      const prob = successProbs[i];
      if (prob === 0) continue;

      const expGain = EXP_GAINS[i];

      const futureCostResult = findOptimalRecursive(
        currentExp + expGain,
        ancestorCycle - beadGain, // 구슬 획득량만큼 사이클 감소
        false,
        false,
        target,
        type,
        priceMap,
        tierProbs,
        supportMode,
        beadGain
      );

      expectedFutureCost += prob * futureCostResult.cost;
      for (const mat in futureCostResult.materials) {
        expectedFutureMaterials[mat] = (expectedFutureMaterials[mat] || 0) + prob * futureCostResult.materials[mat];
      }
    }

    const totalExpectedCost = turnCost + expectedFutureCost;
    if (totalExpectedCost < minExpectedCost) {
      minExpectedCost = totalExpectedCost;
      bestChoice = choice;

      bestMaterials = { ...turnMaterials };
      for (const mat in expectedFutureMaterials) {
        bestMaterials[mat] = (bestMaterials[mat] || 0) + expectedFutureMaterials[mat];
      }
    }
  }

  const result: OptimalResult = {
    cost: minExpectedCost,
    materials: bestMaterials,
    bestChoice,
  };
  memo[memoKey] = result;
  return result;
};

export const findOptimalStrategy = (
  target: RefineTierKey,
  type: "armor" | "weapon",
  priceMap: Record<string, number>,
  supportMode: SupportMode = "permanent" // 기본값
): MaterialCost => {
  memo = {};
  const tierProbs = target.startsWith("tier3")
    ? T3_PROBS
    : target.endsWith("_1") || target.endsWith("_2")
    ? T4_LOW_PROBS
    : T4_HIGH_PROBS;

  const effect = getSupportEffect(target, 0, supportMode);
  const beadGain = effect.advancedRefineBeadGain; // 1 or 2

  // 초기 사이클 7
  const result = findOptimalRecursive(0, 7, false, false, target, type, priceMap, tierProbs, supportMode, beadGain);

  return {
    cost: result.cost,
    materials: result.materials,
  };
};
