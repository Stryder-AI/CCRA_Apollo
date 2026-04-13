import type { LicenseCategory, ApplicationStatus } from '@/types/license'

export const APP_NAME = 'CCRA Intelligence Nexus'
export const APP_VERSION = '0.2.0'
export const ORGANIZATION = 'Cannabis Control & Regulatory Authority'
export const ORGANIZATION_SHORT = 'CCRA'
export const BUILT_BY = 'TechGIS — Technology & GIS Solutions'
export const POWERED_BY = 'STRYDE'

export const MAP_CENTER: [number, number] = [30.3753, 69.3451]
export const MAP_ZOOM = 6

export const TILE_URLS = {
  light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
}

export const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'

// === Regions (backward compat) ===

export const REGIONS = [
  'Tirah Valley', 'Swat', 'Dir', 'Chitral', 'Malakand', 'Buner',
  'Zhob', 'Quetta', 'Chagai', 'Panjgur', 'Khuzdar',
] as const

export const KP_REGIONS = ['Tirah Valley', 'Swat', 'Dir', 'Chitral', 'Malakand', 'Buner'] as const
export const BALOCHISTAN_REGIONS = ['Zhob', 'Quetta', 'Chagai', 'Panjgur', 'Khuzdar'] as const

// === Strains ===

export const STRAINS = [
  'Pakistani Landrace',
  'Peshawar Purple',
  'Balochi Gold',
  'Tirah Valley Green',
  'Swat Valley Kush',
  'Hindu Kush',
  'Chitral Purple',
  'Malakand Express',
  'Industrial Hemp (CBD)',
  'Medicinal Grade A',
] as const

// === Entity Types ===

export const ENTITY_TYPES = [
  'Company',
  'Partnership',
  'Sole Proprietorship',
  'Cooperative',
] as const

// === License Categories ===

export const LICENSE_CATEGORIES: { value: LicenseCategory; label: string; description: string }[] = [
  { value: 'CULTIVATION', label: 'Cannabis Cultivation', description: 'Growing of cannabis plants for medicinal, industrial, or scientific purposes' },
  { value: 'PROCESSING_EXTRACTION', label: 'Processing & Extraction', description: 'Transformation of raw cannabis into extracts, oils, concentrates' },
  { value: 'TESTING_LABORATORY', label: 'Testing Laboratory', description: 'Third-party quality assurance testing on cannabis products' },
  { value: 'DISTRIBUTION_TRANSPORT', label: 'Distribution & Transport', description: 'Movement of cannabis products between licensed facilities' },
  { value: 'RETAIL_DISPENSARY', label: 'Retail / Medical Dispensary', description: 'Sale of approved cannabis products to patients with prescriptions' },
  { value: 'RESEARCH', label: 'Research', description: 'Possession and use of cannabis for scientific research and clinical trials' },
  { value: 'EXPORT_IMPORT', label: 'Export / Import', description: 'Cross-border movement of cannabis products for international trade' },
  { value: 'INDUSTRIAL_HEMP', label: 'Industrial Hemp', description: 'Cultivation and processing of low-THC hemp (≤0.3%) for industrial purposes' },
  { value: 'CANNABIS_DRUG', label: 'Cannabis Drug', description: 'Production of pharmaceutical drugs containing cannabis (DRAP-compliant)' },
]

// === Fee Schedule (Tiered, in PKR) ===

export interface FeeScheduleEntry {
  applicationFee: number
  licenseFee: number
  annualRenewal: number
  totalFirstYear: number
}

