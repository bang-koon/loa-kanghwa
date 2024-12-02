import { NextRequest, NextResponse } from "next/server";
import { getCharacterInfo } from "./getCharacterInfo";

export async function GET(req: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { searchParams } = new URL(req.url);
  const characterName = searchParams.get("characterName");
  if (!characterName) {
    return NextResponse.json(
      { error: "캐릭터 이름이 필요합니다." },
      { status: 400 }
    );
  }

  try {
    const characterInfo = await getCharacterInfo(characterName);
    return NextResponse.json(characterInfo, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "route error" }, { status: 500 });
  }
}
