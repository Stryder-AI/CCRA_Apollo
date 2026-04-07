'use client'

import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { REGIONS } from '@/config/constants'
import { cn } from '@/lib/utils'
import type { WizardFormData } from './WizardShell'

const selectClasses =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'

export function StepRegionArea() {
  const {
    register,
    formState: { errors },
  } = useFormContext<WizardFormData>()

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Region & Proposed Area</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Select the region and specify the proposed cultivation/operation area.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="region">Region</Label>
          <select
            id="region"
            {...register('region')}
            className={cn(selectClasses)}
          >
            <option value="">Select a region</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {errors.region && (
            <p className="text-xs text-destructive">{errors.region.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="proposedArea">Proposed Area (hectares)</Label>
          <Input
            id="proposedArea"
            type="number"
            step="0.1"
            placeholder="e.g. 5.0"
            {...register('proposedArea')}
          />
          {errors.proposedArea && (
            <p className="text-xs text-destructive">{errors.proposedArea.message}</p>
          )}
        </div>
      </div>
    </div>
  )
}
