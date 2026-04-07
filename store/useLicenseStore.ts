import { create } from 'zustand'
import { License } from '@/types/license'
import { licenses as initialLicenses } from '@/data/mock-licenses'

interface LicenseState {
  licenses: License[]
  searchQuery: string
  filterType: string
  filterStatus: string
  selectedLicenseId: string | null
  setSearchQuery: (query: string) => void
  setFilterType: (type: string) => void
  setFilterStatus: (status: string) => void
  addLicense: (license: License) => void
  setSelectedLicense: (id: string | null) => void
  updateLicense: (id: string, updates: Partial<License>) => void
}

export const useLicenseStore = create<LicenseState>((set) => ({
  licenses: initialLicenses,
  searchQuery: '',
  filterType: '',
  filterStatus: '',
  selectedLicenseId: null,
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterType: (type) => set({ filterType: type }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  addLicense: (license) =>
    set((state) => ({ licenses: [...state.licenses, license] })),
  setSelectedLicense: (id) => set({ selectedLicenseId: id }),
  updateLicense: (id, updates) =>
    set((state) => ({
      licenses: state.licenses.map((l) =>
        l.id === id ? { ...l, ...updates } : l
      ),
    })),
}))
