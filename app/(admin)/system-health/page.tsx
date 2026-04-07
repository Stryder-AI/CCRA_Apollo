'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { GlassCard } from '@/design-system/glass-card'
import { AiInsightCard } from '@/components/ai/AiInsightCard'
import { StryderBadge } from '@/components/ai/StryderBadge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  Activity, Server, Database, Globe, Shield, Clock,
  HardDrive, Cpu, MemoryStick, Wifi, CheckCircle, AlertTriangle,
  RefreshCw, Download, Zap, Lock, Cloud, BarChart3
} from 'lucide-react'

interface SystemService {
  id: string
  name: string
  description: string
  status: 'online' | 'degraded' | 'offline'
  uptime: string
  responseTime: number
  lastChecked: string
  icon: string
  details: { label: string; value: string }[]
}

const services: SystemService[] = [
  {
    id: 'srv-001', name: 'Application Server', description: 'Next.js application hosting', status: 'online',
    uptime: '99.97%', responseTime: 42, lastChecked: '2 min ago', icon: 'server',
    details: [
      { label: 'Node.js Version', value: 'v20.11.0' },
      { label: 'Memory Usage', value: '2.1 GB / 8 GB' },
      { label: 'CPU Usage', value: '12%' },
      { label: 'Active Connections', value: '47' },
      { label: 'Region', value: 'Pakistan East (Islamabad)' },
      { label: 'SSL Certificate', value: 'Valid until Dec 2026' },
    ],
  },
  {
    id: 'srv-002', name: 'Database Cluster', description: 'PostgreSQL primary + 2 replicas', status: 'online',
    uptime: '99.99%', responseTime: 8, lastChecked: '1 min ago', icon: 'database',
    details: [
      { label: 'PostgreSQL Version', value: '16.2' },
      { label: 'Storage Used', value: '14.7 GB / 100 GB' },
      { label: 'Active Queries', value: '12' },
      { label: 'Replication Lag', value: '< 1ms' },
      { label: 'Last Backup', value: '2026-03-17 03:00 AM' },
      { label: 'Backup Size', value: '8.3 GB (compressed)' },
    ],
  },
  {
    id: 'srv-003', name: 'GIS Map Service', description: 'Leaflet tile server + geocoding', status: 'online',
    uptime: '99.94%', responseTime: 125, lastChecked: '3 min ago', icon: 'globe',
    details: [
      { label: 'Tile Provider', value: 'CartoDB' },
      { label: 'Cached Tiles', value: '1.2M tiles' },
      { label: 'Geocoding API', value: 'Operational' },
      { label: 'Polygon Renders/hr', value: '342' },
      { label: 'Satellite Layer', value: 'Available' },
      { label: 'Coverage', value: 'Pakistan (full)' },
    ],
  },
  {
    id: 'srv-004', name: 'STRYDER AI Engine', description: 'AI analytics & recommendation engine', status: 'online',
    uptime: '99.91%', responseTime: 230, lastChecked: '1 min ago', icon: 'zap',
    details: [
      { label: 'Model Version', value: 'STRYDER v3.2.1' },
      { label: 'Predictions Today', value: '1,247' },
      { label: 'Avg Confidence', value: '94.2%' },
      { label: 'GPU Utilization', value: '34%' },
      { label: 'Queue Depth', value: '3 pending' },
      { label: 'Last Training', value: '2026-03-15' },
    ],
  },
  {
    id: 'srv-005', name: 'Authentication Service', description: 'OAuth 2.0 + RBAC', status: 'online',
    uptime: '99.99%', responseTime: 15, lastChecked: '30 sec ago', icon: 'lock',
    details: [
      { label: 'Active Sessions', value: '23' },
      { label: 'Auth Method', value: 'OAuth 2.0 + MFA' },
      { label: 'Failed Logins (24h)', value: '2' },
      { label: 'Token Expiry', value: '30 min' },
      { label: 'Encryption', value: 'AES-256-GCM' },
      { label: 'Certificate Authority', value: 'DigiCert' },
    ],
  },
  {
    id: 'srv-006', name: 'Inter-Agency Gateway', description: 'Secure data exchange with ANF, ISI, IB', status: 'degraded',
    uptime: '98.72%', responseTime: 450, lastChecked: '5 min ago', icon: 'cloud',
    details: [
      { label: 'Connected Agencies', value: '5 / 6' },
      { label: 'BL-ET Status', value: 'Connection Pending' },
      { label: 'Encryption', value: 'TLS 1.3 + AES-256' },
      { label: 'Data Synced Today', value: '4,521 records' },
      { label: 'Last Full Sync', value: '2026-03-17 02:15 AM' },
      { label: 'Bandwidth Usage', value: '12.4 MB/hr' },
    ],
  },
]

