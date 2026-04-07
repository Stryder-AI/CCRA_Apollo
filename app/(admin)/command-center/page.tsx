'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { GlassCard } from '@/design-system/glass-card'
import { PageTransition } from '@/design-system/page-transition'
import { StryderBadge } from '@/components/ai/StryderBadge'
import { TypewriterText } from '@/components/ai/TypewriterText'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  XCircle,
  PauseCircle,
  AlertTriangle,
  Shield,
  Calendar,
  FileBarChart,
  Megaphone,
  Download,
  ChevronRight,
  Zap,
  Target,
  Activity,
  Users,
  ArrowUpRight,
  CircleDot,
  Crosshair,
  Flame,
  type LucideIcon,
} from 'lucide-react'
import {
  pendingApprovals,
  escalations,
  kpiData,
  quickActions,
  strategicOutlook,
  type PendingApproval,
  type Escalation,
  type KPIData,
  type StrategicPeriod,
} from '@/data/mock-command-center'

// ─── Icon mapping for quick actions ───
const iconMap: Record<string, LucideIcon> = {
  Calendar,
  FileBarChart,
  Shield,
  Megaphone,
  AlertTriangle,
  Download,
}

// ─── KPI icon mapping ───
const kpiIcons: Record<string, LucideIcon> = {
  'Active Licenses': Target,
  'Revenue Collected': Zap,
  'Compliance Rate': Shield,
  'Inspections Completed': CheckCircle2,
  'Avg. Processing Time': Clock,
  'Enforcement Actions': Crosshair,
}

// ─── Helper: format values ───
function formatKpiValue(value: number, unit: string): string {
  if (unit === 'PKR') return `PKR ${(value / 1_000_000).toFixed(1)}M`
  if (unit === '%') return `${value}%`
  if (unit === 'days') return `${value} days`
  return value.toLocaleString()
}

// ─── Helper: priority badge ───
function PriorityBadge({ priority }: { priority: PendingApproval['priority'] }) {
  const config = {
    urgent: 'bg-red-500/20 text-red-400 border-red-500/30',
    high: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    normal: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  }
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border', config[priority])}>
      {priority === 'urgent' && <Flame className="w-3 h-3" />}
      {priority}
    </span>
  )
}

