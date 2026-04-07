import { DashboardStats, MonthlyRevenue, RegionalData } from '@/types/common'

export const dashboardStats: DashboardStats = {
  totalFarms: 25,
  activeLicenses: 12,
  totalRevenue: 284500000,
  complianceRate: 87.3,
  totalFarmsTrend: 12.5,
  activeLicensesTrend: 8.3,
  totalRevenueTrend: 15.2,
  complianceRateTrend: -2.1,
  totalFarmsSpark: [280, 290, 295, 302, 310, 318, 324],
  activeLicensesSpark: [180, 178, 185, 190, 195, 200, 203],
  totalRevenueSpark: [210, 220, 225, 240, 250, 260, 270],
  complianceRateSpark: [89, 88, 90, 91, 92, 91, 92.4],
}

export const monthlyRevenue: MonthlyRevenue[] = [
  { month: 'Apr', income: 18500000, expense: 4200000 },
  { month: 'May', income: 21000000, expense: 5100000 },
  { month: 'Jun', income: 24500000, expense: 5800000 },
  { month: 'Jul', income: 22000000, expense: 5500000 },
  { month: 'Aug', income: 26000000, expense: 6200000 },
  { month: 'Sep', income: 23500000, expense: 5900000 },
  { month: 'Oct', income: 25000000, expense: 6000000 },
  { month: 'Nov', income: 27500000, expense: 6500000 },
  { month: 'Dec', income: 24000000, expense: 5700000 },
  { month: 'Jan', income: 22500000, expense: 5400000 },
  { month: 'Feb', income: 25500000, expense: 6100000 },
  { month: 'Mar', income: 28000000, expense: 6800000 },
]

export const regionalData: RegionalData[] = [
  { region: 'Khyber Pakhtunkhwa', farms: 15, percentage: 60 },
  { region: 'Balochistan', farms: 10, percentage: 40 },
]
