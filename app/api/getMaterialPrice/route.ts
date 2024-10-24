import { NextRequest, NextResponse } from "next/server";
import { getMaterialPrice, Material } from "./getMaterialPrice";
import clientPromise from "../../lib/db";
import { WithId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("loakang");
    const collection = db.collection("materials");

    // id과 createdAt 제외 가져오기
    let materials: WithId<Document> | { [key: string]: Material } | null =
      await collection.findOne({}, { projection: { _id: 0, createdAt: 0 } });

    if (!materials) {
      materials = await getMaterialPrice();
      const materialsWithDate = { ...materials, createdAt: new Date() };
      await collection.insertOne(materialsWithDate);
    }

    // await collection.createIndex(
    //   { createdAt: 1 },
    //   { expireAfterSeconds: 7200 }
    // );

    return NextResponse.json(materials, { status: 200 });
  } catch (error) {
    console.error("Error in GET route:", error);
    return NextResponse.json(
      { error: "가격 정보를 얻을 수 없습니다." },
      { status: 500 }
    );
  }
}
