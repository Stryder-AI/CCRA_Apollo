'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/design-system/glass-card'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

import { StepLicenseType } from './StepLicenseType'
import { StepApplicantInfo } from './StepApplicantInfo'
import { StepRegionArea } from './StepRegionArea'
import { StepDocuments } from './StepDocuments'
import { StepReview } from './StepReview'

const STEPS = [
  'License Type',
  'Applicant Information',
  'Region & Area',
  'Documents',
  'Review & Submit',
]

export const wizardSchema = z.object({
  licenseType: z.enum(['Cultivation', 'Extraction', 'Manufacturing', 'Sales & Distribution'] as const, {
    message: 'Please select a license type',
  }),
  fullName: z.string().min(2, 'Full name is required'),
  companyName: z.string().min(2, 'Company name is required'),
  cnic: z
    .string()
    .regex(/^\d{5}-\d{7}-\d$/, 'CNIC must be in format XXXXX-XXXXXXX-X'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Valid email is required'),
  region: z.string().min(1, 'Please select a region'),
  proposedArea: z.coerce.number().positive('Area must be greater than 0') as unknown as z.ZodNumber,
})

export type WizardFormData = z.infer<typeof wizardSchema>

interface WizardShellProps {
  onSubmit: (data: WizardFormData) => void
}

const stepFields: Record<number, (keyof WizardFormData)[]> = {
  1: ['licenseType'],
  2: ['fullName', 'companyName', 'cnic', 'phone', 'email'],
  3: ['region', 'proposedArea'],
  4: [],
  5: [],
}

export function WizardShell({ onSubmit }: WizardShellProps) {
  const [currentStep, setCurrentStep] = useState(1)

  const methods = useForm<WizardFormData>({
    resolver: zodResolver(wizardSchema),
    mode: 'onTouched',
    defaultValues: {
      licenseType: undefined,
      fullName: '',
      companyName: '',
      cnic: '',
      phone: '',
      email: '',
      region: '',
      proposedArea: undefined,
    },
  })

  const handleNext = async () => {
    const fields = stepFields[currentStep]
    if (fields && fields.length > 0) {
      const valid = await methods.trigger(fields)
      if (!valid) return
    }
    setCurrentStep((s) => Math.min(s + 1, 5))
  }

  const handlePrev = () => {
    setCurrentStep((s) => Math.max(s - 1, 1))
  }

  const handleFinalSubmit = methods.handleSubmit((data) => {
    onSubmit(data)
  })

  return (
    <FormProvider {...methods}>
      <div className="space-y-6">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-0">
          {STEPS.map((label, idx) => {
            const step = idx + 1
            const isCompleted = step < currentStep
            const isCurrent = step === currentStep
            return (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={cn(
                      'flex size-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors',
                      isCompleted && 'border-green-500 bg-green-500 text-white',
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
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={cn(
                      'h-0.5 w-12 mx-1 mt-[-18px]',
                      step < currentStep ? 'bg-green-500' : 'bg-muted-foreground/20'
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Step content */}
        <GlassCard padding="lg">
          {currentStep === 1 && <StepLicenseType />}
          {currentStep === 2 && <StepApplicantInfo />}
          {currentStep === 3 && <StepRegionArea />}
          {currentStep === 4 && <StepDocuments />}
          {currentStep === 5 && <StepReview />}
        </GlassCard>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          {currentStep < 5 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleFinalSubmit}>Submit Application</Button>
          )}
        </div>
      </div>
    </FormProvider>
  )
}
