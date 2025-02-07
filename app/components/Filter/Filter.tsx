import styles from "./Filter.module.scss";
import FilterItems from "./FilterItems";

const Filter = () => {
  return (
    <div className={styles.filterContainer}>
      <FilterItems />
    </div>
  );
};

export default Filter;
