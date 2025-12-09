import { getMaterialPrice } from "@/app/api/getMaterialPrice/getMaterialPrice";
import { calculateEfficiencyData } from "@/app/lib/efficiency/calculateEfficiencyData";
import PageLayout from "@/app/components/PageLayout/PageLayout";
import EfficiencyContainer from "@/app/components/EfficiencyGraph/EfficiencyContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "상급 재련 효율 | 로아 강화 계산기",
  description: "일반 재련과 상급 재련의 비용 효율을 비교하여 최적의 강화 경로를 확인하세요.",
};

export default async function EfficiencyPage() {
  const materialsPrice = await getMaterialPrice();
  const efficiencyData = calculateEfficiencyData(materialsPrice);

  return (
    <PageLayout title="상급 재련 효율" maxWidth="1100px">
      <EfficiencyContainer data={efficiencyData} />
    </PageLayout>
  );
}
