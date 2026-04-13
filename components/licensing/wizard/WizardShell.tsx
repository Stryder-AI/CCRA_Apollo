'use client'

import { Button } from '@/components/ui/button'
import { GlassCard } from '@/design-system/glass-card'
import { cn } from '@/lib/utils'
import { Check, Save, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { useApplicationWizardStore } from '@/store/useApplicationWizardStore'

import { StepLicenseType } from './StepLicenseType'
import { StepBusinessEntity } from './StepBusinessEntity'
import { StepOwnershipPersonnel } from './StepOwnershipPersonnel'
import { StepSiteFacility } from './StepSiteFacility'
import { StepTypeSpecific } from './StepTypeSpecific'
import { StepDocuments } from './StepDocuments'
import { StepFeePayment } from './StepFeePayment'
import { StepReview } from './StepReview'

const STEPS = [
  { label: 'License Type', group: 'Type' },
  { label: 'Business Entity', group: 'Entity & People' },
  { label: 'Ownership & Personnel', group: 'Entity & People' },
  { label: 'Site & Facility', group: 'Facility & Docs' },
  { label: 'Type-Specific Details', group: 'Facility & Docs' },
  { label: 'Documents', group: 'Facility & Docs' },
  { label: 'Fee & Payment', group: 'Payment & Submit' },
  { label: 'Review & Submit', group: 'Payment & Submit' },
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
      return null // Documents are optional at draft stage
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

interface WizardShellProps {
  onSubmit: () => void
}

export function WizardShell({ onSubmit }: WizardShellProps) {
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
    // Allow clicking on completed steps to go back
    if (step < currentStep) {
      setCurrentStep(step)
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Step {currentStep} of {TOTAL_STEPS}</span>
          <span>{progressPercent}% Complete</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted-foreground/10">
          <div
            className="h-full rounded-full bg-green-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-0 overflow-x-auto pb-2">
        {STEPS.map(({ label }, idx) => {
          const step = idx + 1
          const isCompleted = step < currentStep
          const isCurrent = step === currentStep
          return (
            <div key={label} className="flex items-center">
              <button
                type="button"
                onClick={() => handleStepClick(step)}
                disabled={step > currentStep}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div
                  className={cn(
                    'flex size-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors',
                    isCompleted && 'border-green-500 bg-green-500 text-white cursor-pointer group-hover:bg-green-400',
                    isCurrent && 'border-green-500 bg-green-500/20 text-green-500',
                    !isCompleted && !isCurrent && 'border-muted-foreground/30 text-muted-foreground/50'
                  )}
                >
                  {isCompleted ? <Check className="size-4" /> : step}
                </div>
                <span
                  className={cn(
                    'text-[10px] w-20 text-center leading-tight',
                    isCurrent ? 'text-foreground font-medium' : 'text-muted-foreground'
                  )}
                >
                  {label}
                </span>
              </button>
              {idx < STEPS.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 w-8 mx-0.5 mt-[-18px]',
                    step < currentStep ? 'bg-green-500' : 'bg-muted-foreground/20'
                  )}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Step group label */}
      <div className="text-center">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {STEPS[currentStep - 1].group}
        </span>
      </div>

      {/* Step content */}
      <GlassCard padding="lg">
        {currentStep === 1 && <StepLicenseType />}
        {currentStep === 2 && <StepBusinessEntity />}
        {currentStep === 3 && <StepOwnershipPersonnel />}
        {currentStep === 4 && <StepSiteFacility />}
        {currentStep === 5 && <StepTypeSpecific />}
        {currentStep === 6 && <StepDocuments />}
        {currentStep === 7 && <StepFeePayment />}
        {currentStep === 8 && <StepReview />}
      </GlassCard>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSaveDraft}
            className="text-muted-foreground"
          >
            <Save className="size-4 mr-1" />
            Save Draft
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              store.fillDemoValues()
              toast.success('Demo values loaded', { description: 'All steps populated with sample data.' })
            }}
            className="text-amber-600 hover:text-amber-700 hover:bg-amber-500/10"
          >
            <Sparkles className="size-4 mr-1" />
            Demo Values
          </Button>
        </div>
        {currentStep < TOTAL_STEPS ? (
          <Button onClick={handleNext}>Next</Button>
        ) : (
          <Button onClick={handleFinalSubmit} className="bg-green-600 hover:bg-green-700">
            Submit Application
          </Button>
        )}
      </div>
    </div>
  )
}
