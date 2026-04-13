'use client'

import { Brain } from 'lucide-react'
import { GlassCard } from '@/design-system/glass-card'
import { StryderBadge } from '@/components/ai/StryderBadge'
import { TypewriterText } from '@/components/ai/TypewriterText'
import { aiInsights } from '@/data/mock-ai-insights'

export function AiDashboardSummary() {
  const insight = aiInsights.dashboard[0]

  return (
    <GlassCard
      padding="md"
      gradientBorder
      className="border-l-4 border-l-emerald-500 bg-gradient-to-r from-emerald-500/5 to-transparent"
    >
      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shrink-0">
          <Brain className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-semibold text-foreground">{insight.title}</h3>
            <StryderBadge size="md" />
            <span className="ml-auto text-[11px] text-muted-foreground tabular-nums">
              Confidence: {insight.confidence}%
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <TypewriterText text={insight.insight} speed={10} />
          </p>
        </div>
      </div>
    </GlassCard>
  )
}
