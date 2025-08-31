"use client";

import { useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
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
      image: "",
      gates: [
        { gate: 1, gold: 250, bonusGold: 75, materials: [{ count: 1, image: "beast_bone" }] },
        { gate: 2, gold: 350, bonusGold: 100, materials: [{ count: 1, image: "beast_bone" }] },
      ],
    },
    {
      id: 2,
      name: "발탄",
      difficulty: "Hard",
      image: "",
      gates: [
        { gate: 1, gold: 350, bonusGold: 175, materials: [{ count: 3, image: "beast_bone" }] },
        { gate: 2, gold: 550, bonusGold: 275, materials: [{ count: 3, image: "beast_bone" }] },
      ],
    },
    {
      id: 3,
      name: "비아키스",
      difficulty: "Normal",
      image: "",
      gates: [
        { gate: 1, gold: 300, bonusGold: 100, materials: [{ count: 1, image: "demon_wing" }] },
        { gate: 2, gold: 500, bonusGold: 150, materials: [{ count: 2, image: "demon_wing" }] },
      ],
    },
    {
      id: 4,
      name: "비아키스",
      difficulty: "Hard",
      image: "",
      gates: [
        { gate: 1, gold: 450, bonusGold: 225, materials: [{ count: 3, image: "demon_wing" }] },
        { gate: 2, gold: 750, bonusGold: 375, materials: [{ count: 3, image: "demon_wing" }] },
      ],
    },
    {
      id: 5,
      name: "쿠크세이튼",
      difficulty: null,
      image: "",
      gates: [
        { gate: 1, gold: 300, bonusGold: 100, materials: [{ count: 1, image: "clown_horn" }] },
        { gate: 2, gold: 450, bonusGold: 150, materials: [{ count: 2, image: "clown_horn" }] },
        { gate: 3, gold: 750, bonusGold: 200, materials: [{ count: 2, image: "clown_horn" }] },
      ],
    },
    {
      id: 6,
      name: "아브렐슈드",
      difficulty: "Normal",
      image: "",
      gates: [
        { gate: 1, gold: 500, bonusGold: 100, materials: [{ count: 4, image: "dream_remnant" }] },
        { gate: 2, gold: 500, bonusGold: 150, materials: [{ count: 4, image: "dream_remnant" }] },
        { gate: 3, gold: 500, bonusGold: 200, materials: [{ count: 5, image: "dream_remnant" }] },
        { gate: 4, gold: 800, bonusGold: 375, materials: [{ count: 7, image: "dream_remnant" }] },
      ],
    },
    {
      id: 7,
      name: "아브렐슈드",
      difficulty: "Hard",
      image: "",
      gates: [
        { gate: 1, gold: 600, bonusGold: 300, materials: [{ count: 6, image: "dream_remnant" }] },
        { gate: 2, gold: 600, bonusGold: 300, materials: [{ count: 6, image: "dream_remnant" }] },
        { gate: 3, gold: 600, bonusGold: 300, materials: [{ count: 7, image: "dream_remnant" }] },
        { gate: 4, gold: 1000, bonusGold: 500, materials: [{ count: 10, image: "dream_remnant" }] },
      ],
    },
    {
      id: 8,
      name: "일리아칸",
      difficulty: "Normal",
      image: "",
      gates: [
        { gate: 1, gold: 425, bonusGold: 190, materials: [{ count: 3, image: "decay_eye" }] },
        { gate: 2, gold: 775, bonusGold: 230, materials: [{ count: 3, image: "decay_eye" }] },
        { gate: 3, gold: 1150, bonusGold: 330, materials: [{ count: 5, image: "decay_eye" }] },
      ],
    },
    {
      id: 9,
      name: "일리아칸",
      difficulty: "Hard",
      image: "",
      gates: [
        { gate: 1, gold: 600, bonusGold: 300, materials: [{ count: 7, image: "decay_eye" }] },
        { gate: 2, gold: 1000, bonusGold: 500, materials: [{ count: 7, image: "decay_eye" }] },
        { gate: 3, gold: 1400, bonusGold: 700, materials: [{ count: 8, image: "decay_eye" }] },
      ],
    },
    {
      id: 10,
      name: "카양겔",
      difficulty: "Normal",
      image: "",
      gates: [
        { gate: 1, gold: 375, bonusGold: 180, materials: [{ count: 1, image: "light_of_trial" }] },
        { gate: 2, gold: 550, bonusGold: 200, materials: [{ count: 1, image: "light_of_trial" }] },
        { gate: 3, gold: 725, bonusGold: 270, materials: [{ count: 2, image: "light_of_trial" }] },
      ],
    },
    {
      id: 11,
      name: "카양겔",
      difficulty: "Hard",
      image: "",
      gates: [
        { gate: 1, gold: 450, bonusGold: 225, materials: [{ count: 1, image: "light_of_trial" }] },
        { gate: 2, gold: 700, bonusGold: 350, materials: [{ count: 1, image: "light_of_trial" }] },
        { gate: 3, gold: 1000, bonusGold: 500, materials: [{ count: 3, image: "light_of_trial" }] },
      ],
    },
    {
      id: 12,
      name: "상아탑",
      difficulty: "Normal",
      image: "",
      gates: [
        { gate: 1, gold: 600, bonusGold: 180, materials: [{ count: 2, image: "wisdom_energy" }] },
        { gate: 2, gold: 800, bonusGold: 220, materials: [{ count: 2, image: "wisdom_energy" }] },
        { gate: 3, gold: 1200, bonusGold: 300, materials: [{ count: 4, image: "wisdom_energy" }] },
      ],
    },
    {
      id: 13,
      name: "상아탑",
      difficulty: "Hard",
      image: "",
      gates: [
        { gate: 1, gold: 700, bonusGold: 350, materials: [{ count: 4, image: "wisdom_energy" }] },
        { gate: 2, gold: 1000, bonusGold: 500, materials: [{ count: 4, image: "wisdom_energy" }] },
        { gate: 3, gold: 1900, bonusGold: 950, materials: [{ count: 8, image: "wisdom_energy" }] },
      ],
    },
    {
      id: 14,
      name: "카멘",
      difficulty: "Normal",
      image: "",
      gates: [
        { gate: 1, gold: 800, bonusGold: 360, materials: [{ count: 6, image: "dark_fire" }] },
        { gate: 2, gold: 1000, bonusGold: 440, materials: [{ count: 8, image: "dark_fire" }] },
        { gate: 3, gold: 1400, bonusGold: 640, materials: [{ count: 12, image: "dark_fire" }] },
      ],
    },
    {
      id: 15,
      name: "카멘",
      difficulty: "Hard",
      image: "",
      gates: [
        { gate: 1, gold: 1000, bonusGold: 500, materials: [{ count: 12, image: "dark_fire" }] },
        { gate: 2, gold: 1200, bonusGold: 600, materials: [{ count: 16, image: "dark_fire" }] },
        { gate: 3, gold: 1800, bonusGold: 900, materials: [{ count: 24, image: "dark_fire" }] },
        { gate: 4, gold: 2500, bonusGold: 1250, materials: [{ count: 24, image: "dark_fire" }] },
      ],
    },
  ],
  "4t": [
    {
      id: 16,
      name: "베히모스",
      difficulty: null,
      image: "",
      gates: [
        { gate: 1, gold: 2800, bonusGold: 920, materials: [{ count: 10, image: "behemoth_scale" }] },
        { gate: 2, gold: 6000, bonusGold: 1960, materials: [{ count: 20, image: "behemoth_scale" }] },
      ],
    },
    {
      id: 17,
      name: "에키드나",
      difficulty: "Normal",
      image: "",
      gates: [
        { gate: 1, gold: 1150, bonusGold: 500, materials: [{ count: 3, image: "agris_scale" }] },
        { gate: 2, gold: 2500, bonusGold: 960, materials: [{ count: 6, image: "agris_scale" }] },
      ],
    },
    {
      id: 18,
      name: "에키드나",
      difficulty: "Hard",
      image: "",
      gates: [
        { gate: 1, gold: 2800, bonusGold: 920, materials: [{ count: 3, image: "alkyone_eye" }] },
        { gate: 2, gold: 6000, bonusGold: 1960, materials: [{ count: 6, image: "alkyone_eye" }] },
      ],
    },
    {
      id: 19,
      name: "에기르",
      difficulty: "Normal",
      image: "",
      gates: [
        { gate: 1, gold: 4750, bonusGold: 1030, materials: [{ count: 4, image: "flame_spike" }] },
        { gate: 2, gold: 10750, bonusGold: 2400, materials: [{ count: 6, image: "flame_spike" }] },
      ],
    },
    {
      id: 20,
      name: "에기르",
      difficulty: "Hard",
      image: "",
      gates: [
        { gate: 1, gold: 8000, bonusGold: 3640, materials: [{ count: 8, image: "flame_spike" }] },
        { gate: 2, gold: 16500, bonusGold: 5880, materials: [{ count: 12, image: "flame_spike" }] },
      ],
    },
    {
      id: 21,
      name: "아브렐슈드(Epic)",
      difficulty: null,
      image: "",
      gates: [
        { gate: 1, gold: 7250, bonusGold: 4500, materials: [{ count: 4, image: "karma_remnant" }] },
        { gate: 2, gold: 14250, bonusGold: 7200, materials: [{ count: 6, image: "karma_remnant" }] },
      ],
    },
    {
      id: 22,
      name: "모르페",
      difficulty: null,
      image: "",
      gates: [
        { gate: 1, gold: 6000, bonusGold: 2700, materials: [{ count: 3, image: "lightning_horn" }] },
        { gate: 2, gold: 9500, bonusGold: 4100, materials: [{ count: 5, image: "lightning_horn" }] },
        { gate: 3, gold: 12500, bonusGold: 5800, materials: [{ count: 10, image: "lightning_horn" }] },
      ],
    },
    {
      id: 23,
      name: "아르모체",
      difficulty: null,
      image: "",
      gates: [
        { gate: 1, gold: 12500, bonusGold: 4800, materials: [] },
        { gate: 2, gold: 20500, bonusGold: 8640, materials: [] },
      ],
    },
    {
      id: 24,
      name: "카제로스",
      difficulty: null,
      image: "",
      gates: [
        { gate: 1, gold: 14000, bonusGold: 5440, materials: [] },
        { gate: 2, gold: 26000, bonusGold: 11200, materials: [] },
      ],
    },
  ],
};

