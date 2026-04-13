'use client'

import { cn } from '@/lib/utils'
import { Inbox } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  className?: string
}

export function EmptyState({ icon: Icon = Inbox, title, description, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      <div className="relative mb-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/10 animate-[float_3s_ease-in-out_infinite]">
          <Icon className="h-7 w-7 text-muted-foreground/50" />
        </div>
      </div>
      <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
      {description && <p className="text-xs text-muted-foreground/70 mt-1 max-w-xs">{description}</p>}
    </div>
  )
}
