import HomeClient from "@/app/components/HomeClient/HomeClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "로아 레이드 보상 - 지평의 성당, 세르카, 카제로스 클골",
  description:
    "로스트아크 레이드 지평의 성당, 세르카, 아르모체 등 모든 군단장 및 카제로스 레이드의 보상 목록과 클리어 골드를 한눈에 확인하세요.",
};

export default function RaidPage() {
  return <HomeClient activeView="reward" />;
}