const allRaids = [...mockRaidData["3t"], ...mockRaidData["4t"]];

const Reward = () => {
  const [activeTab, setActiveTab] = useState<"3t" | "4t">("3t");

  const initialRaid = mockRaidData[activeTab][0];
  const [selectedRaidName, setSelectedRaidName] = useState<string>(
    initialRaid.name
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "Normal" | "Hard" | null
  >(initialRaid.difficulty);

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
            <div
              className={styles.materialIcon}
              style={{ backgroundImage: `url(${m.image})` }}
            ></div>
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
            acc.materials[mat.image] =
              (acc.materials[mat.image] || 0) + mat.count;
          });
        }
        return acc;
      },
      { gold: 0, bonusGold: 0, materials: {} }
    );

    const totalMaterialsForRender: Material[] = Object.keys(
      totals.materials
    ).map(image => ({
      image,
      count: totals.materials[image],
    }));

    return (
      <div className={styles.raidTable}>
        <div className={`${styles.row} ${styles.headerRow}`}>
          <div className={styles.headerCol}>관문</div>
          <div className={styles.headerCol}>기본 재료</div>
          <div className={styles.headerCol}>더보기 재료</div>
          <div className={styles.headerCol}>골드</div>
          <div className={styles.headerCol}>더보기 골드</div>
        </div>
        {raid.gates.map((g: Gate, index: number) => (
          <div key={index} className={styles.row}>
            <div className={styles.gateCol}>{g.gate}</div>
            <div className={styles.materialCol}>
              {renderMaterials(g.materials)}
            </div>
            <div className={styles.materialCol}>
              {renderMaterials(g.materials)}
            </div>
            <div className={styles.goldCol}>
              <div className={styles.goldContentWrapper}>
                <div className={styles.goldIcon}></div>
                <span>{g.gold ? g.gold.toLocaleString() : "-"}</span>
              </div>
            </div>
            <div className={styles.goldCol}>
              <div className={styles.goldContentWrapper}>
                <div className={styles.goldIcon}></div>
                <span>{g.bonusGold ? g.bonusGold.toLocaleString() : "-"}</span>
              </div>
            </div>
          </div>
        ))}
        <div className={`${styles.row}`}>
          <div className={styles.gateCol}>합계</div>
          <div className={styles.materialCol}>
            {renderMaterials(totalMaterialsForRender)}
          </div>
          <div className={styles.materialCol}>
            {renderMaterials(totalMaterialsForRender)}
          </div>
          <div className={styles.goldCol}>
            <div className={styles.goldContentWrapper}>
              <div className={styles.goldIcon}></div>
              <span>{totals.gold.toLocaleString()}</span>
            </div>
          </div>
          <div className={styles.goldCol}>
            <div className={styles.goldContentWrapper}>
              <div className={styles.goldIcon}></div>
              <span>{totals.bonusGold.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const raidNamesForCurrentTab = useMemo(
    () => [...new Set(mockRaidData[activeTab].map(raid => raid.name))],
    [activeTab]
  );

  const availableDifficulties = useMemo(
    () => allRaids.filter(raid => raid.name === selectedRaidName),
    [selectedRaidName]
  );

  const raidToDisplay = useMemo(
    () =>
      allRaids.find(
        raid =>
          raid.name === selectedRaidName && raid.difficulty === selectedDifficulty
      ),
    [selectedRaidName, selectedDifficulty]
  );

  return (
    <div className={styles.container}>
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tab} ${activeTab === "3t" ? styles.active : ""}`}
          onClick={() => handleTabClick("3t")}
        >
          3티어
        </button>
        <button
          className={`${styles.tab} ${activeTab === "4t" ? styles.active : ""}`}
          onClick={() => handleTabClick("4t")}
        >
          4티어
        </button>
      </div>

      <Swiper
        key={activeTab}
        spaceBetween={10}
        slidesPerView={"auto"}
        className={styles.raidSelector}
      >
        {raidNamesForCurrentTab.map(name => (
          <SwiperSlide
            key={name}
            className={`${styles.raidSlide} ${
              selectedRaidName === name ? styles.selected : ""
            }`}
            onClick={() => handleRaidNameClick(name)}
          >
            <div
              className={styles.raidImagePlaceholder}
              // style={{ backgroundImage: `url(${raid.image})` }} // Find appropriate image
            ></div>
            <span>{name}</span>
          </SwiperSlide>
        ))}
      </Swiper>

      {availableDifficulties.length > 1 && (
        <div className={styles.difficultySelector}>
          {availableDifficulties.map(raid => (
            <button
              key={raid.difficulty}
              className={`${styles.difficultyButton} ${
                selectedDifficulty === raid.difficulty ? styles.active : ""
              }`}
              onClick={() =>
                setSelectedDifficulty(raid.difficulty)
              }
            >
              {raid.difficulty}
            </button>
          ))}
        </div>
      )}

      {raidToDisplay && renderRaidTable(raidToDisplay)}
    </div>
  );
};

export default Reward;