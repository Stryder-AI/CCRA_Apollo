'use client'

import { cn } from '@/lib/utils'

export function SkeletonPulse({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={cn('animate-pulse rounded-lg bg-muted/50', className)} style={style} />
  )
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl border border-border/50 bg-card/50 p-6 space-y-4', className)}>
      <div className="flex items-center justify-between">
        <SkeletonPulse className="h-4 w-24" />
        <SkeletonPulse className="h-8 w-8 rounded-xl" />
      </div>
      <SkeletonPulse className="h-8 w-32" />
      <div className="flex items-center gap-2">
        <SkeletonPulse className="h-3 w-12" />
        <SkeletonPulse className="h-3 w-20" />
      </div>
      <SkeletonPulse className="h-10 w-full" />
    </div>
  )
}

export function SkeletonTable({ rows = 5, cols = 4, className }: { rows?: number; cols?: number; className?: string }) {
  return (
    <div className={cn('rounded-2xl border border-border/50 bg-card/50 overflow-hidden', className)}>
      {/* Header */}
      <div className="flex gap-4 p-4 border-b border-border/50">
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonPulse key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex gap-4 p-4 border-b border-border/30 last:border-0">
          {Array.from({ length: cols }).map((_, colIdx) => (
            <SkeletonPulse key={colIdx} className="h-4 flex-1" style={{ animationDelay: `${(rowIdx * cols + colIdx) * 100}ms` } as React.CSSProperties} />
          ))}
        </div>
      ))}
    </div>
  )
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border/50 bg-card/50 p-6">
          <SkeletonPulse className="h-4 w-32 mb-4" />
          <SkeletonPulse className="h-48 w-full rounded-xl" />
        </div>
        <div className="rounded-2xl border border-border/50 bg-card/50 p-6">
          <SkeletonPulse className="h-4 w-32 mb-4" />
          <SkeletonPulse className="h-48 w-full rounded-xl" />
        </div>
      </div>
      {/* Table */}
      <SkeletonTable />
    </div>
  )
}
