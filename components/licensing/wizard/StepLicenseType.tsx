'use client'

import { useFormContext } from 'react-hook-form'
import { GlassCard } from '@/design-system/glass-card'
import { FEE_SCHEDULE } from '@/config/constants'
import { formatCurrencyFull } from '@/utils/format'
import { cn } from '@/lib/utils'
import type { WizardFormData } from './WizardShell'
import type { LicenseType } from '@/types/license'

export function StepLicenseType() {
  const { setValue, watch, formState: { errors } } = useFormContext<WizardFormData>()
  const selected = watch('licenseType')

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Select License Type</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose the type of license you are applying for.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {FEE_SCHEDULE.map((fee) => {
          const isSelected = selected === fee.type
          return (
            <div
              key={fee.type}
              onClick={() => setValue('licenseType', fee.type as LicenseType, { shouldValidate: true })}
              className={cn(
                'relative cursor-pointer rounded-xl border-2 p-5 transition-all',
                isSelected
                  ? 'border-green-500 bg-green-500/5 shadow-[0_0_20px_rgba(34,197,94,0.15)]'
                  : 'border-white/10 hover:border-white/20 hover:bg-white/5'
              )}
            >
              <h3 className="font-semibold">{fee.type}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Annual Fee: <span className="font-mono text-foreground">{formatCurrencyFull(fee.annual)}</span>
              </p>
            </div>
          )
        })}
      </div>

      {errors.licenseType && (
        <p className="text-sm text-destructive">{errors.licenseType.message}</p>
      )}
    </div>
  )
}
