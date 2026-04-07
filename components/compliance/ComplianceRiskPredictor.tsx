'use client'

import { AlertTriangle, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GlassCard } from '@/design-system/glass-card'
import { StryderBadge } from '@/components/ai/StryderBadge'
import { aiInsights } from '@/data/mock-ai-insights'

export function ComplianceRiskPredictor() {
  const predictions = aiInsights.compliance

  return (
    <GlassCard padding="md" className="border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-500/5 to-transparent">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        <h3 className="text-sm font-semibold text-foreground">AI Compliance Risk Predictor</h3>
        <StryderBadge />
      </div>
      <div className="space-y-2.5">
        {predictions.map((pred, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 rounded-xl glass border border-border hover:bg-accent/5 transition-colors"
          >
            <div className="flex items-center justify-center shrink-0">
              <RiskIndicator score={pred.riskScore} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{pred.farmName}</p>
              <p className="text-xs text-muted-foreground truncate">{pred.reason}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
              <span
                className={cn(
                  'text-sm font-bold font-mono tabular-nums',
                  pred.riskScore >= 70 ? 'text-red-500' :
                  pred.riskScore >= 50 ? 'text-amber-500' : 'text-emerald-500'
                )}
              >
                {pred.riskScore}%
              </span>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground mt-3">
        Risk scores based on violation history, inspection patterns, and reporting compliance. Updated hourly.
      </p>
    </GlassCard>
  )
}

function RiskIndicator({ score }: { score: number }) {
  const color = score >= 70 ? 'bg-red-500' : score >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
  const pulse = score >= 70

  return (
    <div className="relative">
      <div className={cn('h-3 w-3 rounded-full', color)} />
      {pulse && (
        <div className={cn('absolute inset-0 h-3 w-3 rounded-full animate-ping', color, 'opacity-50')} />
      )}
    </div>
  )
}