export const FEE_SCHEDULE: Record<LicenseCategory, Record<string, FeeScheduleEntry>> = {
  CULTIVATION: {
    MICRO: { applicationFee: 25000, licenseFee: 100000, annualRenewal: 80000, totalFirstYear: 125000 },
    STANDARD_SMALL: { applicationFee: 35000, licenseFee: 150000, annualRenewal: 120000, totalFirstYear: 185000 },
    STANDARD_MEDIUM: { applicationFee: 50000, licenseFee: 250000, annualRenewal: 200000, totalFirstYear: 300000 },
    LARGE_SCALE: { applicationFee: 75000, licenseFee: 400000, annualRenewal: 300000, totalFirstYear: 475000 },
    NURSERY: { applicationFee: 25000, licenseFee: 100000, annualRenewal: 80000, totalFirstYear: 125000 },
  },
  PROCESSING_EXTRACTION: {
    MICRO: { applicationFee: 30000, licenseFee: 200000, annualRenewal: 150000, totalFirstYear: 230000 },
    STANDARD: { applicationFee: 50000, licenseFee: 350000, annualRenewal: 250000, totalFirstYear: 400000 },
    LARGE_SCALE: { applicationFee: 75000, licenseFee: 500000, annualRenewal: 400000, totalFirstYear: 575000 },
  },
  TESTING_LABORATORY: {
    BASIC: { applicationFee: 50000, licenseFee: 300000, annualRenewal: 250000, totalFirstYear: 350000 },
    ISO_CERTIFIED: { applicationFee: 50000, licenseFee: 500000, annualRenewal: 400000, totalFirstYear: 550000 },
  },
  DISTRIBUTION_TRANSPORT: {
    STANDARD: { applicationFee: 30000, licenseFee: 150000, annualRenewal: 100000, totalFirstYear: 180000 },
  },
  RETAIL_DISPENSARY: {
    MEDICAL_DISPENSARY: { applicationFee: 40000, licenseFee: 300000, annualRenewal: 250000, totalFirstYear: 340000 },
    ONLINE_MAIL_ORDER: { applicationFee: 30000, licenseFee: 200000, annualRenewal: 150000, totalFirstYear: 230000 },
  },
  RESEARCH: {
    RESEARCH: { applicationFee: 0, licenseFee: 50000, annualRenewal: 25000, totalFirstYear: 50000 },
  },
  EXPORT_IMPORT: {
    EXPORT: { applicationFee: 50000, licenseFee: 0, annualRenewal: 0, totalFirstYear: 50000 },
    IMPORT: { applicationFee: 50000, licenseFee: 0, annualRenewal: 0, totalFirstYear: 50000 },
  },
  INDUSTRIAL_HEMP: {
    SMALL: { applicationFee: 15000, licenseFee: 75000, annualRenewal: 50000, totalFirstYear: 90000 },
    MEDIUM: { applicationFee: 25000, licenseFee: 150000, annualRenewal: 100000, totalFirstYear: 175000 },
    LARGE: { applicationFee: 50000, licenseFee: 300000, annualRenewal: 200000, totalFirstYear: 350000 },
  },
  CANNABIS_DRUG: {
    STANDARD: { applicationFee: 75000, licenseFee: 500000, annualRenewal: 400000, totalFirstYear: 575000 },
  },
}

// === Additional Fees ===

export const ADDITIONAL_FEES = {
  securityClearancePerPerson: 5000,
  expeditedProcessingPerPerson: 10000,
  annualInspection: 15000,
  reInspection: 10000,
  licenseModification: 5000,
  duplicateCopy: 500,
  verificationLetter: 1000,
  addressChange: 2000,
  ownershipChange: 5000,
  licenseTransfer: 25000,
  suspensionAppeal: 10000,
  perShipmentFee: 25000,
}

export const TRACK_AND_TRACE_FEES: Record<string, { setup: number; monthly: number }> = {
  CULTIVATION: { setup: 5000, monthly: 2000 },
  PROCESSING_EXTRACTION: { setup: 5000, monthly: 2500 },
  TESTING_LABORATORY: { setup: 3000, monthly: 1500 },
  DISTRIBUTION_TRANSPORT: { setup: 3000, monthly: 1500 },
  RETAIL_DISPENSARY: { setup: 2000, monthly: 1000 },
  RESEARCH: { setup: 0, monthly: 0 },
  EXPORT_IMPORT: { setup: 3000, monthly: 1500 },
  INDUSTRIAL_HEMP: { setup: 5000, monthly: 2000 },
  CANNABIS_DRUG: { setup: 5000, monthly: 2500 },
}

// === Application Status Config ===

