import { NextRequest, NextResponse } from "next/server";
import { getMaterialPrice } from "./getMaterialPrice";
import getDbPromise from "../../lib/db";
import { WithId } from "mongodb";

export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const db = await getDbPromise();
    const collection = db.collection("materials");

    // id과 createdAt 제외 가져오기
    let materials: WithId<Document> | Record<string, number> | null =
      await collection.findOne({}, { projection: { _id: 0 } });
    if (!materials) {
      materials = await getMaterialPrice();
      const materialsWithDate = { ...materials, createdAt: new Date() };
      await collection.insertOne(materialsWithDate);
    }

    // await collection.createIndex(
    //   { createdAt: 1 },
    //   { expireAfterSeconds: 7200 }
    // );

    return NextResponse.json(materials, {
      status: 200,
      headers: { "Cache-Control": "no-store", ETag: "" },
    });
  } catch (error) {
    console.error("Error in GET route:", error);
    return NextResponse.json(
      { error: "가격 정보를 얻을 수 없습니다." },
      { status: 500 }
    );
  }
}
