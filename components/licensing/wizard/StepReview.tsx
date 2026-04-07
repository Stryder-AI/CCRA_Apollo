'use client'

import { useFormContext } from 'react-hook-form'
import { FEE_SCHEDULE } from '@/config/constants'
import { formatCurrencyFull } from '@/utils/format'
import type { WizardFormData } from './WizardShell'

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{title}</h3>
      <div className="rounded-lg border border-white/10 p-4 space-y-1.5">{children}</div>
    </div>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

export function StepReview() {
  const { getValues } = useFormContext<WizardFormData>()
  const data = getValues()

  const fee = FEE_SCHEDULE.find((f) => f.type === data.licenseType)

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Review Your Application</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Please review all information before submitting.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ReviewSection title="License Type">
          <ReviewRow label="Type" value={data.licenseType || '—'} />
          {fee && <ReviewRow label="Annual Fee" value={formatCurrencyFull(fee.annual)} />}
          {fee && <ReviewRow label="Application Fee" value={formatCurrencyFull(fee.application)} />}
        </ReviewSection>

        <ReviewSection title="Applicant Information">
          <ReviewRow label="Full Name" value={data.fullName || '—'} />
          <ReviewRow label="Company" value={data.companyName || '—'} />
          <ReviewRow label="CNIC" value={data.cnic || '—'} />
          <ReviewRow label="Phone" value={data.phone || '—'} />
          <ReviewRow label="Email" value={data.email || '—'} />
        </ReviewSection>

        <ReviewSection title="Region & Area">
          <ReviewRow label="Region" value={data.region || '—'} />
          <ReviewRow label="Proposed Area" value={data.proposedArea ? `${data.proposedArea} hectares` : '—'} />
        </ReviewSection>

        <ReviewSection title="Documents">
          <p className="text-sm text-muted-foreground">
            Documents uploaded in the previous step will be attached to this application.
          </p>
        </ReviewSection>
      </div>
    </div>
  )
}
