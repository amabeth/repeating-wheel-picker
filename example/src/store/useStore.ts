import { create } from "zustand";

export interface State {
  enableCustomTypePicker: boolean;
  setEnableCustomTypePicker: (b: boolean) => void;
}

const useStore = create<State>((set) => ({
    enableCustomTypePicker: true,
    setEnableCustomTypePicker: (b: boolean) => set(() => ({enableCustomTypePicker: b}))
  }));

export default useStore;
