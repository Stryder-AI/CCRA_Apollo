import { create } from 'zustand'
import { Farm, FarmFilters } from '@/types/farm'
import { farms as initialFarms } from '@/data/mock-farms'

interface FarmState {
  farms: Farm[]
  selectedFarmId: string | null
  filters: FarmFilters
  viewMode: 'map' | 'list'
  addFarm: (farm: Farm) => void
  updateFarm: (id: string, updates: Partial<Farm>) => void
  deleteFarm: (id: string) => void
  setSelectedFarm: (id: string | null) => void
  setFilters: (filters: Partial<FarmFilters>) => void
  resetFilters: () => void
  setViewMode: (mode: 'map' | 'list') => void
}

const defaultFilters: FarmFilters = {
  search: '',
  region: '',
  status: '',
  strain: '',
}

export const useFarmStore = create<FarmState>((set) => ({
  farms: initialFarms,
  selectedFarmId: null,
  filters: defaultFilters,
  viewMode: 'map',
  addFarm: (farm) => set((state) => ({ farms: [...state.farms, farm] })),
  updateFarm: (id, updates) =>
    set((state) => ({
      farms: state.farms.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    })),
  deleteFarm: (id) =>
    set((state) => ({
      farms: state.farms.filter((f) => f.id !== id),
      selectedFarmId: state.selectedFarmId === id ? null : state.selectedFarmId,
    })),
  setSelectedFarm: (id) => set({ selectedFarmId: id }),
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  resetFilters: () => set({ filters: defaultFilters }),
  setViewMode: (mode) => set({ viewMode: mode }),
}))
