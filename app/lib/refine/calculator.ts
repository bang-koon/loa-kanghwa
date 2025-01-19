import { getRefineTable } from "./data";
import refine from "./refine";

const levelData: Record<
  number,
  { tier: string; grade: number; next: number | null }
> = {
  1275: { tier: "t3_1250", grade: 1, next: 1295 },
  1295: { tier: "t3_1250", grade: 2, next: 1310 },
  1310: { tier: "t3_1250", grade: 3, next: 1325 },
  1325: { tier: "t3_1250", grade: 4, next: 1340 },
  1340: { tier: "t3_1250", grade: 5, next: 1355 },
  1355: { tier: "t3_1250", grade: 6, next: 1370 },
  1370: { tier: "t3_1250", grade: 7, next: 1385 },
  1385: { tier: "t3_1250", grade: 8, next: 1400 },
  1400: { tier: "t3_1250", grade: 9, next: 1415 },
  1415: { tier: "t3_1250", grade: 10, next: 1430 },
  1430: { tier: "t3_1250", grade: 11, next: 1445 },
  1445: { tier: "t3_1250", grade: 12, next: 1460 },
  1460: { tier: "t3_1250", grade: 13, next: 1475 },
  1475: { tier: "t3_1250", grade: 14, next: 1510 },
  1500: { tier: "t3_1390", grade: 11, next: 1510 },
  1510: { tier: "t3_1390", grade: 12, next: 1520 },
  1520: { tier: "t3_1390", grade: 13, next: 1530 },
  1530: { tier: "t3_1390", grade: 14, next: 1540 },
  1540: { tier: "t3_1390", grade: 15, next: 1550 },
  1550: { tier: "t3_1390", grade: 16, next: 1560 },
  1560: { tier: "t3_1390", grade: 17, next: 1570 },
  1570: { tier: "t3_1390", grade: 18, next: 1580 },
  1580: { tier: "t3_1390", grade: 19, next: 1590 },
  1585: { tier: "t3_1525", grade: 12, next: 1590 },
  1590: { tier: "t3_1525", grade: 13, next: 1595 },
  1595: { tier: "t3_1525", grade: 14, next: 1600 },
  1600: { tier: "t3_1525", grade: 15, next: 1605 },
  1605: { tier: "t3_1525", grade: 16, next: 1610 },
  1610: { tier: "t3_1525", grade: 17, next: 1615 },
  1615: { tier: "t3_1525", grade: 18, next: 1620 },
  1620: { tier: "t3_1525", grade: 19, next: 1645 },
  1640: { tier: "t4_1590", grade: 10, next: 1645 },
  1645: { tier: "t4_1590", grade: 11, next: 1650 },
  1650: { tier: "t4_1590", grade: 12, next: 1655 },
  1655: { tier: "t4_1590", grade: 13, next: 1660 },
  1660: { tier: "t4_1590", grade: 14, next: 1665 },
  1665: { tier: "t4_1590", grade: 15, next: 1670 },
  1670: { tier: "t4_1590", grade: 16, next: 1675 },
  1675: { tier: "t4_1590", grade: 17, next: 1680 },
  1680: { tier: "t4_1590", grade: 18, next: 1685 },
  1685: { tier: "t4_1590", grade: 19, next: 1690 },
  1690: { tier: "t4_1590", grade: 20, next: 1695 },
  1695: { tier: "t4_1590", grade: 21, next: 1700 },
  1700: { tier: "t4_1590", grade: 22, next: 1705 },
  1705: { tier: "t4_1590", grade: 23, next: 1710 },
  1710: { tier: "t4_1590", grade: 24, next: 1715 },
  1715: { tier: "t4_1590", grade: 25, next: null },
};

const bindedMap = {
  가호: 0,
  경명돌: 0,
  골드: 0,
  "마력석 조각": 0,
  "명예의 돌파석": 0,
  빙하: 0,
  "빛나는 지혜의 정수": 0,
  상급오레하: 0,
  "선명한 지혜의 정수": 0,
  수결: 0,
  수호강석: 0,
  아비도스: 0,
  야금술기본: 0,
  야금술복합: 0,
  야금술숙련: 0,
  야금술심화: 0,
  야금술업화: 0,
  야금술응용: 0,
  야금술전문: 0,
  야금술특화: 0,
  "에스더의 기운": 0,
  용암: 0,
  운돌: 0,
  "운명의 파편 주머니(중)": 0,
  운명의수호석: 0,
  운명의파괴석: 0,
  운명파편: 0,
  위명돌: 0,
  은총: 0,
  재봉술기본: 0,
  재봉술복합: 0,
  재봉술숙련: 0,
  재봉술심화: 0,
  재봉술업화: 0,
  재봉술응용: 0,
  재봉술전문: 0,
  재봉술특화: 0,
  정제된수호강석: 0,
  정제된파괴강석: 0,
  중급오레하: 0,
  찬명돌: 0,
  최상급오레하: 0,
  축복: 0,
  파결: 0,
  파괴강석: 0,
  파편: 0,
};

const calculator = (
  nowLevel: number,
  targetLevel: number,
  itemType: string,
  materials: Record<string, number>
) => {
  let totalMaterials: Record<string, number> = {};
  let totalCost = 0;

  const applyResearch = false;
  const applyHyperExpress = false;
  let currentLevel = nowLevel;
  while (currentLevel < targetLevel) {
    const nextLevel = levelData[currentLevel].next;
    if (!nextLevel) break;
    const itemGrade = levelData[nextLevel].tier;
    const refineTarget = levelData[nextLevel].grade;
    const table = getRefineTable(
      itemType,
      itemGrade,
      refineTarget,
      applyResearch,
      applyHyperExpress
    );

    if (!table) {
      console.error(`${nextLevel} 레벨의 강화 테이블을 찾을 수 없습니다.`);
      break;
    }

    const result = refine(table, materials, bindedMap);

    for (let key in result.materialsUsed) {
      totalMaterials[key] =
        (totalMaterials[key] || 0) + result.materialsUsed[key];
    }
    totalCost += result.totalCost;
    currentLevel = nextLevel;
  }

  return { materials: totalMaterials, cost: totalCost };
};

export default calculator;
