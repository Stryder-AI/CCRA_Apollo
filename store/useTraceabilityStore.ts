import { create } from 'zustand'
import { Batch } from '@/types/traceability'
import { batches as initialBatches } from '@/data/mock-traceability'

interface TraceabilityState {
  batches: Batch[]
  selectedBatchId: string | null
  setSelectedBatch: (id: string | null) => void
}

export const useTraceabilityStore = create<TraceabilityState>((set) => ({
  batches: initialBatches,
  selectedBatchId: null,
  setSelectedBatch: (id) => set({ selectedBatchId: id }),
}))
