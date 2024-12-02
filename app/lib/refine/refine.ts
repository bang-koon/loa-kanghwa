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
  const materialsUsed: Record<string, number> = {};

  const calculator = (
    defaultBreath: Array<{
      price: number;
      prob: number;
      breathes: Record<string, number>;
    }>,
    baseProb: number,
    additionalProb: number,
    defaultBasePrice: number
  ): {
    minCost: number;
    attempts: number;
    usedBreathes: Record<string, number>;
  } => {
    const maxSuccessRate = 0.86;
    const dp: number[] = Array(87).fill(Infinity);
    const attempts: number[] = Array(87).fill(0);
    const usedBreathes: Record<string, number>[] = Array(87)
      .fill(null)
      .map(() => ({}));
    dp[0] = 0;

    for (let s = 0; s <= 86; s++) {
      for (const breath of defaultBreath) {
        const currentProb = Math.min(
          baseProb + baseProb * 0.1 * attempts[s],
          baseProb * 2
        );
        if (currentProb > maxSuccessRate) continue;

        const calculatedState =
          s + Math.round((currentProb + breath.prob + additionalProb) * 100);
        const nextState = Math.min(86, calculatedState);
        let cost = defaultBasePrice + breath.price;
        let attemptIncrement = 1;

        if (calculatedState > 86) {
          const excess = calculatedState - 86;
          const totalIncrease = calculatedState - s;
          const increaseRatio = 1 - excess / totalIncrease;
          cost *= increaseRatio;
          attemptIncrement *= increaseRatio;
        }

        if (dp[nextState] > dp[s] + cost) {
          dp[nextState] = dp[s] + cost;
          attempts[nextState] = attempts[s] + attemptIncrement;

          usedBreathes[nextState] = { ...usedBreathes[s] };
          for (const [name, amount] of Object.entries(breath.breathes)) {
            usedBreathes[nextState][name] =
              (usedBreathes[nextState][name] || 0) + amount;
          }
        }
      }
    }

    return {
      minCost: dp[86],
      attempts: attempts[86],
      usedBreathes: usedBreathes[86],
    };
  };

  const result = calculator(
    defaultBreath,
    baseProb,
    additionalProb,
    defaultBasePrice
  );

  totalCost = result.minCost;

  for (const [name, amount] of Object.entries(table.amount)) {
    if (name !== "골드") {
      materialsUsed[name] = (amount || 0) * result.attempts;
    }
  }

  for (const [name, amount] of Object.entries(result.usedBreathes)) {
    materialsUsed[name] = (materialsUsed[name] || 0) + amount;
  }

  console.log(`시도 횟수: ${result.attempts}`);
  console.log(`총 비용: ${totalCost}, 사용한 재료:`, materialsUsed);

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
