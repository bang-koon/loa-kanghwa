"use client";

import { EfficiencyDataItem } from "@/app/lib/efficiency/calculateEfficiencyData";
import styles from "./EfficiencyGraph.module.scss";
import Image from "next/image";
import { reverseTransformMaterialName } from "@/app/lib/transformMaterialName";

interface DataWithFilteredCost extends EfficiencyDataItem {
  filteredCost: number;
}

interface EfficiencyGraphProps {
  title: string;
  data: DataWithFilteredCost[];
}

const EfficiencyGraph = ({ title, data }: EfficiencyGraphProps) => {
  if (!data || data.length === 0) return null;

  const maxCost = Math.max(...data.map(d => d.filteredCost));

  return (
    <div className={styles.graphContainer}>
      <h2>{title}</h2>
      <div className={styles.scrollWrapper}>
        <div className={styles.chartArea}>
          {data.map((item, index) => {
            const heightPercent = maxCost > 0 ? (item.filteredCost / maxCost) * 100 : 0;
            const barHeight = Math.max(heightPercent, 2);
            const isFirst = index === 0;
            const isLast = index === data.length - 1;
            const tooltipClass = `${styles.tooltip} ${isFirst ? styles.tooltipFirst : ""} ${isLast ? styles.tooltipLast : ""}`;

            return (
              <div key={item.id} className={styles.barWrapper}>
                <div className={styles.barCost}>{Math.round(item.filteredCost / 1000).toLocaleString()}k</div>

                <div
                  className={`${styles.bar} ${item.type === "advanced" ? styles.advanced : ""}`}
                  style={{ height: `${barHeight}%` }}
                />

                {/* Tooltip - barWrapper 기준으로 위치 */}
                <div className={tooltipClass}>
                  <div className={styles.tooltipTitle}>{item.name}</div>

                  {/* Material List */}
                  {item.materials.map(mat => {
                    if (mat.amount === 0) return null;
                    const displayName = reverseTransformMaterialName(mat.name);
                    const materialCost = mat.category === "gold" ? mat.amount : mat.price * mat.amount;

                    return (
                      <div key={mat.name} className={styles.tooltipRow}>
                        <div className={styles.rowLeft}>
                          <Image
                            src={`/images/${mat.name}.png`}
                            alt={mat.name}
                            width={20}
                            height={20}
                            className={styles.matIcon}
                          />
                          <span>{displayName}</span>
                        </div>
                        <div className={styles.rowRight}>
                          <span className={styles.amount}>{Math.round(mat.amount).toLocaleString()}</span>
                          <span className={styles.cost}>({Math.round(materialCost).toLocaleString()}G)</span>
                        </div>
                      </div>
                    );
                  })}

                  <div className={styles.totalDivider} />

                  {/* Cost Breakdown */}
                  <div className={styles.costBreakdown}>
                    <div className={styles.breakdownRow}>
                      <span>기본 골드</span>
                      <span>{Math.round(item.costs.gold).toLocaleString()}G</span>
                    </div>
                    <div className={styles.breakdownRow}>
                      <span>강석</span>
                      <span>{Math.round(item.costs.stones).toLocaleString()}G</span>
                    </div>
                  </div>

                  <div className={styles.totalDivider} />

                  <div className={styles.totalRow}>
                    <span>선택 비용</span>
                    <span>{Math.round(item.filteredCost).toLocaleString()}G</span>
                  </div>
                </div>

                <div className={styles.barLabel}>{item.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EfficiencyGraph;
