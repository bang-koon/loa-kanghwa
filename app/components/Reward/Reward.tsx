"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import styles from "./Reward.module.scss";

// 데이터 구조에서 name 속성 제거 + 예시 데이터 추가
const mockRaidData = {
  "3t": [
    {
      id: 1,
      name: "발탄",
      image: "",
      gates: [
        {
          gate: 1,
          gold: 500,
          bonusGold: 500,
          materials: [
            { count: 80, image: "shard_3t" },
            { count: 10, image: "leapstone_3t" },
          ],
          bonusMaterials: [{ count: 2, image: "relic_gear_3t" }],
        },
        {
          gate: 2,
          gold: 700,
          bonusGold: 800,
          materials: [
            { count: 90, image: "shard_3t" },
            { count: 15, image: "leapstone_3t" },
          ],
          bonusMaterials: [
            { count: 3, image: "relic_gear_3t" },
            { count: 2, image: "relic_acc_3t" },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "비아키스",
      image: "",
      gates: [
        {
          gate: 1,
          gold: 600,
          bonusGold: 600,
          materials: [
            { count: 10, image: "shard_3t" },
            { count: 12, image: "leapstone_3t" },
          ],
          bonusMaterials: [{ count: 2, image: "relic_gear_3t" }],
        },
        {
          gate: 2,
          gold: 800,
          bonusGold: 900,
          materials: [
            { count: 50, image: "shard_3t" },
            { count: 18, image: "leapstone_3t" },
          ],
          bonusMaterials: [
            { count: 3, image: "relic_gear_3t" },
            { count: 2, image: "relic_acc_3t" },
          ],
        },
      ],
    },
    {
      id: 3,
      name: "쿠크세이튼",
      image: "",
      gates: [
        {
          gate: 1,
          gold: 700,
          bonusGold: 700,
          materials: [
            { count: 15, image: "shard_3t" },
            { count: 15, image: "leapstone_3t" },
          ],
          bonusMaterials: [{ count: 1, image: "clown_horn" }],
        },
        {
          gate: 2,
          gold: 900,
          bonusGold: 1000,
          materials: [
            { count: 20, image: "shard_3t" },
            { count: 20, image: "leapstone_3t" },
          ],
          bonusMaterials: [{ count: 2, image: "clown_horn" }],
        },
      ],
    },
    { id: 4, name: "아브렐슈드", image: "", gates: [] },
    { id: 5, name: "카양겔 (N)", image: "", gates: [] },
    { id: 6, name: "일리아칸 (N)", image: "", gates: [] },
  ],
  "4t": [
    {
      id: 7,
      name: "아브렐슈드 (H)",
      image: "",
      gates: [
        {
          gate: 1,
          gold: 1000,
          bonusGold: 1000,
          materials: [
            { count: 20, image: "shard_4t" },
            { count: 20, image: "leapstone_4t" },
          ],
          bonusMaterials: [{ count: 2, image: "ancient_gear_4t" }],
        },
        {
          gate: 2,
          gold: 1200,
          bonusGold: 1200,
          materials: [
            { count: 25, image: "shard_4t" },
            { count: 25, image: "leapstone_4t" },
          ],
          bonusMaterials: [{ count: 3, image: "ancient_gear_4t" }],
        },
      ],
    },
    {
      id: 8,
      name: "카양겔 (H)",
      image: "",
      gates: [
        {
          gate: 1,
          gold: 1500,
          bonusGold: 1500,
          materials: [
            { count: 30, image: "shard_4t" },
            { count: 30, image: "leapstone_4t" },
          ],
          bonusMaterials: [{ count: 1, image: "light_of_trial" }],
        },
        {
          gate: 2,
          gold: 1800,
          bonusGold: 1800,
          materials: [
            { count: 35, image: "shard_4t" },
            { count: 35, image: "leapstone_4t" },
          ],
          bonusMaterials: [{ count: 2, image: "light_of_trial" }],
        },
      ],
    },
    {
      id: 9,
      name: "일리아칸 (H)",
      image: "",
      gates: [
        {
          gate: 1,
          gold: 2000,
          bonusGold: 2000,
          materials: [
            { count: 40, image: "shard_4t" },
            { count: 40, image: "leapstone_4t" },
          ],
          bonusMaterials: [{ count: 1, image: "plague_spore" }],
        },
        {
          gate: 2,
          gold: 2500,
          bonusGold: 2500,
          materials: [
            { count: 45, image: "shard_4t" },
            { count: 45, image: "leapstone_4t" },
          ],
          bonusMaterials: [{ count: 2, image: "plague_spore" }],
        },
      ],
    },
    { id: 10, name: "상아탑", image: "", gates: [] },
    { id: 11, name: "카멘", image: "", gates: [] },
    { id: 12, name: "에키드나", image: "", gates: [] },
    { id: 13, name: "베히모스", image: "", gates: [] },
  ],
};

const Reward = () => {
  const [activeTab, setActiveTab] = useState<"3t" | "4t">("3t");
  const [selectedRaid, setSelectedRaid] = useState(mockRaidData[activeTab][0]);

  const handleTabClick = (tab: "3t" | "4t") => {
    setActiveTab(tab);
    setSelectedRaid(mockRaidData[tab][0]);
  };

  const handleRaidClick = (raid: any) => {
    setSelectedRaid(raid);
  };

  const renderMaterials = (materials: any[]) => {
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

  const renderRaidTable = (raid: any) => {
    if (!raid || !raid.gates || raid.gates.length === 0) {
      return (
        <div className={styles.raidTable}>
          <p>데이터가 없습니다.</p>
        </div>
      );
    }

    // 합계 계산 로직 (image를 키로 사용)
    const totals = raid.gates.reduce(
      (acc: any, gate: any) => {
        acc.gold += gate.gold || 0;
        acc.bonusGold += gate.bonusGold || 0;
        if (gate.materials) {
          gate.materials.forEach((mat: any) => {
            acc.materials[mat.image] =
              (acc.materials[mat.image] || 0) + mat.count;
          });
        }
        if (gate.bonusMaterials) {
          gate.bonusMaterials.forEach((mat: any) => {
            acc.bonusMaterials[mat.image] =
              (acc.bonusMaterials[mat.image] || 0) + mat.count;
          });
        }
        return acc;
      },
      { gold: 0, bonusGold: 0, materials: {}, bonusMaterials: {} }
    );

    const totalMaterialsForRender = Object.keys(totals.materials).map(
      image => ({
        image,
        count: totals.materials[image],
      })
    );

    const totalBonusMaterialsForRender = Object.keys(totals.bonusMaterials).map(
      image => ({
        image,
        count: totals.bonusMaterials[image],
      })
    );

    return (
      <div className={styles.raidTable}>
        <div className={`${styles.row} ${styles.headerRow}`}>
          <div className={styles.headerCol}>관문</div>
          <div className={styles.headerCol}>기본 재료</div>
          <div className={styles.headerCol}>더보기 재료</div>
          <div className={styles.headerCol}>골드</div>
          <div className={styles.headerCol}>더보기 골드</div>
        </div>
        {raid.gates.map((g: any, index: number) => (
          <div key={index} className={styles.row}>
            <div className={styles.gateCol}>{g.gate}</div>
            <div className={styles.materialCol}>
              {renderMaterials(g.materials)}
            </div>
            <div className={styles.materialCol}>
              {renderMaterials(g.bonusMaterials)}
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
            {renderMaterials(totalBonusMaterialsForRender)}
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
        {mockRaidData[activeTab].map(raid => (
          <SwiperSlide
            key={raid.id}
            className={`${styles.raidSlide} ${
              selectedRaid?.id === raid.id ? styles.selected : ""
            }`}
            onClick={() => handleRaidClick(raid)}
          >
            <div
              className={styles.raidImagePlaceholder}
              style={{ backgroundImage: `url(${raid.image})` }}
            ></div>
            <span>{raid.name}</span>
          </SwiperSlide>
        ))}
      </Swiper>

      {renderRaidTable(selectedRaid)}
    </div>
  );
};

export default Reward;
