import { NextRequest, NextResponse } from "next/server";
import { getCharacterLevel } from "./getCharacterLevel";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const characterName = searchParams.get("characterName");

  if (!characterName) {
    return NextResponse.json(
      { error: "캐릭터 이름이 필요합니다." },
      { status: 400 }
    );
  }

  try {
    const equipments = await getCharacterLevel(characterName);
    return NextResponse.json(equipments, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "데이터를 가져오는 데 실패했습니다." },
      { status: 500 }
    );
  }
}
