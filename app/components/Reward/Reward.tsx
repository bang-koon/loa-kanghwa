"use client";
import { useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import styles from "./Reward.module.scss";

// Type Definitions
interface Material {
  count: number;
  image: string;
}

interface Gate {
  gate: number;
  gold: number;
  bonusGold: number;
  materials: Material[];
}

interface Raid {
  id: number;
  name: string;
  difficulty: "Normal" | "Hard" | null;
  image: string;
  itemLevel: string;
  gates: Gate[];
}

interface Totals {
  gold: number;
  bonusGold: number;
  materials: { [key: string]: number };
}

const mockRaidData: { "3t": Raid[]; "4t": Raid[] } = {
  "3t": [
    {
      id: 1,
      name: "발탄",
      difficulty: "Normal",
      image: "발탄.webp",
      itemLevel: "아이템 레벨 1415",
      gates: [
        {
          gate: 1,
          gold: 250,
          bonusGold: 75,
          materials: [{ count: 1, image: "마수의_뼈.webp" }],
        },
        {
          gate: 2,
          gold: 350,
          bonusGold: 100,
          materials: [{ count: 1, image: "마수의_뼈.webp" }],
        },
      ],
    },
    {
      id: 2,
      name: "발탄",
      difficulty: "Hard",
      image: "발탄.webp",
      itemLevel: "아이템 레벨 1445",
      gates: [
        {
          gate: 1,
          gold: 350,
          bonusGold: 175,
          materials: [{ count: 3, image: "마수의_뼈.webp" }],
        },
        {
          gate: 2,
          gold: 550,
          bonusGold: 275,
          materials: [{ count: 3, image: "마수의_뼈.webp" }],
        },
      ],
    },
    {
      id: 3,
      name: "비아키스",
      difficulty: "Normal",
      image: "비아키스.webp",
      itemLevel: "아이템 레벨 1430",
      gates: [
        {
          gate: 1,
          gold: 300,
          bonusGold: 100,
          materials: [{ count: 1, image: "욕망의_날개.webp" }],
        },
        {
          gate: 2,
          gold: 500,
          bonusGold: 150,
          materials: [{ count: 2, image: "욕망의_날개.webp" }],
        },
      ],
    },
    {
      id: 4,
      name: "비아키스",
      difficulty: "Hard",
      image: "비아키스.webp",
      itemLevel: "아이템 레벨 1460",
      gates: [
        {
          gate: 1,
          gold: 450,
          bonusGold: 225,
          materials: [{ count: 3, image: "욕망의_날개.webp" }],
        },
        {
          gate: 2,
          gold: 750,
          bonusGold: 375,
          materials: [{ count: 3, image: "욕망의_날개.webp" }],
        },
      ],
    },
    {
      id: 5,
      name: "쿠크세이튼",
      difficulty: null,
      image: "쿠크세이튼.webp",
      itemLevel: "아이템 레벨 1475",
      gates: [
        {
          gate: 1,
          gold: 300,
          bonusGold: 100,
          materials: [{ count: 1, image: "광기의_나팔.webp" }],
        },
        {
          gate: 2,
          gold: 450,
          bonusGold: 150,
          materials: [{ count: 2, image: "광기의_나팔.webp" }],
        },
        {
          gate: 3,
          gold: 750,
          bonusGold: 200,
          materials: [{ count: 2, image: "광기의_나팔.webp" }],
        },
      ],
    },
    {
      id: 6,
      name: "아브렐슈드",
      difficulty: "Normal",
      image: "아브렐슈드.webp",
      itemLevel: "아이템 레벨 1490",
      gates: [
        {
          gate: 1,
          gold: 500,
          bonusGold: 100,
          materials: [{ count: 4, image: "몽환의_사념.webp" }],
        },
        {
          gate: 2,
          gold: 500,
          bonusGold: 150,
          materials: [{ count: 4, image: "몽환의_사념.webp" }],
        },
        {
          gate: 3,
          gold: 500,
          bonusGold: 200,
          materials: [{ count: 5, image: "몽환의_사념.webp" }],
        },
        {
          gate: 4,
          gold: 800,
          bonusGold: 375,
          materials: [{ count: 7, image: "몽환의_사념.webp" }],
        },
      ],
    },
    {
      id: 7,
      name: "아브렐슈드",
      difficulty: "Hard",
      image: "아브렐슈드.webp",
      itemLevel: "아이템 레벨 1540",
      gates: [
        {
          gate: 1,
          gold: 600,
          bonusGold: 300,
          materials: [{ count: 6, image: "몽환의_사념.webp" }],
        },
        {
          gate: 2,
          gold: 600,
          bonusGold: 300,
          materials: [{ count: 6, image: "몽환의_사념.webp" }],
        },
        {
          gate: 3,
          gold: 600,
          bonusGold: 300,
          materials: [{ count: 7, image: "몽환의_사념.webp" }],
        },
        {
          gate: 4,
          gold: 1000,
          bonusGold: 500,
          materials: [{ count: 10, image: "몽환의_사념.webp" }],
        },
      ],
    },
    {
      id: 8,
      name: "일리아칸",
      difficulty: "Normal",
      image: "일리아칸.webp",
      itemLevel: "아이템 레벨 1580",
      gates: [
        {
          gate: 1,
          gold: 425,
          bonusGold: 190,
          materials: [{ count: 3, image: "쇠락의_눈동자.webp" }],
        },
        {
          gate: 2,
          gold: 775,
          bonusGold: 230,
          materials: [{ count: 3, image: "쇠락의_눈동자.webp" }],
        },
        {
          gate: 3,
          gold: 1150,
          bonusGold: 330,
          materials: [{ count: 5, image: "쇠락의_눈동자.webp" }],
        },
      ],
    },
    {
      id: 9,
      name: "일리아칸",
      difficulty: "Hard",
      image: "일리아칸.webp",
      itemLevel: "아이템 레벨 1600",
      gates: [
        {
          gate: 1,
          gold: 600,
          bonusGold: 300,
          materials: [{ count: 7, image: "쇠락의_눈동자.webp" }],
        },
        {
          gate: 2,
          gold: 1000,
          bonusGold: 500,
          materials: [{ count: 7, image: "쇠락의_눈동자.webp" }],
        },
        {
          gate: 3,
          gold: 1400,
          bonusGold: 700,
          materials: [{ count: 8, image: "쇠락의_눈동자.webp" }],
        },
      ],
    },
    {
      id: 10,
      name: "카양겔",
      difficulty: "Normal",
      image: "카양겔.webp",
      itemLevel: "아이템 레벨 1540",
      gates: [
        {
          gate: 1,
          gold: 375,
          bonusGold: 180,
          materials: [{ count: 1, image: "관조의_빛무리.webp" }],
        },
        {
          gate: 2,
          gold: 550,
          bonusGold: 200,
          materials: [{ count: 1, image: "관조의_빛무리.webp" }],
        },
        {
          gate: 3,
          gold: 725,
          bonusGold: 270,
          materials: [{ count: 2, image: "관조의_빛무리.webp" }],
        },
      ],
    },
    {
      id: 11,
      name: "카양겔",
      difficulty: "Hard",
      image: "카양겔.webp",
      itemLevel: "아이템 레벨 1580",
      gates: [
        {
          gate: 1,
          gold: 450,
          bonusGold: 225,
          materials: [{ count: 1, image: "관조의_빛무리.webp" }],
        },
        {
          gate: 2,
          gold: 700,
          bonusGold: 350,
          materials: [{ count: 1, image: "관조의_빛무리.webp" }],
        },
        {
          gate: 3,
          gold: 1000,
          bonusGold: 500,
          materials: [{ count: 3, image: "관조의_빛무리.webp" }],
        },
      ],
    },
    {
      id: 12,
      name: "상아탑",
      difficulty: "Normal",
      image: "상아탑.jpg",
      itemLevel: "아이템 레벨 1600",
      gates: [
        {
          gate: 1,
          gold: 600,
          bonusGold: 180,
          materials: [{ count: 2, image: "빛나는_지혜의_기운.webp" }],
        },
        {
          gate: 2,
          gold: 800,
          bonusGold: 220,
          materials: [{ count: 2, image: "빛나는_지혜의_기운.webp" }],
        },
        {
          gate: 3,
          gold: 1200,
          bonusGold: 300,
          materials: [{ count: 4, image: "빛나는_지혜의_기운.webp" }],
        },
      ],
    },
    {
      id: 13,
      name: "상아탑",
      difficulty: "Hard",
      image: "상아탑.webp",
      itemLevel: "아이템 레벨 1620",
      gates: [
        {
          gate: 1,
          gold: 700,
          bonusGold: 350,
          materials: [{ count: 4, image: "빛나는_지혜의_기운.webp" }],
        },
        {
          gate: 2,
          gold: 1000,
          bonusGold: 500,
          materials: [{ count: 4, image: "빛나는_지혜의_기운.webp" }],
        },
        {
          gate: 3,
          gold: 1900,
          bonusGold: 950,
          materials: [{ count: 8, image: "빛나는_지혜의_기운.webp" }],
        },
      ],
    },
    {
      id: 14,
      name: "카멘",
      difficulty: "Normal",
      image: "카멘.webp",
      itemLevel: "아이템 레벨 1610",
      gates: [
        {
          gate: 1,
          gold: 800,
          bonusGold: 360,
          materials: [{ count: 6, image: "어둠의_불.webp" }],
        },
        {
          gate: 2,
          gold: 1000,
          bonusGold: 440,
          materials: [{ count: 8, image: "어둠의_불.webp" }],
        },
        {
          gate: 3,
          gold: 1400,
          bonusGold: 640,
          materials: [{ count: 12, image: "어둠의_불.webp" }],
        },
      ],
    },
    {
      id: 15,
      name: "카멘",
      difficulty: "Hard",
      image: "카멘.webp",
      itemLevel: "아이템 레벨 1630",
      gates: [
        {
          gate: 1,
          gold: 1000,
          bonusGold: 500,
          materials: [{ count: 12, image: "어둠의_불.webp" }],
        },
        {
          gate: 2,
          gold: 1200,
          bonusGold: 600,
          materials: [{ count: 16, image: "어둠의_불.webp" }],
        },
        {
          gate: 3,
          gold: 1800,
          bonusGold: 900,
          materials: [{ count: 24, image: "어둠의_불.webp" }],
        },
        {
          gate: 4,
          gold: 2500,
          bonusGold: 1250,
          materials: [{ count: 24, image: "어둠의_불.webp" }],
        },
      ],
    },
  ],
  "4t": [
    {
      id: 16,
      name: "베히모스",
      difficulty: null,
      image: "베히모스.webp",
      itemLevel: "아이템 레벨 1640",
      gates: [
        {
          gate: 1,
          gold: 2800,
          bonusGold: 920,
          materials: [{ count: 10, image: "베히모스의_비늘.webp" }],
        },
        {
          gate: 2,
          gold: 6000,
          bonusGold: 1960,
          materials: [{ count: 20, image: "베히모스의_비늘.webp" }],
        },
      ],
    },
    {
      id: 17,
      name: "에키드나",
      difficulty: "Normal",
      image: "에키드나.webp",
      itemLevel: "아이템 레벨 1620",
      gates: [
        {
          gate: 1,
          gold: 1150,
          bonusGold: 500,
          materials: [{ count: 3, image: "아그리스의_비늘.webp" }],
        },
        {
          gate: 2,
          gold: 2500,
          bonusGold: 960,
          materials: [{ count: 6, image: "아그리스의_비늘.webp" }],
        },
      ],
    },
    {
      id: 18,
      name: "에키드나",
      difficulty: "Hard",
      image: "에키드나.webp",
      itemLevel: "아이템 레벨 1640",
      gates: [
        {
          gate: 1,
          gold: 2800,
          bonusGold: 920,
          materials: [{ count: 3, image: "알키오네의_눈.webp" }],
        },
        {
          gate: 2,
          gold: 6000,
          bonusGold: 1960,
          materials: [{ count: 6, image: "알키오네의_눈.webp" }],
        },
      ],
    },
    {
      id: 19,
      name: "에기르",
      difficulty: "Normal",
      image: "에기르.webp",
      itemLevel: "아이템 레벨 1660",
      gates: [
        {
          gate: 1,
          gold: 4750,
          bonusGold: 1030,
          materials: [{ count: 4, image: "업화의_쐐기돌.webp" }],
        },
        {
          gate: 2,
          gold: 10750,
          bonusGold: 2400,
          materials: [{ count: 6, image: "업화의_쐐기돌.webp" }],
        },
      ],
    },
    {
      id: 20,
      name: "에기르",
      difficulty: "Hard",
      image: "에기르.webp",
      itemLevel: "아이템 레벨 1680",
      gates: [
        {
          gate: 1,
          gold: 8000,
          bonusGold: 3640,
          materials: [{ count: 8, image: "업화의_쐐기돌.webp" }],
        },
        {
          gate: 2,
          gold: 16500,
          bonusGold: 5880,
          materials: [{ count: 12, image: "업화의_쐐기돌.webp" }],
        },
      ],
    },
    {
      id: 21,
      name: "아브(2막)",
      difficulty: "Normal",
      image: "아브2막.webp",
      itemLevel: "아이템 레벨 1670",
      gates: [
        {
          gate: 1,
          gold: 7250,
          bonusGold: 3240,
          materials: [{ count: 4, image: "카르마의_잔영.webp" }],
        },
        {
          gate: 2,
          gold: 14250,
          bonusGold: 4830,
          materials: [{ count: 6, image: "카르마의_잔영.webp" }],
        },
      ],
    },
    {
      id: 22,
      name: "아브(2막)",
      difficulty: "Hard",
      image: "아브(2막).webp",
      itemLevel: "아이템 레벨 1690",
      gates: [
        {
          gate: 1,
          gold: 10000,
          bonusGold: 4500,
          materials: [{ count: 8, image: "카르마의_잔영.webp" }],
        },
        {
          gate: 2,
          gold: 20500,
          bonusGold: 7200,
          materials: [{ count: 12, image: "카르마의_잔영.webp" }],
        },
      ],
    },
    {
      id: 23,
      name: "모르둠",
      difficulty: "Normal",
      image: "모르둠.jpg",
      itemLevel: "아이템 레벨 1680",
      gates: [
        {
          gate: 1,
          gold: 6000,
          bonusGold: 2400,
          materials: [{ count: 3, image: "낙뢰의_뿔.webp" }],
        },
        {
          gate: 2,
          gold: 9500,
          bonusGold: 3200,
          materials: [{ count: 5, image: "낙뢰의_뿔.webp" }],
        },
        {
          gate: 3,
          gold: 12500,
          bonusGold: 4200,
          materials: [{ count: 10, image: "낙뢰의_뿔.webp" }],
        },
      ],
    },
    {
      id: 24,
      name: "모르둠",
      difficulty: "Hard",
      image: "모르둠.jpg",
      itemLevel: "아이템 레벨 1700",
      gates: [
        {
          gate: 1,
          gold: 7000,
          bonusGold: 2700,
          materials: [{ count: 3, image: "우레의_뇌옥.webp" }],
        },
        {
          gate: 2,
          gold: 11000,
          bonusGold: 4100,
          materials: [{ count: 5, image: "우레의_뇌옥.webp" }],
        },
        {
          gate: 3,
          gold: 20000,
          bonusGold: 5800,
          materials: [{ count: 10, image: "우레의_뇌옥.webp" }],
        },
      ],
    },
    {
      id: 25,
      name: "아르모체",
      difficulty: "Normal",
      image: "아르모체.webp",
      itemLevel: "아이템 레벨 1700",
      gates: [
        { gate: 1, gold: 12500, bonusGold: 4000, materials: [{ count: 1, image: "영웅코어.png" }] },
        { gate: 2, gold: 20500, bonusGold: 6560, materials: [{ count: 1, image: "영웅코어.png" }] },
      ],
    },
    {
      id: 26,
      name: "아르모체",
      difficulty: "Hard",
      image: "아르모체.webp",
      itemLevel: "아이템 레벨 1720",
      gates: [
        { gate: 1, gold: 15000, bonusGold: 4800, materials: [{ count: 1, image: "전설코어.png" }] },
        { gate: 2, gold: 27000, bonusGold: 8640, materials: [{ count: 1, image: "전설코어.png" }] },
      ],
    },
    {
      id: 27,
      name: "카제로스",
      difficulty: "Normal",
      image: "카제로스.webp",
      itemLevel: "아이템 레벨 1710",
      gates: [
        { gate: 1, gold: 14000, bonusGold: 4480, materials: [{ count: 2, image: "영웅코어.png" }] },
        { gate: 2, gold: 26000, bonusGold: 8320, materials: [{ count: 2, image: "영웅코어.png" }] },
      ],
    },
    {
      id: 28,
      name: "카제로스",
      difficulty: "Hard",
      image: "카제로스.webp",
      itemLevel: "아이템 레벨 1730",
      gates: [
        { gate: 1, gold: 17000, bonusGold: 5440, materials: [{ count: 2, image: "전설코어.png" }] },
        { gate: 2, gold: 35000, bonusGold: 11200, materials: [{ count: 2, image: "전설코어.png" }] },
      ],
    },
  ],
};

const allRaids = [...mockRaidData["3t"], ...mockRaidData["4t"]];

const Reward = () => {
  const [activeTab, setActiveTab] = useState<"3t" | "4t">("3t");

  const initialRaid = mockRaidData[activeTab][0];
  const [selectedRaidName, setSelectedRaidName] = useState<string>(initialRaid.name);
  const [selectedDifficulty, setSelectedDifficulty] = useState<"Normal" | "Hard" | null>(initialRaid.difficulty);

  const handleTabClick = (tab: "3t" | "4t") => {
    setActiveTab(tab);
    const firstRaidInTab = mockRaidData[tab][0];
    setSelectedRaidName(firstRaidInTab.name);
    setSelectedDifficulty(firstRaidInTab.difficulty);
  };

  const handleRaidNameClick = (name: string) => {
    setSelectedRaidName(name);
    const firstMatchingRaid = allRaids.find(raid => raid.name === name);
    setSelectedDifficulty(firstMatchingRaid?.difficulty ?? null);
  };

  const renderMaterials = (materials: Material[]) => {
    if (!materials || materials.length === 0) return "-";
    return (
      <div className={styles.materialsWrapper}>
        {materials.map((m, i) => (
          <div key={i} className={styles.materialItem}>
            <div className={styles.materialIcon} style={{ backgroundImage: `url(/reward/${m.image})` }}></div>
            <span>x {m.count.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderRaidTable = (raid: Raid) => {
    if (!raid || !raid.gates || raid.gates.length === 0) {
      return (
        <div className={styles.raidTable}>
          <p>데이터가 없습니다.</p>
        </div>
      );
    }

    const totals = raid.gates.reduce(
      (acc: Totals, gate: Gate) => {
        acc.gold += gate.gold || 0;
        acc.bonusGold += gate.bonusGold || 0;
        if (gate.materials) {
          gate.materials.forEach((mat: Material) => {
            acc.materials[mat.image] = (acc.materials[mat.image] || 0) + mat.count;
          });
        }
        return acc;
      },
      { gold: 0, bonusGold: 0, materials: {} }
    );

    const totalMaterialsForRender: Material[] = Object.keys(totals.materials).map(image => ({
      image,
      count: totals.materials[image],
    }));

    return (
      <div className={styles.raidTable}>
        <div className={`${styles.row} ${styles.headerRow}`}>
          <div className={styles.headerCol}>관문</div>
          <div className={styles.headerCol}>기본 재료</div>
          <div className={styles.headerCol}>더보기 재료</div>
          <div className={styles.headerCol}>더보기 골드</div>
          <div className={styles.headerCol}>골드</div>
        </div>
        {raid.gates.map((g: Gate, index: number) => (
          <div key={index} className={styles.row}>
            <div className={styles.gateCol}>{g.gate}</div>
            <div className={styles.materialCol}>{renderMaterials(g.materials)}</div>
            <div className={styles.materialCol}>{renderMaterials(g.materials)}</div>
            <div className={styles.goldCol}>
              <div className={styles.goldContentWrapper}>
                <span className={styles.goldText}>{g.bonusGold ? g.bonusGold.toLocaleString() : "-"}</span>
                <Image className={styles.goldIcon} src="/reward/gold.png" alt="골드" width={20} height={20} />
              </div>
            </div>
            <div className={styles.goldCol}>
              <div className={styles.goldContentWrapper}>
                <span className={styles.goldText}>{g.gold ? g.gold.toLocaleString() : "-"}</span>
                <Image className={styles.goldIcon} src="/reward/gold.png" alt="골드" width={20} height={20} />
              </div>
            </div>
          </div>
        ))}
        <div className={`${styles.row}`}>
          <div className={styles.gateCol}>합계</div>
          <div className={styles.materialCol}>{renderMaterials(totalMaterialsForRender)}</div>
          <div className={styles.materialCol}>{renderMaterials(totalMaterialsForRender)}</div>
          <div className={styles.goldCol}>
            <div className={styles.goldContentWrapper}>
              <span className={styles.goldText}>{totals.bonusGold.toLocaleString()}</span>
              <Image className={styles.goldIcon} src="/reward/gold.png" alt="골드" width={20} height={20} />
            </div>
          </div>
          <div className={styles.goldCol}>
            <div className={styles.goldContentWrapper}>
              <span className={styles.goldText}>{totals.gold.toLocaleString()}</span>
              <Image className={styles.goldIcon} src="/reward/gold.png" alt="골드" width={20} height={20} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const raidNamesForCurrentTab = useMemo(() => [...new Set(mockRaidData[activeTab].map(raid => raid.name))], [activeTab]);

  const availableDifficulties = useMemo(
    () =>
      allRaids
        .filter(raid => raid.name === selectedRaidName)
        .map(raid => raid.difficulty)
        .filter((value, index, self) => self.indexOf(value) === index),
    [selectedRaidName]
  );

  const raidToDisplay = useMemo(
    () => allRaids.find(raid => raid.name === selectedRaidName && raid.difficulty === selectedDifficulty),
    [selectedRaidName, selectedDifficulty]
  );

  return (
    <div className={styles.container}>
      <div className={styles.tabContainer}>
        <button className={`${styles.tab} ${activeTab === "3t" ? styles.active : ""}`} onClick={() => handleTabClick("3t")}>
          3티어
        </button>
        <button className={`${styles.tab} ${activeTab === "4t" ? styles.active : ""}`} onClick={() => handleTabClick("4t")}>
          4티어
        </button>
      </div>

      <Swiper
        key={activeTab}
        modules={[Mousewheel]}
        spaceBetween={8}
        slidesPerView={"auto"}
        mousewheel={{ sensitivity: 1.5 }}
        className={styles.raidSelector}
      >
        {raidNamesForCurrentTab.map(name => {
          const raidForName = allRaids.find(raid => raid.name === name);
          return (
            <SwiperSlide
              key={name}
              className={`${styles.raidSlide} ${selectedRaidName === name ? styles.selected : ""}`}
              onClick={() => handleRaidNameClick(name)}
            >
              <div
                className={styles.raidImagePlaceholder}
                style={{
                  backgroundImage: raidForName ? `url(/raid/${raidForName.image})` : "none",
                }}
              ></div>
              <span>{name}</span>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {raidToDisplay && (
        <div className={styles.raidContentBox}>
          <div className={styles.raidHeader}>
            <div className={styles.raidHeaderLeft}>
              <div
                className={styles.raidImage}
                style={{
                  backgroundImage: `url(/raid/${raidToDisplay.image})`,
                }}
              ></div>
              <div className={styles.raidInfo}>
                <span className={styles.raidName}>{selectedRaidName}</span>
                <span className={styles.itemLevel}>{raidToDisplay.itemLevel}</span>
              </div>
            </div>
            {availableDifficulties.length > 1 && (
              <div className={styles.difficultyButtons}>
                <button
                  className={`${styles.difficultyButton} ${selectedDifficulty === "Normal" ? styles.active : ""}`}
                  onClick={() => setSelectedDifficulty("Normal")}
                >
                  노말
                </button>
                <button
                  className={`${styles.difficultyButton} ${selectedDifficulty === "Hard" ? styles.active : ""}`}
                  onClick={() => setSelectedDifficulty("Hard")}
                >
                  하드
                </button>
              </div>
            )}
          </div>
          {renderRaidTable(raidToDisplay)}
          <div className={styles.notice}>
            <div className={styles.noticeHeader}>
              <Image src="/reward/infoCircle.svg" alt="주의" width={14} height={14} />
              <span className={styles.noticeTitle}>Notice</span>
            </div>
            <div className={styles.noticeContent}>
              <span>• 귀속 골드 포함입니다.</span>
              <span> • 데이터 업데이트: 2025.08.20.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reward;
