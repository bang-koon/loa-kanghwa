import { NextResponse } from "next/server";
import { getMaterialPrice } from "./getMaterialPrice";

export async function GET() {
  try {
    const materials = await getMaterialPrice();

    return NextResponse.json(materials, {
      status: 200,
    });
  } catch (error) {
    console.error("Error in GET route:", error);
    return NextResponse.json(
      { error: "가격 정보를 얻을 수 없습니다." },
      { status: 500 }
    );
  }
}
