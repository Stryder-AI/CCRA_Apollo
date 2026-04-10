import type { LicenseCategory, LicenseTier, FeeBreakdown } from '@/types/license'
import { FEE_SCHEDULE, ADDITIONAL_FEES, TRACK_AND_TRACE_FEES } from '@/config/constants'

export function calculateFees(
  category: LicenseCategory,
  tier: LicenseTier,
  personnelCount: number,
): FeeBreakdown {
  const tierFees = FEE_SCHEDULE[category]?.[tier]
  const trackFees = TRACK_AND_TRACE_FEES[category] ?? { setup: 0, monthly: 0 }

  if (!tierFees) {
    return {
      applicationFee: 0,
      licenseFee: 0,
      securityClearanceFee: 0,
      trackAndTraceSetup: 0,
      inspectionFee: 0,
      totalDueNow: 0,
      totalFirstYear: 0,
      annualRenewalPreview: 0,
      trackAndTraceMonthly: 0,
    }
  }

  const securityClearanceFee = personnelCount * ADDITIONAL_FEES.securityClearancePerPerson
  const inspectionFee = ADDITIONAL_FEES.annualInspection

  return {
    applicationFee: tierFees.applicationFee,
    licenseFee: tierFees.licenseFee,
    securityClearanceFee,
    trackAndTraceSetup: trackFees.setup,
    inspectionFee,
    totalDueNow: tierFees.applicationFee + securityClearanceFee,
    totalFirstYear: tierFees.totalFirstYear + securityClearanceFee + trackFees.setup,
    annualRenewalPreview: tierFees.annualRenewal + inspectionFee + trackFees.monthly * 12,
    trackAndTraceMonthly: trackFees.monthly,
  }
}
