'use client'

import { useComplianceStore } from '@/store/useComplianceStore'
import { GlassCard } from '@/design-system/glass-card'
import { formatDateShort } from '@/utils/format'
import { cn } from '@/lib/utils'

const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  'in-progress': 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  completed: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border border-red-500/30',
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score < 60
      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
      : score <= 80
        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'

  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', color)}>
      {score}%
    </span>
  )
}

export function InspectionTable() {
  const inspections = useComplianceStore((s) => s.inspections)

  const scheduled = inspections.filter((i) => i.status === 'scheduled' || i.status === 'in-progress')
  const completed = inspections.filter((i) => i.status === 'completed')

  return (
    <div className="space-y-6">
      {/* Scheduled Inspections */}
      <GlassCard padding="none">
        <div className="p-4 border-b border-border/50">
          <h3 className="text-sm font-semibold tracking-tight">Scheduled Inspections</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{scheduled.length} upcoming inspections</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground text-xs">Farm</th>
                <th className="px-4 py-3 font-medium text-muted-foreground text-xs">Inspector</th>
                <th className="px-4 py-3 font-medium text-muted-foreground text-xs">Date</th>
                <th className="px-4 py-3 font-medium text-muted-foreground text-xs">Region</th>
                <th className="px-4 py-3 font-medium text-muted-foreground text-xs">Status</th>
              </tr>
            </thead>
            <tbody>
              {scheduled.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground text-xs">
                    No scheduled inspections
                  </td>
                </tr>
              ) : (
                scheduled.map((inspection) => (
                  <tr key={inspection.id} className="border-b border-border/30 last:border-0 cursor-pointer hover:bg-accent/5 transition-colors" onClick={() => useComplianceStore.getState().setSelectedInspection(inspection.id)}>
                    <td className="px-4 py-3 font-medium">{inspection.farmName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{inspection.inspectorName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDateShort(inspection.scheduledDate)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{inspection.region}</td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', statusColors[inspection.status])}>
                        {inspection.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Completed Inspections */}
      <GlassCard padding="none">
        <div className="p-4 border-b border-border/50">
          <h3 className="text-sm font-semibold tracking-tight">Completed Inspections</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{completed.length} completed inspections</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground text-xs">Farm</th>
                <th className="px-4 py-3 font-medium text-muted-foreground text-xs">Inspector</th>
                <th className="px-4 py-3 font-medium text-muted-foreground text-xs">Completed</th>
                <th className="px-4 py-3 font-medium text-muted-foreground text-xs">Score</th>
                <th className="px-4 py-3 font-medium text-muted-foreground text-xs">Findings</th>
                <th className="px-4 py-3 font-medium text-muted-foreground text-xs">Region</th>
              </tr>
            </thead>
            <tbody>
              {completed.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground text-xs">
                    No completed inspections
                  </td>
                </tr>
              ) : (
                completed.map((inspection) => (
                  <tr key={inspection.id} className="border-b border-border/30 last:border-0 cursor-pointer hover:bg-accent/5 transition-colors" onClick={() => useComplianceStore.getState().setSelectedInspection(inspection.id)}>
                    <td className="px-4 py-3 font-medium">{inspection.farmName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{inspection.inspectorName}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {inspection.completedDate ? formatDateShort(inspection.completedDate) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {inspection.complianceScore != null ? (
                        <ScoreBadge score={inspection.complianceScore} />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">
                      {inspection.findings || '—'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{inspection.region}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