// ─── Helper: type badge ───
function TypeBadge({ type }: { type: PendingApproval['type'] }) {
  const config = {
    license: { label: 'License', cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
    inspection: { label: 'Inspection', cls: 'bg-teal-500/15 text-teal-400 border-teal-500/30' },
    'policy-exception': { label: 'Policy Exception', cls: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
  }
  const c = config[type]
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border', c.cls)}>
      {c.label}
    </span>
  )
}

// ─── Helper: severity config for escalations ───
const severityConfig = {
  critical: { dot: 'bg-red-500', text: 'text-red-400', border: 'border-red-500/30', bg: 'bg-red-500/10', label: 'CRITICAL' },
  high: { dot: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10', label: 'HIGH' },
  medium: { dot: 'bg-yellow-500', text: 'text-yellow-400', border: 'border-yellow-500/30', bg: 'bg-yellow-500/10', label: 'MEDIUM' },
}

// ─── SVG Circular Progress Ring ───
function ProgressRing({ value, target, status }: { value: number; target: number; status: KPIData['status'] }) {
  const pct = Math.min((value / target) * 100, 100)
  const strokeColor = status === 'on-track' ? '#22c55e' : status === 'at-risk' ? '#f59e0b' : '#ef4444'
  const circumference = 2 * Math.PI * 40
  const offset = circumference - (pct / 100) * circumference

  return (
    <div className="relative w-20 h-20">
      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="6" className="text-white/5" />
        <circle
          cx="50" cy="50" r="40"
          fill="none"
          stroke={strokeColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold font-mono">{Math.round(pct)}%</span>
      </div>
    </div>
  )
}

// ─── Status badge ───
function StatusBadge({ status }: { status: KPIData['status'] }) {
  const config = {
    'on-track': { label: 'On Track', cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
    'at-risk': { label: 'At Risk', cls: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
    'behind': { label: 'Behind', cls: 'bg-red-500/15 text-red-400 border-red-500/30' },
  }
  const c = config[status]
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border', c.cls)}>
      {c.label}
    </span>
  )
}

// ═══════════════════════════════════════════════════
// ─── MAIN PAGE ───
// ═══════════════════════════════════════════════════

export default function CommandCenterPage() {
  const [kpiDialog, setKpiDialog] = useState<KPIData | null>(null)
  const [approvalDialog, setApprovalDialog] = useState<PendingApproval | null>(null)
  const [escalationDialog, setEscalationDialog] = useState<Escalation | null>(null)
  const [quickActionDialog, setQuickActionDialog] = useState<(typeof quickActions)[0] | null>(null)
  const [strategicDialog, setStrategicDialog] = useState<{ period: string; prediction: string; type: 'risk' | 'opportunity' } | null>(null)

  // ─── Approval action handler ───
  const handleApprovalAction = (action: 'approve' | 'reject' | 'defer', item: PendingApproval) => {
    const messages = {
      approve: `Approved: ${item.title}. Notification sent to ${item.submittedBy}.`,
      reject: `Rejected: ${item.title}. Reason required — notification queued.`,
      defer: `Deferred: ${item.title}. Moved to review queue for next session.`,
    }
    toast.success(messages[action])
    setApprovalDialog(null)
  }

  // ─── Escalation action handler ───
  const handleEscalationAction = (action: string, item: Escalation) => {
    toast.success(`${action} initiated for: ${item.title}`)
    setEscalationDialog(null)
  }

  // ─── Quick Action handler ───
  const handleQuickAction = (action: (typeof quickActions)[0]) => {
    toast.success(`${action.label} — initiated successfully.`)
    setQuickActionDialog(null)
  }

  // ─── Strategic action handler ───
  const handleStrategicAction = (type: 'risk' | 'opportunity') => {
    toast.success(type === 'risk' ? 'Mitigation plan activated.' : 'Preparation plan initiated.')
    setStrategicDialog(null)
  }

  const briefingText = `Good morning, Director General. Here is your daily intelligence brief for March 17, 2026. Active licenses stand at 1,247 against a Q1 target of 1,500 — a gap of 253. Revenue collection is at PKR 89.2M (71.4% of target) with 14 days remaining — immediate intervention recommended. Two critical escalations require your attention: unlicensed cultivation detected in Bajaur District and an inspector misconduct allegation in Nowshera. On the positive side, inspections are tracking at 85.5% completion with strong momentum, and 18 license applications are nearing approval worth an estimated PKR 9.2M in new revenue. I recommend prioritizing the revenue collection drive and the Bajaur enforcement action today.`

  return (
    <PageTransition>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* ─── Header ─── */}
        <PageHeader
          title="DG Command Center"
          description="Your executive decision hub — powered by STRYDER AI"
        >
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <CircleDot className="w-3 h-3 text-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-emerald-400">LIVE</span>
            </div>
            <StryderBadge size="md" />
          </div>
        </PageHeader>

        {/* ═══════════════════════════════════════════ */}
        {/* ─── AI DAILY BRIEFING ─── */}
        {/* ═══════════════════════════════════════════ */}
        <div className="mb-8">
          <GlassCard glow="green" hover padding="lg" className="border border-emerald-500/10">
            <div className="flex items-start gap-4">
              <div className="shrink-0 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <Brain className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-lg font-semibold">Daily Intelligence Brief</h2>
                  <StryderBadge />
                  <span className="text-xs text-muted-foreground">March 17, 2026 — 08:00 AM</span>
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  <TypewriterText text={briefingText} speed={8} />
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* ─── KPI SCOREBOARD ─── */}
        {/* ═══════════════════════════════════════════ */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold">KPI Scoreboard</h2>
            <span className="text-xs text-muted-foreground">Q1 2026 Performance</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kpiData.map((kpi) => {
              const Icon = kpiIcons[kpi.label] || Target
              return (
                <GlassCard
                  key={kpi.id}
                  hover
                  glow={kpi.status === 'on-track' ? 'green' : kpi.status === 'at-risk' ? 'gold' : 'red'}
                  onClick={() => setKpiDialog(kpi)}
                  className="relative overflow-hidden"
                >
                  <div className={cn(
                    'absolute top-0 left-0 w-1 h-full rounded-l-2xl',
                    kpi.status === 'on-track' ? 'bg-emerald-500' : kpi.status === 'at-risk' ? 'bg-amber-500' : 'bg-red-500'
                  )} />
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className={cn('w-4 h-4', kpi.status === 'on-track' ? 'text-emerald-400' : kpi.status === 'at-risk' ? 'text-amber-400' : 'text-red-400')} />
                        <span className="text-sm text-muted-foreground">{kpi.label}</span>
                      </div>
                      <div className="text-2xl font-bold tracking-tight mb-1">
                        {formatKpiValue(kpi.value, kpi.unit)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Target: {formatKpiValue(kpi.target, kpi.unit)}</span>
                        <span className="text-muted-foreground/40">|</span>
                        <div className={cn('flex items-center gap-0.5', kpi.trend >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                          {kpi.trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          <span>{Math.abs(kpi.trend)}%</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <StatusBadge status={kpi.status} />
                      </div>
                      {kpi.status !== 'on-track' && (
                        <Button
                          variant="ghost"
                          size="xs"
                          className="mt-2 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 gap-1"
                          onClick={(e) => { e.stopPropagation(); setKpiDialog(kpi) }}
                        >
                          <Zap className="w-3 h-3" /> View Action Plan
                        </Button>
                      )}
                    </div>
                    <ProgressRing value={kpi.value} target={kpi.target} status={kpi.status} />
                  </div>
                </GlassCard>
              )
            })}
          </div>
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* ─── APPROVALS + ESCALATIONS (2-col) ─── */}
        {/* ═══════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* ─── PENDING APPROVALS QUEUE ─── */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-semibold">Pending Approvals</h2>
              <Badge variant="secondary" className="ml-1">{pendingApprovals.length}</Badge>
            </div>
            <div className="space-y-3">
              {pendingApprovals.map((item) => (
                <GlassCard
                  key={item.id}
                  hover
                  glow={item.priority === 'urgent' ? 'red' : item.priority === 'high' ? 'gold' : 'green'}
                  padding="sm"
                  onClick={() => setApprovalDialog(item)}
                  className="relative"
                >
                  <div className={cn(
                    'absolute top-0 left-0 w-1 h-full rounded-l-2xl',
                    item.priority === 'urgent' ? 'bg-red-500' : item.priority === 'high' ? 'bg-amber-500' : 'bg-blue-500'
                  )} />
                  <div className="pl-2">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <PriorityBadge priority={item.priority} />
                      <TypeBadge type={item.type} />
                      <span className="text-[10px] text-muted-foreground ml-auto">{item.id}</span>
                    </div>
                    <h3 className="text-sm font-semibold mb-1">{item.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{item.description}</p>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-2">
                      <Users className="w-3 h-3" />
                      <span>{item.farmOrApplicant}</span>
                      <span className="text-muted-foreground/30">|</span>
                      <Clock className="w-3 h-3" />
                      <span>{item.submittedDate}</span>
                    </div>

                    {/* AI Recommendation */}
                    <div className="flex items-start gap-2 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 mb-3">
                      <Brain className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[10px] font-semibold text-emerald-400">STRYDER AI</span>
                          <span className="text-[10px] text-muted-foreground">Confidence: {item.aiConfidence}%</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{item.aiRecommendation}</p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="xs"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white gap-1"
                        onClick={(e) => { e.stopPropagation(); handleApprovalAction('approve', item) }}
                      >
                        <CheckCircle2 className="w-3 h-3" /> Approve
                      </Button>
                      <Button
                        size="xs"
                        variant="destructive"
                        className="gap-1"
                        onClick={(e) => { e.stopPropagation(); handleApprovalAction('reject', item) }}
                      >
                        <XCircle className="w-3 h-3" /> Reject
                      </Button>
                      <Button
                        size="xs"
                        variant="outline"
                        className="gap-1"
                        onClick={(e) => { e.stopPropagation(); handleApprovalAction('defer', item) }}
                      >
                        <PauseCircle className="w-3 h-3" /> Defer
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* ─── ESCALATION FEED ─── */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-semibold">Escalation Feed</h2>
              <Badge variant="destructive" className="ml-1">{escalations.filter(e => e.severity === 'critical').length} Critical</Badge>
            </div>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[11px] top-4 bottom-4 w-px bg-gradient-to-b from-red-500/50 via-amber-500/30 to-transparent" />

              <div className="space-y-4">
                {escalations.map((item) => {
                  const sev = severityConfig[item.severity]
                  return (
                    <div key={item.id} className="relative pl-8">
                      {/* Timeline dot */}
                      <div className={cn('absolute left-1 top-4 w-[14px] h-[14px] rounded-full border-2 border-background z-10', sev.dot)} />
                      {item.severity === 'critical' && (
                        <div className={cn('absolute left-1 top-4 w-[14px] h-[14px] rounded-full animate-ping', sev.dot, 'opacity-30')} />
                      )}

                      <GlassCard
                        hover
                        glow={item.severity === 'critical' ? 'red' : item.severity === 'high' ? 'gold' : 'none'}
                        padding="sm"
                        onClick={() => setEscalationDialog(item)}
                      >
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border', sev.text, sev.border, sev.bg)}>
                            {sev.label}
                          </span>
                          <span className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">{item.module}</span>
                          <span className="text-[10px] text-muted-foreground ml-auto">{new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <h3 className="text-sm font-semibold mb-1">{item.title}</h3>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-[10px] font-bold text-white">
                              {item.escalatedBy.name.charAt(0)}
                            </div>
                            <div>
                              <span className="text-xs font-medium">{item.escalatedBy.name}</span>
                              <span className="text-[10px] text-muted-foreground ml-1.5 bg-muted/50 px-1.5 py-0.5 rounded">{item.escalatedBy.role}</span>
                            </div>
                          </div>
                          <Button
                            size="xs"
                            className="bg-amber-600/80 hover:bg-amber-500 text-white gap-1"
                            onClick={(e) => { e.stopPropagation(); setEscalationDialog(item) }}
                          >
                            <Zap className="w-3 h-3" /> Take Action
                          </Button>
                        </div>
                      </GlassCard>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* ─── QUICK ACTIONS GRID ─── */}
        {/* ═══════════════════════════════════════════ */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold">Quick Actions</h2>
            <span className="text-xs text-muted-foreground">Executive command shortcuts</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const Icon = iconMap[action.iconName] || Zap
              return (
                <GlassCard
                  key={action.id}
                  hover
                  glow="green"
                  onClick={() => setQuickActionDialog(action)}
                  className="group"
                >
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                      <Icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold mb-0.5 group-hover:text-emerald-400 transition-colors">{action.label}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{action.description}</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-emerald-400 transition-colors shrink-0 mt-1" />
                  </div>
                </GlassCard>
              )
            })}
          </div>
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* ─── STRATEGIC OUTLOOK ─── */}
        {/* ═══════════════════════════════════════════ */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Crosshair className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold">Strategic Outlook</h2>
            <StryderBadge />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {strategicOutlook.map((period) => {
              const riskColors = {
                low: { badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', glow: 'green' as const },
                medium: { badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30', glow: 'gold' as const },
                high: { badge: 'bg-red-500/15 text-red-400 border-red-500/30', glow: 'red' as const },
              }
              const rc = riskColors[period.riskLevel]
              return (
                <GlassCard key={period.period} hover glow={rc.glow} padding="lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold">{period.period}</h3>
                    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border', rc.badge)}>
                      {period.riskLevel} risk
                    </span>
                  </div>
                  <div className="space-y-3">
                    {period.predictions.map((pred, idx) => (
                      <div key={idx} className="group/pred">
                        <div className="flex items-start gap-2 mb-1.5">
                          <div className={cn(
                            'w-1.5 h-1.5 rounded-full mt-1.5 shrink-0',
                            pred.type === 'risk' ? 'bg-red-400' : 'bg-emerald-400'
                          )} />
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground leading-relaxed">{pred.text}</p>
                            <Button
                              size="xs"
                              variant="ghost"
                              className={cn(
                                'mt-1 gap-1 text-[11px]',
                                pred.type === 'risk' ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10' : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10'
                              )}
                              onClick={() => setStrategicDialog({ period: period.period, prediction: pred.text, type: pred.type })}
                            >
                              {pred.type === 'risk' ? (
                                <><Shield className="w-3 h-3" /> Mitigate</>
                              ) : (
                                <><ChevronRight className="w-3 h-3" /> Prepare</>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )
            })}
          </div>
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* ─── DIALOGS ─── */}
        {/* ═══════════════════════════════════════════ */}

        {/* KPI Action Plan Dialog */}
        <Dialog open={!!kpiDialog} onOpenChange={(open) => !open && setKpiDialog(null)}>
          <DialogContent showCloseButton className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                {kpiDialog?.label} — Action Plan
              </DialogTitle>
            </DialogHeader>
            {kpiDialog && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <span className="text-sm text-muted-foreground">Current</span>
                    <div className="text-xl font-bold">{formatKpiValue(kpiDialog.value, kpiDialog.unit)}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <span className="text-sm text-muted-foreground">Target</span>
                    <div className="text-xl font-bold text-emerald-400">{formatKpiValue(kpiDialog.target, kpiDialog.unit)}</div>
                  </div>
                  <StatusBadge status={kpiDialog.status} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-semibold">STRYDER AI Recommended Actions</span>
                  </div>
                  <div className="space-y-2">
                    {kpiDialog.actionPlan.map((action, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                        <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] font-bold text-emerald-400 mt-0.5">{idx + 1}</span>
                        <p className="text-xs text-muted-foreground leading-relaxed">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="bg-emerald-600 hover:bg-emerald-500 text-white flex-1" onClick={() => { toast.success('Action plan activated. Tasks assigned to relevant directors.'); setKpiDialog(null) }}>
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Activate Plan
                  </Button>
                  <Button variant="outline" onClick={() => setKpiDialog(null)}>Dismiss</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Approval Detail Dialog */}
        <Dialog open={!!approvalDialog} onOpenChange={(open) => !open && setApprovalDialog(null)}>
          <DialogContent showCloseButton className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {approvalDialog && <PriorityBadge priority={approvalDialog.priority} />}
                {approvalDialog?.title}
              </DialogTitle>
            </DialogHeader>
            {approvalDialog && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground">Applicant</span>
                    <div className="font-medium mt-0.5">{approvalDialog.farmOrApplicant}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground">Submitted By</span>
                    <div className="font-medium mt-0.5">{approvalDialog.submittedBy}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground">Date</span>
                    <div className="font-medium mt-0.5">{approvalDialog.submittedDate}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground">Type</span>
                    <div className="mt-0.5"><TypeBadge type={approvalDialog.type} /></div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{approvalDialog.description}</p>
                <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
                  <div className="flex items-center gap-2 mb-1">
                    <Brain className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-400">STRYDER AI Analysis</span>
                    <span className="text-[10px] text-muted-foreground ml-auto">Confidence: {approvalDialog.aiConfidence}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{approvalDialog.aiRecommendation}</p>
                </div>
                <div className="flex gap-2">
                  <Button className="bg-emerald-600 hover:bg-emerald-500 text-white flex-1 gap-1" onClick={() => handleApprovalAction('approve', approvalDialog)}>
                    <CheckCircle2 className="w-4 h-4" /> Approve
                  </Button>
                  <Button variant="destructive" className="flex-1 gap-1" onClick={() => handleApprovalAction('reject', approvalDialog)}>
                    <XCircle className="w-4 h-4" /> Reject
                  </Button>
                  <Button variant="outline" className="gap-1" onClick={() => handleApprovalAction('defer', approvalDialog)}>
                    <PauseCircle className="w-4 h-4" /> Defer
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Escalation Action Dialog */}
        <Dialog open={!!escalationDialog} onOpenChange={(open) => !open && setEscalationDialog(null)}>
          <DialogContent showCloseButton className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className={cn('w-5 h-5', escalationDialog?.severity === 'critical' ? 'text-red-400' : 'text-amber-400')} />
                {escalationDialog?.title}
              </DialogTitle>
            </DialogHeader>
            {escalationDialog && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs">
                  <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border', severityConfig[escalationDialog.severity].text, severityConfig[escalationDialog.severity].border, severityConfig[escalationDialog.severity].bg)}>
                    {severityConfig[escalationDialog.severity].label}
                  </span>
                  <span className="text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">{escalationDialog.module}</span>
                  <span className="text-muted-foreground ml-auto">{new Date(escalationDialog.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-sm text-muted-foreground">{escalationDialog.description}</p>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xs font-bold text-white">
                    {escalationDialog.escalatedBy.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-xs font-medium">{escalationDialog.escalatedBy.name}</span>
                    <span className="text-[10px] text-muted-foreground ml-1.5 bg-muted px-1.5 py-0.5 rounded">{escalationDialog.escalatedBy.role}</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
                  <div className="flex items-center gap-2 mb-1">
                    <Brain className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-400">Suggested Resolution</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{escalationDialog.suggestedAction}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button className="bg-emerald-600 hover:bg-emerald-500 text-white gap-1" onClick={() => handleEscalationAction('Assign Inspector', escalationDialog)}>
                    <Users className="w-4 h-4" /> Assign Inspector
                  </Button>
                  <Button variant="outline" className="gap-1" onClick={() => handleEscalationAction('Schedule Meeting', escalationDialog)}>
                    <Calendar className="w-4 h-4" /> Schedule Meeting
                  </Button>
                  <Button className="bg-amber-600 hover:bg-amber-500 text-white gap-1" onClick={() => handleEscalationAction('Issue Directive', escalationDialog)}>
                    <Zap className="w-4 h-4" /> Issue Directive
                  </Button>
                  <Button variant="ghost" className="text-muted-foreground gap-1" onClick={() => { toast.info('Escalation dismissed.'); setEscalationDialog(null) }}>
                    <XCircle className="w-4 h-4" /> Dismiss
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Quick Action Confirm Dialog */}
        <Dialog open={!!quickActionDialog} onOpenChange={(open) => !open && setQuickActionDialog(null)}>
          <DialogContent showCloseButton className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {quickActionDialog && (() => { const Icon = iconMap[quickActionDialog.iconName] || Zap; return <Icon className="w-5 h-5 text-emerald-400" /> })()}
                {quickActionDialog?.confirmTitle}
              </DialogTitle>
            </DialogHeader>
            {quickActionDialog && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{quickActionDialog.confirmDescription}</p>
                <div className="flex gap-2">
                  <Button className="bg-emerald-600 hover:bg-emerald-500 text-white flex-1 gap-1" onClick={() => handleQuickAction(quickActionDialog)}>
                    <CheckCircle2 className="w-4 h-4" /> Confirm
                  </Button>
                  <Button variant="outline" onClick={() => setQuickActionDialog(null)}>Cancel</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Strategic Action Dialog */}
        <Dialog open={!!strategicDialog} onOpenChange={(open) => !open && setStrategicDialog(null)}>
          <DialogContent showCloseButton className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {strategicDialog?.type === 'risk' ? (
                  <Shield className="w-5 h-5 text-red-400" />
                ) : (
                  <Target className="w-5 h-5 text-emerald-400" />
                )}
                {strategicDialog?.type === 'risk' ? 'Risk Mitigation Plan' : 'Opportunity Preparation'}
              </DialogTitle>
            </DialogHeader>
            {strategicDialog && (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{strategicDialog.period} Forecast</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{strategicDialog.prediction}</p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-400">STRYDER AI Recommendation</span>
                  </div>
                  {strategicDialog.type === 'risk' ? (
                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      <p>1. Establish cross-functional task force with weekly reporting cadence</p>
                      <p>2. Allocate contingency budget for immediate response capability</p>
                      <p>3. Develop scenario-based response protocols with clear trigger points</p>
                      <p>4. Brief all relevant directors and ensure resource pre-positioning</p>
                    </div>
                  ) : (
                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      <p>1. Assign project lead and establish dedicated preparation team</p>
                      <p>2. Develop stakeholder engagement plan and timeline</p>
                      <p>3. Prepare necessary documentation and regulatory filings</p>
                      <p>4. Schedule coordination meetings with external partners</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    className={cn(
                      'flex-1 gap-1 text-white',
                      strategicDialog.type === 'risk' ? 'bg-red-600 hover:bg-red-500' : 'bg-emerald-600 hover:bg-emerald-500'
                    )}
                    onClick={() => handleStrategicAction(strategicDialog.type)}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {strategicDialog.type === 'risk' ? 'Activate Mitigation' : 'Begin Preparation'}
                  </Button>
                  <Button variant="outline" onClick={() => setStrategicDialog(null)}>Later</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </PageTransition>
  )
}
