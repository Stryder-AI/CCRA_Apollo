'use client'

import { useComplianceStore } from '@/store/useComplianceStore'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { GlassCard } from '@/design-system/glass-card'
import { AiInsightCard } from '@/components/ai/AiInsightCard'
import { formatDate, formatCurrencyFull } from '@/utils/format'
import { cn } from '@/lib/utils'
import { Camera, MapPin, User, Calendar, CheckCircle, AlertTriangle } from 'lucide-react'

const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  'in-progress': 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  completed: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border border-red-500/30',
}

function scoreColor(score: number) {
  if (score >= 90) return 'text-emerald-400'
  if (score >= 70) return 'text-amber-400'
  return 'text-red-400'
}

function scoreBorderColor(score: number | undefined) {
  if (score == null) return 'border-l-muted-foreground'
  if (score >= 90) return 'border-l-emerald-500'
  if (score >= 70) return 'border-l-amber-500'
  return 'border-l-red-500'
}

export function InspectionDetailModal() {
  const selectedInspectionId = useComplianceStore((s) => s.selectedInspectionId)
  const setSelectedInspection = useComplianceStore((s) => s.setSelectedInspection)
  const inspections = useComplianceStore((s) => s.inspections)
  const violations = useComplianceStore((s) => s.violations)
  const setSelectedViolation = useComplianceStore((s) => s.setSelectedViolation)

  const inspection = inspections.find((i) => i.id === selectedInspectionId)

  const relatedViolations = violations.filter(
    (v) => v.inspectionId === selectedInspectionId
  )

  return (
    <Dialog
      open={selectedInspectionId !== null}
      onOpenChange={(open) => {
        if (!open) setSelectedInspection(null)
      }}
    >
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        {inspection && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {inspection.farmName}
              </DialogTitle>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <User className="h-3.5 w-3.5" />
                  {inspection.inspectorName}
                </span>
                <span className={cn(
                  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                  'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                )}>
                  <MapPin className="h-3 w-3 mr-1" />
                  {inspection.region}
                </span>
              </div>
            </DialogHeader>

            {/* Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Scheduled Date</p>
                <p className="text-sm font-medium flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  {formatDate(inspection.scheduledDate)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Completed Date</p>
                <p className="text-sm font-medium">
                  {inspection.completedDate
                    ? formatDate(inspection.completedDate)
                    : 'Pending'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Status</p>
                <span className={cn(
                  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                  statusColors[inspection.status]
                )}>
                  {inspection.status}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Compliance Score</p>
                {inspection.complianceScore != null ? (
                  <p className={cn('text-2xl font-bold', scoreColor(inspection.complianceScore))}>
                    {inspection.complianceScore}%
                  </p>
                ) : (
                  <p className="text-2xl font-bold text-muted-foreground">N/A</p>
                )}
              </div>
            </div>

            {/* Findings */}
            {inspection.findings && (
              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-2">Findings</p>
                <GlassCard
                  padding="sm"
                  className={cn('border-l-4', scoreBorderColor(inspection.complianceScore))}
                >
                  <p className="text-sm text-foreground leading-relaxed">
                    {inspection.findings}
                  </p>
                </GlassCard>
              </div>
            )}

            {/* Photo Evidence Placeholder */}
            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-2">Photo Evidence</p>
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-center gap-2 rounded-xl bg-muted/30 border border-border/50 h-28"
                  >
                    <Camera className="h-5 w-5 text-muted-foreground/50" />
                    <span className="text-xs text-muted-foreground/50">Evidence Photo</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Risk Assessment */}
            <div className="mt-4">
              <AiInsightCard
                title="Risk Assessment"
                insight={`${inspection.farmName} in ${inspection.region} shows a ${
                  inspection.complianceScore != null && inspection.complianceScore >= 85
                    ? 'positive compliance trajectory with consistent adherence to regulatory standards. Recommend maintaining current inspection frequency.'
                    : inspection.complianceScore != null && inspection.complianceScore >= 70
                      ? 'moderate compliance trajectory. Some areas require improvement. Recommend scheduling a follow-up inspection within 60 days to verify corrective actions.'
                      : 'concerning compliance pattern that warrants closer monitoring. Recommend increasing inspection frequency and issuing a formal improvement notice.'
                }`}
                severity={
                  inspection.complianceScore != null && inspection.complianceScore >= 85
                    ? 'info'
                    : inspection.complianceScore != null && inspection.complianceScore >= 70
                      ? 'warning'
                      : 'critical'
                }
                confidence={inspection.complianceScore != null ? Math.min(92, inspection.complianceScore + 5) : 75}
              />
            </div>

            {/* Related Violations */}
            {relatedViolations.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-2">
                  Related Violations ({relatedViolations.length})
                </p>
                <div className="space-y-2">
                  {relatedViolations.map((violation) => (
                    <GlassCard
                      key={violation.id}
                      padding="sm"
                      hover
                      onClick={() => {
                        setSelectedInspection(null)
                        setSelectedViolation(violation.id)
                      }}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className={cn(
                            'h-4 w-4',
                            violation.severity === 'Critical' ? 'text-red-400' :
                            violation.severity === 'Major' ? 'text-amber-400' : 'text-gray-400'
                          )} />
                          <span className="text-sm font-medium">{violation.type}</span>
                          <span className={cn(
                            'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium',
                            violation.severity === 'Critical'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : violation.severity === 'Major'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                          )}>
                            {violation.severity}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {violation.penaltyPKR != null ? formatCurrencyFull(violation.penaltyPKR) : 'No penalty'}
                        </span>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
