import type { LicenseCategory, LicenseTier, ApplicationStatus } from '@/types/license'
import { LICENSE_CATEGORIES, APPLICATION_STATUS_CONFIG, SITE_FACILITY_DOCUMENTS } from '@/config/constants'
import { LICENSE_TYPE_CONFIGS } from '@/config/license-type-config'

export function getLicenseCategoryLabel(category: LicenseCategory): string {
  return LICENSE_CATEGORIES.find((c) => c.value === category)?.label ?? category
}

export function getLicenseCategoryShortLabel(category: LicenseCategory): string {
  return LICENSE_TYPE_CONFIGS[category]?.shortLabel ?? category
}

export function getTierLabel(category: LicenseCategory, tier: LicenseTier): string {
  const config = LICENSE_TYPE_CONFIGS[category]
  return config?.tiers.find((t) => t.value === tier)?.label ?? String(tier)
}

export function getStatusLabel(status: ApplicationStatus): string {
  return APPLICATION_STATUS_CONFIG[status]?.label ?? status
}

export function getStatusColor(status: ApplicationStatus): { color: string; bgColor: string; borderColor: string } {
  const config = APPLICATION_STATUS_CONFIG[status]
  if (!config) return { color: '#6b7280', bgColor: 'rgba(107,114,128,0.12)', borderColor: '#6b7280' }
  return { color: config.color, bgColor: config.bgColor, borderColor: config.borderColor }
}

export function getStatusPhase(status: ApplicationStatus): string {
  return APPLICATION_STATUS_CONFIG[status]?.phase ?? 'Unknown'
}

export function getRequiredSiteDocs(category: LicenseCategory): typeof SITE_FACILITY_DOCUMENTS[number][] {
  const config = LICENSE_TYPE_CONFIGS[category]
  if (!config) return []
  return SITE_FACILITY_DOCUMENTS.filter((doc) => {
    if (!config.siteFacilityDocKeys.includes(doc.key)) return false
    if ('applicableTo' in doc && doc.applicableTo) {
      return (doc.applicableTo as LicenseCategory[]).includes(category)
    }
    return true
  })
}

export function getRequiredPersonnel(category: LicenseCategory): string[] {
  return LICENSE_TYPE_CONFIGS[category]?.requiredPersonnel ?? []
}

export function generateApplicationReference(): string {
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `CCRA-APP-2026-${rand}`
}

export function generateLicenseNumber(): string {
  const rand = Math.floor(100 + Math.random() * 900)
  return `CCRA-LIC-2026-${rand}`
}
