import calculator from "./calculator";

export default function totalCalculator(
  current: string,
  target: string,
  materials: Record<string, number>
) {
  const currentLevel = parseInt(current);
  const targetLevel = parseInt(target);
  let total: { cost: number; materials: Record<string, number> } = {
    cost: 0,
    materials: {},
  };

  const weapon = calculator(currentLevel, targetLevel, "weapon", materials);
  for (let key in weapon.totalMaterials) {
    total.materials[key] =
      (total.materials[key] || 0) + weapon.totalMaterials[key];
  }
  total.cost += weapon.totalCost;

  const armor = calculator(currentLevel, targetLevel, "armor", materials);
  for (let key in armor.totalMaterials) {
    total.materials[key] =
      (total.materials[key] || 0) + armor.totalMaterials[key] * 5;
  }
  total.cost += armor.totalCost * 5;

  return total;
}
