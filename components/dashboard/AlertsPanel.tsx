'use client'

import { useState } from 'react'
import { GlassCard } from '@/design-system/glass-card'
import { alerts } from '@/data/mock-alerts'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { StryderBadge } from '@/components/ai/StryderBadge'
import { AlertTriangle, AlertCircle, Info, X, Clock } from 'lucide-react'
import { timeAgo } from '@/utils/format'

type AlertType = 'danger' | 'warning' | 'info'

const alertStyles: Record<AlertType, { icon: typeof AlertCircle; color: string; bg: string; border: string; label: string }> = {
  danger: { icon: AlertCircle, color: 'text-ccra-red', bg: 'bg-ccra-red/10', border: 'border-ccra-red/20', label: 'Critical' },
  warning: { icon: AlertTriangle, color: 'text-ccra-amber', bg: 'bg-ccra-amber/10', border: 'border-ccra-amber/20', label: 'Warning' },
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'Info' },
}

export function AlertsPanel() {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())
  const [selectedAlert, setSelectedAlert] = useState<typeof alerts[0] | null>(null)

  const unreadAlerts = alerts.filter((a) => !a.read && !dismissedIds.has(a.id))

  if (unreadAlerts.length === 0) return null

  return (
    <>
      <div className="space-y-3">
        {unreadAlerts.map((alert) => {
          const style = alertStyles[alert.type as AlertType] || alertStyles.info
          const Icon = style.icon
          const isAi = alert.title.includes('[STRYDER AI]')

          return (
            <GlassCard key={alert.id} padding="sm" className={cn('border cursor-pointer hover:bg-accent/30 transition-colors', style.border)}>
              <div className="flex gap-3" onClick={() => setSelectedAlert(alert)}>
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', style.bg)}>
                  <Icon className={cn('w-4 h-4', style.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{alert.title}</p>
                    {isAi && <StryderBadge size="sm" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{alert.message}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setDismissedIds((prev) => new Set([...prev, alert.id]))
                  }}
                  className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </GlassCard>
          )
        })}
      </div>

      {/* Alert Detail Modal */}
      <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
        <DialogContent>
          {selectedAlert && (() => {
            const style = alertStyles[selectedAlert.type as AlertType] || alertStyles.info
            const Icon = style.icon
            const isAi = selectedAlert.title.includes('[STRYDER AI]')

            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', style.bg)}>
                      <Icon className={cn('w-5 h-5', style.color)} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        {selectedAlert.title}
                        {isAi && <StryderBadge size="sm" />}
                      </div>
                      <div className="text-xs font-normal text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {selectedAlert.timestamp ? timeAgo(selectedAlert.timestamp) : 'Recently'}
                      </div>
                    </div>
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                  {/* Alert Message */}
                  <div className={cn('rounded-xl p-4 border', style.border, style.bg)}>
                    <p className="text-sm text-foreground">{selectedAlert.message}</p>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-[11px] text-muted-foreground">Severity</p>
                      <span className={cn('inline-flex items-center gap-1 mt-1 text-sm font-medium', style.color)}>
                        <Icon className="w-3.5 h-3.5" />
                        {style.label}
                      </span>
                    </div>
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-[11px] text-muted-foreground">Source</p>
                      <p className="text-sm font-medium mt-1">
                        {isAi ? 'STRYDER AI Engine' : 'System Monitor'}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-[11px] text-muted-foreground">Alert ID</p>
                      <p className="text-sm font-medium mt-1 font-mono text-xs">
                        {selectedAlert.id.toUpperCase()}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-[11px] text-muted-foreground">Status</p>
                      <p className="text-sm font-medium mt-1 text-amber-500">Active</p>
                    </div>
                  </div>

                  {/* AI Analysis for AI alerts */}
                  {isAi && (
                    <div className="rounded-xl border border-ccra-green/20 bg-ccra-green/5 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <StryderBadge size="sm" />
                        <span className="text-xs font-medium text-muted-foreground">AI Analysis</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        This alert was generated by STRYDER AI&apos;s anomaly detection engine analyzing real-time sensor data, historical patterns, and compliance trends across all registered farms. Confidence level: 94%. Recommended action: dispatch field inspector within 48 hours.
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setDismissedIds((prev) => new Set([...prev, selectedAlert.id]))
                        setSelectedAlert(null)
                      }}
                      className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => setSelectedAlert(null)}
                      className="flex-1 rounded-lg bg-ccra-green/10 border border-ccra-green/20 px-4 py-2 text-sm font-medium text-ccra-green hover:bg-ccra-green/20 transition-colors"
                    >
                      Acknowledge
                    </button>
                  </div>
                </div>
              </>
            )
          })()}
        </DialogContent>
      </Dialog>
    </>
  )
}
