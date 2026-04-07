'use client'

import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { WizardFormData } from './WizardShell'

export function StepApplicantInfo() {
  const {
    register,
    formState: { errors },
  } = useFormContext<WizardFormData>()

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Applicant Information</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Enter the applicant and company details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" placeholder="Muhammad Ahmad Khan" {...register('fullName')} />
          {errors.fullName && (
            <p className="text-xs text-destructive">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="companyName">Company Name</Label>
          <Input id="companyName" placeholder="Green Valley Enterprises" {...register('companyName')} />
          {errors.companyName && (
            <p className="text-xs text-destructive">{errors.companyName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cnic">CNIC</Label>
          <Input id="cnic" placeholder="12345-1234567-1" {...register('cnic')} />
          {errors.cnic && (
            <p className="text-xs text-destructive">{errors.cnic.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" placeholder="+92 300 1234567" {...register('phone')} />
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="applicant@company.com" {...register('email')} />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>
    </div>
  )
}
