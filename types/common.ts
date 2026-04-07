export interface DashboardStats {
  totalFarms: number
  activeLicenses: number
  totalRevenue: number
  complianceRate: number
  totalFarmsTrend: number
  activeLicensesTrend: number
  totalRevenueTrend: number
  complianceRateTrend: number
  totalFarmsSpark: number[]
  activeLicensesSpark: number[]
  totalRevenueSpark: number[]
  complianceRateSpark: number[]
}

export interface MonthlyRevenue {
  month: string
  income: number
  expense: number
}

export interface RegionalData {
  region: string
  farms: number
  percentage: number
}

export interface FeeScheduleItem {
  type: string
  application: number
  annual: number
  renewal: number
  inspection: number
}

export interface Document {
  id: string
  name: string
  type: string
  uploadDate: string
  status: 'verified' | 'pending' | 'rejected'
}

export interface TimelineEvent {
  id: string
  farmId: string
  event: string
  date: string
  description: string
  type: 'registration' | 'inspection' | 'violation' | 'update' | 'license'
}
