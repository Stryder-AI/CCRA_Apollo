// ──────────────────────────────────────────────
// CCRA License Types — Comprehensive Type System
// ──────────────────────────────────────────────

// === License Categories (9 total) ===

export type LicenseCategory =
  | 'CULTIVATION'
  | 'PROCESSING_EXTRACTION'
  | 'TESTING_LABORATORY'
  | 'DISTRIBUTION_TRANSPORT'
  | 'RETAIL_DISPENSARY'
  | 'RESEARCH'
  | 'EXPORT_IMPORT'
  | 'INDUSTRIAL_HEMP'
  | 'CANNABIS_DRUG'

// === Tier / Sub-Category Types ===

export type CultivationTier = 'MICRO' | 'STANDARD_SMALL' | 'STANDARD_MEDIUM' | 'LARGE_SCALE' | 'NURSERY'
export type ProcessingTier = 'MICRO' | 'STANDARD' | 'LARGE_SCALE'
export type TestingTier = 'BASIC' | 'ISO_CERTIFIED'
export type DistributionTier = 'STANDARD'
export type RetailTier = 'MEDICAL_DISPENSARY' | 'ONLINE_MAIL_ORDER'
export type ResearchTier = 'RESEARCH'
export type ExportImportTier = 'EXPORT' | 'IMPORT'
export type HempTier = 'SMALL' | 'MEDIUM' | 'LARGE'
export type DrugTier = 'STANDARD'

export type LicenseTier =
  | CultivationTier
  | ProcessingTier
  | TestingTier
  | DistributionTier
  | RetailTier
  | ResearchTier
  | ExportImportTier
  | HempTier
  | DrugTier

// === Application Statuses (16 total) ===

export type ApplicationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW_SCREENING'
  | 'RFI_ISSUED'
  | 'UNDER_REVIEW_TECHNICAL'
  | 'SECURITY_CLEARANCE_PENDING'
  | 'INSPECTION_SCHEDULED'
  | 'INSPECTION_COMPLETE'
  | 'APPROVED'
  | 'APPROVED_WITH_CONDITIONS'
  | 'DENIED'
  | 'LAPSED'
  | 'SUSPENDED'
  | 'REVOKED'
  | 'EXPIRED'
  | 'RENEWAL_IN_PROGRESS'

// Backward-compatible alias for existing admin views
export type LicenseStatus = ApplicationStatus

// Backward-compatible alias for existing components that import LicenseType
export type LicenseType = LicenseCategory

// === Entity Types ===

export type EntityType = 'Company' | 'Partnership' | 'Sole Proprietorship' | 'Cooperative'

// === Pakistan Address ===

export interface PakistanAddress {
  province: string
  district: string
  tehsil: string
  city: string
  street: string
  postalCode: string
  gpsCoordinates?: { lat: number; lng: number }
}

// === Document Upload ===

export interface DocumentUpload {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  uploadDate: string
  status: 'pending' | 'verified' | 'rejected'
  category: string
}

// === Business Entity Information ===

export interface BusinessEntity {
  legalEntityName: string
  entityType: EntityType
  secpRegistrationNumber: string
  ntn: string
  dateOfIncorporation: string
  registeredAddress: PakistanAddress
  businessPhone: string
  businessEmail: string
  website?: string
  natureOfBusiness: string
  existingLicenses?: string
}

// === Ownership & Control ===

export interface ShareholderRecord {
  name: string
  cnic: string
  percentageOwnership: number
}

export interface UBORecord {
  name: string
  cnic: string
  nationality: string
  percentageOwnership: number
}

export interface DirectorRecord {
  name: string
  cnic: string
  designation: string
  appointmentDate: string
}

export interface OwnershipControl {
  shareholders: ShareholderRecord[]
  ultimateBeneficialOwners: UBORecord[]
  boardOfDirectors: DirectorRecord[]
  organizationalChart?: DocumentUpload
  pepDeclaration: boolean
  pepDetails?: string
}

// === Key Personnel ===

export type PersonnelRole =
  | 'Responsible Person'
  | 'Quality Assurance Person'
  | 'Head of Security'
  | 'Master Grower / Operations Manager'
  | 'Compliance Officer'
  | 'Financial Controller'

export interface PersonnelRecord {
  role: PersonnelRole
  name: string
  cnic: string
  phone: string
  email: string
  qualifications: string
  photo?: DocumentUpload
  cv?: DocumentUpload
  certificates?: DocumentUpload[]
  references?: DocumentUpload[]
  backgroundCheckConsent: boolean
}

// === Site & Facility ===

export interface SiteFacility {
  siteAddress: PakistanAddress
  propertyDeed?: DocumentUpload
  propertyTaxCertificate?: DocumentUpload
  zoningCertificate?: DocumentUpload
  utilityCertificates?: DocumentUpload
  premisesBlueprint?: DocumentUpload
  siteLocationMap?: DocumentUpload
  siteVideoTour?: DocumentUpload
  securityPlan?: DocumentUpload
  environmentalImpactAssessment?: DocumentUpload
  environmentalClearance?: DocumentUpload
  waterSourceVerification?: DocumentUpload
  soilTestingReport?: DocumentUpload
  wasteManagementPlan?: DocumentUpload
  communityEngagementPlan?: DocumentUpload
  districtAdminApproval?: DocumentUpload
}

// === License-Type-Specific Fields ===

