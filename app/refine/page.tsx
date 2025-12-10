import HomeClient from "@/app/components/HomeClient/HomeClient";
import getOptimalRefineData from "@/app/lib/advancedRefine";
import { getMaterialPrice } from "@/app/api/getMaterialPrice/getMaterialPrice";
import { zeroBoundBookPrices } from "@/app/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "로아 강화 계산기 - 일반, 상급 재련 최적화 계산기",
  description: "로아 재련 비용 계산과 최신 레이드 보상 정보를 한눈에!",
};
export const revalidate = 1800;

export default async function RefinePage() {
  const materialsPrice = await getMaterialPrice();
  const boundBookPrice = zeroBoundBookPrices(materialsPrice);

  // 4가지 시나리오 계산 (supportMode x boundBook)
  const permanentAdvancedRefineData = getOptimalRefineData(materialsPrice, "permanent");
  const permanentBoundBookAdvancedRefineData = getOptimalRefineData(boundBookPrice, "permanent");
  const mokokoAdvancedRefineData = getOptimalRefineData(materialsPrice, "mokoko");
  const mokokoBoundBookAdvancedRefineData = getOptimalRefineData(boundBookPrice, "mokoko");

  return (
    <HomeClient
      materials={materialsPrice}
      permanentAdvancedRefineData={permanentAdvancedRefineData}
      permanentBoundBookAdvancedRefineData={permanentBoundBookAdvancedRefineData}
      mokokoAdvancedRefineData={mokokoAdvancedRefineData}
      mokokoBoundBookAdvancedRefineData={mokokoBoundBookAdvancedRefineData}
      activeView="calculator"
    />
  );
}
