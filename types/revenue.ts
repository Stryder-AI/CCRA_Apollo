export interface RevenueRecord {
  id: string
  month: string
  year: number
  licenseFees: number
  penalties: number
  inspectionFees: number
  renewalFees: number
  total: number
}

export interface Transaction {
  id: string
  type: 'license_fee' | 'penalty' | 'inspection_fee' | 'renewal_fee'
  description: string
  amount: number
  payer: string
  date: string
  status: 'completed' | 'pending' | 'failed'
  referenceNumber: string
}

export interface FinancialSummary {
  totalRevenue: number
  totalPenalties: number
  totalLicenseFees: number
  totalInspectionFees: number
  projectedQuarterly: number
  collectionRate: number
  yoyGrowth: number
}
