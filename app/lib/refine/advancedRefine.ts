// 4t 21~30 상재 계산

interface RefineResult {
  materials: Record<string, number>;
  cost: number;
}

const advancedRefine = (
  priceMap: Record<string, number>,
  type: "armor" | "weapon"
) => {
  // 노숨 평균 시도 횟수 54(테메릭 정 제외, 57 - 2.85), 선조 턴 8.16
  // 선조 숨결 평균 횟수 47(테메릭 정 제외, 50.4 - 2.52), 선조 턴 7.2

  // 타입을 확인한 뒤에 노숨 54회와, 일반턴 40 + 선조턴(빙하, 용암)
  const table = {
    armor: {
      material: {
        운명의수호석: 1000,
        운돌: 18,
        아비도스: 17,
        운명파편: 7000,
        골드: 2000,
      },
      breath: "빙하",
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
    },
  };

  const DEFAULT_ATTEMPTS = 54;
  const BREATHES_ATTEMPTS = 47;
  let refineCost = 0;
  const materials: Record<string, number> = table[type].material;
  const breath = table[type].breath;

  for (let material in materials) {
    const quantity = materials[material];
    const price = priceMap[material] || 0;
    refineCost += quantity * price;
  }

  const noBreathesCost = refineCost * DEFAULT_ATTEMPTS;
  const breathesCost = refineCost * BREATHES_ATTEMPTS + priceMap[breath] * 7;
  const refineResult: RefineResult = {
    materials: {},
    cost: 0,
  };

  if (noBreathesCost > breathesCost) {
    for (let material in materials) {
      refineResult.materials[material] =
        materials[material] * BREATHES_ATTEMPTS;
    }

    // 숨결은 한 턴에 20개, 선조 턴이 7,2회
    refineResult.materials = { ...refineResult.materials, [breath]: 20 * 7.2 };
    refineResult.cost = breathesCost;
    refineResult.cost += priceMap[breath] * 7.2;
  } else {
    for (let material in materials) {
      refineResult.materials[material] = materials[material] * DEFAULT_ATTEMPTS;
    }
  }

  return refineResult;
};

export default advancedRefine;
