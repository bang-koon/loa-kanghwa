// 4t 21~40 상재 계산, 노숨 vs 나베르 숨 가격 비교

interface RefineResult {
  materials: Record<string, number>;
  cost: number;
}

const advancedRefine = (
  priceMap: Record<string, number>,
  type: "armor" | "weapon",
  tier: "4_3" | "4_4"
) => {
  const table = {
    "4_3": {
      armor: {
        material: {
          운명의수호석: 1000,
          운돌: 18,
          아비도스: 17,
          운명파편: 7000,
          골드: 2000,
        },
        breath: "빙하",
        maxBreathes: 20,
      },
      weapon: {
        material: {
          운명의파괴석: 1200,
          운돌: 25,
          아비도스: 28,
          운명파편: 11500,
          골드: 3000,
        },
        breath: "용암",
        maxBreathes: 20,
      },
    },
    "4_4": {
      armor: {
        material: {
          운명의수호석: 1200,
          운돌: 23,
          아비도스: 19,
          운명파편: 8000,
          골드: 2400,
        },
        breath: "빙하",
        maxBreathes: 24,
      },
      weapon: {
        material: {
          운명의파괴석: 1400,
          운돌: 32,
          아비도스: 30,
          운명파편: 11500,
          골드: 4000,
        },
        breath: "용암",
        maxBreathes: 24,
      },
    },
  };

  const DEFAULT_ATTEMPTS = 52; // 노숨
  const NAVER_ATTEMPTS = 1.27; // 50.8 * 0.025
  const BREATHES_ATTEMPTS = 49.53; // 총 50.8 - 나베르턴 1.27
  const MAX_BREATHES = table[tier][type].maxBreathes; // 최대 숨결 개수
  let refineCost = 0;
  const materials: Record<string, number> = table[tier][type].material;
  const breath = table[tier][type].breath;

  for (let material in materials) {
    const quantity = materials[material];
    const price = priceMap[material] || 0;
    refineCost += quantity * price;
  }

  const noBreathesCost = refineCost * DEFAULT_ATTEMPTS;
  const breathesCost =
    refineCost * BREATHES_ATTEMPTS +
    priceMap[breath] * MAX_BREATHES * NAVER_ATTEMPTS;
  const refineResult: RefineResult = {
    materials: {},
    cost: 0,
  };

  if (noBreathesCost > breathesCost) {
    for (let material in materials) {
      refineResult.materials[material] =
        materials[material] * BREATHES_ATTEMPTS;
    }

    refineResult.materials = {
      ...refineResult.materials,
      [breath]: MAX_BREATHES * NAVER_ATTEMPTS,
    };
    refineResult.cost = breathesCost;
    refineResult.cost += priceMap[breath] * MAX_BREATHES * NAVER_ATTEMPTS;
  } else {
    for (let material in materials) {
      refineResult.materials[material] = materials[material] * DEFAULT_ATTEMPTS;
    }
  }
  return refineResult;
};
export default advancedRefine;
