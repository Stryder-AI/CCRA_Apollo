import { create } from 'zustand'
import { Inspection, Violation } from '@/types/compliance'
import { inspections as initialInspections } from '@/data/mock-inspections'
import { violations as initialViolations } from '@/data/mock-violations'

interface ComplianceState {
  inspections: Inspection[]
  violations: Violation[]
  selectedInspectionId: string | null
  selectedViolationId: string | null
  addInspection: (inspection: Inspection) => void
  updateInspection: (id: string, updates: Partial<Inspection>) => void
  addViolation: (violation: Violation) => void
  updateViolation: (id: string, updates: Partial<Violation>) => void
  setSelectedInspection: (id: string | null) => void
  setSelectedViolation: (id: string | null) => void
}

export const useComplianceStore = create<ComplianceState>((set) => ({
  inspections: initialInspections,
  violations: initialViolations,
  selectedInspectionId: null,
  selectedViolationId: null,
  addInspection: (inspection) =>
    set((state) => ({ inspections: [...state.inspections, inspection] })),
  updateInspection: (id, updates) =>
    set((state) => ({
      inspections: state.inspections.map((i) =>
        i.id === id ? { ...i, ...updates } : i
      ),
    })),
  addViolation: (violation) =>
    set((state) => ({ violations: [...state.violations, violation] })),
  updateViolation: (id, updates) =>
    set((state) => ({
      violations: state.violations.map((v) =>
        v.id === id ? { ...v, ...updates } : v
      ),
    })),
  setSelectedInspection: (id) => set({ selectedInspectionId: id }),
  setSelectedViolation: (id) => set({ selectedViolationId: id }),
}))
