import Image from "next/image";
import useFilterStore from "@/app/lib/store";
import styles from "./Filter.module.scss";

interface FilterMobileProps {
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
}

const FilterMobile = ({ setShowFilter }: FilterMobileProps) => {
  const { selected, toggleSelected } = useFilterStore();

  const handleModal = () => {
    setShowFilter(false);
  };
  return (
    <div className={styles.filterBackground} onClick={handleModal}>
      <div className={styles.filterModal} onClick={e => e.stopPropagation()}>
        <div className={styles.filterGroup}>
          <div className={styles.filterModalTitle}>장비</div>
          <div className={styles.filterModalItem}>
            <img
              src={
                selected.weapon ? "/button/clicked.svg" : "/button/default.svg"
              }
              alt="무기"
              onClick={() => toggleSelected("weapon")}
              className={styles.modalIcon}
            />
            <label
              htmlFor="weapon"
              className={styles.modalLabel}
              onClick={() => toggleSelected("weapon")}
            >
              무기
            </label>
          </div>
          <div className={styles.filterModalItem}>
            <img
              src={
                selected.armor ? "/button/clicked.svg" : "/button/default.svg"
              }
              alt="방어구"
              onClick={() => toggleSelected("armor")}
              className={styles.modalIcon}
            />
            <label
              htmlFor="armor"
              className={styles.modalLabel}
              onClick={() => toggleSelected("armor")}
            >
              방어구
            </label>
          </div>
        </div>
        <div className={styles.filterGroup}>
          <div className={styles.filterModalTitle}>상급재련</div>
          <div className={styles.filterModalItem}>
            <img
              src={
                selected.tier3_1 ? "/button/clicked.svg" : "/button/default.svg"
              }
              alt="3티어 1~10"
              onClick={() => toggleSelected("tier3_1")}
              className={styles.modalIcon}
            />
            <label
              htmlFor="3_1"
              className={styles.modalLabel}
              onClick={() => toggleSelected("tier3_1")}
            >
              3T 1~10
            </label>
          </div>
          <div className={styles.filterModalItem}>
            <img
              src={
                selected.tier3_2 ? "/button/clicked.svg" : "/button/default.svg"
              }
              alt="3티어 11~20"
              onClick={() => toggleSelected("tier3_2")}
              className={styles.modalIcon}
            />
            <label
              htmlFor="3_2"
              className={styles.modalLabel}
              onClick={() => toggleSelected("tier3_2")}
            >
              3T 11~20
            </label>
          </div>
          <div className={styles.filterModalItem}>
            <img
              src={
                selected.tier4_1 ? "/button/clicked.svg" : "/button/default.svg"
              }
              alt="4T 1~10"
              onClick={() => toggleSelected("tier4_1")}
              className={styles.modalIcon}
            />
            <label
              htmlFor="4_1"
              className={styles.modalLabel}
              onClick={() => toggleSelected("tier4_1")}
            >
              4T 1~10
            </label>
          </div>
          <div className={styles.filterModalItem}>
            <img
              src={
                selected.tier4_2 ? "/button/clicked.svg" : "/button/default.svg"
              }
              alt="4T 11~20"
              onClick={() => toggleSelected("tier4_2")}
              className={styles.modalIcon}
            />
            <label
              htmlFor="4_2"
              className={styles.modalLabel}
              onClick={() => toggleSelected("tier4_2")}
            >
              4T 11~20
            </label>
          </div>
          <div className={styles.xButton} onClick={handleModal}>
            <Image
              src="/button/xButton.svg"
              width="20"
              height="20"
              alt="xButton"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterMobile;
