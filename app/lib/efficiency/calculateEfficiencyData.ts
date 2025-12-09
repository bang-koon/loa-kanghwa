import calculateRefine from "@/app/lib/refine/refine";
import { getRefineTable } from "@/app/lib/refine/data";
import getOptimalRefineData from "@/app/lib/advancedRefine";

// 재료 카테고리 정의
export type CostCategory = "gold" | "shards" | "leapstones" | "fusion" | "breath" | "book" | "stones";

export interface CostBreakdown {
  gold: number; // 기본 골드 (누르는 비용)
  shards: number; // 파편
  leapstones: number; // 돌파석 (명돌, 운돌)
  fusion: number; // 융화재료 (오레하, 아비도스)
  breath: number; // 숨결 (은총, 축복, 가호, 빙하, 용암)
  book: number; // 책 (야금술, 재봉술)
  stones: number; // 강석 (수호석, 파괴석)
}

export interface MaterialInfo {
  name: string;
  amount: number;
  price: number;
  category: CostCategory;
}

export interface EfficiencyDataItem {
  id: string;
  name: string;
  type: "normal" | "advanced";
  costs: CostBreakdown;
  materials: MaterialInfo[];
  totalCost: number; // 모든 재료 포함한 총 비용
}

export interface EfficiencyData {
  weapon: EfficiencyDataItem[];
  armor: EfficiencyDataItem[];
}

// 재료 이름으로 카테고리 판별
const getMaterialCategory = (name: string): CostCategory => {
  if (name === "골드") return "gold";
  if (name.includes("파편") || name.includes("운명파편")) return "shards";
  if (name.includes("돌") && (name.includes("명") || name.includes("운"))) return "leapstones"; // 찬명돌, 운돌 등
  if (name.includes("오레하") || name.includes("아비도스")) return "fusion";
  if (name.includes("은총") || name.includes("축복") || name.includes("가호") || name.includes("빙하") || name.includes("용암"))
    return "breath";
  if (name.includes("야금술") || name.includes("재봉술")) return "book";
  if (name.includes("수호") || name.includes("파괴")) return "stones";
  return "stones"; // 기본값
};

// 재료 데이터를 비용 breakdown으로 변환
const processMaterials = (
  materials: Record<string, number>,
  priceMap: Record<string, number>
): { costs: CostBreakdown; materialList: MaterialInfo[] } => {
  const costs: CostBreakdown = {
    gold: 0,
    shards: 0,
    leapstones: 0,
    fusion: 0,
    breath: 0,
    book: 0,
    stones: 0,
  };

  const materialList: MaterialInfo[] = [];

  for (const [name, amount] of Object.entries(materials)) {
    if (amount <= 0) continue;

    const category = getMaterialCategory(name);
    const price = priceMap[name] || 0;

    // 골드는 그대로 더하고, 나머지는 가격 * 수량
    const cost = category === "gold" ? amount : price * amount;
    costs[category] += cost;

    materialList.push({
      name,
      amount: Math.round(amount * 100) / 100, // 소수점 2자리
      price,
      category,
    });
  }

  return { costs, materialList };
};

export function calculateEfficiencyData(priceMap: Record<string, number>): EfficiencyData {
  const result: EfficiencyData = { weapon: [], armor: [] };
  const categories = ["weapon", "armor"] as const;

  // 상급 재련 최적화 데이터 (이미 10단계/20단계 전체 비용 계산됨)
  const advancedRefineData = getOptimalRefineData(priceMap);

  for (const cat of categories) {
    const items: EfficiencyDataItem[] = [];

    // 1. 일반 재련: 15→16 ~ 22→23 (T4 1590)
    for (let fromGrade = 15; fromGrade < 23; fromGrade++) {
      const toGrade = fromGrade + 1;
      const table = getRefineTable(cat, "t4_1590", toGrade, false, false);

      if (!table) {
        console.warn(`Table not found for ${cat} grade ${toGrade}`);
        continue;
      }

      const refineResult = calculateRefine(table, priceMap);
      const { costs, materialList } = processMaterials(refineResult.materials, priceMap);

      // 아이템 레벨 계산 (T4 기준: 11강 = 1640, 매 강화당 +5)
      const itemLevel = 1640 + (toGrade - 11) * 5;

      items.push({
        id: `normal-${toGrade}`,
        name: `+${toGrade}강`,
        type: "normal",
        costs,
        materials: materialList,
        totalCost: Object.values(costs).reduce((sum, v) => sum + v, 0),
      });
    }

    // 2. 상급 재련 (getOptimalRefineData 사용 - 이미 최적화 계산됨)
    const advTiers = [
      { key: "tier4_1", name: "상재 1~10", id: "adv-1-10" },
      { key: "tier4_2", name: "상재 11~20", id: "adv-11-20" },
      { key: "tier4_3", name: "상재 21~30", id: "adv-21-30" },
      { key: "tier4_4", name: "상재 31~40", id: "adv-31-40" },
    ] as const;

    for (const tier of advTiers) {
      const tierResult = advancedRefineData[cat]?.[tier.key];
      if (!tierResult) continue;

      // advancedRefineData의 result는 { cost, materials } 형태
      const { costs, materialList } = processMaterials(tierResult.materials, priceMap);

      items.push({
        id: tier.id,
        name: tier.name,
        type: "advanced",
        costs,
        materials: materialList,
        totalCost: tierResult.cost, // 이미 계산된 총 비용 사용
      });
    }

    result[cat] = items;
  }

  return result;
}
