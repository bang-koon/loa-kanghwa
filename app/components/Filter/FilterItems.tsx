import styles from "./Filter.module.scss";
import useFilterStore from "@/app/lib/store";

const FilterItems = () => {
  const { selected, toggleSelected } = useFilterStore();
  return (
    <>
      <div className={styles.filterGroup}>
        <div className={styles.filterTitle}>장비</div>
        <div className={styles.filterItem}>
          <img
            src={
              selected.weapon ? "/button/clicked.svg" : "/button/default.svg"
            }
            alt="무기"
            onClick={() => toggleSelected("weapon")}
            className={styles.icon}
          />
          <label
            htmlFor="weapon"
            className={styles.label}
            onClick={() => toggleSelected("weapon")}
          >
            무기
          </label>
        </div>
        <div className={styles.filterItem}>
          <img
            src={selected.armor ? "/button/clicked.svg" : "/button/default.svg"}
            alt="방어구"
            onClick={() => toggleSelected("armor")}
            className={styles.icon}
          />
          <label
            htmlFor="armor"
            className={styles.label}
            onClick={() => toggleSelected("armor")}
          >
            방어구
          </label>
        </div>
        <div className={styles.radioContainer}>
          <img
            src={
              selected.onePart ? "/button/clicked.svg" : "/button/default.svg"
            }
            alt="한 부위"
            className={styles.icon}
          />
          <label htmlFor="onePart" className={styles.radioLabel}>
            <input
              type="radio"
              id="onePart"
              name="armorParts"
              className={styles.radioInput}
              checked={selected.onePart}
              onChange={() => toggleSelected("onePart")}
            />
            <span>한 부위</span>
          </label>
        </div>
        <div className={styles.radioContainer}>
          <img
            src={
              selected.fiveParts ? "/button/clicked.svg" : "/button/default.svg"
            }
            className={styles.icon}
            alt="다섯 부위"
          />
          <label htmlFor="fiveParts" className={styles.radioLabel}>
            <input
              type="radio"
              id="fiveParts"
              name="armorParts"
              className={styles.radioInput}
              checked={selected.fiveParts}
              onChange={() => toggleSelected("fiveParts")}
            />
            다섯 부위
          </label>
        </div>
      </div>
      <div className={styles.filterGroup}>
        <div className={styles.filterTitle}>상급재련</div>
        <div className={styles.filterItem}>
          <img
            src={
              selected.tier3_1 ? "/button/clicked.svg" : "/button/default.svg"
            }
            alt="3티어 1~10"
            onClick={() => toggleSelected("tier3_1")}
            className={styles.icon}
          />
          <label
            htmlFor="3_1"
            className={styles.label}
            onClick={() => toggleSelected("tier3_1")}
          >
            3T 1~10
          </label>
        </div>
        <div className={styles.filterItem}>
          <img
            src={
              selected.tier3_2 ? "/button/clicked.svg" : "/button/default.svg"
            }
            alt="3티어 11~20"
            onClick={() => toggleSelected("tier3_2")}
            className={styles.icon}
          />
          <label
            htmlFor="3_2"
            className={styles.label}
            onClick={() => toggleSelected("tier3_2")}
          >
            3T 11~20
          </label>
        </div>
        <div className={styles.filterItem}>
          <img
            src={
              selected.tier4_1 ? "/button/clicked.svg" : "/button/default.svg"
            }
            alt="4T 1~10"
            onClick={() => toggleSelected("tier4_1")}
            className={styles.icon}
          />
          <label
            htmlFor="4_1"
            className={styles.label}
            onClick={() => toggleSelected("tier4_1")}
          >
            4T 1~10
          </label>
        </div>
        <div className={styles.filterItem}>
          <img
            src={
              selected.tier4_2 ? "/button/clicked.svg" : "/button/default.svg"
            }
            alt="4T 11~20"
            onClick={() => toggleSelected("tier4_2")}
            className={styles.icon}
          />
          <label
            htmlFor="4_2"
            className={styles.label}
            onClick={() => toggleSelected("tier4_2")}
          >
            4T 11~20
          </label>
        </div>
        <div className={styles.filterItem}>
          <img
            src={
              selected.tier4_3 ? "/button/clicked.svg" : "/button/default.svg"
            }
            alt="4T 21~30"
            onClick={() => toggleSelected("tier4_3")}
            className={styles.icon}
          />
          <label
            htmlFor="4_3"
            className={styles.label}
            onClick={() => toggleSelected("tier4_3")}
          >
            4T 21~30
          </label>
        </div>
        <div className={styles.filterItem}>
          <img
            src={
              selected.tier4_4 ? "/button/clicked.svg" : "/button/default.svg"
            }
            alt="4T 21~30"
            onClick={() => toggleSelected("tier4_4")}
            className={styles.icon}
          />
          <label
            htmlFor="4_4"
            className={styles.label}
            onClick={() => toggleSelected("tier4_4")}
          >
            4T 31~40
          </label>
        </div>
      </div>
    </>
  );
};

export default FilterItems;
