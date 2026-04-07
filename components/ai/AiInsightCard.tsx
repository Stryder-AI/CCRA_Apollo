'use client'

import { useState } from 'react'
import { Brain, TrendingUp, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GlassCard } from '@/design-system/glass-card'
import { StryderBadge } from './StryderBadge'
import { TypewriterText } from './TypewriterText'

interface AiInsightCardProps {
  title: string
  insight: string
  severity?: 'info' | 'warning' | 'critical'
  confidence?: number
  className?: string
  animate?: boolean
}

const severityConfig = {
  info: {
    border: 'border-l-emerald-500',
    icon: Info,
    iconColor: 'text-emerald-500',
    bg: 'bg-emerald-500/5',
  },
  warning: {
    border: 'border-l-amber-500',
    icon: AlertTriangle,
    iconColor: 'text-amber-500',
    bg: 'bg-amber-500/5',
  },
  critical: {
    border: 'border-l-red-500',
    icon: AlertTriangle,
    iconColor: 'text-red-500',
    bg: 'bg-red-500/5',
  },
}

export function AiInsightCard({
  title,
  insight,
  severity = 'info',
  confidence,
  className,
  animate = true,
}: AiInsightCardProps) {
  const [hasAnimated, setHasAnimated] = useState(false)
  const config = severityConfig[severity]
  const Icon = config.icon

  return (
    <GlassCard
      padding="sm"
      className={cn(
        'border-l-4',
        config.border,
        config.bg,
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={cn('mt-0.5 p-1.5 rounded-lg bg-background/50', config.iconColor)}>
            <Brain className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <h4 className="text-sm font-semibold text-foreground">{title}</h4>
              <StryderBadge />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {animate && !hasAnimated ? (
                <TypewriterText
                  text={insight}
                  speed={12}
                  onComplete={() => setHasAnimated(true)}
                />
              ) : (
                insight
              )}
            </p>
          </div>
        </div>
        {confidence !== undefined && (
          <div className="flex flex-col items-center gap-0.5 shrink-0">
            <div className="relative h-10 w-10">
              <svg className="h-10 w-10 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-border"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeDasharray={`${confidence}, 100`}
                  className="text-emerald-500"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold font-mono text-foreground">
                {confidence}
              </span>
            </div>
            <span className="text-[9px] text-muted-foreground">conf.</span>
          </div>
        )}
      </div>
    </GlassCard>
  )
}
