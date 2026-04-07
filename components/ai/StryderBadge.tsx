'use client'

import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StryderBadgeProps {
  size?: 'sm' | 'md'
  className?: string
}

export function StryderBadge({ size = 'sm', className }: StryderBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-semibold tracking-wide',
        'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400',
        'border border-emerald-500/30',
        size === 'sm' && 'px-2 py-0.5 text-[10px]',
        size === 'md' && 'px-3 py-1 text-xs',
        className
      )}
    >
      <Sparkles className={cn(size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3')} />
      STRYDER AI
    </span>
  )
}
