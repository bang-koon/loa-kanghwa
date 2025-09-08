
import { NextResponse } from 'next/server';
import { getMaterialPrice } from '../getMaterialPrice/getMaterialPrice';
import calculateAllOptimalAdvancedRefine from '@/app/lib/advancedRefine';

export async function GET() {
  try {
    const materialsPrice = await getMaterialPrice();
    const advancedRefineData = calculateAllOptimalAdvancedRefine(materialsPrice);
    return NextResponse.json(advancedRefineData, { status: 200 });
  } catch (error) {
    console.error("advancedRefine calculation error:", error);
    return NextResponse.json(
      { error: "getAdvancedRefineData error" },
      { status: 500 }
    );
  }
}
