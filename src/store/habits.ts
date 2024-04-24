import { create } from 'zustand'

interface HabitsStoreState {
  isInEditMode: boolean
  setIsInEditMode: (isInEditMode: boolean) => void
}

export const useHabitsStore = create<HabitsStoreState>()((set) => ({
  isInEditMode: false,
  setIsInEditMode: (isInEditMode) => set({ isInEditMode })
}))

