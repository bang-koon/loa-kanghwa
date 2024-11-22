import { RefineTable } from "./data";

const breathNames = ["은총", "축복", "가호", "용암", "빙하"];

const calculateRefine = (
  table: RefineTable,
  priceMap: Record<string, number>,
  bindedMap: Record<string, number>
): { totalCost: number; materialsUsed: Record<string, number> } => {
  const JANGIN_ACCUMULATE_DIVIDER = 0.465;
  const baseProb = table.baseProb;
  const additionalProb = table.additionalProb;
  const defaultBasePrice = getPrice(priceMap, bindedMap, table.amount);
  const defaultBreath = buildBreath(
    priceMap,
    table.breath,
    bindedMap,
    baseProb
  );
  let totalCost = 0;
  let totalAttempts = 0;
  let currentProb = baseProb;
  let cumulativeProb = 0;
  let jangin = 0;
  const materialsUsed: Record<string, number> = {};

  while (jangin < 0.4) {
    const breath = defaultBreath.reduce((best, current) => {
      if (current.prob + currentProb + additionalProb > 1) {
        return best;
      }
      const currentScore =
        (current.prob + currentProb + additionalProb) /
        (defaultBasePrice + current.price);
      const bestScore =
        (best.prob + currentProb + additionalProb) /
        (defaultBasePrice + best.price);
      return currentScore > bestScore ? current : best;
    });

    if (!breath) {
      console.log("No suitable breath found");
      break;
    }

    const attemptCost = defaultBasePrice + breath.price;
    const successProb = currentProb + additionalProb + breath.prob;
    jangin += successProb * JANGIN_ACCUMULATE_DIVIDER;

    if (jangin > 0.4) {
      const excessProb = jangin - 0.4;
      const effectiveProb = successProb - excessProb;
      const effectiveCost = attemptCost * (effectiveProb / successProb);

      totalCost += effectiveCost;

      for (const [name, amount] of Object.entries(table.amount)) {
        materialsUsed[name] =
          (materialsUsed[name] || 0) + amount * (effectiveProb / successProb);
      }

      for (const [name, amount] of Object.entries(breath.breathes)) {
        materialsUsed[name] =
          (materialsUsed[name] || 0) + amount * (effectiveProb / successProb);
      }

      break;
    }

    totalCost += attemptCost;
    totalAttempts += 1;

    for (const [name, amount] of Object.entries(table.amount)) {
      materialsUsed[name] = (materialsUsed[name] || 0) + amount;
    }

    for (const [name, amount] of Object.entries(breath.breathes)) {
      materialsUsed[name] = (materialsUsed[name] || 0) + amount;
    }
    currentProb = Math.min(currentProb + baseProb * 0.1, baseProb * 2);
    cumulativeProb += successProb;
  }

  console.log(`평균 강화 비용: ${totalCost} 시도 횟수: ${totalAttempts}`);
  console.log(materialsUsed, "materialsUsed");
  return { totalCost, materialsUsed };
};

// Helper functions
const getPrice = (
  priceMap: Record<string, number>,
  bindedMap: Record<string, number>,
  amountMap: Record<string, number>
): number => {
  return Object.entries(amountMap)
    .map(([key, amount]) => {
      return priceMap[key] * Math.max(amount - (bindedMap[key] ?? 0), 0);
    })
    .reduce((sum, x) => sum + x, 0);
};

const buildBreath = (
  priceMap: Record<string, number>,
  breathMap: Record<string, [number, number]>,
  bindedMap: Record<string, number>,
  baseProb: number
) => {
  const breathes = Object.keys(breathMap).sort((a, b) => {
    const comparator =
      (Math.max(breathMap[a][0] - (bindedMap[a] ?? 0), 0) * priceMap[a]) /
        (breathMap[a][0] * breathMap[a][1]) -
      (Math.max(breathMap[b][0] - (bindedMap[b] ?? 0), 0) * priceMap[b]) /
        (breathMap[b][0] * breathMap[b][1]);

    if (comparator === 0) {
      return priceMap[a] / breathMap[a][1] - priceMap[b] / breathMap[b][1];
    }

    return comparator;
  });

  const adjustedBreathMap: Record<
    string,
    { price: number; prob: number; amount: number }
  > = {};
  let probLeft = Math.max(baseProb, 0.01);

  breathes.forEach(name => {
    const [breathAmount, breathProb] = breathMap[name];
    if (breathNames.includes(name)) {
      const amount = Math.min(Math.ceil(probLeft / breathProb), breathAmount);

      adjustedBreathMap[name] = {
        price: Math.max(amount - (bindedMap[name] ?? 0), 0) * priceMap[name],
        prob: Math.min(amount * breathProb, probLeft),
        amount,
      };
      probLeft -= amount * breathProb;
    } else {
      adjustedBreathMap[name] = {
        price: Math.max(1 - (bindedMap[name] ?? 0), 0) * priceMap[name],
        prob: breathProb,
        amount: 1,
      };
    }
  });

  return breathes.reduce(
    (arr, name) => {
      const prev = arr[arr.length - 1];
      const current = adjustedBreathMap[name];
      arr.push({
        price: prev.price + current.price,
        prob: prev.prob + current.prob,
        breathes: { ...prev.breathes, [name]: current.amount },
      });
      return arr;
    },
    [{ price: 0, prob: 0, breathes: {} as Record<string, number> }]
  );
};

export default calculateRefine;
