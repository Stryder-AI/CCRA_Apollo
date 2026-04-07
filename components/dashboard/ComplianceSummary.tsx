'use client'

import Link from 'next/link'
import { GlassCard } from '@/design-system/glass-card'
import { AnimatedNumber } from '@/design-system/animated-number'
import { dashboardStats } from '@/data/mock-stats'

export function ComplianceSummary() {
  const { complianceRate } = dashboardStats
  const circumference = 2 * Math.PI * 45
  const offset = circumference - (complianceRate / 100) * circumference

  return (
    <Link href="/compliance" className="block">
      <GlassCard hover glow="green" className="cursor-pointer">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Compliance Overview</h3>
        <div className="flex items-center justify-center">
          <div className="relative w-28 h-28">
            <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted/30"
              />
              <circle
                cx="50" cy="50" r="45"
                fill="none"
                stroke="#22c55e"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{
                  '--circumference': circumference,
                  '--target-offset': offset,
                  animation: 'progressRing 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                } as React.CSSProperties}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <AnimatedNumber
                value={complianceRate}
                formatter={(v) => `${v.toFixed(1)}%`}
                className="text-xl font-semibold"
              />
              <span className="text-[10px] text-muted-foreground">Rate</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="text-center p-2 rounded-lg bg-accent">
            <p className="text-lg font-semibold font-mono">10</p>
            <p className="text-[11px] text-muted-foreground">Completed</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-accent">
            <p className="text-lg font-semibold font-mono">5</p>
            <p className="text-[11px] text-muted-foreground">Scheduled</p>
          </div>
        </div>
      </GlassCard>
    </Link>
  )
}
