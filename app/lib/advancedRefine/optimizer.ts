import { advancedRefineTable, AdvancedRefineTable } from "./data";
import { MaterialCost, RefineTierKey } from "../types";
import {
  getSupportEffect,
  SupportEffect,
  SupportMode,
} from "../supportSettings";

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
  attempts: number;
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
  naber: { names: [], probs: [] },
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
  effect: SupportEffect
): { cost: number; materials: Record<string, number> } => {
  const materials: Record<string, number> = {};
  let cost = 0;

  const {
    gold: goldMultiplier,
    materials: materialsMultiplier,
    shard: shardMultiplier,
  } = effect.advancedRefineCostMultiplier;

  // Base materials - Conditionally add cost and materials
  if (!isFreeRefine) {
    // 1. 모든 기본 재료에 대해 할인율 적용 및 추가
    for (const mat in table.amount) {
      const isGold = mat === "골드";
      const isShard = mat.includes("파편");

      let multiplier = materialsMultiplier;
      if (isGold) multiplier = goldMultiplier;
      else if (isShard) multiplier = shardMultiplier;

      const discountedAmount = Math.round(table.amount[mat] * multiplier);
      materials[mat] = (materials[mat] || 0) + discountedAmount;
    }
  }

  // Breath materials (할인 적용)
  if (choice.includes("breath")) {
    if (table.breath) {
      if ("빙하" in table.breath || "용암" in table.breath) {
        // T4
        for (const breathName in table.breath) {
          const quantity = Math.round(table.breath[breathName] * materialsMultiplier);
          materials[breathName] = (materials[breathName] || 0) + quantity;
        }
      } else {
        // T3
        const breathNum = parseInt(choice.replace(/[^0-9]/g, ""), 10) as 1 | 2 | 3;

        const sortedBreaths = Object.entries(table.breath)
          .map(([name, amount]) => ({
            name,
            amount: Math.round(amount * materialsMultiplier),
            price: priceMap[name] || 0,
          }))
          .sort((a, b) => a.price * a.amount - b.price * b.amount);

        const selectedBreaths = sortedBreaths.slice(0, breathNum);

        for (const breath of selectedBreaths) {
          materials[breath.name] = (materials[breath.name] || 0) + breath.amount;
        }
      }
    }
  }

  // Book material (책은 할인 대상이 아님)
  if (choice.includes("book") && table.book) {
    const bookName = table.book;
    materials[bookName] = (materials[bookName] || 0) + 1;
  }

  // 최종적으로 구성된 재료 목록을 기반으로 총 비용 계산
  for (const mat in materials) {
    // '골드'의 가격은 1이므로 priceMap에서 찾지 않고 직접 더함
    cost += materials[mat] * (priceMap[mat] || (mat === "골드" ? 1 : 0));
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
  effect: SupportEffect
): OptimalResult => {
  if (currentExp >= MAX_EXP) {
    return { cost: 0, materials: {}, attempts: 0, bestChoice: "none" };
  }

  const memoKey = `${currentExp}-${ancestorCycle}-${isNaberActive}-${isFreeRefine}`;
  if (memo[memoKey]) {
    return memo[memoKey];
  }

  const isAncestorTurn = ancestorCycle <= 1;
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
  let bestAttempts = 0;

  for (const choice of choices) {
    const turnCostResult = calculateCost(
      choice,
      table,
      priceMap,
      isFreeRefine,
      effect
    );
    const turnCost = turnCostResult.cost;
    const turnMaterials = turnCostResult.materials;

    const successProbs = tierProbs.success[choice]!;
    if (!successProbs) continue;

    let expectedFutureCost = 0;
    let expectedFutureMaterials: Record<string, number> = {};
    let expectedFutureAttempts = 0;

    for (let i = 0; i < successProbs.length; i++) {
      const prob = successProbs[i];
      if (prob === 0) continue;

      const expGain = EXP_GAINS[i];
      let futureCostResult: OptimalResult;

      if (isAncestorTurn) {
        let ancestorExpectedCost = 0;
        let ancestorExpectedMaterials: Record<string, number> = {};
        let ancestorExpectedAttempts = 0;

        for (let j = 0; j < tierProbs.ancestor.probs.length; j++) {
          const ancestorProb = tierProbs.ancestor.probs[j];
          const ancestorName = tierProbs.ancestor.names[j];
          let ancestorResult: OptimalResult;

          if (isNaberActive) {
            let naberExpectedCost = 0;
            let naberExpectedMaterials: Record<string, number> = {};
            let naberExpectedAttempts = 0;
            for (let k = 0; k < tierProbs.naber.probs.length; k++) {
              const naberProb = tierProbs.naber.probs[k];
              const naberName = tierProbs.naber.names[k];
              let naberResult: OptimalResult;
              if (naberName === "나베르-갈라트루")
                naberResult = findOptimalRecursive(currentExp + expGain * 7, 7, false, false, target, type, priceMap, tierProbs, effect);
              else if (naberName === "나베르-겔라르")
                naberResult = findOptimalRecursive(currentExp + expGain * 5, 7, false, false, target, type, priceMap, tierProbs, effect);
              else if (naberName === "나베르-쿠훔바르")
                naberResult = findOptimalRecursive(currentExp + expGain + 80, 1, false, false, target, type, priceMap, tierProbs, effect);
              else if (naberName === "나베르-테메르")
                naberResult = findOptimalRecursive(currentExp + expGain + 30, 7, false, true, target, type, priceMap, tierProbs, effect);
              else
                naberResult = findOptimalRecursive(
                  Math.floor((currentExp + expGain) / 100) * 100 + 200,
                  7,
                  false,
                  false,
                  target,
                  type,
                  priceMap,
                  tierProbs,
                  effect
                );

              naberExpectedCost += naberProb * naberResult.cost;
              naberExpectedAttempts += naberProb * naberResult.attempts;
              for (const mat in naberResult.materials)
                naberExpectedMaterials[mat] = (naberExpectedMaterials[mat] || 0) + naberProb * naberResult.materials[mat];
            }
            ancestorResult = { cost: naberExpectedCost, materials: naberExpectedMaterials, attempts: naberExpectedAttempts, bestChoice: "none" };
          } else if (ancestorName === "갈라트루")
            ancestorResult = findOptimalRecursive(currentExp + expGain * 5, 7, false, false, target, type, priceMap, tierProbs, effect);
          else if (ancestorName === "겔라르")
            ancestorResult = findOptimalRecursive(currentExp + expGain * 3, 7, false, false, target, type, priceMap, tierProbs, effect);
          else if (ancestorName === "쿠훔바르")
            ancestorResult = findOptimalRecursive(currentExp + expGain + 30, 1, false, false, target, type, priceMap, tierProbs, effect);
          else if (ancestorName === "테메르")
            ancestorResult = findOptimalRecursive(currentExp + expGain + 10, 7, false, true, target, type, priceMap, tierProbs, effect);
          else if (ancestorName === "나베르")
            ancestorResult = findOptimalRecursive(currentExp + expGain, 1, true, false, target, type, priceMap, tierProbs, effect);
          else
            ancestorResult = findOptimalRecursive(
              Math.floor((currentExp + expGain) / 100) * 100 + 100,
              7,
              false,
              false,
              target,
              type,
              priceMap,
              tierProbs,
              effect
            );

          ancestorExpectedCost += ancestorProb * ancestorResult.cost;
          ancestorExpectedAttempts += ancestorProb * ancestorResult.attempts;
          for (const mat in ancestorResult.materials) {
            ancestorExpectedMaterials[mat] = (ancestorExpectedMaterials[mat] || 0) + ancestorProb * ancestorResult.materials[mat];
          }
        }
        futureCostResult = { cost: ancestorExpectedCost, materials: ancestorExpectedMaterials, attempts: ancestorExpectedAttempts, bestChoice: "none" };
      } else {
        futureCostResult = findOptimalRecursive(
          currentExp + expGain,
          ancestorCycle - effect.advancedRefineBeadGain,
          false,
          false,
          target,
          type,
          priceMap,
          tierProbs,
          effect
        );
      }

      expectedFutureCost += prob * futureCostResult.cost;
      expectedFutureAttempts += prob * futureCostResult.attempts;
      for (const mat in futureCostResult.materials) {
        expectedFutureMaterials[mat] = (expectedFutureMaterials[mat] || 0) + prob * futureCostResult.materials[mat];
      }
    }

    const totalExpectedCost = turnCost + expectedFutureCost;
    const totalExpectedAttempts = 1 + expectedFutureAttempts;

    if (totalExpectedCost < minExpectedCost) {
      minExpectedCost = totalExpectedCost;
      bestChoice = choice;
      bestAttempts = totalExpectedAttempts;

      bestMaterials = { ...turnMaterials };
      for (const mat in expectedFutureMaterials) {
        bestMaterials[mat] = (bestMaterials[mat] || 0) + expectedFutureMaterials[mat];
      }
    }
  }

  const result: OptimalResult = {
    cost: minExpectedCost,
    materials: bestMaterials,
    attempts: bestAttempts,
    bestChoice,
  };
  memo[memoKey] = result;
  return result;
};


export const findOptimalStrategy = (
  target: RefineTierKey,
  type: "armor" | "weapon",
  priceMap: Record<string, number>,
  supportMode: SupportMode
): MaterialCost => {
  memo = {};
  const tierProbs = target.startsWith("tier3")
    ? T3_PROBS
    : target.endsWith("_1") || target.endsWith("_2")
    ? T4_LOW_PROBS
    : T4_HIGH_PROBS;

  const effect = getSupportEffect(target, 0, supportMode);
  const table = advancedRefineTable[type][target];

  const result = findOptimalRecursive(
    0,
    7,
    false,
    false,
    target,
    type,
    priceMap,
    tierProbs,
    effect
  );

  // 1회 시도당 재료 개수 및 가격 출력
  // const { gold: gm, materials: mm, shard: sm } = effect.advancedRefineCostMultiplier;
  // console.log(`\n[Optimizer] === ${target} / ${type} (${supportMode}) ===`);
  // console.log(`[Optimizer] 1회 시도 재료 (할인 적용 후):`);
  // for (const mat in table.amount) {
  //   const isGold = mat === "골드";
  //   const isShard = mat.includes("파편");
  //   const multiplier = isGold ? gm : isShard ? sm : mm;
  //   const qty = Math.round(table.amount[mat] * multiplier);
  //   const unitPrice = priceMap[mat] || (isGold ? 1 : 0);
  //   console.log(`  ${mat}: ${qty}개 × ${unitPrice}골드 = ${(qty * unitPrice).toFixed(0)}골드`);
  // }
  // if (table.breath) {
  //   for (const mat in table.breath) {
  //     const qty = Math.round(table.breath[mat] * mm);
  //     const unitPrice = priceMap[mat] || 0;
  //     console.log(`  ${mat}(숨결): ${qty}개 × ${unitPrice}골드 = ${(qty * unitPrice).toFixed(0)}골드`);
  //   }
  // }
  // if (table.book) {
  //   const bookPrice = priceMap[table.book] || 0;
  //   console.log(`  ${table.book}(책): 1개 × ${bookPrice}골드 = ${bookPrice}골드 (할인 미적용)`);
  // }
  // console.log(`[Optimizer] 최적 기대 시도 횟수: ${result.attempts.toFixed(2)}`);
  // console.log(`[Optimizer] 최적 기대 총 비용: ${result.cost.toFixed(0)}골드`);

  return {
    cost: result.cost,
    materials: result.materials,
  };
};
