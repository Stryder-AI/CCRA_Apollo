export type LicenseType = 'Cultivation' | 'Extraction' | 'Manufacturing' | 'Sales & Distribution'

export type LicenseStatus = 'active' | 'pending' | 'expired' | 'suspended' | 'revoked' | 'under-review' | 'approved' | 'rejected'

export interface License {
  id: string
  licenseNumber: string
  type: LicenseType
  applicantName: string
  companyName: string
  region: string
  status: LicenseStatus
  applicationDate: string
  issueDate?: string
  expiryDate?: string
  feePaidPKR: number
  linkedFarmId?: string
  documents: string[]
  notes?: string
}

export interface LicenseApplication {
  id: string
  applicantName: string
  companyName: string
  cnic: string
  phone: string
  email: string
  licenseType: LicenseType
  region: string
  proposedArea?: number
  status: LicenseStatus
  submittedDate: string
  documents: string[]
}
