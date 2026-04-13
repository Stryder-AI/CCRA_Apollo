'use client'

import { useState } from 'react'
import { useApplicationWizardStore } from '@/store/useApplicationWizardStore'
import { getLicenseCategoryLabel, getTierLabel } from '@/utils/license-helpers'
import { formatCurrencyFull } from '@/utils/format'
import { LICENSE_TYPE_CONFIGS } from '@/config/license-type-config'
import { ChevronDown, Edit2, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SectionProps {
  title: string
  step: number
  onEdit: (step: number) => void
  children: React.ReactNode
}

function ReviewSection({ title, step, onEdit, children }: SectionProps) {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <div className="rounded-lg border border-white/10 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-3 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
      >
        <div className="flex items-center gap-2">
          <CheckCircle className="size-4 text-green-500" />
          <span className="text-sm font-semibold">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onEdit(step) }}
            className="flex items-center gap-1 text-xs text-green-500 hover:underline"
          >
            <Edit2 className="size-3" /> Edit
          </button>
          <ChevronDown className={cn('size-4 text-muted-foreground transition-transform', isOpen && 'rotate-180')} />
        </div>
      </button>
      {isOpen && (
        <div className="p-4 border-t border-white/10 text-sm space-y-2">
          {children}
        </div>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string | undefined }) {
  if (!value) return null
  return (
    <div className="flex justify-between py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right max-w-[60%]">{value}</span>
    </div>
  )
}

export function StepReview() {
  const store = useApplicationWizardStore()
  const {
    category, tier, businessEntity, ownershipControl, keyPersonnel,
    siteFacility, commonDocuments, feeBreakdown, paymentMethod,
    certificationAccepted, setCertification, setCurrentStep, validationErrors,
  } = store

  const config = category ? LICENSE_TYPE_CONFIGS[category] : null
  const uploadedDocsCount = Object.values(commonDocuments).filter(Boolean).length

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Review & Submit</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Review all information before submitting your application. Click &quot;Edit&quot; to make changes to any section.
        </p>
      </div>

      {/* Step 1: Licence Type */}
      <ReviewSection title="Licence Type & Tier" step={1} onEdit={setCurrentStep}>
        <Row label="Category" value={category ? getLicenseCategoryLabel(category) : undefined} />
        <Row label="Tier" value={category && tier ? getTierLabel(category, tier) : undefined} />
        {config && <Row label="Permitted Activities" value={config.permittedActivities} />}
      </ReviewSection>

      {/* Step 2: Business Entity */}
      <ReviewSection title="Business Entity Information" step={2} onEdit={setCurrentStep}>
        <Row label="Legal Entity Name" value={businessEntity.legalEntityName} />
        <Row label="Entity Type" value={businessEntity.entityType} />
        <Row label="SECP #" value={businessEntity.secpRegistrationNumber} />
        <Row label="NTN" value={businessEntity.ntn} />
        <Row label="Date of Incorporation" value={businessEntity.dateOfIncorporation} />
        <Row label="Province" value={businessEntity.registeredAddress.province} />
        <Row label="District" value={businessEntity.registeredAddress.district} />
        <Row label="Business Phone" value={businessEntity.businessPhone} />
        <Row label="Business Email" value={businessEntity.businessEmail} />
        <Row label="Nature of Business" value={businessEntity.natureOfBusiness} />
      </ReviewSection>

      {/* Step 3: Ownership & Personnel */}
      <ReviewSection title="Ownership & Key Personnel" step={3} onEdit={setCurrentStep}>
        <Row label="Shareholders" value={`${ownershipControl.shareholders.length} listed`} />
        <Row label="Beneficial Owners (≥25%)" value={`${ownershipControl.ultimateBeneficialOwners.length} listed`} />
        <Row label="Directors" value={`${ownershipControl.boardOfDirectors.length} listed`} />
        <Row label="PEP Declaration" value={ownershipControl.pepDeclaration ? 'Yes — PEP identified' : 'No PEP'} />
        <Row label="Key Personnel" value={`${keyPersonnel.length} of ${config?.requiredPersonnel.length ?? 0} roles filled`} />
      </ReviewSection>

      {/* Step 4: Site & Facility */}
      <ReviewSection title="Site & Facility" step={4} onEdit={setCurrentStep}>
        <Row label="Province" value={siteFacility.siteAddress.province} />
        <Row label="District" value={siteFacility.siteAddress.district} />
        <Row label="City" value={siteFacility.siteAddress.city} />
        {siteFacility.siteAddress.gpsCoordinates && (
          <Row label="GPS" value={`${siteFacility.siteAddress.gpsCoordinates.lat}, ${siteFacility.siteAddress.gpsCoordinates.lng}`} />
        )}
      </ReviewSection>

      {/* Step 5: Type-Specific */}
      <ReviewSection title="Licence-Specific Details" step={5} onEdit={setCurrentStep}>
        {store.typeSpecificFields ? (
          <p className="text-muted-foreground">Type-specific details have been provided.</p>
        ) : (
          <p className="text-amber-500 text-xs">No type-specific details entered yet.</p>
        )}
      </ReviewSection>

      {/* Step 6: Documents */}
      <ReviewSection title="Common Documents" step={6} onEdit={setCurrentStep}>
        <Row label="Documents Uploaded" value={`${uploadedDocsCount} of 12`} />
      </ReviewSection>

      {/* Step 7: Fees */}
      <ReviewSection title="Fee Calculation & Payment" step={7} onEdit={setCurrentStep}>
        {feeBreakdown && (
          <>
            <Row label="Application Fee" value={formatCurrencyFull(feeBreakdown.applicationFee)} />
            <Row label="Licence Fee" value={formatCurrencyFull(feeBreakdown.licenseFee)} />
            <Row label="Security Clearance" value={formatCurrencyFull(feeBreakdown.securityClearanceFee)} />
            <Row label="Track & Trace Setup" value={formatCurrencyFull(feeBreakdown.trackAndTraceSetup)} />
            <div className="border-t border-white/10 pt-2 mt-2">
              <Row label="Total Due Now" value={formatCurrencyFull(feeBreakdown.totalDueNow)} />
            </div>
            <Row label="Payment Method" value={paymentMethod ?? 'Not selected'} />
          </>
        )}
      </ReviewSection>

      {/* Certification */}
      <div className={cn("rounded-lg border-2 p-4 space-y-3", validationErrors.includes('certification') ? 'border-red-500/50 bg-red-500/5' : 'border-green-500/30 bg-green-500/5')}>
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="certification"
            checked={certificationAccepted}
            onChange={(e) => setCertification(e.target.checked)}
            className="mt-0.5 size-5 rounded border-white/20 accent-green-500"
          />
          <label htmlFor="certification" className="text-sm leading-relaxed">
            I hereby certify that all information provided in this application is true, accurate, and complete to the best of my knowledge.
            I understand that providing false or misleading information may result in the denial or revocation of my licence and may constitute
            a criminal offence under the Cannabis Control and Regulatory Authority Act 2024.
          </label>
        </div>
      </div>
    </div>
  )
}
