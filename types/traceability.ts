export type StageType = 'seed' | 'cultivation' | 'harvest' | 'processing' | 'lab-testing' | 'packaging' | 'distribution'

export interface BatchStage {
  type: StageType
  status: 'completed' | 'in-progress' | 'pending'
  startDate?: string
  endDate?: string
  notes?: string
  handler?: string
}

export interface LabResult {
  thcPercent: number
  cbdPercent: number
  moisture: number
  contaminants: 'pass' | 'fail'
  pesticides: 'pass' | 'fail'
  heavyMetals: 'pass' | 'fail'
  testedDate: string
  labName: string
  certificateId?: string
}

export interface Batch {
  id: string
  batchCode: string
  farmId: string
  farmName: string
  strain: string
  quantity: number
  unit: string
  stages: BatchStage[]
  currentStage: StageType
  labResults?: LabResult
  createdDate: string
  estimatedCompletion?: string
}
