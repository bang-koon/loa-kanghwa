export type SupportMode = "none" | "permanent" | "mokoko";

export interface SupportEffect {
  costMultiplier: {
    gold: number;
    materials: number;
    shard: number;
  };
  successRateMultiplier: number; // 기본 성공률 배율 (예: 2.0 = 2배)
  advancedRefineBeadGain: number; // 상급 재련 구슬 획득량 (기본 1, 모챌 2)
  advancedRefineCostMultiplier: {
    gold: number;
    materials: number;
    shard: number;
  };
}

export const getSupportEffect = (itemTierId: string, grade: number, mode: SupportMode): SupportEffect => {
  // 기본값 (효과 없음)
  const effect: SupportEffect = {
    costMultiplier: { gold: 1, materials: 1, shard: 1 },
    successRateMultiplier: 1,
    advancedRefineBeadGain: 1,
    advancedRefineCostMultiplier: { gold: 1, materials: 1, shard: 1 },
  };

  // 모코코 챌린지 익스프레스 (T4 전용)
  if (mode === "mokoko") {
    // T4 장비
    if (itemTierId.includes("tier4")) {
      // 일반 재련
      if (grade <= 18) {
        effect.successRateMultiplier = 2.0; // 성공률 2배
        effect.costMultiplier.materials = 0.8; // 재료 20% 감소 (multiplier 0.8)
        effect.costMultiplier.shard = 0.6; // 파편 40% 감소 (multiplier 0.6)

        // 골드 할인
        if (grade <= 14) {
          effect.costMultiplier.gold = 0.4; // 14단계까지 60% 감소 (multiplier 0.4)
        } else {
          // 15~18단계
          effect.costMultiplier.gold = 0.6; // 40% 감소 (multiplier 0.6)
        }
      }

      // 상급 재련 (모챌익)
      if (itemTierId !== "tier4_3" && itemTierId !== "tier4_4") {
        effect.advancedRefineBeadGain = 2; // 구슬 2개씩 획득
        effect.advancedRefineCostMultiplier.materials = 0.3; // 재료 70% 감소 (multiplier 0.3)
        effect.advancedRefineCostMultiplier.shard = 0.1; // 파편 90% 감소 (multiplier 0.1)
        effect.advancedRefineCostMultiplier.gold = 0.5; // 골드 50% 감소 (multiplier 0.5)
      }
    }

    // T3 장비 (모코코 모드에서도 상시 완화 효과 적용)
    if (itemTierId.startsWith("tier3")) {
      effect.costMultiplier.gold = 0; // 골드 100% 감소 (무료)
      effect.costMultiplier.materials = 0.6; // 재료 60%만 소모
      effect.costMultiplier.shard = 0.6;
    }

    return effect; // 모챌익은 상시 지원 중복 적용 안됨
  }

  // 상시 지원 (Permanent Support)
  if (mode === "permanent") {
    // T3 장비
    if (itemTierId.startsWith("tier3")) {
      // 1525 (12강) 까지는 무료지만, 계산 시작 지점을 UI에서 조절할 예정
      // 13강 이상 구간에 대해 재료 할인 적용
      effect.costMultiplier.gold = 0; // 골드 100% 감소 (무료)
      effect.costMultiplier.materials = 0.4; // 재료 60%만 소모 (40% 감소 아님, 60% *만* 들어감 -> multiplier 0.6? 사용자 설명이 "60%만 들어" -> 0.6)
      // 사용자 설명: "재료는 전부 60%만 들어" -> Cost * 0.6
      effect.costMultiplier.materials = 0.6;
      effect.costMultiplier.shard = 0.6; // 파편도 재료에 포함되므로 0.6 가정 (명확하지 않으면 재료와 동일하게)
    }

    // T4 장비
    if (itemTierId.includes("tier4")) {
      // 18단계까지 골드 20% 감소
      if (grade <= 18) {
        effect.costMultiplier.gold = 0.8;
      }
    }

    // 상급 재련 상시 완화 (T3, T4 공통) - 단, 21단계 이상(tier4_3, tier4_4)은 제외
    // 1~10(tierX_1), 11~20(tierX_2) 단계만 적용
    if (itemTierId !== "tier4_3" && itemTierId !== "tier4_4") {
      // 재료 70% 감소 (multiplier 0.3), 파편 90% 감소 (multiplier 0.1), 골드 50% 감소 (multiplier 0.5)
      effect.advancedRefineCostMultiplier.materials = 0.3;
      effect.advancedRefineCostMultiplier.shard = 0.1;
      effect.advancedRefineCostMultiplier.gold = 0.5;
    }
  }

  return effect;
};
