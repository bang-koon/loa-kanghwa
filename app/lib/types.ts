export interface MaterialCost {
  materials: Record<string, number>;
  cost: number;
}

// 키 목록을 실제 런타임 값(상수 배열)으로 정의합니다.
export const REFINE_TIER_KEYS = [
  "tier3_1",
  "tier3_2",
  "tier4_1",
  "tier4_2",
  "tier4_3",
  "tier4_4",
] as const;

// 위 상수 배열로부터 타입을 동적으로 생성합니다.
export type RefineTierKey = (typeof REFINE_TIER_KEYS)[number];

export type RefineCategory = {
  [K in RefineTierKey]: MaterialCost;
};

export interface AdvancedRefine {
  [key: string]: RefineCategory;
  weapon: RefineCategory;
  armor: RefineCategory;
}

// Board.tsx에서만 사용하는 타입
export interface CalculationResult {
  total: MaterialCost;
  weapon: MaterialCost;
  armor: MaterialCost;
}
