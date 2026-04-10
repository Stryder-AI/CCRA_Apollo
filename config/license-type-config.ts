import type { LicenseCategory, LicenseTier, PersonnelRole } from '@/types/license'
import {
  Leaf, FlaskConical, Microscope, Truck, Store, GraduationCap,
  ArrowLeftRight, Wheat, Pill,
} from 'lucide-react'

export interface TierConfig {
  value: LicenseTier
  label: string
  description: string
  areaOrCapacity?: string
}

export interface LicenseTypeConfig {
  category: LicenseCategory
  label: string
  shortLabel: string
  description: string
  permittedActivities: string
  icon: typeof Leaf
  tiers: TierConfig[]
  requiredPersonnel: PersonnelRole[]
  skipSiteFacility?: boolean
  siteFacilityDocKeys: string[]
}

export const LICENSE_TYPE_CONFIGS: Record<LicenseCategory, LicenseTypeConfig> = {
  CULTIVATION: {
    category: 'CULTIVATION',
    label: 'Cannabis Cultivation Licence',
    shortLabel: 'Cultivation',
    description: 'Authorize the growing of cannabis plants for medicinal, industrial, or scientific purposes.',
    permittedActivities: 'Planting, growing, harvesting, drying, trimming, milling cannabis plants. Nurseries may also sell seeds and seedlings to licensed cultivators.',
    icon: Leaf,
    tiers: [
      { value: 'MICRO' as LicenseTier, label: 'Micro-Cultivation', description: 'Small-scale farming', areaOrCapacity: 'Up to 2 acres' },
      { value: 'STANDARD_SMALL' as LicenseTier, label: 'Standard (Small)', description: 'Medium commercial farming', areaOrCapacity: '3–5 acres' },
      { value: 'STANDARD_MEDIUM' as LicenseTier, label: 'Standard (Medium)', description: 'Medium-large commercial farming', areaOrCapacity: '5–10 acres' },
      { value: 'LARGE_SCALE' as LicenseTier, label: 'Large-Scale Cultivation', description: 'Industrial farming operations', areaOrCapacity: '10+ acres' },
      { value: 'NURSERY' as LicenseTier, label: 'Nursery', description: 'Propagation of seeds/seedlings only', areaOrCapacity: 'Up to 2 acres' },
    ],
    requiredPersonnel: ['Responsible Person', 'Quality Assurance Person', 'Head of Security', 'Master Grower / Operations Manager', 'Compliance Officer', 'Financial Controller'],
    siteFacilityDocKeys: ['property_deed', 'property_tax', 'zoning_certificate', 'utility_certificates', 'premises_blueprint', 'site_location_map', 'site_video_tour', 'security_plan', 'eia_iee', 'epa_clearance', 'water_source', 'soil_testing', 'waste_management', 'community_engagement', 'district_admin'],
  },
  PROCESSING_EXTRACTION: {
    category: 'PROCESSING_EXTRACTION',
    label: 'Cannabis Processing & Extraction Licence',
    shortLabel: 'Processing',
    description: 'Authorize the transformation of raw cannabis into extracts, oils, concentrates, and other processed forms.',
    permittedActivities: 'Extraction (using approved solvents), refining, infusion, formulation, packaging, and labelling.',
    icon: FlaskConical,
    tiers: [
      { value: 'MICRO' as LicenseTier, label: 'Micro-Processing', description: 'Small-scale extraction/processing', areaOrCapacity: 'Up to 5 kg/day' },
      { value: 'STANDARD' as LicenseTier, label: 'Standard Processing', description: 'Medium processing operations', areaOrCapacity: '5–25 kg/day' },
      { value: 'LARGE_SCALE' as LicenseTier, label: 'Large-Scale Processing', description: 'Industrial processing', areaOrCapacity: '25+ kg/day' },
    ],
    requiredPersonnel: ['Responsible Person', 'Quality Assurance Person', 'Head of Security', 'Compliance Officer', 'Financial Controller'],
    siteFacilityDocKeys: ['property_deed', 'property_tax', 'zoning_certificate', 'utility_certificates', 'premises_blueprint', 'site_location_map', 'site_video_tour', 'security_plan', 'eia_iee', 'epa_clearance', 'water_source', 'waste_management', 'community_engagement', 'district_admin'],
  },
  TESTING_LABORATORY: {
    category: 'TESTING_LABORATORY',
    label: 'Cannabis Testing Laboratory Licence',
    shortLabel: 'Testing Lab',
    description: 'Authorize third-party laboratories to conduct quality assurance testing on cannabis products.',
    permittedActivities: 'Potency testing, heavy metals analysis, microbial testing, pesticide residue testing, solvent residue testing, terpene profiling.',
    icon: Microscope,
    tiers: [
      { value: 'BASIC' as LicenseTier, label: 'Basic Laboratory', description: 'Standard testing capabilities', areaOrCapacity: 'Standard equipment' },
      { value: 'ISO_CERTIFIED' as LicenseTier, label: 'ISO/IEC 17025 Certified', description: 'International accreditation', areaOrCapacity: 'Advanced equipment' },
    ],
    requiredPersonnel: ['Responsible Person', 'Quality Assurance Person', 'Head of Security', 'Compliance Officer', 'Financial Controller'],
    siteFacilityDocKeys: ['property_deed', 'property_tax', 'utility_certificates', 'premises_blueprint', 'site_location_map', 'site_video_tour', 'security_plan', 'waste_management', 'community_engagement'],
  },
  DISTRIBUTION_TRANSPORT: {
    category: 'DISTRIBUTION_TRANSPORT',
    label: 'Cannabis Distribution & Transport Licence',
    shortLabel: 'Distribution',
    description: 'Authorize the movement of cannabis products between licensed facilities.',
    permittedActivities: 'Transportation, temporary storage, arrangement for testing, quality assurance review.',
    icon: Truck,
    tiers: [
      { value: 'STANDARD' as LicenseTier, label: 'Standard', description: 'Licensed transport operations', areaOrCapacity: 'Fleet-based' },
    ],
    requiredPersonnel: ['Responsible Person', 'Head of Security', 'Compliance Officer', 'Financial Controller'],
    siteFacilityDocKeys: ['property_deed', 'property_tax', 'utility_certificates', 'premises_blueprint', 'site_location_map', 'security_plan', 'community_engagement'],
  },
  RETAIL_DISPENSARY: {
    category: 'RETAIL_DISPENSARY',
    label: 'Cannabis Retail / Medical Dispensary Licence',
    shortLabel: 'Retail',
    description: 'Authorize the sale of approved cannabis products to patients/consumers with valid prescriptions.',
    permittedActivities: 'Dispensing medical cannabis to patients with valid prescriptions, patient counselling, inventory management.',
    icon: Store,
    tiers: [
      { value: 'MEDICAL_DISPENSARY' as LicenseTier, label: 'Medical Dispensary', description: 'Physical location for dispensing', areaOrCapacity: 'Storefront' },
      { value: 'ONLINE_MAIL_ORDER' as LicenseTier, label: 'Online / Mail-Order', description: 'Sale for medical purposes via delivery', areaOrCapacity: 'Warehouse + delivery' },
    ],
    requiredPersonnel: ['Responsible Person', 'Quality Assurance Person', 'Head of Security', 'Compliance Officer', 'Financial Controller'],
    siteFacilityDocKeys: ['property_deed', 'property_tax', 'zoning_certificate', 'utility_certificates', 'premises_blueprint', 'site_location_map', 'site_video_tour', 'security_plan', 'community_engagement'],
  },
  RESEARCH: {
    category: 'RESEARCH',
    label: 'Cannabis Research Licence',
    shortLabel: 'Research',
    description: 'Authorize the possession and use of cannabis for scientific research and clinical trials.',
    permittedActivities: 'Clinical trials, product development, genetic research, agricultural research, analytical method development.',
    icon: GraduationCap,
    tiers: [
      { value: 'RESEARCH' as LicenseTier, label: 'Research', description: 'Scientific research and clinical trials', areaOrCapacity: 'As specified in protocol' },
    ],
    requiredPersonnel: ['Responsible Person', 'Quality Assurance Person', 'Compliance Officer'],
    skipSiteFacility: true,
    siteFacilityDocKeys: ['property_deed', 'premises_blueprint', 'site_location_map'],
  },
  EXPORT_IMPORT: {
    category: 'EXPORT_IMPORT',
    label: 'Cannabis Export / Import Licence',
    shortLabel: 'Export/Import',
    description: 'Authorize the cross-border movement of cannabis or cannabis products for international trade.',
    permittedActivities: 'International export or import of cannabis products in compliance with UN conventions and bilateral agreements.',
    icon: ArrowLeftRight,
    tiers: [
      { value: 'EXPORT' as LicenseTier, label: 'Export', description: 'Exporting cannabis products', areaOrCapacity: 'Per-shipment basis' },
      { value: 'IMPORT' as LicenseTier, label: 'Import', description: 'Importing cannabis products', areaOrCapacity: 'Per-shipment basis' },
    ],
    requiredPersonnel: ['Responsible Person', 'Quality Assurance Person', 'Head of Security', 'Compliance Officer', 'Financial Controller'],
    siteFacilityDocKeys: ['property_deed', 'property_tax', 'utility_certificates', 'premises_blueprint', 'site_location_map', 'security_plan'],
  },
  INDUSTRIAL_HEMP: {
    category: 'INDUSTRIAL_HEMP',
    label: 'Industrial Hemp Licence',
    shortLabel: 'Hemp',
    description: 'Authorize the cultivation and processing of low-THC hemp (≤0.3%) for industrial purposes (fibre, textiles, construction, food).',
    permittedActivities: 'Cultivation, harvesting, and processing of hemp with THC content not exceeding 0.3%.',
    icon: Wheat,
    tiers: [
      { value: 'SMALL' as LicenseTier, label: 'Small Scale', description: 'Small hemp farming', areaOrCapacity: '1–5 acres' },
      { value: 'MEDIUM' as LicenseTier, label: 'Medium Scale', description: 'Medium hemp farming', areaOrCapacity: '5–20 acres' },
      { value: 'LARGE' as LicenseTier, label: 'Large Scale', description: 'Industrial hemp farming', areaOrCapacity: '20+ acres' },
    ],
    requiredPersonnel: ['Responsible Person', 'Quality Assurance Person', 'Head of Security', 'Compliance Officer', 'Financial Controller'],
    siteFacilityDocKeys: ['property_deed', 'property_tax', 'zoning_certificate', 'utility_certificates', 'premises_blueprint', 'site_location_map', 'site_video_tour', 'security_plan', 'eia_iee', 'epa_clearance', 'water_source', 'soil_testing', 'waste_management', 'community_engagement', 'district_admin'],
  },
  CANNABIS_DRUG: {
    category: 'CANNABIS_DRUG',
    label: 'Cannabis Drug Licence',
    shortLabel: 'Drug',
    description: 'Authorize the production of pharmaceutical drugs containing cannabis (DRAP-compliant).',
    permittedActivities: 'Manufacturing pharmaceutical-grade cannabis products in compliance with DRAP regulations.',
    icon: Pill,
    tiers: [
      { value: 'STANDARD' as LicenseTier, label: 'Standard', description: 'Pharmaceutical cannabis production', areaOrCapacity: 'As per DRAP approval' },
    ],
    requiredPersonnel: ['Responsible Person', 'Quality Assurance Person', 'Head of Security', 'Compliance Officer', 'Financial Controller'],
    siteFacilityDocKeys: ['property_deed', 'property_tax', 'utility_certificates', 'premises_blueprint', 'site_location_map', 'site_video_tour', 'security_plan', 'waste_management', 'community_engagement'],
  },
}

export function getLicenseTypeConfig(category: LicenseCategory): LicenseTypeConfig {
  return LICENSE_TYPE_CONFIGS[category]
}

export function getTierConfig(category: LicenseCategory, tier: LicenseTier): TierConfig | undefined {
  return LICENSE_TYPE_CONFIGS[category].tiers.find((t) => t.value === tier)
}
