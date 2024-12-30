import { create } from "zustand";

interface FilterState {
  selected: Record<string, boolean>;
  toggleSelected: (item: string) => void;
}

const useFilterStore = create<FilterState>(set => ({
  selected: {
    weapon: true,
    armor: true,
    tier3_1: false,
    tier3_2: false,
    tier4_1: false,
    tier4_2: false,
  },
  toggleSelected: item =>
    set(state => ({
      selected: { ...state.selected, [item]: !state.selected[item] },
    })),
}));

export default useFilterStore;
