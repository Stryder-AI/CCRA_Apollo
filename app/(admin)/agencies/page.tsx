'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { GlassCard } from '@/design-system/glass-card'
import { AiInsightCard } from '@/components/ai/AiInsightCard'
import { AgencyDetailModal } from '@/components/agencies/AgencyDetailModal'
import { DataExchangeDetailModal } from '@/components/agencies/DataExchangeDetailModal'
import { agencies, dataExchangeLogs } from '@/data/mock-agencies'
import { timeAgo, formatNumber } from '@/utils/format'
import { ArrowUpRight, ArrowDownLeft, ShieldCheck, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Agency, DataExchangeLog } from '@/types/agency'

const statusConfig = {
  connected: { dot: 'bg-ccra-green', label: 'Connected' },
  pending: { dot: 'bg-amber-500', label: 'Pending' },
  offline: { dot: 'bg-ccra-red', label: 'Offline' },
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

export default function AgenciesPage() {
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null)
  const [agencyModalOpen, setAgencyModalOpen] = useState(false)
  const [selectedLog, setSelectedLog] = useState<DataExchangeLog | null>(null)
  const [logModalOpen, setLogModalOpen] = useState(false)

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <PageHeader
        title="Inter-Agency Data Exchange"
        description="Secure data sharing with partner agencies"
      />

      {/* Agency Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agencies.map((agency) => {
          const status = statusConfig[agency.status]
          return (
            <GlassCard
              key={agency.id}
              hover
              glow={agency.status === 'connected' ? 'green' : agency.status === 'pending' ? 'gold' : 'red'}
              onClick={() => {
                setSelectedAgency(agency)
                setAgencyModalOpen(true)
              }}
            >
              <div className="space-y-3">
                {/* Header */}
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">{agency.abbreviation}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{agency.name}</p>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                  <span className={cn('h-2 w-2 rounded-full', status.dot, agency.status === 'connected' && 'animate-pulse')} />
                  <span className="text-xs font-medium">{status.label}</span>
                </div>

                {/* Details */}
                <div className="space-y-2 pt-2 border-t border-border/50">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Last Sync</span>
                    <span>{timeAgo(agency.lastSync)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Records Shared</span>
                    <span className="font-medium">{formatNumber(agency.dataShared)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Access Level</span>
                    <span className={cn(
                      'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium capitalize',
                      accessLevelColors[agency.accessLevel]
                    )}>
                      {agency.accessLevel}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Encryption</span>
                    <span className="font-mono text-[10px]">{agency.encryptionLevel}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          )
        })}
      </div>

      {/* Data Exchange Log */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">Data Exchange Log</h3>
          <span className="text-xs text-muted-foreground">{dataExchangeLogs.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 font-medium text-muted-foreground">Timestamp</th>
                <th className="pb-3 font-medium text-muted-foreground">Agency</th>
                <th className="pb-3 font-medium text-muted-foreground text-center">Direction</th>
                <th className="pb-3 font-medium text-muted-foreground">Data Type</th>
                <th className="pb-3 font-medium text-muted-foreground text-right">Records</th>
                <th className="pb-3 font-medium text-muted-foreground text-center">Status</th>
                <th className="pb-3 font-medium text-muted-foreground text-center">Encrypted</th>
              </tr>
            </thead>
            <tbody>
              {dataExchangeLogs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-border/50 hover:bg-accent/30 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedLog(log)
                    setLogModalOpen(true)
                  }}
                >
                  <td className="py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {timeAgo(log.timestamp)}
                  </td>
                  <td className="py-3 font-medium">{log.agencyName}</td>
                  <td className="py-3 text-center">
                    {log.direction === 'outbound' ? (
                      <ArrowUpRight className="h-4 w-4 text-ccra-green mx-auto" />
                    ) : (
                      <ArrowDownLeft className="h-4 w-4 text-blue-500 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 text-muted-foreground">{log.dataType}</td>
                  <td className="py-3 text-right font-mono">{log.recordCount}</td>
                  <td className="py-3 text-center">
                    <span className={cn(
                      'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                      logStatusColors[log.status]
                    )}>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    {log.encryptionVerified ? (
                      <ShieldCheck className="h-4 w-4 text-ccra-green mx-auto" />
                    ) : (
                      <ShieldAlert className="h-4 w-4 text-ccra-red mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* AI Insight */}
      <AiInsightCard
        title="Data Exchange Health"
        insight="All 5 connected agencies are syncing successfully with 100% encryption verification. Balochistan Excise & Taxation (BL-ET) remains in pending status since March 10 — the last data exchange failed due to certificate expiry. Recommend contacting Director Excise Balochistan to renew their API certificates. ANF leads in data exchange volume with 2,456 records shared — the bilateral intelligence sharing protocol is functioning optimally. ISI and IB maintain limited access as per security classification protocols."
        severity="warning"
        confidence={94}
      />

      {/* Agency Detail Modal */}
      <AgencyDetailModal
        agency={selectedAgency}
        open={agencyModalOpen}
        onOpenChange={setAgencyModalOpen}
      />

      {/* Data Exchange Detail Modal */}
      <DataExchangeDetailModal
        log={selectedLog}
        open={logModalOpen}
        onOpenChange={setLogModalOpen}
      />
    </div>
  )
}
