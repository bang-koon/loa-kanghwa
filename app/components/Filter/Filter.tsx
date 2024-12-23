import { useState } from "react";
import styles from "./Filter.module.scss";

const Filter = () => {
  const [selected, setSelected] = useState<Record<string, boolean>>({
    weapon: false,
    armor: false,
    tier3: false,
    tier4: false,
  });

  const handleToggle = (item: string) => {
    setSelected(prev => ({ ...prev, [item]: !prev[item] }));
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterGroup}>
        <div className={styles.filterTitle}>장비</div>
        <div className={styles.filterItem}>
          <img
            src={
              selected.weapon ? "/button/clicked.svg" : "/button/default.svg"
            }
            alt="무기"
            onClick={() => handleToggle("weapon")}
            className={styles.icon}
          />
          <label htmlFor="weapon">무기</label>
        </div>
        <div className={styles.filterItem}>
          <img
            src={selected.armor ? "/button/clicked.svg" : "/button/default.svg"}
            alt="방어구"
            onClick={() => handleToggle("armor")}
            className={styles.icon}
          />
          <label htmlFor="armor">방어구</label>
        </div>
      </div>
      <div className={styles.filterGroup}>
        <div className={styles.filterTitle}>상급재련</div>
        <div className={styles.filterItem}>
          <img
            src={selected.tier3 ? "/button/clicked.svg" : "/button/default.svg"}
            alt="3티어"
            onClick={() => handleToggle("tier3")}
            className={styles.icon}
          />
          <label htmlFor="3tier">3티어</label>
        </div>
        <div className={styles.filterItem}>
          <img
            src={selected.tier4 ? "/button/clicked.svg" : "/button/default.svg"}
            alt="4티어"
            onClick={() => handleToggle("tier4")}
            className={styles.icon}
          />
          <label htmlFor="4tier">4티어</label>
        </div>
      </div>
    </div>
  );
};

export default Filter;
