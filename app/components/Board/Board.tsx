import Image from "next/image";
import styles from "./Board.module.scss";
import { reverseTransformMaterialName } from "@/app/lib/transformMaterialName";

interface BoardProps {
  materials: Record<string, number>;
  materialsPrice: Record<string, number>;
  totalGold: number;
  owned: Record<string, string>;
  setOwned: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const Board = ({
  materials,
  materialsPrice,
  totalGold,
  owned,
  setOwned,
}: BoardProps) => {
  const onChange = (name: string, value: string) => {
    setOwned(prevOwned => ({
      ...prevOwned,
      [name]: value,
    }));
  };

  return totalGold ? (
    <div className={styles.board}>
      <div className={styles.materialContainer}>
        <div className={styles.materialHeader}>
          <div className={`${styles.image} ${styles.cell}`}></div>
          <div className={`${styles.cell} ${styles.materialNameCell}`}>
            재료명
          </div>
          <div className={`${styles.cell} ${styles.requiredAmountCell}`}>
            필요량
          </div>
          <div className={styles.cell}>소유량</div>
          <div className={styles.cell}>재료별 가격(개당)</div>
        </div>
        {Object.entries(materials).map(([name, value], index) => (
          <div key={index} className={styles.materialColumn}>
            <div className={`${styles.image} ${styles.cell}`}>
              <Image
                src={`/images/${name}.png`}
                alt={name}
                width={44}
                height={44}
              />
            </div>
            <div className={styles.cell}>
              {reverseTransformMaterialName(name)}
            </div>
            <div className={styles.cell}>{value.toLocaleString()}</div>
            <div className={styles.cell}>
              <input
                className={styles.owned}
                type="text"
                value={owned[name] || ""}
                onChange={e => onChange(name, e.target.value)}
              />
            </div>
            <div className={styles.materialPriceCell}>
              {(
                materialsPrice[reverseTransformMaterialName(name)] * value
              ).toLocaleString()}
              <br />
              <div className={styles.peacePrice}>
                {` (${materialsPrice[reverseTransformMaterialName(name)]})`}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.totalGold}>
        평균 비용: {totalGold.toLocaleString()}
      </div>
    </div>
  ) : null;
};

export default Board;
