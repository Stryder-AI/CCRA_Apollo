'use client'

import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export function AnimatedGradientBorder({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('relative rounded-2xl p-[1px] overflow-hidden', className)}>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 animate-gradient-x" />
      <div className="relative rounded-2xl bg-background">
        {children}
      </div>
    </div>
  )
}
