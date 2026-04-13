import type { WizardState } from '@/store/useApplicationWizardStore'

export function getStepErrors(step: number, state: WizardState): string[] {
  const errors: string[] = []

  switch (step) {
    case 1:
      if (!state.category) errors.push('category')
      if (!state.tier) errors.push('tier')
      break
    case 2:
      if (!state.businessEntity.legalEntityName.trim()) errors.push('legalEntityName')
      if (!state.businessEntity.secpRegistrationNumber.trim()) errors.push('secpRegistrationNumber')
      if (!state.businessEntity.ntn.trim()) errors.push('ntn')
      if (!state.businessEntity.businessPhone.trim()) errors.push('businessPhone')
      if (!state.businessEntity.businessEmail.trim()) errors.push('businessEmail')
      if (!state.businessEntity.registeredAddress.province) errors.push('province')
      if (!state.businessEntity.registeredAddress.district) errors.push('district')
      break
    case 3:
      if (state.ownershipControl.shareholders.length === 0) errors.push('shareholders')
      if (state.ownershipControl.shareholders.some(s => !s.name.trim())) errors.push('shareholderName')
      break
    case 4:
      if (!state.siteFacility.siteAddress.province) errors.push('siteProvince')
      if (!state.siteFacility.siteAddress.district) errors.push('siteDistrict')
      break
    case 5:
      if (!state.typeSpecificFields) errors.push('typeSpecific')
      break
    case 6:
      break
    case 7:
      if (!state.paymentMethod) errors.push('paymentMethod')
      break
    case 8:
      if (!state.certificationAccepted) errors.push('certification')
      break
  }

  return errors
}

export const FIELD_ERROR_LABELS: Record<string, string> = {
  category: 'License Category',
  tier: 'License Tier',
  legalEntityName: 'Legal Entity Name',
  secpRegistrationNumber: 'SECP Registration Number',
  ntn: 'National Tax Number',
  businessPhone: 'Business Phone',
  businessEmail: 'Business Email',
  province: 'Province',
  district: 'District',
  shareholders: 'Shareholders',
  shareholderName: 'Shareholder Name',
  siteProvince: 'Site Province',
  siteDistrict: 'Site District',
  typeSpecific: 'Type-Specific Details',
  paymentMethod: 'Payment Method',
  certification: 'Certification Acceptance',
}
