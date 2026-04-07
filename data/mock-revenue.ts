import { RevenueRecord, Transaction, FinancialSummary } from '@/types/revenue'

export const revenueRecords: RevenueRecord[] = [
  { id: 'r01', month: 'Apr', year: 2025, licenseFees: 12500000, penalties: 0, inspectionFees: 400000, renewalFees: 0, total: 12900000 },
  { id: 'r02', month: 'May', year: 2025, licenseFees: 15000000, penalties: 0, inspectionFees: 600000, renewalFees: 0, total: 15600000 },
  { id: 'r03', month: 'Jun', year: 2025, licenseFees: 10000000, penalties: 0, inspectionFees: 800000, renewalFees: 0, total: 10800000 },
  { id: 'r04', month: 'Jul', year: 2025, licenseFees: 12500000, penalties: 0, inspectionFees: 500000, renewalFees: 1500000, total: 14500000 },
  { id: 'r05', month: 'Aug', year: 2025, licenseFees: 7500000, penalties: 0, inspectionFees: 700000, renewalFees: 0, total: 8200000 },
  { id: 'r06', month: 'Sep', year: 2025, licenseFees: 5000000, penalties: 75000000, inspectionFees: 400000, renewalFees: 3000000, total: 83400000 },
  { id: 'r07', month: 'Oct', year: 2025, licenseFees: 8000000, penalties: 50000000, inspectionFees: 600000, renewalFees: 0, total: 58600000 },
  { id: 'r08', month: 'Nov', year: 2025, licenseFees: 5000000, penalties: 25500000, inspectionFees: 800000, renewalFees: 1500000, total: 32800000 },
  { id: 'r09', month: 'Dec', year: 2025, licenseFees: 3000000, penalties: 1000000, inspectionFees: 400000, renewalFees: 0, total: 4400000 },
  { id: 'r10', month: 'Jan', year: 2026, licenseFees: 4500000, penalties: 500000, inspectionFees: 600000, renewalFees: 5000000, total: 10600000 },
  { id: 'r11', month: 'Feb', year: 2026, licenseFees: 6000000, penalties: 0, inspectionFees: 700000, renewalFees: 2500000, total: 9200000 },
  { id: 'r12', month: 'Mar', year: 2026, licenseFees: 8500000, penalties: 0, inspectionFees: 500000, renewalFees: 0, total: 9000000 },
]

export const transactions: Transaction[] = [
  { id: 't001', type: 'license_fee', description: 'Cultivation License — Malakand Sunrise', amount: 500000, payer: 'Gul Zaman', date: '2026-03-15', status: 'completed', referenceNumber: 'TXN-2026-0312' },
  { id: 't002', type: 'renewal_fee', description: 'License Renewal — Tirah Valley Estate', amount: 1500000, payer: 'Khan Muhammad Afridi', date: '2026-03-12', status: 'completed', referenceNumber: 'TXN-2026-0298' },
  { id: 't003', type: 'inspection_fee', description: 'Scheduled Inspection — Tirah Gold Plantation', amount: 200000, payer: 'Malik Nasrullah', date: '2026-03-10', status: 'completed', referenceNumber: 'TXN-2026-0285' },
  { id: 't004', type: 'penalty', description: 'Water Usage Violation — Quetta Highland Farm', amount: 1000000, payer: 'Abdul Samad', date: '2026-03-08', status: 'pending', referenceNumber: 'TXN-2026-0271' },
  { id: 't005', type: 'license_fee', description: 'Extraction License Application — Quetta Premium Cultivars', amount: 1000000, payer: 'Dr. Rashid Baloch', date: '2026-03-05', status: 'completed', referenceNumber: 'TXN-2026-0258' },
  { id: 't006', type: 'renewal_fee', description: 'License Renewal — Chagai Desert Bloom', amount: 1500000, payer: 'Balach Khan', date: '2026-03-01', status: 'completed', referenceNumber: 'TXN-2026-0244' },
  { id: 't007', type: 'inspection_fee', description: 'Unscheduled Inspection — Dir Cannabis Co-op', amount: 350000, payer: 'Bakht Zaman', date: '2026-02-28', status: 'completed', referenceNumber: 'TXN-2026-0231' },
  { id: 't008', type: 'license_fee', description: 'Manufacturing License — Green Pharma Ltd', amount: 2000000, payer: 'Green Pharma Ltd', date: '2026-02-25', status: 'completed', referenceNumber: 'TXN-2026-0218' },
  { id: 't009', type: 'penalty', description: 'Boundary Violation Penalty — Panjgur Oasis', amount: 25000000, payer: 'Mir Hamza', date: '2026-02-20', status: 'pending', referenceNumber: 'TXN-2026-0205' },
  { id: 't010', type: 'license_fee', description: 'Sales & Distribution License Renewal', amount: 2500000, payer: 'National Cannabis Trading Co.', date: '2026-02-15', status: 'completed', referenceNumber: 'TXN-2026-0192' },
]

export const financialSummary: FinancialSummary = {
  totalRevenue: 270000000,
  totalPenalties: 152000000,
  totalLicenseFees: 97500000,
  totalInspectionFees: 6000000,
  projectedQuarterly: 85000000,
  collectionRate: 87.3,
  yoyGrowth: 0,
}
