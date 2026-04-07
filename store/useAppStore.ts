import { create } from 'zustand'

interface AppState {
  sidebarCollapsed: boolean
  searchQuery: string
  toggleSidebar: () => void
  setSearchQuery: (query: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  searchQuery: '',
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSearchQuery: (query) => set({ searchQuery: query }),
}))
