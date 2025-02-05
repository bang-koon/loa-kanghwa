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

    // 4t 21~40
    if (materials && refineData) {
      const armorAdvancedRefine4_3 = advancedRefine(materials, "armor", "4_3");
      const weaponAdvancedRefine4_3 = advancedRefine(
        materials,
        "weapon",
        "4_3"
      );
      const armorAdvancedRefine4_4 = advancedRefine(materials, "armor", "4_4");
      const weaponAdvancedRefine4_4 = advancedRefine(
        materials,
        "weapon",
        "4_4"
      );

      refineData.armor.tier4_3 = {
        materials: armorAdvancedRefine4_3.materials,
        cost: armorAdvancedRefine4_3.cost,
      };

      refineData.weapon.tier4_3 = {
        materials: weaponAdvancedRefine4_3.materials,
        cost: weaponAdvancedRefine4_3.cost,
      };
      refineData.armor.tier4_4 = {
        materials: armorAdvancedRefine4_4.materials,
        cost: armorAdvancedRefine4_4.cost,
      };

      refineData.weapon.tier4_4 = {
        materials: weaponAdvancedRefine4_4.materials,
        cost: weaponAdvancedRefine4_4.cost,
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
