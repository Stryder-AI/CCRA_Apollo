'use client'

import Link from 'next/link'
import { GlassCard } from '@/design-system/glass-card'
import { regionalData } from '@/data/mock-stats'

export function RegionalBreakdown() {
  return (
    <Link href="/analytics" className="block">
      <GlassCard hover glow="green" className="cursor-pointer">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Regional Breakdown</h3>
        <div className="space-y-4">
          {regionalData.map((region) => (
            <div key={region.region}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium">{region.region}</span>
                <span className="text-sm font-mono text-muted-foreground">{region.farms} farms</span>
              </div>
              <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-ccra-green transition-all duration-700 ease-out"
                  style={{ width: `${region.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </Link>
  )
}
