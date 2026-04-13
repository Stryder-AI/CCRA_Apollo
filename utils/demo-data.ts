import type {
  BusinessEntity,
  OwnershipControl,
  PersonnelRecord,
  SiteFacility,
  TypeSpecificFields,
  DocumentUpload,
  FeeBreakdown,
  PaymentMethod,
} from '@/types/license'
import { calculateFees } from '@/utils/fees'
import { COMMON_DOCUMENTS } from '@/config/constants'

function mockDoc(category: string, name: string): DocumentUpload {
  return {
    id: crypto.randomUUID(),
    fileName: `${name.replace(/\s/g, '_')}.pdf`,
    fileType: 'application/pdf',
    fileSize: Math.floor(200000 + Math.random() * 800000),
    uploadDate: new Date().toISOString(),
    status: 'verified',
    category,
  }
}

export const DEMO_BUSINESS_ENTITY: BusinessEntity = {
  legalEntityName: 'Tirah Valley Cannabis Corp (Pvt.) Ltd.',
  entityType: 'Company',
  secpRegistrationNumber: '0123456-7',
  ntn: '1234567-8',
  dateOfIncorporation: '2022-03-15',
  registeredAddress: {
    province: 'Khyber Pakhtunkhwa',
    district: 'Khyber',
    tehsil: 'Bara',
    city: 'Bara',
    street: 'Plot 12, Industrial Zone, Main GT Road',
    postalCode: '25100',
  },
  businessPhone: '+92 91 5701234',
  businessEmail: 'info@tirahvalleycannabis.pk',
  website: 'https://tirahvalleycannabis.pk',
  natureOfBusiness: 'Cultivation, processing, and export of medicinal cannabis and cannabis-derived products in compliance with CCRA regulations.',
  existingLicenses: 'None — first-time applicant',
}

export const DEMO_OWNERSHIP: OwnershipControl = {
  shareholders: [
    { name: 'Khan Muhammad Afridi', cnic: '17301-1234567-1', percentageOwnership: 51 },
    { name: 'Dr. Ayesha Siddiqui', cnic: '42201-7654321-2', percentageOwnership: 30 },
    { name: 'Haji Noor Zaman', cnic: '17301-9876543-3', percentageOwnership: 19 },
  ],
  ultimateBeneficialOwners: [
    { name: 'Khan Muhammad Afridi', cnic: '17301-1234567-1', nationality: 'Pakistani', percentageOwnership: 51 },
  ],
  boardOfDirectors: [
    { name: 'Khan Muhammad Afridi', cnic: '17301-1234567-1', designation: 'Chairman & CEO', appointmentDate: '2022-03-15' },
    { name: 'Dr. Ayesha Siddiqui', cnic: '42201-7654321-2', designation: 'Director — Research & Quality', appointmentDate: '2022-03-15' },
    { name: 'Barrister Usman Shah', cnic: '17301-5555555-5', designation: 'Independent Director — Legal & Compliance', appointmentDate: '2023-01-10' },
  ],
  pepDeclaration: false,
}

export const DEMO_PERSONNEL: PersonnelRecord[] = [
  {
    role: 'Responsible Person',
    name: 'Khan Muhammad Afridi',
    cnic: '17301-1234567-1',
    phone: '+92 300 1234567',
    email: 'khan.afridi@tirahvalleycannabis.pk',
    qualifications: 'MBA — Peshawar Business School, 15 years in agricultural enterprise management',
    backgroundCheckConsent: true,
  },
  {
    role: 'Quality Assurance Person',
    name: 'Dr. Ayesha Siddiqui',
    cnic: '42201-7654321-2',
    phone: '+92 321 7654321',
    email: 'dr.ayesha@tirahvalleycannabis.pk',
    qualifications: 'Ph.D. Pharmaceutical Chemistry — University of Karachi, ISO 17025 Lead Auditor',
    backgroundCheckConsent: true,
  },
  {
    role: 'Head of Security',
    name: 'Major (R) Tariq Zaman',
    cnic: '17301-8888888-8',
    phone: '+92 333 8888888',
    email: 'security@tirahvalleycannabis.pk',
    qualifications: 'Retired Pakistan Army, 20 years military service, Private Security License PSL-KPK-2024-0456',
    backgroundCheckConsent: true,
  },
  {
    role: 'Master Grower / Operations Manager',
    name: 'Fazal Rehman Shinwari',
    cnic: '17301-6666666-6',
    phone: '+92 345 6666666',
    email: 'grower@tirahvalleycannabis.pk',
    qualifications: 'B.Sc. Agriculture — Agricultural University Peshawar, 10 years cannabis cultivation experience (licensed operations in Canada 2016-2022)',
    backgroundCheckConsent: true,
  },
  {
    role: 'Compliance Officer',
    name: 'Barrister Usman Shah',
    cnic: '17301-5555555-5',
    phone: '+92 311 5555555',
    email: 'compliance@tirahvalleycannabis.pk',
    qualifications: 'LL.B — University of London, LL.M — LUMS, Certified Compliance Professional (ICA)',
    backgroundCheckConsent: true,
  },
  {
    role: 'Financial Controller',
    name: 'Ahmed Nawaz Khan',
    cnic: '17301-4444444-4',
    phone: '+92 322 4444444',
    email: 'finance@tirahvalleycannabis.pk',
    qualifications: 'ACCA (UK), Fellow Member ICAP, 12 years in pharmaceutical sector financial management',
    backgroundCheckConsent: true,
  },
]

export const DEMO_SITE_FACILITY: SiteFacility = {
  siteAddress: {
    province: 'Khyber Pakhtunkhwa',
    district: 'Khyber',
    tehsil: 'Bara',
    city: 'Tirah Valley',
    street: 'Survey Plot No. 45-B, Tirah Valley Agricultural Zone',
    postalCode: '25110',
    gpsCoordinates: { lat: 33.9244, lng: 70.9862 },
  },
}

export const DEMO_TYPE_SPECIFIC: TypeSpecificFields = {
  category: 'CULTIVATION',
  data: {
    totalCultivationArea: 25,
    cultivationType: 'Greenhouse',
    numberOfGrowingRooms: 8,
    plantCanopyArea: 18,
    irrigationType: 'Drip Irrigation',
    seedCloneSource: 'Certified seed bank — Bedrocan International (Netherlands), under INCB Article 12 import license',
    cannabisStrains: ['Tirah Haze', 'Hindu Kush', 'Swat Valley Purple'],
    expectedAnnualHarvest: 5000,
    dryingFacilityDescription: 'Climate-controlled drying rooms (2x 200 sqm) with HVAC dehumidification, temperature maintained at 18-22 C, humidity 45-55%. Capacity: 2,500 kg per cycle.',
    propagationDetails: 'On-site nursery propagation facility with mother room (50 sqm) for maintaining genetic stock. Cloning capacity: 5,000 clones per month.',
  },
}

export function getDemoCommonDocuments(): Record<string, DocumentUpload | null> {
  const docs: Record<string, DocumentUpload | null> = {}
  COMMON_DOCUMENTS.forEach((doc) => {
    docs[doc.key] = mockDoc(doc.key, doc.label)
  })
  return docs
}

export function getDemoFeeBreakdown(): FeeBreakdown {
  return calculateFees('CULTIVATION', 'STANDARD_MEDIUM', DEMO_PERSONNEL.length)
}

export const DEMO_PAYMENT_METHOD: PaymentMethod = 'Bank Transfer'
