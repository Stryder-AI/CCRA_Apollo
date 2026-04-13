'use client'

import { useState } from 'react'
import { GlassCard } from '@/design-system/glass-card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Check, ChevronLeft, ChevronRight, CheckCircle2, Save, Sparkles, ArrowRight, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { useApplicationWizardStore } from '@/store/useApplicationWizardStore'
import { generateApplicationReference } from '@/utils/license-helpers'
import { getStepErrors, FIELD_ERROR_LABELS } from '@/utils/wizard-validation'

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

interface PublicWizardShellProps {
  onSubmit: () => void
}

export function PublicWizardShell({ onSubmit }: PublicWizardShellProps) {
  const store = useApplicationWizardStore()
  const { currentStep, setCurrentStep, setValidationErrors } = store
  const [submitted, setSubmitted] = useState(false)
  const [refNumber, setRefNumber] = useState('')

  const progressPercent = Math.round(((currentStep - 1) / (TOTAL_STEPS - 1)) * 100)

  const handleNext = () => {
    const state = useApplicationWizardStore.getState()
    const errors = getStepErrors(currentStep, state)
    if (errors.length > 0) {
      setValidationErrors(errors)
      const labels = errors.map(e => FIELD_ERROR_LABELS[e] || e).join(', ')
      toast.error('Required fields missing', { description: labels })
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
    const state = useApplicationWizardStore.getState()
    const errors = getStepErrors(currentStep, state)
    if (errors.length > 0) {
      setValidationErrors(errors)
      const labels = errors.map(e => FIELD_ERROR_LABELS[e] || e).join(', ')
      toast.error('Required fields missing', { description: labels })
      return
    }
    const ref = generateApplicationReference()
    setRefNumber(ref)
    setSubmitted(true)
    onSubmit()
  }

  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step)
    }
  }

  // ── Confirmation Screen ──
  if (submitted) {
    return (
      <GlassCard className="w-full" padding="lg">
        <div className="flex flex-col items-center gap-6 py-12">
          {/* Animated checkmark */}
          <div className="relative flex items-center justify-center">
            <svg
              className="h-28 w-28"
              viewBox="0 0 96 96"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="48"
                cy="48"
                r="44"
                stroke="#22c55e"
                strokeWidth="4"
                fill="rgba(34, 197, 94, 0.1)"
                className="animate-[scale-in_0.4s_ease-out]"
              />
              <path
                d="M28 50 L42 64 L68 34"
                stroke="#22c55e"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                style={{
                  strokeDasharray: 80,
                  strokeDashoffset: 80,
                  animation: 'draw-check 0.5s 0.3s ease-out forwards',
                }}
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-foreground">
            Application Submitted Successfully
          </h2>

          <p className="text-center text-muted-foreground max-w-md">
            Your cannabis license application has been received by the Cannabis Control & Regulatory Authority. Please save your reference number below.
          </p>

          <div className="rounded-xl bg-green-600/10 border border-green-600/20 px-8 py-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Application Reference Number</p>
            <div className="flex items-center gap-3">
              <p className="text-2xl font-mono font-bold text-green-600 tracking-wider">
                {refNumber}
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(refNumber)
                  toast.success('Copied to clipboard')
                }}
                className="p-1.5 rounded-md hover:bg-green-600/10 transition-colors"
                title="Copy reference number"
              >
                <Copy className="h-4 w-4 text-green-600" />
              </button>
            </div>
          </div>

          <div className="rounded-lg bg-muted/50 border border-border p-4 max-w-md text-sm text-muted-foreground space-y-2">
            <p><strong>What happens next?</strong></p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Your application will be screened within <strong>5 business days</strong></li>
              <li>You may receive a Request for Information (RFI) if documents need clarification</li>
              <li>Security clearance and site inspection will be scheduled</li>
              <li>Track your application status on the public portal using your reference number</li>
            </ul>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <a
              href="/public-portal"
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-green-700 transition-colors"
            >
              Go to Public Portal
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes draw-check {
            to { stroke-dashoffset: 0; }
          }
          @keyframes scale-in {
            from { transform: scale(0); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        ` }} />
      </GlassCard>
    )
  }

  // ── Wizard ──
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              store.fillDemoValues()
              toast.success('Demo values loaded', { description: 'All steps populated with sample data.' })
            }}
            className="text-amber-600 hover:text-amber-700 hover:bg-amber-500/10"
          >
            <Sparkles className="h-4 w-4 mr-1" />
            Demo Values
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
