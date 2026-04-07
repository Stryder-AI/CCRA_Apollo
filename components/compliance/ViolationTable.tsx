'use client'

import { useComplianceStore } from '@/store/useComplianceStore'
import { GlassCard } from '@/design-system/glass-card'
import { formatCurrencyFull, formatDateShort } from '@/utils/format'
import { cn } from '@/lib/utils'
import type { SeverityLevel, ViolationStatus } from '@/types/compliance'

const severityStyles: Record<SeverityLevel, string> = {
  Critical: 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_8px_rgba(239,68,68,0.3)]',
  Major: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  Minor: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
}

const statusStyles: Record<ViolationStatus, string> = {
  open: 'bg-red-500/20 text-red-400 border border-red-500/30',
  resolved: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  'under-appeal': 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
}

const statusLabels: Record<ViolationStatus, string> = {
  open: 'Open',
  resolved: 'Resolved',
  'under-appeal': 'Under Appeal',
}

export function ViolationTable() {
  const violations = useComplianceStore((s) => s.violations)

  return (
    <GlassCard padding="none">
      <div className="p-4 border-b border-border/50">
        <h3 className="text-sm font-semibold tracking-tight">Violations</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{violations.length} total violations</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 text-left">
              <th className="px-4 py-3 font-medium text-muted-foreground text-xs">Farm Name</th>
              <th className="px-4 py-3 font-medium text-muted-foreground text-xs">License #</th>
              <th className="px-4 py-3 font-medium text-muted-foreground text-xs">Type</th>
              <th className="px-4 py-3 font-medium text-muted-foreground text-xs">Severity</th>
              <th className="px-4 py-3 font-medium text-muted-foreground text-xs">Description</th>
              <th className="px-4 py-3 font-medium text-muted-foreground text-xs">Detected</th>
              <th className="px-4 py-3 font-medium text-muted-foreground text-xs">Status</th>
              <th className="px-4 py-3 font-medium text-muted-foreground text-xs text-right">Penalty</th>
            </tr>
          </thead>
          <tbody>
            {violations.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground text-xs">
                  No violations recorded
                </td>
              </tr>
            ) : (
              violations.map((violation) => (
                <tr key={violation.id} className="border-b border-border/30 last:border-0 cursor-pointer hover:bg-accent/5 transition-colors" onClick={() => useComplianceStore.getState().setSelectedViolation(violation.id)}>
                  <td className="px-4 py-3 font-medium">{violation.farmName}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{violation.licenseNumber}</td>
                  <td className="px-4 py-3 text-muted-foreground">{violation.type}</td>
                  <td className="px-4 py-3">
                    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', severityStyles[violation.severity])}>
                      {violation.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[200px]">
                    <span className="block truncate" title={violation.description}>
                      {violation.description.length > 60
                        ? violation.description.slice(0, 60) + '...'
                        : violation.description}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDateShort(violation.detectedDate)}</td>
                  <td className="px-4 py-3">
                    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', statusStyles[violation.status])}>
                      {statusLabels[violation.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs">
                    {violation.penaltyPKR != null ? formatCurrencyFull(violation.penaltyPKR) : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </GlassCard>
  )
}
