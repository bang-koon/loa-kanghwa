import { getMaterialPrice } from "@/app/api/getMaterialPrice/getMaterialPrice";
import { calculateEfficiencyData } from "@/app/lib/efficiency/calculateEfficiencyData";
import PageLayout from "@/app/components/PageLayout/PageLayout";
import EfficiencyContainer from "@/app/components/EfficiencyGraph/EfficiencyContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "로아쿤 - 상급 재련 효율",
  description: "일반 재련과 상급 재련의 비용 효율을 비교하여 최적의 강화 경로를 확인하세요.",
};

export const revalidate = 1800; // 30분마다 페이지 재생성 (ISR)

export default async function EfficiencyPage() {
  const materialsPrice = await getMaterialPrice();

  // 두 가지 모드 데이터 모두 계산
  const permanentData = await calculateEfficiencyData(materialsPrice, "permanent");
  const mokokoData = await calculateEfficiencyData(materialsPrice, "mokoko");

  return (
    <PageLayout title="상급 재련 효율" maxWidth="1100px">
      <EfficiencyContainer permanentData={permanentData} mokokoData={mokokoData} />
    </PageLayout>
  );
}
