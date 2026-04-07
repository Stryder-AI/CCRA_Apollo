'use client'

import { DataExchangeLog } from '@/types/agency'
import { timeAgo } from '@/utils/format'
import { cn } from '@/lib/utils'
import { AiInsightCard } from '@/components/ai/AiInsightCard'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  ShieldAlert,
  Globe,
  FileCode,
  Archive,
  HardDrive,
  Database,
} from 'lucide-react'

interface DataExchangeDetailModalProps {
  log: DataExchangeLog | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const logStatusColors: Record<string, string> = {
  success: 'bg-ccra-green/10 text-ccra-green border-ccra-green/30',
  failed: 'bg-ccra-red/10 text-ccra-red border-ccra-red/30',
  pending: 'bg-ccra-gold/10 text-ccra-gold border-ccra-gold/30',
}

function getRecordBreakdown(dataType: string, recordCount: number) {
  const breakdowns: Record<string, { category: string; pct: number }[]> = {
    'Farm Registration Records': [
      { category: 'New Registrations', pct: 0.4 },
      { category: 'Updated Records', pct: 0.35 },
      { category: 'Status Changes', pct: 0.15 },
      { category: 'Deregistrations', pct: 0.1 },
    ],
    'Seizure Intelligence Reports': [
      { category: 'Active Seizure Reports', pct: 0.5 },
      { category: 'Investigation Updates', pct: 0.3 },
      { category: 'Evidence Records', pct: 0.2 },
    ],
    'Licensed Entity Database': [
      { category: 'Active Licenses', pct: 0.6 },
      { category: 'Suspended Licenses', pct: 0.15 },
      { category: 'Pending Applications', pct: 0.2 },
      { category: 'Revoked Licenses', pct: 0.05 },
    ],
    default: [
      { category: 'Primary Records', pct: 0.5 },
      { category: 'Metadata', pct: 0.25 },
      { category: 'Audit Trail', pct: 0.15 },
      { category: 'Checksums', pct: 0.1 },
    ],
  }

  const items = breakdowns[dataType] || breakdowns.default
  return items.map((item) => ({
    ...item,
    count: Math.max(1, Math.round(recordCount * item.pct)),
  }))
}

export function DataExchangeDetailModal({
  log,
  open,
  onOpenChange,
}: DataExchangeDetailModalProps) {
  if (!log) return null

  const transferSize = (log.recordCount * 2.4).toFixed(1)
  const breakdown = getRecordBreakdown(log.dataType, log.recordCount)

  const aiInsight =
    log.status === 'success'
      ? `Data exchange completed successfully with ${log.recordCount} records transferred. All records passed integrity verification and encryption was ${log.encryptionVerified ? 'verified' : 'NOT verified'}. Transfer throughput was within normal parameters.`
      : log.status === 'failed'
        ? `Data exchange failed during transfer. ${log.recordCount} records were queued but not delivered. ${!log.encryptionVerified ? 'Encryption handshake failed — likely due to expired certificates.' : 'Encryption was verified but the transfer was interrupted.'} Recommend retrying with manual certificate validation.`
        : `Data exchange is currently pending. ${log.recordCount} records are queued for transfer. Monitor for completion within the next 30 minutes.`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="sm:max-w-lg glass border border-border/50 max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="text-lg">Data Exchange Details</DialogTitle>
          <DialogDescription>
            Exchange ID: <span className="font-mono text-foreground">{log.id.toUpperCase()}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Key Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="glass rounded-xl h-12 w-12 flex items-center justify-center shrink-0">
              {log.direction === 'outbound' ? (
                <ArrowUpRight className="h-6 w-6 text-ccra-green" />
              ) : (
                <ArrowDownLeft className="h-6 w-6 text-blue-500" />
              )}
            </div>
            <div>
              <h3 className="text-base font-semibold">{log.agencyName}</h3>
              <p className="text-xs text-muted-foreground capitalize">{log.direction} Transfer</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize border',
                logStatusColors[log.status]
              )}
            >
              {log.status}
            </span>
            <div className="flex items-center gap-1 text-xs">
              {log.encryptionVerified ? (
                <>
                  <ShieldCheck className="h-3.5 w-3.5 text-ccra-green" />
                  <span className="text-ccra-green font-medium">Encrypted</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="h-3.5 w-3.5 text-ccra-red" />
                  <span className="text-ccra-red font-medium">Not Verified</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Exchange Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="glass rounded-lg p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Database className="h-3.5 w-3.5" />
              <span className="text-[10px] uppercase tracking-wider font-medium">Data Type</span>
            </div>
            <p className="text-sm font-medium">{log.dataType}</p>
          </div>
          <div className="glass rounded-lg p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <HardDrive className="h-3.5 w-3.5" />
              <span className="text-[10px] uppercase tracking-wider font-medium">Record Count</span>
            </div>
            <p className="text-sm font-medium font-mono">{log.recordCount} records</p>
          </div>
          <div className="glass rounded-lg p-3 space-y-1 col-span-2">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className="text-[10px] uppercase tracking-wider font-medium">Timestamp</span>
            </div>
            <p className="text-sm font-medium">
              {new Date(log.timestamp).toLocaleString('en-PK', {
                dateStyle: 'full',
                timeStyle: 'short',
              })}{' '}
              <span className="text-muted-foreground text-xs">({timeAgo(log.timestamp)})</span>
            </p>
          </div>
        </div>

        {/* Transfer Details */}
        <div className="glass rounded-lg p-4 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Transfer Details
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" />
                Protocol
              </span>
              <span className="font-mono text-xs">HTTPS / TLS 1.3</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <FileCode className="h-3.5 w-3.5" />
                Data Format
              </span>
              <span className="font-mono text-xs">JSON-LD</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Archive className="h-3.5 w-3.5" />
                Compression
              </span>
              <span className="font-mono text-xs">GZIP</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <HardDrive className="h-3.5 w-3.5" />
                Transfer Size
              </span>
              <span className="font-mono text-xs">{transferSize} KB</span>
            </div>
          </div>
        </div>

        {/* Record Breakdown */}
        <div className="glass rounded-lg p-4 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Record Breakdown
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-2 font-medium text-muted-foreground">Category</th>
                  <th className="pb-2 font-medium text-muted-foreground text-right">Count</th>
                  <th className="pb-2 font-medium text-muted-foreground text-right">Share</th>
                </tr>
              </thead>
              <tbody>
                {breakdown.map((item) => (
                  <tr key={item.category} className="border-b border-border/30">
                    <td className="py-2">{item.category}</td>
                    <td className="py-2 text-right font-mono">{item.count}</td>
                    <td className="py-2 text-right text-muted-foreground">
                      {Math.round(item.pct * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Assessment */}
        <AiInsightCard
          title="Exchange Analysis"
          insight={aiInsight}
          severity={log.status === 'failed' ? 'critical' : log.status === 'pending' ? 'warning' : 'info'}
          confidence={log.status === 'success' ? 97 : log.status === 'failed' ? 84 : 72}
          animate={false}
        />
      </DialogContent>
    </Dialog>
  )
}
