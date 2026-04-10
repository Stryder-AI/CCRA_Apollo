'use client'

import { useApplicationWizardStore } from '@/store/useApplicationWizardStore'
import { LICENSE_TYPE_CONFIGS } from '@/config/license-type-config'
import { FEE_SCHEDULE } from '@/config/constants'
import { formatCurrencyFull } from '@/utils/format'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import type { LicenseCategory } from '@/types/license'

const categories = Object.values(LICENSE_TYPE_CONFIGS)

export function StepLicenseType() {
  const { category, tier, setCategory, setTier } = useApplicationWizardStore()

  const selectedConfig = category ? LICENSE_TYPE_CONFIGS[category] : null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Select Licence Type</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose the type of licence you are applying for. Pakistan&apos;s CCRA issues 9 categories of cannabis licences.
        </p>
      </div>

      {/* Category Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((config) => {
          const Icon = config.icon
          const isSelected = category === config.category
          const tiers = FEE_SCHEDULE[config.category]
          const startingFee = tiers ? Math.min(...Object.values(tiers).map((t) => t.applicationFee)) : 0

          return (
            <div
              key={config.category}
              onClick={() => setCategory(config.category)}
              className={cn(
                'relative cursor-pointer rounded-xl border-2 p-4 transition-all',
                isSelected
                  ? 'border-green-500 bg-green-500/5 shadow-[0_0_20px_rgba(34,197,94,0.15)]'
                  : 'border-white/10 hover:border-white/20 hover:bg-white/5'
              )}
            >
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 flex size-5 items-center justify-center rounded-full bg-green-500">
                  <Check className="size-3 text-white" />
                </div>
              )}
              <div className="flex items-start gap-3">
                <div className={cn(
                  'flex size-9 shrink-0 items-center justify-center rounded-lg',
                  isSelected ? 'bg-green-500/20' : 'bg-white/5'
                )}>
                  <Icon className={cn('size-4', isSelected ? 'text-green-500' : 'text-muted-foreground')} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold leading-snug">{config.shortLabel}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{config.description}</p>
                  {startingFee > 0 && (
                    <p className="text-xs text-muted-foreground mt-1.5">
                      From <span className="font-mono text-foreground">{formatCurrencyFull(startingFee)}</span>
                    </p>
                  )}
                  {startingFee === 0 && config.category === 'RESEARCH' && (
                    <p className="text-xs text-green-500 mt-1.5 font-medium">No application fee</p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tier Selection */}
      {selectedConfig && selectedConfig.tiers.length > 1 && (
        <div className="space-y-3 pt-2">
          <div>
            <h3 className="text-sm font-semibold">Select Tier / Sub-Category</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {selectedConfig.label} is available in the following tiers:
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {selectedConfig.tiers.map((t) => {
              const isSelected = tier === t.value
              const fees = FEE_SCHEDULE[category!]?.[t.value]

              return (
                <div
                  key={t.value}
                  onClick={() => setTier(t.value)}
                  className={cn(
                    'cursor-pointer rounded-lg border-2 p-3.5 transition-all',
                    isSelected
                      ? 'border-green-500 bg-green-500/5'
                      : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{t.label}</h4>
                    {isSelected && <Check className="size-4 text-green-500" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
                  {t.areaOrCapacity && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Capacity: <span className="font-mono text-foreground">{t.areaOrCapacity}</span>
                    </p>
                  )}
                  {fees && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Application: <span className="font-mono text-foreground">{formatCurrencyFull(fees.applicationFee)}</span>
                      {' · '}Licence: <span className="font-mono text-foreground">{formatCurrencyFull(fees.licenseFee)}</span>
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Auto-select single-tier categories */}
      {selectedConfig && selectedConfig.tiers.length === 1 && !tier && (
        <div className="text-sm text-muted-foreground bg-green-500/5 border border-green-500/20 rounded-lg p-3">
          <span className="font-medium text-foreground">{selectedConfig.tiers[0].label}</span> — {selectedConfig.tiers[0].description}
          {selectedConfig.tiers[0].areaOrCapacity && ` (${selectedConfig.tiers[0].areaOrCapacity})`}
          <button
            type="button"
            className="ml-2 text-green-500 font-medium hover:underline"
            onClick={() => setTier(selectedConfig.tiers[0].value)}
          >
            Select →
          </button>
        </div>
      )}
    </div>
  )
}
