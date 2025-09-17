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

  // UI에서 배수를 조절하도록 곱셈 로직 제거
  // const total = {
  //   cost: weapon.cost + armor.cost,
  //   materials: { ...weapon.materials },
  // };

  // for (let key in armor.materials) {
  //   total.materials[key] = (total.materials[key] || 0) + armor.materials[key];
  // }

  return { weapon, armor };
}