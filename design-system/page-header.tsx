'use client'

import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  icon?: LucideIcon
  children?: React.ReactNode // for action buttons on the right
}

export function PageHeader({ title, subtitle, icon: Icon, children }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6 animate-slide-up">
      <div>
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/20">
              <Icon className="h-5 w-5 text-ccra-green" />
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold tracking-tight">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <div className="mt-3 h-[2px] w-24 bg-gradient-to-r from-green-500 to-emerald-400/0 rounded-full" />
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}