const iconMap: Record<string, React.ElementType> = {
  server: Server,
  database: Database,
  globe: Globe,
  zap: Zap,
  lock: Lock,
  cloud: Cloud,
}

const statusConfig = {
  online: { color: 'text-emerald-500', bg: 'bg-emerald-500', label: 'Online', badge: 'bg-emerald-500/10 text-emerald-500' },
  degraded: { color: 'text-amber-500', bg: 'bg-amber-500', label: 'Degraded', badge: 'bg-amber-500/10 text-amber-500' },
  offline: { color: 'text-red-500', bg: 'bg-red-500', label: 'Offline', badge: 'bg-red-500/10 text-red-500' },
}

const metrics = {
  overallUptime: '99.92%',
  avgResponseTime: '145ms',
  lastBackup: '2026-03-17 03:00 AM',
  storageUsed: '14.7 GB / 100 GB',
  storagePercent: 14.7,
  activeUsers: 23,
  apiCallsToday: 12847,
  incidentsThisMonth: 1,
}

export default function SystemHealthPage() {
  const [selectedService, setSelectedService] = useState<SystemService | null>(null)

  const onlineCount = services.filter((s) => s.status === 'online').length
  const degradedCount = services.filter((s) => s.status === 'degraded').length

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <PageHeader
        title="System Health"
        description="Real-time infrastructure monitoring and service status"
      >
        <Button
          variant="outline"
          onClick={() => toast.success('Running full system diagnostic...')}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Run Diagnostic
        </Button>
      </PageHeader>

      {/* System Overview */}
      <div className="grid grid-cols-4 gap-4">
        <GlassCard padding="sm" className="border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Overall Uptime</p>
              <p className="text-xl font-bold text-emerald-500">{metrics.overallUptime}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard padding="sm" className="border-l-4 border-l-blue-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg Response Time</p>
              <p className="text-xl font-bold text-blue-500">{metrics.avgResponseTime}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard padding="sm" className="border-l-4 border-l-purple-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">API Calls Today</p>
              <p className="text-xl font-bold">{metrics.apiCallsToday.toLocaleString()}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard padding="sm" className={cn('border-l-4', degradedCount > 0 ? 'border-l-amber-500' : 'border-l-emerald-500')}>
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', degradedCount > 0 ? 'bg-amber-500/10' : 'bg-emerald-500/10')}>
              <Server className={cn('w-5 h-5', degradedCount > 0 ? 'text-amber-500' : 'text-emerald-500')} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Services</p>
              <p className="text-xl font-bold">
                <span className="text-emerald-500">{onlineCount}</span>
                {degradedCount > 0 && <span className="text-amber-500"> / {degradedCount}</span>}
                <span className="text-muted-foreground text-sm font-normal"> of {services.length}</span>
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Service Cards Grid */}
      <div className="grid grid-cols-3 gap-4">
        {services.map((service) => {
          const IconComp = iconMap[service.icon] || Server
          const status = statusConfig[service.status]
          return (
            <GlassCard
              key={service.id}
              hover
              glow={service.status === 'online' ? 'green' : service.status === 'degraded' ? 'gold' : 'red'}
              onClick={() => setSelectedService(service)}
              className="cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', service.status === 'online' ? 'bg-emerald-500/10' : 'bg-amber-500/10')}>
                    <IconComp className={cn('w-5 h-5', status.color)} />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{service.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{service.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={cn('w-2 h-2 rounded-full', status.bg, service.status === 'online' && 'animate-pulse')} />
                  <span className={cn('text-xs font-medium', status.color)}>{status.label}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-border/50">
                <div>
                  <p className="text-[10px] text-muted-foreground">Uptime</p>
                  <p className="text-sm font-semibold">{service.uptime}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Response</p>
                  <p className={cn('text-sm font-semibold', service.responseTime > 300 ? 'text-amber-500' : 'text-emerald-500')}>
                    {service.responseTime}ms
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Checked</p>
                  <p className="text-sm text-muted-foreground">{service.lastChecked}</p>
                </div>
              </div>
              {service.status === 'degraded' && (
                <div className="mt-3 flex items-center gap-2 p-2 rounded-lg bg-amber-500/5 border border-amber-500/20">
                  <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
                  <p className="text-[10px] text-amber-500">Performance degradation detected</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-5 text-[10px] text-amber-500 ml-auto"
                    onClick={(e) => { e.stopPropagation(); toast.success('Initiating service restart...') }}
                  >
                    Restart
                  </Button>
                </div>
              )}
            </GlassCard>
          )
        })}
      </div>

      {/* Storage & Backup */}
      <div className="grid grid-cols-2 gap-4">
        <GlassCard>
          <h3 className="text-sm font-medium mb-3">Storage Usage</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Database</span>
                <span>{metrics.storageUsed}</span>
              </div>
              <div className="h-2 rounded-full bg-accent overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-ccra-green to-emerald-400" style={{ width: `${metrics.storagePercent}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">File Storage</span>
                <span>3.2 GB / 50 GB</span>
              </div>
              <div className="h-2 rounded-full bg-accent overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400" style={{ width: '6.4%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Log Archive</span>
                <span>8.1 GB / 25 GB</span>
              </div>
              <div className="h-2 rounded-full bg-accent overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-400" style={{ width: '32.4%' }} />
              </div>
            </div>
          </div>
        </GlassCard>
        <GlassCard>
          <h3 className="text-sm font-medium mb-3">Backup Status</h3>
          <div className="space-y-3">
            {[
              { type: 'Full Backup', time: '2026-03-17 03:00 AM', size: '8.3 GB', status: 'success' },
              { type: 'Incremental', time: '2026-03-17 09:00 AM', size: '142 MB', status: 'success' },
              { type: 'Incremental', time: '2026-03-17 03:00 PM', size: '98 MB', status: 'success' },
              { type: 'Next Scheduled', time: '2026-03-17 09:00 PM', size: '—', status: 'pending' },
            ].map((backup, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {backup.status === 'success' ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                  )}
                  <span>{backup.type}</span>
                </div>
                <span className="text-muted-foreground text-xs">{backup.time}</span>
                <span className="text-xs font-medium">{backup.size}</span>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={() => toast.success('Manual backup initiated')}
            >
              <Download className="w-3.5 h-3.5 mr-2" />
              Trigger Manual Backup
            </Button>
          </div>
        </GlassCard>
      </div>

      {/* Security Overview */}
      <GlassCard>
        <h3 className="text-sm font-medium mb-3">Security Overview</h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'SSL Certificate', value: 'Valid', detail: 'Expires Dec 2026', status: 'good' },
            { label: 'Firewall', value: 'Active', detail: '247 rules enforced', status: 'good' },
            { label: 'Failed Logins (24h)', value: '2', detail: 'Below threshold (10)', status: 'good' },
            { label: 'Data Encryption', value: 'AES-256', detail: 'All data at rest & transit', status: 'good' },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-xl bg-accent/30">
              <div className="flex items-center gap-1.5 mb-1">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
              <p className="text-sm font-semibold text-emerald-500">{item.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{item.detail}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* AI Insight */}
      <AiInsightCard
        title="System Health Assessment"
        insight="All critical services are operational with 99.92% aggregate uptime. The Inter-Agency Gateway is experiencing elevated response times (450ms vs 150ms baseline) due to BL-ET connection negotiation. Recommendation: Contact Balochistan Excise IT team to complete API credential exchange — estimated resolution within 48 hours. All other services are performing within optimal parameters. Next scheduled maintenance window: March 22, 2026 02:00-04:00 AM."
        severity="warning"
        confidence={96}
      />

      {/* Service Detail Dialog */}
      <Dialog open={!!selectedService} onOpenChange={(open) => !open && setSelectedService(null)}>
        <DialogContent showCloseButton className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedService?.name}</DialogTitle>
          </DialogHeader>
          {selectedService && (() => {
            const IconComp = iconMap[selectedService.icon] || Server
            const status = statusConfig[selectedService.status]
            return (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', selectedService.status === 'online' ? 'bg-emerald-500/10' : 'bg-amber-500/10')}>
                    <IconComp className={cn('w-6 h-6', status.color)} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{selectedService.description}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className={cn('w-2 h-2 rounded-full', status.bg)} />
                      <span className={cn('text-sm font-medium', status.color)}>{status.label}</span>
                      <span className="text-xs text-muted-foreground">· Uptime {selectedService.uptime}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {selectedService.details.map((d, i) => (
                    <div key={i} className="p-2 rounded-lg bg-accent/30">
                      <p className="text-[10px] text-muted-foreground">{d.label}</p>
                      <p className="text-xs font-medium mt-0.5">{d.value}</p>
                    </div>
                  ))}
                </div>
                {selectedService.status === 'degraded' && (
                  <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-medium text-amber-500">Action Required</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Service response time is elevated. This is affecting inter-agency data synchronization.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-amber-500 text-white hover:bg-amber-600"
                        onClick={() => toast.success('Service restart initiated')}
                      >
                        Restart Service
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast.success('Escalated to IT team')}
                      >
                        Escalate to IT
                      </Button>
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => toast.success('Viewing service logs...')}>
                    View Logs
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toast.success('Performance report generated')}>
                    Performance Report
                  </Button>
                </div>
              </div>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