export interface CultivationSpecific {
  totalCultivationArea: number
  cultivationType: 'Indoor' | 'Outdoor' | 'Greenhouse'
  numberOfGrowingRooms?: number
  plantCanopyArea?: number
  irrigationType: string
  seedCloneSource: string
  cannabisStrains: string[]
  expectedAnnualHarvest: number
  dryingFacilityDescription: string
  propagationDetails?: string
}

export interface ProcessingSpecific {
  processingMethods: string[]
  solventsUsed?: string
  dailyProcessingCapacity: number
  productTypes: string[]
  equipmentList?: DocumentUpload
  chemicalStorageSpecs?: string
}

export interface TestingLabSpecific {
  testingCapabilities: string[]
  isoAccreditationStatus: 'Accredited' | 'In Progress' | 'Not Started'
  isoAccreditationDoc?: DocumentUpload
  equipmentInventory?: DocumentUpload
  testingMethods?: DocumentUpload
  qcProcedures?: DocumentUpload
  proficiencyRecords?: DocumentUpload
  headOfLabCV?: DocumentUpload
  labDirectorQualifications?: DocumentUpload
}

export interface DistributionSpecific {
  vehicleFleet: {
    vehicleType: string
    registrationNumber: string
    gpsTrackingId: string
  }[]
  transportRoutes: string
  temporaryStorageAddress?: string
  insuranceCoverage: string
  driverDetails: {
    name: string
    cnic: string
    driverLicenseNumber: string
  }[]
}

export interface RetailSpecific {
  storeAddress: PakistanAddress
  operatingHours: string
  medicalPractitionerName: string
  medicalPractitionerPMDC: string
  medicalPractitionerSpecialization: string
  prescriptionVerificationSystem: string
  posSystem: string
  ageVerificationProcedure: string
  inventoryManagementSystem: string
  patientDataProtectionPlan?: DocumentUpload
}

export interface ResearchSpecific {
  institutionName: string
  principalInvestigator: string
  piQualifications: string
  piCV?: DocumentUpload
  researchProtocol?: DocumentUpload
  researchObjectives: string
  researchType: 'Clinical Trial' | 'Agricultural' | 'Product Development' | 'Genetic' | 'Analytical'
  ethicsApproval?: DocumentUpload
  fundingSource: string
  expectedStartDate: string
  expectedEndDate: string
  cannabisQuantityRequired: string
}

export interface ExportImportSpecific {
  direction: 'Export' | 'Import'
  destinationOrOriginCountry: string
  productType: string
  quantity: string
  purpose: 'Medical' | 'Scientific' | 'Industrial'
  entityDetails: string
  bilateralAgreementReference?: string
  incbReference: string
}

export interface HempSpecific {
  hempVariety: string
  thcCertification?: DocumentUpload
  intendedUse: 'Fibre' | 'Seed' | 'Oil' | 'Construction' | 'Textile' | 'Food' | 'Other'
  cultivationArea: number
  expectedYield: string
}

export interface DrugSpecific {
  drapComplianceDetails: string
  drugFormulation: string
  clinicalTrialData?: string
}

export type TypeSpecificFields =
  | { category: 'CULTIVATION'; data: CultivationSpecific }
  | { category: 'PROCESSING_EXTRACTION'; data: ProcessingSpecific }
  | { category: 'TESTING_LABORATORY'; data: TestingLabSpecific }
  | { category: 'DISTRIBUTION_TRANSPORT'; data: DistributionSpecific }
  | { category: 'RETAIL_DISPENSARY'; data: RetailSpecific }
  | { category: 'RESEARCH'; data: ResearchSpecific }
  | { category: 'EXPORT_IMPORT'; data: ExportImportSpecific }
  | { category: 'INDUSTRIAL_HEMP'; data: HempSpecific }
  | { category: 'CANNABIS_DRUG'; data: DrugSpecific }

// === Fee Breakdown ===

export interface FeeBreakdown {
  applicationFee: number
  licenseFee: number
  securityClearanceFee: number
  trackAndTraceSetup: number
  inspectionFee: number
  totalDueNow: number
  totalFirstYear: number
  annualRenewalPreview: number
  trackAndTraceMonthly: number
}

// === Payment ===

export type PaymentMethod =
  | 'Online Payment'
  | 'Bank Transfer'
  | 'Cheque'
  | 'Money Order'
  | 'Cash Deposit'
  | 'RAAST'

// === Comprehensive License Application ===

export interface LicenseApplication {
  id: string
  applicationReferenceNumber: string
  category: LicenseCategory
  tier: LicenseTier
  status: ApplicationStatus
  businessEntity: BusinessEntity
  ownershipControl: OwnershipControl
  keyPersonnel: PersonnelRecord[]
  siteFacility: SiteFacility
  commonDocuments: DocumentUpload[]
  typeSpecificFields?: TypeSpecificFields
  typeSpecificDocuments?: DocumentUpload[]
  feeBreakdown: FeeBreakdown
  paymentMethod?: PaymentMethod
  certificationAccepted: boolean
  submittedDate?: string
  lastModifiedDate: string
  currentPhase: string
}

// === License (Issued) ===

export interface License {
  id: string
  licenseNumber: string
  category: LicenseCategory
  tier: LicenseTier
  status: ApplicationStatus
  applicantName: string
  companyName: string
  entityType: EntityType
  region: string
  province: string
  applicationDate: string
  issueDate?: string
  expiryDate?: string
  feePaidPKR: number
  linkedFarmId?: string
  documents: string[]
  notes?: string
  secpNumber?: string
  ntn?: string
  applicationId?: string

  // Backward compat — old code references these
  type?: LicenseCategory
}
