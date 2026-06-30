"use client";
import React from "react";
import Image from "next/image";
import styles from "./RaidTimeline.module.scss";
import { mockRaidData } from "./Reward";

function getRaidDetails(title: string, difficulty: string) {
  let searchName = "";
  if (title.includes("4막")) searchName = "4막: 아르모체";
  else if (title.includes("종막")) searchName = "종막: 카제로스";
  else if (title.includes("세르카")) searchName = "세르카";
  else if (title.includes("성당")) searchName = "지평의 성당";
  else if (title.includes("벨가르딘")) searchName = "벨가르딘";

  const allRaids = [...mockRaidData["3t"], ...mockRaidData["4t"]];
  return allRaids.find((r) => r.name === searchName && r.difficulty === difficulty);
}

const levels = [1700, 1710, 1720, 1730, 1740, 1750, 1760, 1770, 1780];

const raidRows = [
  {
    title: "4막 : 파멸의 성채",
    items: [
      { level: 1700, name: "노말", gold: 27000, image: "아르모체.webp" },
      { level: 1720, name: "하드", gold: 38000, image: "아르모체.webp" },
    ],
  },
  {
    title: "종막 : 최후의 날",
    items: [
      { level: 1710, name: "노말", gold: 32000, image: "카제로스.webp" },
      { level: 1730, name: "하드", gold: 48000, image: "카제로스.webp" },
    ],
  },
  {
    title: "고통의 마녀, 세르카",
    items: [
      { level: 1710, name: "노말", gold: 32000, image: "세르카.png" },
      { level: 1730, name: "하드", gold: 44000, image: "세르카.png" },
      { level: 1740, name: "나이트메어", gold: 54000, image: "세르카.png" },
    ],
  },
  {
    title: "지평의 성당",
    items: [
      { level: 1700, name: "1단계", gold: 30000, image: "지평의성당.png" },
      { level: 1720, name: "2단계", gold: 40000, image: "지평의성당.png" },
      { level: 1750, name: "3단계", gold: 50000, image: "지평의성당.png" },
    ],
  },
  {
    title: "죽음의 계승자, 벨가르딘",
    items: [
      { level: 1750, name: "노말", gold: 50000, image: "벨가르딘.png" },
      { level: 1770, name: "하드", gold: 62000, image: "벨가르딘.png" },
      { level: 1780, name: "나이트메어", gold: 75000, image: "벨가르딘.png" },
    ],
  },
];

const weeklyGold = {
  1700: { total: 0, trade: 0, bound: 0 },
  1710: { total: 94000, trade: 32000, bound: 62000 },
  1720: { total: 110000, trade: 54000, bound: 56000 },
  1730: { total: 130000, trade: 130000, bound: 0 },
  1740: { total: 140000, trade: 140000, bound: 0 },
  1750: { total: 154000, trade: 104000, bound: 50000 },
  1760: { total: 0, trade: 0, bound: 0 },
  1770: { total: 166000, trade: 116000, bound: 50000 },
  1780: { total: 179000, trade: 129000, bound: 50000 },
};

interface Props {
  onToggleView?: () => void;
}

export default function RaidTimeline({ onToggleView }: Props) {
  return (
    <div className={styles.timelineWrapper}>
      <div className={styles.timelineContainer}>
        {/* Header (Levels) */}
        <div className={styles.headerRow}>
          <div className={styles.rowLabel}>
            {onToggleView && (
              <button onClick={onToggleView} className={styles.detailButton}>
                자세히
              </button>
            )}
          </div>
          {levels.map((lvl) => (
            <div key={`header-${lvl}`} className={styles.levelHeader}>
              {lvl}
            </div>
          ))}
        </div>

        {/* Raid Rows */}
        {raidRows.map((row, idx) => (
          <div key={`row-${idx}`} className={styles.raidRow}>
            <div className={styles.rowLabel}>{row.title}</div>
            <div className={styles.cellsWrapper}>
              {/* Background track line */}
              <div className={styles.trackLine} />

              {levels.map((lvl) => {
                const item = row.items.find((i) => i.level === lvl);
                return (
                  <div key={`cell-${idx}-${lvl}`} className={styles.cell}>
                    {item &&
                      (() => {
                        const details = getRaidDetails(row.title, item.name);
                        return (
                          <div className={styles.raidCard}>
                            <div className={styles.imageBox} style={{ backgroundImage: `url(/raid/${item.image})` }} />
                            <div className={styles.cardInfo}>
                              <span className={styles.difficulty}>{item.name}</span>
                              <span className={styles.gold}>{item.gold.toLocaleString()} G</span>
                            </div>

                            {details && (
                              <div className={styles.tooltip}>
                                {details.gates.map((g, gIdx) => (
                                  <div key={gIdx} className={styles.tooltipRow}>
                                    <div className={styles.tooltipGate}>{g.gate}관문</div>
                                    <div className={styles.tooltipDetail}>
                                      <span>
                                        기본 <span className={styles.tooltipHighlight}>{g.gold.toLocaleString()}G</span>
                                      </span>
                                      <span>/</span>
                                      <span>
                                        더보기{" "}
                                        <span className={styles.tooltipHighlight}>{g.bonusGold.toLocaleString()}G</span>
                                      </span>
                                    </div>
                                    <div className={styles.tooltipDetail}>
                                      <span>
                                        {g.materials
                                          .filter((m) => m.text)
                                          .map((m) => `${m.text} ${m.count}개`)
                                          .join(", ")}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Weekly Gold Info */}
        <div className={styles.weeklyGoldRow}>
          <div className={styles.rowLabel}>
            레벨별
            <br />
            주간 골드 정보
          </div>
          <div className={styles.cellsWrapper}>
            {levels.map((lvl) => {
              const info = weeklyGold[lvl as keyof typeof weeklyGold];
              if (!info || info.total === 0) return <div key={`gold-${lvl}`} className={styles.cell} />;
              return (
                <div key={`gold-${lvl}`} className={styles.goldCell}>
                  <div className={styles.goldStat}>
                    <span className={styles.goldLabelTotal}>총 골드</span>
                    <span className={styles.goldTotal}>{info.total.toLocaleString()} G</span>
                  </div>
                  <div className={styles.goldStat}>
                    <span className={styles.goldLabel}>거래가능</span>
                    <span className={styles.goldTrade}>{info.trade.toLocaleString()} G</span>
                  </div>
                  <div className={styles.goldStat}>
                    <span className={styles.goldLabel}>귀속골드</span>
                    <span className={styles.goldBound}>
                      {info.bound > 0 ? `${info.bound.toLocaleString()} G` : "-"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <p className={styles.note}>
        * 참고: 1730~1740 구간에서 높은 귀속 골드 대신 거래가능 골드가 높은 하위 레이드를 선택했습니다.
      </p>
      <p className={styles.credit}>
        * UI 및 골드표 출처:{" "}
        <a
          href="https://www.inven.co.kr/board/lostark/4821/110268"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.creditLink}
        >
          인벤 &apos;미도레&apos;님
        </a>
      </p>
    </div>
  );
}
