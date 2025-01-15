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

  armor.cost *= 5;
  for (let key in armor.materials) {
    armor.materials[key] *= 5;
  }

  const total = {
    cost: weapon.cost + armor.cost,
    materials: { ...weapon.materials },
  };

  for (let key in armor.materials) {
    total.materials[key] = (total.materials[key] || 0) + armor.materials[key];
  }

  return { total, weapon, armor };
}