export const APPLICATION_STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; bgColor: string; borderColor: string; phase: string }> = {
  DRAFT: { label: 'Draft', color: '#6b7280', bgColor: 'rgba(107, 114, 128, 0.12)', borderColor: '#6b7280', phase: 'Pre-Application' },
  SUBMITTED: { label: 'Submitted', color: '#2563eb', bgColor: 'rgba(59, 130, 246, 0.12)', borderColor: '#3b82f6', phase: 'Submission' },
  UNDER_REVIEW_SCREENING: { label: 'Under Review — Screening', color: '#7c3aed', bgColor: 'rgba(124, 58, 237, 0.12)', borderColor: '#8b5cf6', phase: 'Screening' },
  RFI_ISSUED: { label: 'RFI Issued', color: '#d97706', bgColor: 'rgba(217, 119, 6, 0.12)', borderColor: '#f59e0b', phase: 'Screening' },
  UNDER_REVIEW_TECHNICAL: { label: 'Under Review — Technical', color: '#7c3aed', bgColor: 'rgba(124, 58, 237, 0.12)', borderColor: '#8b5cf6', phase: 'Technical Review' },
  SECURITY_CLEARANCE_PENDING: { label: 'Security Clearance Pending', color: '#0891b2', bgColor: 'rgba(8, 145, 178, 0.12)', borderColor: '#06b6d4', phase: 'Background Checks' },
  INSPECTION_SCHEDULED: { label: 'Inspection Scheduled', color: '#0891b2', bgColor: 'rgba(8, 145, 178, 0.12)', borderColor: '#06b6d4', phase: 'Inspection' },
  INSPECTION_COMPLETE: { label: 'Inspection Complete', color: '#0d9488', bgColor: 'rgba(13, 148, 136, 0.12)', borderColor: '#14b8a6', phase: 'Inspection' },
  APPROVED: { label: 'Approved', color: '#16a34a', bgColor: 'rgba(34, 197, 94, 0.15)', borderColor: '#22c55e', phase: 'Decision' },
  APPROVED_WITH_CONDITIONS: { label: 'Approved with Conditions', color: '#16a34a', bgColor: 'rgba(34, 197, 94, 0.10)', borderColor: '#86efac', phase: 'Decision' },
  DENIED: { label: 'Denied', color: '#dc2626', bgColor: 'rgba(239, 68, 68, 0.12)', borderColor: '#ef4444', phase: 'Decision' },
  LAPSED: { label: 'Lapsed', color: '#9ca3af', bgColor: 'rgba(156, 163, 175, 0.12)', borderColor: '#d1d5db', phase: 'Closed' },
  SUSPENDED: { label: 'Suspended', color: '#dc2626', bgColor: 'rgba(239, 68, 68, 0.12)', borderColor: '#ef4444', phase: 'Enforcement' },
  REVOKED: { label: 'Revoked', color: '#4b5563', bgColor: 'rgba(107, 114, 128, 0.12)', borderColor: '#6b7280', phase: 'Enforcement' },
  EXPIRED: { label: 'Expired', color: '#9ca3af', bgColor: 'rgba(156, 163, 175, 0.12)', borderColor: '#d1d5db', phase: 'Closed' },
  RENEWAL_IN_PROGRESS: { label: 'Renewal in Progress', color: '#2563eb', bgColor: 'rgba(59, 130, 246, 0.12)', borderColor: '#3b82f6', phase: 'Renewal' },
}

