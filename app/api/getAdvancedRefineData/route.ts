import { NextRequest, NextResponse } from "next/server";
import getDbPromise from "@/app/lib/db";
import { getMaterialPrice } from "../getMaterialPrice/getMaterialPrice";
import advancedRefine from "@/app/lib/refine/advancedRefine";

export async function GET(req: NextRequest) {
  const materials = await getMaterialPrice();
  try {
    const db = await getDbPromise();
    const collection = db.collection("advancedRefine");
    const refineData = await collection.findOne({}, { projection: { _id: 0 } });

    if (refineData && materials) {
      for (const category of Object.keys(refineData)) {
        for (const tier of Object.keys(refineData[category])) {
          const materialQuantities: Record<string, number> =
            refineData[category][tier].materials;
          let totalCost = 0;

          if (category === "armor") {
            for (const material in materialQuantities) {
              materialQuantities[material] *= 5;
            }
          }

          for (const [material, quantity] of Object.entries(
            materialQuantities
          )) {
            if (materials[material]) {
              totalCost += quantity * materials[material];
            }
          }

          refineData[category][tier].cost = totalCost;
        }
      }
    }

    // 4t 21~30
    if (materials && refineData) {
      const armorAdvancedRefine = advancedRefine(materials, "armor");
      const weaponAdvancedRefine = advancedRefine(materials, "weapon");

      refineData.armor.tier4_3 = {
        materials: armorAdvancedRefine.materials,
        cost: armorAdvancedRefine.cost,
      };

      refineData.weapon.tier4_3 = {
        materials: weaponAdvancedRefine.materials,
        cost: weaponAdvancedRefine.cost,
      };
    }

    return NextResponse.json(refineData, { status: 200 });
  } catch (error) {
    console.error("advancedRefine:", error);
    return NextResponse.json(
      { error: "getAdvancedRefineData error" },
      { status: 500 }
    );
  }
}
