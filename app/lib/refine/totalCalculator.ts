import calculator from "./calculator";

export default function totalCalculator(
  current: string,
  target: string,
  materials: Record<string, number>
) {
  const currentLevel = parseInt(current);
  const targetLevel = parseInt(target);

  const weapon = calculator(currentLevel, targetLevel, "weapon", materials);
  const armor = calculator(currentLevel, targetLevel, "armor", materials);

  const total = {
    cost: weapon.cost + armor.cost * 5,
    materials: { ...weapon.materials },
  };

  for (let key in armor.materials) {
    total.materials[key] =
      (total.materials[key] || 0) + armor.materials[key] * 5;
  }

  return { total, weapon, armor };
}
