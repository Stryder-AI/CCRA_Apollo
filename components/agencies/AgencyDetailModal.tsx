'use client'

import { Agency } from '@/types/agency'
import { dataExchangeLogs } from '@/data/mock-agencies'
import { timeAgo, formatNumber } from '@/utils/format'
import { cn } from '@/lib/utils'
import { AiInsightCard } from '@/components/ai/AiInsightCard'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Shield,
  Lock,
  Clock,
  Database,
  Globe,
  UserCircle,
  RefreshCw,
  ShieldOff,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react'

interface AgencyDetailModalProps {
  agency: Agency | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const statusConfig = {
  connected: {
    dot: 'bg-ccra-green',
    label: 'Connected',
    color: 'text-ccra-green',
    bg: 'bg-ccra-green/10 border-ccra-green/30',
  },
  pending: {
    dot: 'bg-amber-500',
    label: 'Pending',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10 border-amber-500/30',
  },
  offline: {
    dot: 'bg-ccra-red',
    label: 'Offline',
    color: 'text-ccra-red',
    bg: 'bg-ccra-red/10 border-ccra-red/30',
  },
}

const accessLevelColors: Record<string, string> = {
  full: 'bg-ccra-green/10 text-ccra-green',
  limited: 'bg-ccra-gold/10 text-ccra-gold',
  'read-only': 'bg-blue-500/10 text-blue-500',
}

const logStatusColors: Record<string, string> = {
  success: 'bg-ccra-green/10 text-ccra-green',
  failed: 'bg-ccra-red/10 text-ccra-red',
  pending: 'bg-ccra-gold/10 text-ccra-gold',
}

function getAiInsight(agency: Agency) {
  if (agency.status === 'connected') {
    return {
      insight: `${agency.abbreviation} connection is healthy with ${formatNumber(agency.dataShared)} records shared and ${formatNumber(agency.dataReceived)} received. Encryption verified at ${agency.encryptionLevel}. Last sync was ${timeAgo(agency.lastSync)} — within normal operational parameters. No anomalies detected in recent data exchanges.`,
      severity: 'info' as const,
      confidence: 95,
    }
  }
  if (agency.status === 'pending') {
    return {
      insight: `${agency.abbreviation} integration is pending. Last successful sync was ${timeAgo(agency.lastSync)}. The most recent data exchange failed — likely due to expired API certificates. Recommend immediate outreach to ${agency.contactPerson || 'the agency contact'} to resolve connectivity issues before data staleness exceeds 14 days.`,
      severity: 'warning' as const,
      confidence: 87,
    }
  }
  return {
    insight: `${agency.abbreviation} is currently offline. No data exchange has occurred recently. Investigate infrastructure or credential issues. Escalate to IT Security team if not resolved within 24 hours.`,
    severity: 'critical' as const,
    confidence: 78,
  }
}

const mockEndpoints: Record<string, string> = {
  ag001: 'api.isi.gov.pk/ccra/v2',
  ag002: 'api.ib.gov.pk/ccra/v2',
  ag003: 'api.anf.gov.pk/ccra/v2',
  ag004: 'api.drap.gov.pk/ccra/v2',
  ag005: 'api.kpet.gkp.pk/ccra/v1',
  ag006: 'api.blet.gob.pk/ccra/v1',
}

export function AgencyDetailModal({
  agency,
  open,
  onOpenChange,
}: AgencyDetailModalProps) {
  if (!agency) return null

  const status = statusConfig[agency.status]
  const ai = getAiInsight(agency)
  const agencyLogs = dataExchangeLogs
    .filter((log) => log.agencyId === agency.id)
    .slice(0, 5)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="sm:max-w-lg glass border border-border/50 max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="text-lg">Agency Details</DialogTitle>
          <DialogDescription>Inter-agency data exchange profile</DialogDescription>
        </DialogHeader>

        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="glass rounded-xl h-16 w-16 flex items-center justify-center shrink-0">
            <span className="text-xl font-bold tracking-tight">{agency.abbreviation}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold">{agency.name}</h3>
            <div className="flex items-center gap-2 mt-1.5">
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border',
                  status.bg,
                  status.color
                )}
              >
                <span
                  className={cn(
                    'h-1.5 w-1.5 rounded-full',
                    status.dot,
                    agency.status === 'connected' && 'animate-pulse'
                  )}
                />
                {status.label}
              </span>
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium capitalize',
                  accessLevelColors[agency.accessLevel]
                )}
              >
                {agency.accessLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="glass rounded-lg p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Shield className="h-3.5 w-3.5" />
              <span className="text-[10px] uppercase tracking-wider font-medium">Access Level</span>
            </div>
            <p className="text-sm font-medium capitalize">{agency.accessLevel}</p>
          </div>
          <div className="glass rounded-lg p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Lock className="h-3.5 w-3.5" />
              <span className="text-[10px] uppercase tracking-wider font-medium">Encryption</span>
            </div>
            <p className="text-xs font-mono font-medium">{agency.encryptionLevel}</p>
          </div>
          <div className="glass rounded-lg p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-[10px] uppercase tracking-wider font-medium">Last Sync</span>
            </div>
            <p className="text-sm font-medium">{timeAgo(agency.lastSync)}</p>
          </div>
          <div className="glass rounded-lg p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Database className="h-3.5 w-3.5" />
              <span className="text-[10px] uppercase tracking-wider font-medium">Records</span>
            </div>
            <p className="text-sm font-medium">
              {formatNumber(agency.dataShared)} sent / {formatNumber(agency.dataReceived)} recv
            </p>
          </div>
          <div className="glass rounded-lg p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Globe className="h-3.5 w-3.5" />
              <span className="text-[10px] uppercase tracking-wider font-medium">API Endpoint</span>
            </div>
            <p className="text-xs font-mono font-medium truncate">
              {mockEndpoints[agency.id] || 'api.agency.gov.pk/ccra/v1'}
            </p>
          </div>
          <div className="glass rounded-lg p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <UserCircle className="h-3.5 w-3.5" />
              <span className="text-[10px] uppercase tracking-wider font-medium">Contact</span>
            </div>
            <p className="text-xs font-medium">{agency.contactPerson || 'Not assigned'}</p>
          </div>
        </div>

        {/* Data Exchange History */}
        {agencyLogs.length > 0 && (
          <div className="glass rounded-lg p-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Recent Data Exchanges
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-2 font-medium text-muted-foreground">Time</th>
                    <th className="pb-2 font-medium text-muted-foreground text-center">Dir</th>
                    <th className="pb-2 font-medium text-muted-foreground">Data Type</th>
                    <th className="pb-2 font-medium text-muted-foreground text-right">Records</th>
                    <th className="pb-2 font-medium text-muted-foreground text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {agencyLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-border/30 hover:bg-accent/20 transition-colors"
                    >
                      <td className="py-2 text-muted-foreground whitespace-nowrap">
                        {timeAgo(log.timestamp)}
                      </td>
                      <td className="py-2 text-center">
                        {log.direction === 'outbound' ? (
                          <ArrowUpRight className="h-3.5 w-3.5 text-ccra-green mx-auto" />
                        ) : (
                          <ArrowDownLeft className="h-3.5 w-3.5 text-blue-500 mx-auto" />
                        )}
                      </td>
                      <td className="py-2 text-muted-foreground">{log.dataType}</td>
                      <td className="py-2 text-right font-mono">{log.recordCount}</td>
                      <td className="py-2 text-center">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium capitalize',
                            logStatusColors[log.status]
                          )}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* AI Assessment */}
        <AiInsightCard
          title="Connectivity Analysis"
          insight={ai.insight}
          severity={ai.severity}
          confidence={ai.confidence}
          animate={false}
        />

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex-1 gap-2"
            disabled
            onClick={() => {}}
          >
            <RefreshCw className="h-4 w-4" />
            Sync Now
          </Button>
          <Button
            variant="outline"
            className="flex-1 gap-2 text-ccra-red hover:text-ccra-red"
            disabled
            onClick={() => {}}
          >
            <ShieldOff className="h-4 w-4" />
            Revoke Access
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
