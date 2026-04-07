import { AiReviewFlag } from '@/components/ai/AiReviewPanel'

export interface LicenseAiReview {
  licenseId: string
  verdict: 'pass' | 'fail' | 'review'
  riskScore: number
  flags: AiReviewFlag[]
  recommendation: string
  reviewDate: string
  documentCompleteness: { doc: string; status: 'verified' | 'missing' | 'incomplete' }[]
}

export const licenseReviews: Record<string, LicenseAiReview> = {
  l001: {
    licenseId: 'l001',
    verdict: 'pass',
    riskScore: 12,
    flags: [
      { label: 'Documents Complete', severity: 'pass' },
      { label: 'Land Title Verified', severity: 'pass' },
      { label: 'No Prior Violations', severity: 'pass' },
      { label: 'Region Eligible', severity: 'pass' },
    ],
    recommendation: 'Application meets all regulatory requirements. Applicant has clean compliance history with a score of 92%. Land title verified against provincial records. Recommend approval with standard monitoring schedule.',
    reviewDate: '2025-06-10',
    documentCompleteness: [
      { doc: 'CNIC Copy', status: 'verified' },
      { doc: 'Land Title Deed', status: 'verified' },
      { doc: 'Agricultural Survey Report', status: 'verified' },
    ],
  },
  l005: {
    licenseId: 'l005',
    verdict: 'review',
    riskScore: 45,
    flags: [
      { label: 'Document Incomplete', severity: 'warning' },
      { label: 'New Applicant', severity: 'warning' },
      { label: 'Region Eligible', severity: 'pass' },
      { label: 'Area Within Limits', severity: 'pass' },
    ],
    recommendation: 'Application has 2 of 4 required documents. Missing: Agricultural Survey Report and Environmental Impact Assessment. Applicant is a first-time registrant with no compliance history. Recommend requesting missing documents before proceeding with approval.',
    reviewDate: '2026-01-08',
    documentCompleteness: [
      { doc: 'CNIC Copy', status: 'verified' },
      { doc: 'Land Title Deed', status: 'verified' },
      { doc: 'Agricultural Survey Report', status: 'missing' },
      { doc: 'Environmental Impact Assessment', status: 'missing' },
    ],
  },
  l009: {
    licenseId: 'l009',
    verdict: 'fail',
    riskScore: 89,
    flags: [
      { label: 'Active THC Violation', severity: 'fail' },
      { label: 'Unauthorized Additives', severity: 'fail' },
      { label: 'Compliance Score: 45%', severity: 'fail' },
      { label: 'Under Investigation', severity: 'warning' },
    ],
    recommendation: 'CRITICAL: This license holder has 2 active critical violations — THC at 28% (limit 20%) and unauthorized chemical additives. Compliance score is 45%, well below the 70% threshold. License is currently suspended. Strongly recommend maintaining suspension and escalating to the Board of Governors for potential revocation.',
    reviewDate: '2025-09-05',
    documentCompleteness: [
      { doc: 'CNIC Copy', status: 'verified' },
      { doc: 'Land Title Deed', status: 'verified' },
      { doc: 'Compliance Report', status: 'incomplete' },
    ],
  },
  l012: {
    licenseId: 'l012',
    verdict: 'fail',
    riskScore: 95,
    flags: [
      { label: 'Unauthorized Strain', severity: 'fail' },
      { label: 'License Revoked', severity: 'fail' },
      { label: 'Compliance Score: 32%', severity: 'fail' },
    ],
    recommendation: 'License permanently revoked. Applicant cultivated Balochi Gold instead of the approved Pakistani Landrace strain, constituting a fundamental violation of license terms. No renewal or reinstatement recommended.',
    reviewDate: '2025-08-20',
    documentCompleteness: [
      { doc: 'CNIC Copy', status: 'verified' },
      { doc: 'Land Title Deed', status: 'verified' },
    ],
  },
  l015: {
    licenseId: 'l015',
    verdict: 'review',
    riskScore: 38,
    flags: [
      { label: 'Lab Certification Valid', severity: 'pass' },
      { label: 'Company Registered', severity: 'pass' },
      { label: 'High-Value Application', severity: 'warning' },
      { label: 'No Linked Farm', severity: 'warning' },
    ],
    recommendation: 'Extraction license application from Dr. Rashid Baloch (Quetta Premium Cultivars). Strong documentation — lab certification and company registration verified. However, no linked farm ID provided yet (farm registration CCRA-BL-007 is still pending). Recommend conditional approval pending farm registration completion.',
    reviewDate: '2026-02-18',
    documentCompleteness: [
      { doc: 'CNIC Copy', status: 'verified' },
      { doc: 'Company Registration', status: 'verified' },
      { doc: 'Lab Certification', status: 'verified' },
      { doc: 'Environmental Impact Assessment', status: 'missing' },
    ],
  },
  l016: {
    licenseId: 'l016',
    verdict: 'pass',
    riskScore: 15,
    flags: [
      { label: 'All Documents Verified', severity: 'pass' },
      { label: 'PSQCA Certified', severity: 'pass' },
      { label: 'Environmental Clearance', severity: 'pass' },
      { label: 'High Revenue License', severity: 'pass' },
    ],
    recommendation: 'Pakistan Cannabis Corp manufacturing license is fully compliant. PSQCA certification current. Environmental clearance obtained. This is a high-value license (PKR 8M fee) with strong institutional backing. Recommend continued active status with quarterly inspections.',
    reviewDate: '2025-05-25',
    documentCompleteness: [
      { doc: 'Company Registration', status: 'verified' },
      { doc: 'Manufacturing License', status: 'verified' },
      { doc: 'PSQCA Certificate', status: 'verified' },
      { doc: 'Environmental Clearance', status: 'verified' },
    ],
  },
  l017: {
    licenseId: 'l017',
    verdict: 'pass',
    riskScore: 22,
    flags: [
      { label: 'Company Registered', severity: 'pass' },
      { label: 'Manufacturing License Valid', severity: 'pass' },
      { label: 'Partial Documentation', severity: 'warning' },
    ],
    recommendation: 'Green Pharma Ltd manufacturing application approved. Core documents verified. PSQCA certification provided but environmental clearance pending. Recommend issuance with condition that environmental clearance be submitted within 60 days.',
    reviewDate: '2025-10-15',
    documentCompleteness: [
      { doc: 'Company Registration', status: 'verified' },
      { doc: 'Manufacturing License', status: 'verified' },
      { doc: 'PSQCA Certificate', status: 'verified' },
      { doc: 'Environmental Clearance', status: 'missing' },
    ],
  },
}

// Default review for licenses without specific review data
export const defaultReview: LicenseAiReview = {
  licenseId: 'default',
  verdict: 'pass',
  riskScore: 20,
  flags: [
    { label: 'Standard Documentation', severity: 'pass' },
    { label: 'Region Eligible', severity: 'pass' },
    { label: 'No Known Issues', severity: 'pass' },
  ],
  recommendation: 'Application meets standard regulatory requirements. No flags detected during automated review. Recommend standard approval process with routine monitoring schedule.',
  reviewDate: '2025-07-01',
  documentCompleteness: [
    { doc: 'CNIC Copy', status: 'verified' },
    { doc: 'Land Title Deed', status: 'verified' },
  ],
}
