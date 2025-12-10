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
    tier4_3: false,
    tier4_4: false,
    onePart: false,
    fiveParts: true,
    mokoko: false,
    boundBook: false,
  },
  toggleSelected: item =>
    set(state => {
      const newState = { ...state.selected, [item]: !state.selected[item] };
      if (item === "onePart" && newState.onePart) {
        newState.fiveParts = false;
      } else if (item === "fiveParts" && newState.fiveParts) {
        newState.onePart = false;
      }
      return { selected: newState };
    }),
}));

export default useFilterStore;
