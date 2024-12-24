import { create } from "zustand";

interface FilterState {
  selected: Record<string, boolean>;
  toggleSelected: (item: string) => void;
}

const useFilterStore = create<FilterState>(set => ({
  selected: {
    weapon: false,
    armor: false,
    tier3: false,
    tier4: false,
  },
  toggleSelected: item =>
    set(state => ({
      selected: { ...state.selected, [item]: !state.selected[item] },
    })),
}));

export default useFilterStore;
