import HomeClient from "@/app/components/HomeClient/HomeClient";
import getOptimalRefineData from "@/app/lib/advancedRefine";
import { getMaterialPrice } from "@/app/api/getMaterialPrice/getMaterialPrice";

export default async function RefinePage() {
  const materialsPrice = await getMaterialPrice();
  const advancedRefineData = getOptimalRefineData(materialsPrice);

  return (
    <main style={{ padding: "20px", paddingTop: "54px", maxWidth: "1200px", margin: "0 auto", flexGrow: 1 }}>
      <HomeClient materials={materialsPrice} advancedRefineData={advancedRefineData} activeView="calculator" />
    </main>
  );
}
