import getDbPromise from "@/app/lib/db";
import advancedRefine from "@/app/lib/refine/advancedRefine";
import { getMaterialPrice } from "@/app/api/getMaterialPrice/getMaterialPrice";
import { AdvancedRefine, REFINE_TIER_KEYS } from "@/app/lib/types";

export async function getAdvancedRefineData() {
  const materials = await getMaterialPrice();
  try {
    const db = await getDbPromise();
    const collection = db.collection("advancedRefine");
    const dbResult = await collection.findOne({}, { projection: { _id: 0 } });

    if (!dbResult) {
      throw new Error("Failed to find refine data in database.");
    }

    const refineData = dbResult as unknown as AdvancedRefine;

    for (const category of Object.keys(refineData)) {
      for (const tier of REFINE_TIER_KEYS) {
        if (!refineData[category][tier]) continue;

        const materialQuantities: Record<string, number> =
          refineData[category][tier].materials;
        let totalCost = 0;

        if (category === "armor") {
          for (const material in materialQuantities) {
            materialQuantities[material] *= 5;
          }
        }

        for (const [material, quantity] of Object.entries(materialQuantities)) {
          if (materials[material]) {
            totalCost += quantity * materials[material];
          }
        }

        refineData[category][tier].cost = totalCost;
      }
    }

    const armorAdvancedRefine4_3 = advancedRefine(materials, "armor", "4_3");
    const weaponAdvancedRefine4_3 = advancedRefine(materials, "weapon", "4_3");
    const armorAdvancedRefine4_4 = advancedRefine(materials, "armor", "4_4");
    const weaponAdvancedRefine4_4 = advancedRefine(materials, "weapon", "4_4");

    refineData.armor.tier4_3 = { ...armorAdvancedRefine4_3 };
    refineData.weapon.tier4_3 = { ...weaponAdvancedRefine4_3 };
    refineData.armor.tier4_4 = { ...armorAdvancedRefine4_4 };
    refineData.weapon.tier4_4 = { ...weaponAdvancedRefine4_4 };

    return { refineData, materials };
  } catch (error) {
    console.error("getAdvancedRefineData Error:", error);
    throw new Error("Failed to get advanced refine data");
  }
}
