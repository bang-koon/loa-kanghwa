import styles from "./Filter.module.scss";
import FilterItems from "./FilterItems";

interface FilterMobileProps {
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
}

const FilterMobile = ({ setShowFilter }: FilterMobileProps) => {
  const handleModal = () => {
    setShowFilter(false);
  };
  return (
    <div className={styles.filterBackground} onClick={handleModal}>
      <div className={styles.filterModal} onClick={e => e.stopPropagation()}>
        <FilterItems />
      </div>
    </div>
  );
};

export default FilterMobile;
