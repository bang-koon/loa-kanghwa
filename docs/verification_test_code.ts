import calculator from "../app/lib/refine/calculator";
import { getSupportEffect } from "../app/lib/supportSettings";

// 검증 스크립트 (Verification Script)
// 이 코드는 구현된 완화 패치 로직이 올바르게 작동하는지 확인하기 위해 사용되었습니다.

const runVerification = () => {
  console.log("--- Support Patch Verification Start ---");

  // 1. 완화 수치(Support Effect) 객체 확인
  console.log("\n[1] Check Support Effect Values");
  const t3Perm = getSupportEffect("t3_1525", 13, "permanent");

  // T3 상시 완화: 골드 0 (무료), 재료 60% 소모 (0.6)
  if (t3Perm.costMultiplier.gold === 0 && t3Perm.costMultiplier.materials === 0.6) {
    console.log("PASS: Permanent T3 Support (Gold 0, Mat 0.6)");
  } else {
    console.error("FAIL: Permanent T3 Support", t3Perm);
  }

  // 모코코 T4: 성공률 2배, 골드 40% 소모 (0.4)
  const mokokoT4 = getSupportEffect("t4_1590", 12, "mokoko");
  if (mokokoT4.successRateMultiplier === 2.0 && mokokoT4.costMultiplier.gold === 0.4) {
    console.log("PASS: Mokoko T4 Support Grade 12 (Success 2.0, Gold 0.4)");
  } else {
    console.error("FAIL: Mokoko T4 Support Grade 12", mokokoT4);
  }

  // 2. 계산기(Calculator) 통합 테스트 (시뮬레이션)
  // 가상의 가격 데이터
  const priceMap = {
    "명예의 파편": 0.5,
    "최상급 오레하 융화 재료": 50,
    "정제된 파괴강석": 1,
    "정제된 수호강석": 0.5,
    "찬란한 명예의 돌파석": 30,
    골드: 1,
  };

  console.log("\n[2] Check Logic Integration");
  try {
    // T4 1590 장비 15->16 단계 재련 비용 계산
    const t4Normal = calculator("t4_1590", "weapon", 15, 16, priceMap, "permanent");
    const t4Mokoko = calculator("t4_1590", "weapon", 15, 16, priceMap, "mokoko");

    console.log("T4 Permanent Cost:", t4Normal.cost);
    console.log("T4 Mokoko Cost:", t4Mokoko.cost);

    // 모코코 비용이 상시 비용보다 저렴해야 함
    if (t4Mokoko.cost < t4Normal.cost) {
      console.log(`PASS: Mokoko cost (${t4Mokoko.cost}) is lower than Permanent cost (${t4Normal.cost})`);
    } else {
      console.error("FAIL: Mokoko cost is not lower");
    }
  } catch (e) {
    console.error("Error during calculation:", e);
  }

  console.log("--- Verification Complete ---");
};

runVerification();