// Backward-compatible STATUS_COLORS
export const STATUS_COLORS: Record<string, { bg: string; text: string; darkText: string; border: string }> = {
  active: { bg: 'rgba(34, 197, 94, 0.15)', text: '#16a34a', darkText: '#4ade80', border: '#22c55e' },
  pending: { bg: 'rgba(234, 179, 8, 0.15)', text: '#a16207', darkText: '#facc15', border: '#eab308' },
  suspended: { bg: 'rgba(239, 68, 68, 0.12)', text: '#dc2626', darkText: '#f87171', border: '#ef4444' },
  revoked: { bg: 'rgba(107, 114, 128, 0.12)', text: '#4b5563', darkText: '#9ca3af', border: '#6b7280' },
  expired: { bg: 'rgba(107, 114, 128, 0.12)', text: '#4b5563', darkText: '#9ca3af', border: '#6b7280' },
  'under-review': { bg: 'rgba(59, 130, 246, 0.12)', text: '#2563eb', darkText: '#60a5fa', border: '#3b82f6' },
  approved: { bg: 'rgba(34, 197, 94, 0.15)', text: '#16a34a', darkText: '#4ade80', border: '#22c55e' },
  rejected: { bg: 'rgba(239, 68, 68, 0.12)', text: '#dc2626', darkText: '#f87171', border: '#ef4444' },
  // New statuses mapped
  DRAFT: { bg: 'rgba(107, 114, 128, 0.12)', text: '#6b7280', darkText: '#9ca3af', border: '#6b7280' },
  SUBMITTED: { bg: 'rgba(59, 130, 246, 0.12)', text: '#2563eb', darkText: '#60a5fa', border: '#3b82f6' },
  UNDER_REVIEW_SCREENING: { bg: 'rgba(124, 58, 237, 0.12)', text: '#7c3aed', darkText: '#a78bfa', border: '#8b5cf6' },
  RFI_ISSUED: { bg: 'rgba(217, 119, 6, 0.12)', text: '#d97706', darkText: '#fbbf24', border: '#f59e0b' },
  UNDER_REVIEW_TECHNICAL: { bg: 'rgba(124, 58, 237, 0.12)', text: '#7c3aed', darkText: '#a78bfa', border: '#8b5cf6' },
  SECURITY_CLEARANCE_PENDING: { bg: 'rgba(8, 145, 178, 0.12)', text: '#0891b2', darkText: '#22d3ee', border: '#06b6d4' },
  INSPECTION_SCHEDULED: { bg: 'rgba(8, 145, 178, 0.12)', text: '#0891b2', darkText: '#22d3ee', border: '#06b6d4' },
  INSPECTION_COMPLETE: { bg: 'rgba(13, 148, 136, 0.12)', text: '#0d9488', darkText: '#2dd4bf', border: '#14b8a6' },
  APPROVED: { bg: 'rgba(34, 197, 94, 0.15)', text: '#16a34a', darkText: '#4ade80', border: '#22c55e' },
  APPROVED_WITH_CONDITIONS: { bg: 'rgba(34, 197, 94, 0.10)', text: '#16a34a', darkText: '#86efac', border: '#86efac' },
  DENIED: { bg: 'rgba(239, 68, 68, 0.12)', text: '#dc2626', darkText: '#f87171', border: '#ef4444' },
  LAPSED: { bg: 'rgba(156, 163, 175, 0.12)', text: '#9ca3af', darkText: '#d1d5db', border: '#d1d5db' },
  SUSPENDED: { bg: 'rgba(239, 68, 68, 0.12)', text: '#dc2626', darkText: '#f87171', border: '#ef4444' },
  REVOKED: { bg: 'rgba(107, 114, 128, 0.12)', text: '#4b5563', darkText: '#9ca3af', border: '#6b7280' },
  EXPIRED: { bg: 'rgba(156, 163, 175, 0.12)', text: '#9ca3af', darkText: '#d1d5db', border: '#d1d5db' },
  RENEWAL_IN_PROGRESS: { bg: 'rgba(59, 130, 246, 0.12)', text: '#2563eb', darkText: '#60a5fa', border: '#3b82f6' },
}

// === Key Personnel Roles ===

export const KEY_PERSONNEL_ROLES = [
  'Responsible Person',
  'Quality Assurance Person',
  'Head of Security',
  'Master Grower / Operations Manager',
  'Compliance Officer',
  'Financial Controller',
] as const

// === Common Documents (12 items — required for all license types) ===

export const COMMON_DOCUMENTS = [
  { key: 'secp_certificate', label: 'SECP Certificate of Incorporation', required: true, format: 'PDF' },
  { key: 'articles_association', label: 'Articles of Association / Partnership Deed', required: true, format: 'PDF' },
  { key: 'board_resolution', label: 'Board Resolution', required: true, format: 'PDF' },
  { key: 'fbr_ntn_certificate', label: 'FBR NTN Certificate', required: true, format: 'PDF' },
  { key: 'tax_returns', label: 'Tax Returns (Last 2 Years)', required: true, format: 'PDF' },
  { key: 'financial_statements', label: 'Audited Financial Statements (Last 2 Years)', required: true, format: 'PDF' },
  { key: 'bank_statements', label: 'Bank Statements (Last 3 Months)', required: true, format: 'PDF' },
  { key: 'bank_reference', label: 'Bank Reference Letter', required: true, format: 'PDF' },
  { key: 'startup_capital', label: 'Proof of Startup Capital', required: true, format: 'PDF' },
  { key: 'business_plan', label: 'Business Plan', required: true, format: 'PDF' },
  { key: 'aml_kyc', label: 'AML/KYC Documentation', required: true, format: 'PDF' },
  { key: 'conflict_of_interest', label: 'Conflict of Interest Declaration', required: true, format: 'PDF' },
] as const

// === Site & Facility Documents ===

