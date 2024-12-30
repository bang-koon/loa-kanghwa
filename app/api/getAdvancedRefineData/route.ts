import { NextRequest, NextResponse } from "next/server";
import getDbPromise from "@/app/lib/db";

export async function GET(req: NextRequest) {
  try {
    const db = await getDbPromise();
    const collection = db.collection("advancedRefine");
    const data = await collection.findOne({}, { projection: { _id: 0 } });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("advancedRefine:", error);
    return NextResponse.json(
      { error: "getAdvancedRefineData error" },
      { status: 500 }
    );
  }
}
