'use client'

import { GlassCard } from '@/design-system/glass-card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Check, ChevronLeft, ChevronRight, CheckCircle2, Save } from 'lucide-react'
import { toast } from 'sonner'
import { useApplicationWizardStore } from '@/store/useApplicationWizardStore'

import { StepLicenseType } from '@/components/licensing/wizard/StepLicenseType'
import { StepBusinessEntity } from '@/components/licensing/wizard/StepBusinessEntity'
import { StepOwnershipPersonnel } from '@/components/licensing/wizard/StepOwnershipPersonnel'
import { StepSiteFacility } from '@/components/licensing/wizard/StepSiteFacility'
import { StepTypeSpecific } from '@/components/licensing/wizard/StepTypeSpecific'
import { StepDocuments } from '@/components/licensing/wizard/StepDocuments'
import { StepFeePayment } from '@/components/licensing/wizard/StepFeePayment'
import { StepReview } from '@/components/licensing/wizard/StepReview'

const STEPS = [
  { label: 'License Type', shortLabel: 'Type' },
  { label: 'Business Entity', shortLabel: 'Entity' },
  { label: 'Ownership & Personnel', shortLabel: 'Ownership' },
  { label: 'Site & Facility', shortLabel: 'Site' },
  { label: 'Type-Specific Details', shortLabel: 'Details' },
  { label: 'Documents', shortLabel: 'Docs' },
  { label: 'Fee & Payment', shortLabel: 'Payment' },
  { label: 'Review & Submit', shortLabel: 'Review' },
] as const

const TOTAL_STEPS = STEPS.length

function validateStep(step: number, state: ReturnType<typeof useApplicationWizardStore.getState>): string | null {
  switch (step) {
    case 1:
      if (!state.category) return 'Please select a license category'
      if (!state.tier) return 'Please select a license tier'
      return null
    case 2:
      if (!state.businessEntity.legalEntityName.trim()) return 'Legal entity name is required'
      if (!state.businessEntity.secpRegistrationNumber.trim()) return 'SECP registration number is required'
      if (!state.businessEntity.ntn.trim()) return 'NTN is required'
      if (!state.businessEntity.businessPhone.trim()) return 'Business phone is required'
      if (!state.businessEntity.businessEmail.trim()) return 'Business email is required'
      if (!state.businessEntity.registeredAddress.province) return 'Province is required for registered address'
      return null
    case 3:
      if (state.ownershipControl.shareholders.length === 0) return 'At least one shareholder is required'
      if (state.ownershipControl.shareholders.some(s => !s.name.trim())) return 'All shareholder names are required'
      return null
    case 4:
      if (!state.siteFacility.siteAddress.province) return 'Site province is required'
      if (!state.siteFacility.siteAddress.district) return 'Site district is required'
      return null
    case 5:
      if (!state.typeSpecificFields) return 'Please fill in the type-specific details'
      return null
    case 6:
      return null
    case 7:
      if (!state.paymentMethod) return 'Please select a payment method'
      return null
    case 8:
      if (!state.certificationAccepted) return 'You must accept the certification to submit'
      return null
    default:
      return null
  }
}

interface PublicWizardShellProps {
  onSubmit: () => void
}

export function PublicWizardShell({ onSubmit }: PublicWizardShellProps) {
  const store = useApplicationWizardStore()
  const { currentStep, setCurrentStep } = store

  const progressPercent = Math.round(((currentStep - 1) / (TOTAL_STEPS - 1)) * 100)

  const handleNext = () => {
    const error = validateStep(currentStep, useApplicationWizardStore.getState())
    if (error) {
      toast.error('Validation Error', { description: error })
      return
    }
    setCurrentStep(Math.min(currentStep + 1, TOTAL_STEPS))
  }

  const handlePrev = () => {
    setCurrentStep(Math.max(currentStep - 1, 1))
  }

  const handleSaveDraft = () => {
    toast.success('Draft Saved', {
      description: 'Your application progress has been saved. You can continue later.',
    })
  }

  const handleFinalSubmit = () => {
    const error = validateStep(currentStep, useApplicationWizardStore.getState())
    if (error) {
      toast.error('Validation Error', { description: error })
      return
    }
    onSubmit()
  }

  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step)
    }
  }

  return (
    <GlassCard className="w-full" padding="lg">
      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-foreground">Cannabis License Application</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Complete all 8 steps to submit your application to CCRA
        </p>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5 mb-6">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Step {currentStep} of {TOTAL_STEPS} — {STEPS[currentStep - 1].label}</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-green-600 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-between mb-6">
        {STEPS.map(({ shortLabel }, idx) => {
          const step = idx + 1
          const isCompleted = step < currentStep
          const isCurrent = step === currentStep
          return (
            <div key={shortLabel} className="flex flex-col items-center gap-1.5 flex-1">
              <button
                type="button"
                onClick={() => handleStepClick(step)}
                disabled={step > currentStep}
                className="group"
              >
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors mx-auto',
                    isCompleted && 'border-green-600 bg-green-600 text-white cursor-pointer group-hover:bg-green-500',
                    isCurrent && 'border-green-600 bg-green-600/10 text-green-600',
                    !isCompleted && !isCurrent && 'border-border bg-muted text-muted-foreground'
                  )}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : step}
                </div>
              </button>
              <span
                className={cn(
                  'text-[10px] font-medium text-center',
                  isCurrent || isCompleted ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {shortLabel}
              </span>
            </div>
          )
        })}
      </div>

      {/* Divider */}
      <div className="h-px bg-border mb-6" />

      {/* Step content */}
      <div className="min-h-[400px]">
        {currentStep === 1 && <StepLicenseType />}
        {currentStep === 2 && <StepBusinessEntity />}
        {currentStep === 3 && <StepOwnershipPersonnel />}
        {currentStep === 4 && <StepSiteFacility />}
        {currentStep === 5 && <StepTypeSpecific />}
        {currentStep === 6 && <StepDocuments />}
        {currentStep === 7 && <StepFeePayment />}
        {currentStep === 8 && <StepReview />}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-4 border-t border-border">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSaveDraft}
            className="text-muted-foreground"
          >
            <Save className="h-4 w-4 mr-1" />
            Save Draft
          </Button>
        </div>
        {currentStep < TOTAL_STEPS ? (
          <Button onClick={handleNext}>
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleFinalSubmit} className="bg-green-600 hover:bg-green-700">
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Submit Application
          </Button>
        )}
      </div>
    </GlassCard>
  )
}
