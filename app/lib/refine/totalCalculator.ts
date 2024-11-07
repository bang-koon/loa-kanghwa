import calculator from "./calculator";

export default function totalCalculator(
  current: number,
  target: number,
  materials: Record<string, number>
) {
  let total: { cost: number; materials: Record<string, number> } = {
    cost: 0,
    materials: {},
  };

  const weapon = calculator(current, target, "weapon", materials);
  for (let key in weapon.totalMaterials) {
    total.materials[key] =
      (total.materials[key] || 0) + weapon.totalMaterials[key];
  }
  total.cost += weapon.totalCost;

  const armor = calculator(current, target, "armor", materials);
  for (let key in armor.totalMaterials) {
    total.materials[key] =
      (total.materials[key] || 0) + armor.totalMaterials[key] * 5;
  }
  total.cost += armor.totalCost * 5;

  return total;
}
