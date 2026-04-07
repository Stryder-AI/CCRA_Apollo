'use client'

import { GlassCard } from '@/design-system/glass-card'
import { FEE_SCHEDULE } from '@/config/constants'
import { formatCurrencyFull } from '@/utils/format'

export function FeeScheduleCard() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Fee Schedule</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FEE_SCHEDULE.map((fee) => (
          <GlassCard key={fee.type} hover glow="green" padding="md">
            <h3 className="font-semibold text-sm mb-4">{fee.type}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Application</span>
                <span className="font-mono text-xs">{formatCurrencyFull(fee.application)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Annual</span>
                <span className="font-mono text-xs">{formatCurrencyFull(fee.annual)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Renewal</span>
                <span className="font-mono text-xs">{formatCurrencyFull(fee.renewal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Inspection</span>
                <span className="font-mono text-xs">{formatCurrencyFull(fee.inspection)}</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
