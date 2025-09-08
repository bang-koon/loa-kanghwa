import HomeClient from "@/app/components/HomeClient/HomeClient";
import getOptimalRefineData from "@/app/lib/advancedRefine";
import { getMaterialPrice } from "@/app/api/getMaterialPrice/getMaterialPrice";

export default async function Home() {
  const materialsPrice = await getMaterialPrice();
  const advancedRefineData = getOptimalRefineData(materialsPrice);

  return (
    <HomeClient
      materials={materialsPrice}
      advancedRefineData={advancedRefineData}
    />
  );
}
