import HomeClient from "@/app/components/HomeClient/HomeClient";
import getOptimalRefineData from "@/app/lib/advancedRefine";
import { getMaterialPrice } from "@/app/api/getMaterialPrice/getMaterialPrice";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "로아 강화 계산기 - 일반, 상급 재련 최적화 계산기",
  description: "로아 재련 비용 계산과 최신 레이드 보상 정보를 한눈에!",
};

export default async function RefinePage() {
  const materialsPrice = await getMaterialPrice();
  const advancedRefineData = getOptimalRefineData(materialsPrice);

  return <HomeClient materials={materialsPrice} advancedRefineData={advancedRefineData} activeView="calculator" />;
}
