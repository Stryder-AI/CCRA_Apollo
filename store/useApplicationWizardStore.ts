'use client'

import { create } from 'zustand'
import type {
  LicenseCategory,
  LicenseTier,
  BusinessEntity,
  OwnershipControl,
  PersonnelRecord,
  SiteFacility,
  DocumentUpload,
  TypeSpecificFields,
  FeeBreakdown,
  PaymentMethod,
  PakistanAddress,
} from '@/types/license'

const emptyAddress: PakistanAddress = {
  province: '',
  district: '',
  tehsil: '',
  city: '',
  street: '',
  postalCode: '',
}

export interface WizardState {
  // Step 1
  category: LicenseCategory | null
  tier: LicenseTier | null

  // Step 2
  businessEntity: BusinessEntity

  // Step 3
  ownershipControl: OwnershipControl
  keyPersonnel: PersonnelRecord[]

  // Step 4
  siteFacility: SiteFacility

  // Step 5
  typeSpecificFields: TypeSpecificFields | null

  // Step 6
  commonDocuments: Record<string, DocumentUpload | null>

  // Step 7
  feeBreakdown: FeeBreakdown | null
  paymentMethod: PaymentMethod | null

  // Step 8
  certificationAccepted: boolean

  // Wizard meta
  currentStep: number
  isDraft: boolean
  validationErrors: string[]
}

interface WizardActions {
  setCategory: (category: LicenseCategory) => void
  setTier: (tier: LicenseTier) => void
  setBusinessEntity: (entity: Partial<BusinessEntity>) => void
  setOwnershipControl: (ownership: Partial<OwnershipControl>) => void
  setKeyPersonnel: (personnel: PersonnelRecord[]) => void
  setSiteFacility: (facility: Partial<SiteFacility>) => void
  setTypeSpecificFields: (fields: TypeSpecificFields) => void
  setCommonDocument: (key: string, doc: DocumentUpload | null) => void
  setFeeBreakdown: (fees: FeeBreakdown) => void
  setPaymentMethod: (method: PaymentMethod) => void
  setCertification: (accepted: boolean) => void
  setCurrentStep: (step: number) => void
  setValidationErrors: (errors: string[]) => void
  clearValidationErrors: () => void
  resetWizard: () => void
  fillDemoValues: () => void
}

const initialState: WizardState = {
  category: null,
  tier: null,
  businessEntity: {
    legalEntityName: '',
    entityType: 'Company',
    secpRegistrationNumber: '',
    ntn: '',
    dateOfIncorporation: '',
    registeredAddress: { ...emptyAddress },
    businessPhone: '',
    businessEmail: '',
    website: '',
    natureOfBusiness: '',
    existingLicenses: '',
  },
  ownershipControl: {
    shareholders: [{ name: '', cnic: '', percentageOwnership: 0 }],
    ultimateBeneficialOwners: [],
    boardOfDirectors: [{ name: '', cnic: '', designation: '', appointmentDate: '' }],
    pepDeclaration: false,
  },
  keyPersonnel: [],
  siteFacility: {
    siteAddress: { ...emptyAddress },
  },
  typeSpecificFields: null,
  commonDocuments: {},
  feeBreakdown: null,
  paymentMethod: null,
  certificationAccepted: false,
  currentStep: 1,
  isDraft: false,
  validationErrors: [],
}

export const useApplicationWizardStore = create<WizardState & WizardActions>((set) => ({
  ...initialState,

  setCategory: (category) => set({ category, tier: null }),
  setTier: (tier) => set({ tier }),

  setBusinessEntity: (entity) =>
    set((state) => ({
      businessEntity: { ...state.businessEntity, ...entity },
    })),

  setOwnershipControl: (ownership) =>
    set((state) => ({
      ownershipControl: { ...state.ownershipControl, ...ownership },
    })),

  setKeyPersonnel: (personnel) => set({ keyPersonnel: personnel }),

  setSiteFacility: (facility) =>
    set((state) => ({
      siteFacility: { ...state.siteFacility, ...facility },
    })),

  setTypeSpecificFields: (fields) => set({ typeSpecificFields: fields }),

  setCommonDocument: (key, doc) =>
    set((state) => ({
      commonDocuments: { ...state.commonDocuments, [key]: doc },
    })),

  setFeeBreakdown: (fees) => set({ feeBreakdown: fees }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  setCertification: (accepted) => set({ certificationAccepted: accepted }),
  setValidationErrors: (errors) => set({ validationErrors: errors }),
  clearValidationErrors: () => set({ validationErrors: [] }),
  setCurrentStep: (step) => set({ currentStep: step, validationErrors: [] }),
  resetWizard: () => set(initialState),
  fillDemoValues: () => {
    // Lazy import to avoid circular deps and keep bundle small for non-demo users
    import('@/utils/demo-data').then((demo) => {
      set({
        category: 'CULTIVATION',
        tier: 'STANDARD_MEDIUM',
        businessEntity: demo.DEMO_BUSINESS_ENTITY,
        ownershipControl: demo.DEMO_OWNERSHIP,
        keyPersonnel: demo.DEMO_PERSONNEL,
        siteFacility: demo.DEMO_SITE_FACILITY,
        typeSpecificFields: demo.DEMO_TYPE_SPECIFIC,
        commonDocuments: demo.getDemoCommonDocuments(),
        feeBreakdown: demo.getDemoFeeBreakdown(),
        paymentMethod: demo.DEMO_PAYMENT_METHOD,
        certificationAccepted: true,
      })
    })
  },
}))
