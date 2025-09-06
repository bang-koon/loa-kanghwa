import HomeClient from "@/app/components/HomeClient/HomeClient";
import { getAdvancedRefineData } from "@/app/lib/data/getAdvancedRefineData";

export default async function Home() {
  // 서버에서 데이터 로딩을 모두 처리합니다.
  const { refineData, materials } = await getAdvancedRefineData();

  // 데이터 로딩이 완료되면, 클라이언트 컴포넌트에 props로 전달하여 렌더링합니다.
  return (
    <HomeClient 
      materials={materials} 
      advancedRefineData={refineData} 
    />
  );
}