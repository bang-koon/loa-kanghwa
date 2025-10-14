import HomeClient from "@/app/components/HomeClient/HomeClient";
import getOptimalRefineData from "@/app/lib/advancedRefine";
import { getMaterialPrice } from "@/app/api/getMaterialPrice/getMaterialPrice";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "로아 레이드 보상 - 군단장, 카제로스",
  description: "로스트아크 군단장, 카제로스 보상 정보",
};

export default async function RaidPage() {
  const materialsPrice = await getMaterialPrice(); // HomeClient requires these props
  const advancedRefineData = getOptimalRefineData(materialsPrice); // HomeClient requires these props

  return (
    <main style={{ padding: "20px", paddingTop: "54px", maxWidth: "1200px", margin: "0 auto", flexGrow: 1 }}>
      <HomeClient materials={materialsPrice} advancedRefineData={advancedRefineData} activeView="reward" />
    </main>
  );
}
