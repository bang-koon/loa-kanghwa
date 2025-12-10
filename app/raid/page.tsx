import HomeClient from "@/app/components/HomeClient/HomeClient";
import getOptimalRefineData from "@/app/lib/advancedRefine";
import { getMaterialPrice } from "@/app/api/getMaterialPrice/getMaterialPrice";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "로아 레이드 보상 - 군단장, 카제로스",
  description: "로스트아크 군단장, 카제로스 보상 정보",
};

export default function RaidPage() {
  return <HomeClient activeView="reward" />;
}
