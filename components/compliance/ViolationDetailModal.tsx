'use client'

import { useComplianceStore } from '@/store/useComplianceStore'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { GlassCard } from '@/design-system/glass-card'
import { AiInsightCard } from '@/components/ai/AiInsightCard'
import { formatDate, formatCurrencyFull } from '@/utils/format'
import { cn } from '@/lib/utils'
import { CheckCircle, Circle, Clock } from 'lucide-react'
import type { ViolationStatus } from '@/types/compliance'

const severityStyles: Record<string, string> = {
  Critical: 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_12px_rgba(239,68,68,0.4)]',
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

const STEPS = ['Detected', 'Acknowledged', 'Corrective Action', 'Resolved'] as const

function getStepStates(status: ViolationStatus) {
  switch (status) {
    case 'resolved':
      return ['completed', 'completed', 'completed', 'completed'] as const
    case 'under-appeal':
      return ['completed', 'completed', 'current', 'future'] as const
    case 'open':
    default:
      return ['completed', 'future', 'future', 'future'] as const
  }
}

function ResolutionStepper({ status }: { status: ViolationStatus }) {
  const states = getStepStates(status)

  return (
    <div className="flex items-center justify-between w-full">
      {STEPS.map((step, idx) => {
        const state = states[idx]
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              {state === 'completed' ? (
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              ) : state === 'current' ? (
                <Clock className="h-5 w-5 text-amber-400" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground/30" />
              )}
              <span className={cn(
                'text-[10px] font-medium text-center whitespace-nowrap',
                state === 'completed' ? 'text-emerald-400' :
                state === 'current' ? 'text-amber-400' : 'text-muted-foreground/40'
              )}>
                {step}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={cn(
                'h-0.5 flex-1 mx-2 rounded-full mt-[-18px]',
                state === 'completed' ? 'bg-emerald-500/50' : 'bg-muted-foreground/15'
              )} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export function ViolationDetailModal() {
  const selectedViolationId = useComplianceStore((s) => s.selectedViolationId)
  const setSelectedViolation = useComplianceStore((s) => s.setSelectedViolation)
  const violations = useComplianceStore((s) => s.violations)

  const violation = violations.find((v) => v.id === selectedViolationId)

  return (
    <Dialog
      open={selectedViolationId !== null}
      onOpenChange={(open) => {
        if (!open) setSelectedViolation(null)
      }}
    >
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        {violation && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {violation.type}
              </DialogTitle>
              <div className="mt-1">
                <span className={cn(
                  'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
                  severityStyles[violation.severity]
                )}>
                  {violation.severity}
                </span>
              </div>
            </DialogHeader>

            {/* Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Farm Name</p>
                <p className="text-sm font-medium">{violation.farmName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">License Number</p>
                <p className="text-sm font-medium font-mono">{violation.licenseNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Detected Date</p>
                <p className="text-sm font-medium">{formatDate(violation.detectedDate)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Resolved Date</p>
                <p className="text-sm font-medium">
                  {violation.resolvedDate
                    ? formatDate(violation.resolvedDate)
                    : 'Unresolved'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Penalty</p>
                <p className={cn(
                  'font-bold',
                  violation.penaltyPKR != null ? 'text-lg text-red-400' : 'text-sm text-muted-foreground'
                )}>
                  {violation.penaltyPKR != null
                    ? formatCurrencyFull(violation.penaltyPKR)
                    : 'No penalty'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Status</p>
                <span className={cn(
                  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                  statusStyles[violation.status]
                )}>
                  {statusLabels[violation.status]}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-2">Description</p>
              <GlassCard padding="sm">
                <p className="text-sm text-foreground leading-relaxed">
                  {violation.description}
                </p>
              </GlassCard>
            </div>

            {/* Resolution Status Stepper */}
            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-3">Resolution Progress</p>
              <GlassCard padding="sm">
                <ResolutionStepper status={violation.status} />
              </GlassCard>
            </div>

            {/* AI Assessment */}
            <div className="mt-4">
              <AiInsightCard
                title="Re-offense Risk Prediction"
                insight={
                  violation.severity === 'Critical'
                    ? `This critical ${violation.type.toLowerCase()} violation at ${violation.farmName} indicates a high re-offense probability (78%). Historical data shows similar violations at this severity level tend to recur within 6 months without sustained corrective intervention. Recommend enhanced monitoring and mandatory compliance training.`
                    : violation.severity === 'Major'
                      ? `Based on pattern analysis, ${violation.farmName} has a moderate re-offense risk (45%) for ${violation.type.toLowerCase()} violations. Similar major violations in the sector show improvement with targeted corrective actions. Recommend follow-up inspection within 90 days.`
                      : `${violation.farmName} presents a low re-offense risk (18%) for this minor ${violation.type.toLowerCase()} violation. Most farms resolve similar issues promptly and maintain compliance thereafter. Standard monitoring frequency is sufficient.`
                }
                severity={
                  violation.severity === 'Critical' ? 'critical' :
                  violation.severity === 'Major' ? 'warning' : 'info'
                }
                confidence={
                  violation.severity === 'Critical' ? 88 :
                  violation.severity === 'Major' ? 82 : 91
                }
              />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
