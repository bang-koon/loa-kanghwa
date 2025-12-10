import calculateRefine from "@/app/lib/refine/refine";
import { getRefineTable } from "@/app/lib/refine/data";
import getOptimalRefineData from "@/app/lib/advancedRefine";
import { RefineTierKey } from "@/app/lib/types";
import calculator from "../refine/calculator";
import { SupportMode } from "../supportSettings";

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
  totalCost: number; // filteredCost is used in UI, totalCost kept for reference if needed, but not strictly required by UI types?
  filteredCost: number; // UI expects this
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

// Helper function to calculate costs
const calculateCostsByMaterials = (materials: MaterialInfo[]): CostBreakdown => {
  const costs: CostBreakdown = {
    gold: 0,
    stones: 0,
    shards: 0, // plural to match interface
    leapstones: 0, // plural to match interface
    fusion: 0,
    breath: 0,
    book: 0,
  };

  for (const mat of materials) {
    if (mat.category === "gold") costs.gold += mat.amount;
    else if (mat.category === "stones") costs.stones += mat.price * mat.amount;
    else if (mat.category === "shards") costs.shards += mat.price * mat.amount;
    else if (mat.category === "leapstones") costs.leapstones += mat.price * mat.amount;
    else if (mat.category === "fusion") costs.fusion += mat.price * mat.amount;
    else if (mat.category === "breath") costs.breath += mat.price * mat.amount;
    else if (mat.category === "book") costs.book += mat.price * mat.amount;
  }
  return costs;
};

export const calculateEfficiencyData = async (
  priceMap: Record<string, number>,
  supportMode: SupportMode = "permanent" // 기본값 설정
): Promise<EfficiencyData> => {
  const categories = ["weapon", "armor"] as const;
  const efficiencyData: EfficiencyData = {
    weapon: [],
    armor: [],
  };

  for (const cat of categories) {
    const items: EfficiencyDataItem[] = [];

    // 1. 일반 재련: 13→14 ~ 22→23 (T4 1590) - 사용자 요청 13~23강
    for (let fromGrade = 12; fromGrade < 23; fromGrade++) {
      const toGrade = fromGrade + 1;
      // calculator now accepts supportMode
      const result = calculator("t4_1590", cat, fromGrade, toGrade, priceMap, supportMode);

      const item: EfficiencyDataItem = {
        id: `normal_${cat}_${toGrade}`,
        type: "normal",
        name: `+${toGrade}강`,
        materials: Object.entries(result.materials).map(([name, amount]) => ({
          name,
          amount: Math.round(amount * 100) / 100, // 소수점 2자리
          category: getMaterialCategory(name),
          price: name === "골드" ? 1 : priceMap[name] || 0,
        })),
        costs: {
          gold: 0,
          stones: 0,
          shards: 0,
          leapstones: 0,
          fusion: 0,
          breath: 0,
          book: 0,
        },
        filteredCost: 0,
        totalCost: 0,
      };

      // 비용 계산
      item.costs = calculateCostsByMaterials(item.materials);
      item.totalCost = Object.values(item.costs).reduce((a, b) => a + b, 0); // Approx total

      items.push(item);
    }

    // 2. 상급 재련 (1~10, 11~20, 21~30, 31~40)
    const advancedRanges: { name: string; key: RefineTierKey }[] = [
      { name: "상급 1~10", key: "tier4_1" },
      { name: "상급 11~20", key: "tier4_2" },
      { name: "상급 21~30", key: "tier4_3" },
      { name: "상급 31~40", key: "tier4_4" },
    ];

    // Get advanced refine data with support mode
    // Note: getOptimalRefineData returns ALL categories, so we access result[cat][range.key]
    const advancedRefineData = getOptimalRefineData(priceMap, supportMode);

    for (const range of advancedRanges) {
      const result = advancedRefineData[cat][range.key];

      const item: EfficiencyDataItem = {
        id: `advanced_${cat}_${range.key}`,
        type: "advanced",
        name: range.name,
        materials: Object.entries(result.materials).map(([name, amount]: [string, number]) => ({
          name,
          amount: Math.round(amount * 100) / 100, // 소수점 2자리
          category: getMaterialCategory(name),
          price: name === "골드" ? 1 : priceMap[name] || 0,
        })),
        costs: {
          gold: 0,
          stones: 0,
          shards: 0,
          leapstones: 0,
          fusion: 0,
          breath: 0,
          book: 0,
        },
        filteredCost: 0,
        totalCost: 0,
      };

      item.costs = calculateCostsByMaterials(item.materials);
      item.totalCost = Object.values(item.costs).reduce((a, b) => a + b, 0);

      items.push(item);
    }

    // sort and assign
    efficiencyData[cat] = items.sort((a, b) => b.costs.gold - a.costs.gold);
  }

  return efficiencyData;
};
