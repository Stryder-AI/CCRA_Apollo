'use client'

import { useState } from 'react'
import { GlassCard } from '@/design-system/glass-card'
import { FEE_SCHEDULE, ADDITIONAL_FEES, LICENSE_CATEGORIES } from '@/config/constants'
import { getTierLabel } from '@/utils/license-helpers'
import { formatCurrencyFull } from '@/utils/format'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import type { LicenseCategory } from '@/types/license'

export function FeeScheduleCard() {
  const [expandedCategory, setExpandedCategory] = useState<LicenseCategory | null>(null)

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Fee Schedule</h2>

      <div className="space-y-2">
        {LICENSE_CATEGORIES.map((cat) => {
          const tiers = FEE_SCHEDULE[cat.value]
          const isExpanded = expandedCategory === cat.value
          const tierEntries = Object.entries(tiers)

          return (
            <GlassCard key={cat.value} padding="none">
              <button
                type="button"
                onClick={() => setExpandedCategory(isExpanded ? null : cat.value)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-accent/5 transition-colors"
              >
                <div className="text-left">
                  <span className="font-semibold text-sm">{cat.label}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({tierEntries.length} tier{tierEntries.length > 1 ? 's' : ''})
                  </span>
                </div>
                <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform', isExpanded && 'rotate-180')} />
              </button>

              {isExpanded && (
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {tierEntries.map(([tierKey, fee]) => (
                      <div key={tierKey} className="rounded-lg border border-white/10 p-3 space-y-2">
                        <h4 className="text-xs font-semibold text-green-500">
                          {getTierLabel(cat.value, tierKey as import('@/types/license').LicenseTier)}
                        </h4>
                        <div className="space-y-1.5 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Application</span>
                            <span className="font-mono text-xs">{formatCurrencyFull(fee.applicationFee)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">License</span>
                            <span className="font-mono text-xs">{formatCurrencyFull(fee.licenseFee)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Annual Renewal</span>
                            <span className="font-mono text-xs">{formatCurrencyFull(fee.annualRenewal)}</span>
                          </div>
                          <div className="flex justify-between border-t border-white/10 pt-1.5">
                            <span className="font-medium">First Year Total</span>
                            <span className="font-mono text-xs font-semibold text-green-500">{formatCurrencyFull(fee.totalFirstYear)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </GlassCard>
          )
        })}
      </div>

      {/* Additional Fees */}
      <GlassCard padding="md">
        <h3 className="font-semibold text-sm mb-3">Additional Fees</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Security Clearance (per person)</span>
            <span className="font-mono text-xs">{formatCurrencyFull(ADDITIONAL_FEES.securityClearancePerPerson)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Annual Inspection</span>
            <span className="font-mono text-xs">{formatCurrencyFull(ADDITIONAL_FEES.annualInspection)}</span>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