export const SITE_FACILITY_DOCUMENTS = [
  { key: 'property_deed', label: 'Property Deed or Registered Lease', required: true, format: 'PDF' },
  { key: 'property_tax', label: 'Property Tax Certificate', required: true, format: 'PDF' },
  { key: 'zoning_certificate', label: 'Zoning Certificate', required: true, format: 'PDF', applicableTo: ['CULTIVATION', 'PROCESSING_EXTRACTION', 'RETAIL_DISPENSARY', 'INDUSTRIAL_HEMP'] as LicenseCategory[] },
  { key: 'utility_certificates', label: 'Utility Connection Certificates', required: true, format: 'PDF' },
  { key: 'premises_blueprint', label: 'Premises Diagram / Blueprint', required: true, format: 'PDF/CAD' },
  { key: 'site_location_map', label: 'Site Location Map (GPS)', required: true, format: 'PDF/Image' },
  { key: 'site_video_tour', label: 'Site Video Tour', required: true, format: 'MP4', applicableTo: ['CULTIVATION', 'PROCESSING_EXTRACTION', 'TESTING_LABORATORY', 'RETAIL_DISPENSARY', 'INDUSTRIAL_HEMP'] as LicenseCategory[] },
  { key: 'security_plan', label: 'Facility Security Plan', required: true, format: 'PDF' },
  { key: 'eia_iee', label: 'Environmental Impact Assessment (EIA/IEE)', required: true, format: 'PDF', applicableTo: ['CULTIVATION', 'PROCESSING_EXTRACTION', 'INDUSTRIAL_HEMP'] as LicenseCategory[] },
  { key: 'epa_clearance', label: 'Environmental Clearance (NOC)', required: true, format: 'PDF', applicableTo: ['CULTIVATION', 'PROCESSING_EXTRACTION', 'INDUSTRIAL_HEMP'] as LicenseCategory[] },
  { key: 'water_source', label: 'Water Source Verification', required: true, format: 'PDF', applicableTo: ['CULTIVATION', 'PROCESSING_EXTRACTION', 'INDUSTRIAL_HEMP'] as LicenseCategory[] },
  { key: 'soil_testing', label: 'Soil Testing Report', required: true, format: 'PDF', applicableTo: ['CULTIVATION', 'INDUSTRIAL_HEMP'] as LicenseCategory[] },
  { key: 'waste_management', label: 'Waste Management Plan', required: true, format: 'PDF', applicableTo: ['CULTIVATION', 'PROCESSING_EXTRACTION', 'TESTING_LABORATORY', 'INDUSTRIAL_HEMP'] as LicenseCategory[] },
  { key: 'community_engagement', label: 'Community Engagement Plan', required: true, format: 'PDF' },
  { key: 'district_admin', label: 'District Administration Approval', required: false, format: 'PDF' },
] as const

// === Processing Methods ===

export const PROCESSING_METHODS = [
  'CO2 Extraction',
  'Ethanol Extraction',
  'Hydrocarbon Extraction',
  'Mechanical Processing',
  'Other',
] as const

// === Product Types ===

export const PRODUCT_TYPES = [
  'Oil',
  'Tincture',
  'Capsule',
  'Topical',
  'Edible',
  'Other',
] as const

// === Testing Capabilities ===

export const TESTING_CAPABILITIES = [
  'Potency (THC/CBD)',
  'Heavy Metals',
  'Microbial Contaminants',
  'Pesticide Residues',
  'Residual Solvents',
  'Terpene Profile',
  'Moisture Content',
  'Foreign Material',
] as const

// === Irrigation Types ===

export const IRRIGATION_TYPES = [
  'Drip Irrigation',
  'Flood Irrigation',
  'Sprinkler System',
  'Canal Irrigation',
  'Tube Well',
  'Rain-fed',
  'Other',
] as const

// === Hemp Intended Uses ===

export const HEMP_USES = [
  'Fibre',
  'Seed',
  'Oil',
  'Construction',
  'Textile',
  'Food',
  'Other',
] as const

// === Research Types ===

export const RESEARCH_TYPES = [
  'Clinical Trial',
  'Agricultural',
  'Product Development',
  'Genetic',
  'Analytical',
] as const

// === Payment Methods ===

export const PAYMENT_METHODS = [
  'Online Payment',
  'Bank Transfer',
  'Cheque',
  'Money Order',
  'Cash Deposit',
  'RAAST',
] as const
