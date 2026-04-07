'use client'

import { CheckCircle2, XCircle, AlertCircle, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GlassCard } from '@/design-system/glass-card'
import { StryderBadge } from './StryderBadge'
import { TypewriterText } from './TypewriterText'

export interface AiReviewFlag {
  label: string
  severity: 'pass' | 'warning' | 'fail'
}

interface AiReviewPanelProps {
  verdict: 'pass' | 'fail' | 'review'
  riskScore: number
  flags: AiReviewFlag[]
  recommendation: string
  reviewDate?: string
  className?: string
}

const verdictConfig = {
  pass: {
    label: 'APPROVED',
    icon: CheckCircle2,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    ring: 'text-emerald-500',
  },
  fail: {
    label: 'REJECTED',
    icon: XCircle,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    ring: 'text-red-500',
  },
  review: {
    label: 'NEEDS REVIEW',
    icon: AlertCircle,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    ring: 'text-amber-500',
  },
}

const flagSeverityStyles = {
  pass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
  fail: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
}

export function AiReviewPanel({
  verdict,
  riskScore,
  flags,
  recommendation,
  reviewDate,
  className,
}: AiReviewPanelProps) {
  const config = verdictConfig[verdict]
  const VerdictIcon = config.icon
  const riskColor = riskScore <= 30 ? 'text-emerald-500' : riskScore <= 60 ? 'text-amber-500' : 'text-red-500'

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-emerald-500" />
        <h3 className="font-semibold text-foreground">AI First-Pass Review</h3>
        <StryderBadge size="md" />
      </div>

      {/* Verdict + Risk Score */}
      <div className="grid grid-cols-2 gap-3">
        <GlassCard padding="sm" className={cn('flex flex-col items-center gap-2', config.bg, 'border', config.border)}>
          <VerdictIcon className={cn('h-8 w-8', config.color)} />
          <span className={cn('text-sm font-bold', config.color)}>{config.label}</span>
          <span className="text-[11px] text-muted-foreground">AI Verdict</span>
        </GlassCard>

        <GlassCard padding="sm" className="flex flex-col items-center gap-2">
          <div className="relative h-16 w-16">
            <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
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
                strokeWidth="3"
                strokeDasharray={`${riskScore}, 100`}
                className={riskColor}
              />
            </svg>
            <span className={cn('absolute inset-0 flex items-center justify-center text-lg font-bold font-mono', riskColor)}>
              {riskScore}
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground">Risk Score</span>
        </GlassCard>
      </div>

      {/* Flags */}
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Review Flags</h4>
        <div className="flex flex-wrap gap-1.5">
          {flags.map((flag, i) => (
            <span
              key={i}
              className={cn(
                'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border',
                flagSeverityStyles[flag.severity]
              )}
            >
              {flag.severity === 'pass' && <CheckCircle2 className="h-3 w-3" />}
              {flag.severity === 'warning' && <AlertCircle className="h-3 w-3" />}
              {flag.severity === 'fail' && <XCircle className="h-3 w-3" />}
              {flag.label}
            </span>
          ))}
        </div>
      </div>

      {/* Recommendation */}
      <GlassCard padding="sm" className="border-l-4 border-l-emerald-500 bg-emerald-500/5">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">AI Recommendation</h4>
        <p className="text-sm text-foreground leading-relaxed">
          <TypewriterText text={recommendation} speed={10} />
        </p>
      </GlassCard>

      {reviewDate && (
        <p className="text-[11px] text-muted-foreground text-right">
          Reviewed: {reviewDate}
        </p>
      )}
    </div>
  )
}
