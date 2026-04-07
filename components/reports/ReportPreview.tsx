'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GlassCard } from '@/design-system/glass-card'
import { StryderBadge } from '@/components/ai/StryderBadge'
import { TypewriterText } from '@/components/ai/TypewriterText'
import { toast } from 'sonner'
import {
  Download,
  CalendarClock,
  Share2,
  ShieldAlert,
  TrendingUp,
  Users,
  Zap,
  CheckCircle2,
  MapPin,
  FlaskConical,
  Award,
  BarChart3,
  ArrowUpRight,
  Clock,
  Target,
  Rocket,
  AlertTriangle,
  Send,
} from 'lucide-react'
import type { ReportTemplate } from '@/data/mock-reports'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface ReportPreviewProps {
  report: ReportTemplate | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const revenueChartData = [
  { month: 'Apr', amount: 12.9 },
  { month: 'May', amount: 15.6 },
  { month: 'Jun', amount: 10.8 },
  { month: 'Jul', amount: 14.5 },
  { month: 'Aug', amount: 8.2 },
  { month: 'Sep', amount: 83.4 },
  { month: 'Oct', amount: 58.6 },
  { month: 'Nov', amount: 32.8 },
  { month: 'Dec', amount: 4.4 },
  { month: 'Jan', amount: 10.6 },
  { month: 'Feb', amount: 9.2 },
  { month: 'Mar', amount: 9.0 },
]

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null
  return (
    <div className="glass rounded-lg p-3 text-sm">
      <p className="font-medium mb-1">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} className="text-muted-foreground">
          PKR {entry.value}M
        </p>
      ))}
    </div>
  )
}

function ActionButton({ label, icon: Icon, variant = 'action' }: { label: string; icon: any; variant?: 'action' | 'urgent' | 'schedule' }) {
  const colorMap = {
    action: 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/30',
    urgent: 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/30',
    schedule: 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/30',
  }
  return (
    <Button
      variant="outline"
      size="xs"
      className={`${colorMap[variant]} border text-[11px] gap-1`}
      onClick={(e) => {
        e.stopPropagation()
        toast.success(`Action initiated: ${label}`, {
          description: 'STRYDER AI will track progress and notify you upon completion.',
        })
      }}
    >
      <Icon className="size-3" />
      {label}
    </Button>
  )
}

function StatBox({ label, value, sub, color = 'emerald' }: { label: string; value: string; sub?: string; color?: string }) {
  const colorMap: Record<string, string> = {
    emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30',
    amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/30',
    blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/30',
    red: 'from-red-500/20 to-red-500/5 border-red-500/30',
  }
  return (
    <div className={`rounded-xl border bg-gradient-to-br ${colorMap[color]} p-3 text-center`}>
      <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-lg font-bold mt-0.5">{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  )
}

function BoardReport({ report }: { report: ReportTemplate }) {
  return (
    <div className="space-y-5">
      {/* Executive Summary */}
      <section>
        <h3 className="text-sm font-semibold text-emerald-500 uppercase tracking-wider mb-2">Executive Summary</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{report.sections[0].content}</p>
      </section>

      {/* KPI Overview */}
      <section>
        <h3 className="text-sm font-semibold text-emerald-500 uppercase tracking-wider mb-3">KPI Overview</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <StatBox label="Total Farms" value="25" sub="+4 new" color="emerald" />
          <StatBox label="Total Yield" value="287.5t" sub="Target: 250t" color="blue" />
          <StatBox label="Revenue" value="PKR 270M" sub="Target: PKR 240M" color="emerald" />
          <StatBox label="Compliance" value="82.9%" sub="7 violations" color="amber" />
        </div>
      </section>

      {/* Revenue Breakdown */}
      <section>
        <h3 className="text-sm font-semibold text-emerald-500 uppercase tracking-wider mb-2">Revenue Breakdown</h3>
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="amount" name="Revenue" fill="#22c55e" radius={[3, 3, 0, 0]} maxBarSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="flex justify-between text-xs p-2 rounded-lg bg-muted/50">
            <span className="text-muted-foreground">License Fees</span>
            <span className="font-medium">PKR 97.5M (36.1%)</span>
          </div>
          <div className="flex justify-between text-xs p-2 rounded-lg bg-muted/50">
            <span className="text-muted-foreground">Penalties</span>
            <span className="font-medium">PKR 152M (56.3%)</span>
          </div>
          <div className="flex justify-between text-xs p-2 rounded-lg bg-muted/50">
            <span className="text-muted-foreground">Inspection Fees</span>
            <span className="font-medium">PKR 6M (2.2%)</span>
          </div>
          <div className="flex justify-between text-xs p-2 rounded-lg bg-muted/50">
            <span className="text-muted-foreground">Renewals</span>
            <span className="font-medium">PKR 14.5M (5.4%)</span>
          </div>
        </div>
      </section>

      {/* Compliance Status */}
      <section>
        <h3 className="text-sm font-semibold text-emerald-500 uppercase tracking-wider mb-2">Compliance Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="size-3.5 text-emerald-500" />
              <span className="text-xs font-semibold">Khyber Pakhtunkhwa</span>
            </div>
            <p className="text-xs text-muted-foreground">82.7% avg compliance</p>
            <p className="text-xs text-muted-foreground">4 active violations (2 water, 1 boundary, 1 pesticide)</p>
            <div className="mt-2">
              <ActionButton label="Deploy KP Inspector" icon={Users} />
            </div>
          </div>
          <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-3">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="size-3.5 text-teal-500" />
              <span className="text-xs font-semibold">Balochistan</span>
            </div>
            <p className="text-xs text-muted-foreground">83.4% avg compliance</p>
            <p className="text-xs text-muted-foreground">3 active violations (1 boundary, 1 docs, 1 yield)</p>
            <div className="mt-2">
              <ActionButton label="Schedule Audit" icon={CalendarClock} variant="schedule" />
            </div>
          </div>
        </div>
      </section>

      {/* STRYDER AI Recommendations */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-sm font-semibold text-emerald-500 uppercase tracking-wider">STRYDER AI Recommendations</h3>
          <StryderBadge />
        </div>
        <div className="space-y-2">
          {[
            { text: 'Deploy additional inspector to Chagai district — water compliance in 3 farms dropped below 75%.', action: 'Deploy Inspector', icon: Users, variant: 'urgent' as const },
            { text: 'Accelerate Board review of Panjgur Oasis penalty — PKR 25M outstanding for 28 days.', action: 'Schedule Board Review', icon: CalendarClock, variant: 'urgent' as const },
            { text: 'Adjust Q2 revenue target upward by 12% — trajectory supports PKR 95.2M projection.', action: 'Adjust Budget', icon: TrendingUp, variant: 'action' as const },
            { text: 'Schedule compliance workshop for Balochistan inspectors — 18% documentation gap vs KP.', action: 'Schedule Workshop', icon: Users, variant: 'schedule' as const },
          ].map((rec, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-border/50 bg-muted/30">
              <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500 text-[10px] font-bold">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground leading-relaxed">{rec.text}</p>
                <div className="mt-1.5">
                  <ActionButton label={rec.action} icon={rec.icon} variant={rec.variant} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function InternationalReport({ report }: { report: ReportTemplate }) {
  return (
    <div className="space-y-5">
      {/* Export Statistics */}
      <section>
        <h3 className="text-sm font-semibold text-blue-500 uppercase tracking-wider mb-3">Export Statistics</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <StatBox label="Export Ready" value="8/25" sub="32% of farms" color="blue" />
          <StatBox label="Export Volume" value="42.3t" sub="Q1 total" color="emerald" />
          <StatBox label="Export Revenue" value="PKR 38.5M" sub="Q1 contribution" color="emerald" />
          <StatBox label="Rejected" value="0" sub="Shipments" color="emerald" />
        </div>
        <div className="mt-3 p-3 rounded-xl border border-blue-500/20 bg-blue-500/5">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Approved Destinations:</span> Germany, Thailand, Australia
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="font-medium text-foreground">Pending Applications:</span> 3 new export permits
          </p>
          <div className="mt-2">
            <ActionButton label="Fast-Track Export Permits" icon={Rocket} />
          </div>
        </div>
      </section>

      {/* Lab Testing */}
      <section>
        <h3 className="text-sm font-semibold text-blue-500 uppercase tracking-wider mb-3">Lab Testing Compliance</h3>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <StatBox label="Samples Tested" value="156" sub="Q1 total" color="blue" />
          <StatBox label="Pass Rate" value="94.2%" sub="+1.8% QoQ" color="emerald" />
          <StatBox label="Avg Turnaround" value="3.8 days" sub="Target: 5 days" color="emerald" />
        </div>
        <div className="space-y-1.5">
          {[
            { label: 'Pesticide Residue Failures', count: 4, action: 'Issue Remediation Order' },
            { label: 'Heavy Metal Failures', count: 2, action: 'Suspend Cultivation' },
            { label: 'Microbial Failures', count: 3, action: 'Schedule Re-Test' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-2 rounded-lg bg-red-500/5 border border-red-500/20">
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-3 text-red-500" />
                <span className="text-xs">{item.label}: <span className="font-bold text-red-500">{item.count}</span></span>
              </div>
              <ActionButton label={item.action} icon={Zap} variant="urgent" />
            </div>
          ))}
        </div>
      </section>

      {/* WHO/EU GMP */}
      <section>
        <h3 className="text-sm font-semibold text-blue-500 uppercase tracking-wider mb-3">WHO/EU GMP Alignment</h3>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <StatBox label="GMP Compliant" value="6/12" sub="Processing units" color="amber" />
          <StatBox label="Overall Score" value="78%" sub="Target: 90%" color="amber" />
        </div>
        <div className="space-y-1.5">
          {[
            { area: 'Documentation Control', score: 62, action: 'Launch Doc Audit' },
            { area: 'Environmental Monitoring', score: 71, action: 'Deploy Sensors' },
            { area: 'Validation Protocols', score: 68, action: 'Assign Validator' },
          ].map((gap) => (
            <div key={gap.area} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-xs flex-1">{gap.area}</span>
                <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-amber-500" style={{ width: `${gap.score}%` }} />
                </div>
                <span className="text-xs font-mono w-8 text-right text-amber-500">{gap.score}%</span>
              </div>
              <div className="ml-2">
                <ActionButton label={gap.action} icon={Zap} variant="schedule" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <p className="text-xs text-muted-foreground">Timeline to Full Alignment: <span className="font-medium text-foreground">Est. 8 months</span> | Required Investment: <span className="font-medium text-foreground">PKR 45M</span></p>
          <div className="mt-1.5">
            <ActionButton label="Initiate GMP Upgrade Program" icon={Rocket} />
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section>
        <h3 className="text-sm font-semibold text-blue-500 uppercase tracking-wider mb-3">Certification Status</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { cert: 'GACP Certified', count: '12/25 farms', pct: 48 },
            { cert: 'ISO 9001', count: '4 units', pct: 33 },
            { cert: 'HACCP', count: '3 units', pct: 25 },
            { cert: 'EU-GMP', count: '2 facilities', pct: 17 },
            { cert: 'Organic', count: '2 farms', pct: 8 },
            { cert: 'UNODC', count: 'Full', pct: 100 },
          ].map((c) => (
            <div key={c.cert} className="flex items-center justify-between p-2 rounded-lg bg-muted/50 border border-border/50">
              <div>
                <p className="text-xs font-medium">{c.cert}</p>
                <p className="text-[10px] text-muted-foreground">{c.count}</p>
              </div>
              {c.pct === 100 ? (
                <CheckCircle2 className="size-4 text-emerald-500" />
              ) : (
                <span className="text-[10px] font-mono text-amber-500">{c.pct}%</span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-2">
          <ActionButton label="Accelerate GACP Certifications" icon={Award} />
        </div>
      </section>
    </div>
  )
}

function RevenueReport({ report }: { report: ReportTemplate }) {
  return (
    <div className="space-y-5">
      {/* Monthly Breakdown Chart */}
      <section>
        <h3 className="text-sm font-semibold text-emerald-500 uppercase tracking-wider mb-3">Monthly Revenue Breakdown</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="amount" name="Revenue" fill="#22c55e" radius={[3, 3, 0, 0]} maxBarSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Table */}
        <div className="mt-3 rounded-xl border border-border/50 overflow-hidden">
          <div className="grid grid-cols-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground p-2 bg-muted/50">
            <span>Month</span>
            <span className="text-right">Amount (PKR M)</span>
            <span className="text-right">vs Target</span>
          </div>
          {revenueChartData.map((row) => (
            <div key={row.month} className="grid grid-cols-3 text-xs p-2 border-t border-border/30">
              <span>{row.month}</span>
              <span className="text-right font-mono">{row.amount.toFixed(1)}</span>
              <span className={`text-right font-mono ${row.amount > 12 ? 'text-emerald-500' : 'text-red-500'}`}>
                {row.amount > 12 ? '+' : ''}{(row.amount - 12).toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Collection Rates */}
      <section>
        <h3 className="text-sm font-semibold text-emerald-500 uppercase tracking-wider mb-3">Collection Rates</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <StatBox label="Overall" value="87.3%" sub="+2.3pp QoQ" color="emerald" />
          <StatBox label="License Fees" value="94.1%" sub="Best category" color="emerald" />
          <StatBox label="Penalties" value="78.2%" sub="PKR 33.1M due" color="red" />
          <StatBox label="Inspection" value="99.8%" sub="Near-perfect" color="emerald" />
        </div>
        <div className="mt-2">
          <ActionButton label="Launch Collection Drive" icon={Target} />
        </div>
      </section>

      {/* Outstanding */}
      <section>
        <h3 className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-3">Outstanding Amounts</h3>
        <div className="space-y-1.5">
          {[
            { entity: 'Panjgur Oasis', amount: 'PKR 25M', reason: 'Boundary violation penalty', days: 28, action: 'Escalate to Legal' },
            { entity: 'Quetta Highland Farm', amount: 'PKR 1M', reason: 'Water usage violation', days: 9, action: 'Send Reminder' },
            { entity: '3 farms combined', amount: 'PKR 0.95M', reason: 'Overdue inspection fees', days: 15, action: 'Auto-Deduct' },
            { entity: '2 farms combined', amount: 'PKR 3M', reason: 'Pending renewal fees', days: 7, action: 'Send Notice' },
          ].map((item) => (
            <div key={item.entity} className="flex items-start justify-between p-2.5 rounded-xl border border-red-500/20 bg-red-500/5">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">{item.entity}</span>
                  <Badge variant="destructive" className="text-[9px]">{item.days}d overdue</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">{item.reason} — <span className="font-bold text-foreground">{item.amount}</span></p>
              </div>
              <div className="ml-2 shrink-0">
                <ActionButton label={item.action} icon={Zap} variant="urgent" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projections */}
      <section>
        <h3 className="text-sm font-semibold text-emerald-500 uppercase tracking-wider mb-3">AI Revenue Projections</h3>
        <div className="grid grid-cols-3 gap-2">
          <StatBox label="Best Case" value="PKR 108M" sub="Full collection" color="emerald" />
          <StatBox label="Projected" value="PKR 95.2M" sub="84% confidence" color="blue" />
          <StatBox label="Worst Case" value="PKR 72M" sub="If penalties lag" color="red" />
        </div>
        <div className="mt-2 flex gap-2 flex-wrap">
          <ActionButton label="Approve Revised Target" icon={Target} />
          <ActionButton label="Commission Forecast Report" icon={BarChart3} variant="schedule" />
        </div>
      </section>
    </div>
  )
}

function RegionalReport({ report }: { report: ReportTemplate }) {
  return (
    <div className="space-y-5">
      {/* Side by side comparison */}
      <section>
        <h3 className="text-sm font-semibold text-emerald-500 uppercase tracking-wider mb-3">Regional Comparison</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* KP */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="size-4 text-emerald-500" />
              <span className="text-sm font-semibold">Khyber Pakhtunkhwa</span>
            </div>
            {[
              { label: 'Farms', value: '15' },
              { label: 'Active Licenses', value: '13' },
              { label: 'Total Yield', value: '156.8 tonnes' },
              { label: 'Avg Yield/Farm', value: '10.45 tonnes' },
              { label: 'Revenue', value: 'PKR 148.5M' },
              { label: 'Compliance', value: '82.7%' },
              { label: 'New Registrations', value: '3 (Q1)' },
            ].map((row) => (
              <div key={row.label} className="flex justify-between text-xs">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-medium">{row.value}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-emerald-500/20">
              <p className="text-[10px] text-emerald-500 font-medium">Top: Tirah Valley Estate (18.2t, 91%)</p>
              <p className="text-[10px] text-red-500 font-medium">Low: Dir Cannabis Co-op (6.8t, 72%)</p>
            </div>
            <ActionButton label="Hire KP Inspector" icon={Users} />
          </div>

          {/* Balochistan */}
          <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-3 space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="size-4 text-teal-500" />
              <span className="text-sm font-semibold">Balochistan</span>
            </div>
            {[
              { label: 'Farms', value: '10' },
              { label: 'Active Licenses', value: '9' },
              { label: 'Total Yield', value: '130.7 tonnes' },
              { label: 'Avg Yield/Farm', value: '13.07 tonnes' },
              { label: 'Revenue', value: 'PKR 121.5M' },
              { label: 'Compliance', value: '83.4%' },
              { label: 'New Registrations', value: '1 (Q1)' },
            ].map((row) => (
              <div key={row.label} className="flex justify-between text-xs">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-medium">{row.value}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-teal-500/20">
              <p className="text-[10px] text-emerald-500 font-medium">Top: Chagai Desert Bloom (22.5t, 89%)</p>
              <p className="text-[10px] text-red-500 font-medium">Low: Panjgur Oasis (8.1t, 61%)</p>
            </div>
            <ActionButton label="Fund Lab Infrastructure" icon={FlaskConical} />
          </div>
        </div>
      </section>

      {/* Comparative Analysis */}
      <section>
        <h3 className="text-sm font-semibold text-emerald-500 uppercase tracking-wider mb-3">Comparative Analysis</h3>
        <div className="space-y-2">
          {[
            { metric: 'Yield Efficiency', kp: '10.45t/farm', bal: '13.07t/farm', winner: 'bal', insight: 'Balochistan +25% advantage (larger farm sizes in Chagai)' },
            { metric: 'Compliance Avg', kp: '82.7%', bal: '83.4%', winner: 'bal', insight: 'Marginal Balochistan lead, higher variance (std 9.2 vs 5.8)' },
            { metric: 'Revenue/Farm', kp: 'PKR 9.9M', bal: 'PKR 12.15M', winner: 'bal', insight: 'Balochistan higher per-farm contribution' },
            { metric: 'Inspector Ratio', kp: '1:5', bal: '1:3.3', winner: 'bal', insight: 'KP needs 1 additional inspector' },
          ].map((row) => (
            <div key={row.metric} className="p-2.5 rounded-xl border border-border/50 bg-muted/30">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">{row.metric}</span>
                <Badge variant="secondary" className="text-[9px]">{row.winner === 'kp' ? 'KP Leads' : 'Bal. Leads'}</Badge>
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>KP: <span className="font-mono font-medium text-foreground">{row.kp}</span></span>
                <span>Bal: <span className="font-mono font-medium text-foreground">{row.bal}</span></span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">{row.insight}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Growth */}
      <section>
        <h3 className="text-sm font-semibold text-emerald-500 uppercase tracking-wider mb-3">Growth Trajectories</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
            <p className="text-xs font-medium mb-1">KP Growth</p>
            <p className="text-xs text-muted-foreground">12% YoY farm growth. Yield plateauing due to water constraints in Lower Dir.</p>
            <div className="mt-2">
              <ActionButton label="Commission Water Study" icon={FlaskConical} variant="schedule" />
            </div>
          </div>
          <div className="p-3 rounded-xl border border-teal-500/20 bg-teal-500/5">
            <p className="text-xs font-medium mb-1">Balochistan Growth</p>
            <p className="text-xs text-muted-foreground">8% YoY growth. High potential in Zhob district (3 pre-applications).</p>
            <div className="mt-2">
              <ActionButton label="Approve Zhob Expansion" icon={Rocket} />
            </div>
          </div>
        </div>
        <div className="mt-2 p-2 rounded-lg bg-muted/50 border border-border/50">
          <p className="text-[11px] text-muted-foreground">Target: <span className="font-medium text-foreground">30 total farms by Q4 FY2026</span></p>
          <div className="mt-1.5">
            <ActionButton label="Set Growth Targets" icon={Target} />
          </div>
        </div>
      </section>
    </div>
  )
}

function ComplianceReport({ report }: { report: ReportTemplate }) {
  return (
    <div className="space-y-5">
      {/* Violations Summary */}
      <section>
        <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-3">Violations Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <StatBox label="Active" value="7" sub="violations" color="red" />
          <StatBox label="Critical" value="2" sub="immediate action" color="red" />
          <StatBox label="Resolved Q1" value="14" sub="avg 18.3 days" color="emerald" />
          <StatBox label="Penalty Rev." value="PKR 152M" sub="collected" color="amber" />
        </div>
        <div className="space-y-1.5 mt-3">
          {[
            { type: 'Critical', desc: 'Panjgur Oasis boundary violation — PKR 25M pending', action: 'Expedite Board Hearing', variant: 'urgent' as const },
            { type: 'Critical', desc: 'Chagai water compliance — 3 farms below threshold', action: 'Deploy Water Unit', variant: 'urgent' as const },
            { type: 'Major', desc: 'Pesticide use violations — 2 farms in KP', action: 'Issue Stop Order', variant: 'urgent' as const },
            { type: 'Major', desc: 'Documentation gaps — Balochistan inspector reports', action: 'Launch Training', variant: 'schedule' as const },
            { type: 'Minor', desc: 'Reporting delays — 2 farms late submissions', action: 'Send Reminder', variant: 'action' as const },
          ].map((v, i) => (
            <div key={i} className="flex items-start justify-between p-2.5 rounded-xl border border-border/50 bg-muted/30">
              <div className="flex items-start gap-2 flex-1">
                <Badge variant={v.type === 'Critical' ? 'destructive' : 'secondary'} className="text-[9px] mt-0.5 shrink-0">{v.type}</Badge>
                <p className="text-xs text-muted-foreground">{v.desc}</p>
              </div>
              <div className="ml-2 shrink-0">
                <ActionButton label={v.action} icon={Zap} variant={v.variant} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 p-2 rounded-lg bg-muted/50">
          <p className="text-[10px] text-muted-foreground">Repeat Offenders: <span className="font-medium text-red-500">Quetta Highland (2x), Dir Co-op (2x)</span></p>
          <div className="mt-1.5">
            <ActionButton label="Initiate License Review" icon={ShieldAlert} variant="urgent" />
          </div>
        </div>
      </section>

      {/* Inspector Performance */}
      <section>
        <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-3">Inspector Performance</h3>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <StatBox label="Inspectors" value="8" sub="total" color="blue" />
          <StatBox label="Inspections" value="67" sub="Q1 completed" color="emerald" />
          <StatBox label="Utilization" value="91%" sub="target: 85%" color="emerald" />
        </div>
        <div className="rounded-xl border border-border/50 overflow-hidden">
          <div className="grid grid-cols-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground p-2 bg-muted/50">
            <span>Inspector</span>
            <span className="text-center">Count</span>
            <span className="text-center">Accuracy</span>
            <span className="text-right">Action</span>
          </div>
          {[
            { name: 'Khalid Afridi', count: 12, accuracy: 96, top: true },
            { name: 'Fazal Khan', count: 10, accuracy: 92, top: false },
            { name: 'Rashid Baloch', count: 9, accuracy: 90, top: false },
            { name: 'Mir Hamza', count: 5, accuracy: 78, top: false },
          ].map((insp) => (
            <div key={insp.name} className="grid grid-cols-4 items-center text-xs p-2 border-t border-border/30">
              <span className="font-medium">{insp.name}</span>
              <span className="text-center font-mono">{insp.count}</span>
              <span className={`text-center font-mono ${insp.accuracy >= 90 ? 'text-emerald-500' : 'text-amber-500'}`}>{insp.accuracy}%</span>
              <div className="flex justify-end">
                {insp.top ? (
                  <ActionButton label="Promote" icon={Award} />
                ) : insp.accuracy < 85 ? (
                  <ActionButton label="Retrain" icon={Users} variant="schedule" />
                ) : (
                  <ActionButton label="Review" icon={Target} variant="action" />
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Risk Trends */}
      <section>
        <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-3">Risk Trends</h3>
        <div className="space-y-2">
          {[
            { trend: 'Water compliance violations', change: '+34%', direction: 'up', detail: 'Drought conditions in Chagai district', action: 'Deploy Water Monitors' },
            { trend: 'Pesticide violations', change: '-22%', direction: 'down', detail: 'Q4 enforcement action effective', action: 'Continue Program' },
            { trend: 'Documentation compliance', change: '+9pp', direction: 'down', detail: '88% vs 79% previous quarter', action: 'Expand Training' },
            { trend: 'License expiry risk', change: '3 farms', direction: 'up', detail: 'Approaching expiry without renewal apps', action: 'Send Urgent Notice' },
          ].map((t) => (
            <div key={t.trend} className="flex items-start justify-between p-2.5 rounded-xl border border-border/50 bg-muted/30">
              <div className="flex items-start gap-2 flex-1">
                <ArrowUpRight className={`size-3.5 mt-0.5 shrink-0 ${t.direction === 'up' ? 'text-red-500' : 'text-emerald-500 rotate-180'}`} />
                <div>
                  <p className="text-xs font-medium">{t.trend} <span className={`font-mono ${t.direction === 'up' ? 'text-red-500' : 'text-emerald-500'}`}>{t.change}</span></p>
                  <p className="text-[10px] text-muted-foreground">{t.detail}</p>
                </div>
              </div>
              <div className="ml-2 shrink-0">
                <ActionButton label={t.action} icon={Zap} variant={t.direction === 'up' ? 'urgent' : 'action'} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function AIStrategicReport({ report }: { report: ReportTemplate }) {
  const [hasAnimated, setHasAnimated] = useState(false)
  const aiAnalysis = `STRYDER AI has completed a comprehensive analysis of 2,847 data points across farm operations, compliance records, financial transactions, and environmental sensor readings. The CCRA is operating at 87% of optimal capacity with significant room for improvement in three key areas: compliance enforcement consistency, revenue collection efficiency, and international market readiness.

The most pressing concern is the water table decline in Chagai district, where satellite imagery shows a 12% drop over 90 days. If unaddressed, this threatens compliance status for 3 farms representing PKR 36M in annual revenue. Simultaneously, the Panjgur Oasis boundary violation (PKR 25M) represents both a legal risk and an opportunity to establish enforcement precedent.

On the positive side, yield performance has exceeded targets by 15%, and 4 new license applications in the pipeline represent PKR 8M in near-term revenue. Thailand's regulatory framework now accepts Pakistani cannabis certificates, opening a potential PKR 45M annual export market with a first-mover advantage window of approximately 90 days.`

  return (
    <div className="space-y-5">
      {/* AI Analysis */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-sm font-semibold text-emerald-500 uppercase tracking-wider">Strategic Intelligence Overview</h3>
          <StryderBadge />
        </div>
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {!hasAnimated ? (
              <TypewriterText text={aiAnalysis} speed={8} onComplete={() => setHasAnimated(true)} />
            ) : (
              aiAnalysis
            )}
          </p>
        </div>
      </section>

      {/* Prediction Confidence Scores */}
      <section>
        <h3 className="text-sm font-semibold text-emerald-500 uppercase tracking-wider mb-3">Prediction Confidence Scores</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[
            { prediction: 'Q2 Yield Forecast', value: '310 tonnes', confidence: 89, action: 'Set Yield Targets' },
            { prediction: 'Compliance Trajectory', value: '85.1% by June', confidence: 82, action: 'Approve Plan' },
            { prediction: 'Revenue Projection', value: 'PKR 95.2M', confidence: 84, action: 'Update Budget' },
          ].map((pred) => (
            <div key={pred.prediction} className="rounded-xl border border-border/50 bg-muted/30 p-3 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{pred.prediction}</p>
              <p className="text-lg font-bold mt-1">{pred.value}</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${pred.confidence}%` }} />
                </div>
                <span className="text-[10px] font-mono text-emerald-500">{pred.confidence}%</span>
              </div>
              <div className="mt-2">
                <ActionButton label={pred.action} icon={Target} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Risk Matrix */}
      <section>
        <h3 className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-3">Critical Risk Assessment</h3>
        <div className="space-y-2">
          {[
            { risk: 'Panjgur Oasis legal escalation', probability: '35%', impact: 'High', timeline: '14 days', action: 'Expedite Board Hearing', variant: 'urgent' as const },
            { risk: 'Chagai water table collapse', probability: '28%', impact: 'Very High', timeline: '90 days', action: 'Deploy Water Units', variant: 'urgent' as const },
            { risk: 'License renewal backlog', probability: '60%', impact: 'Medium', timeline: '45 days', action: 'Auto-Send Renewals', variant: 'schedule' as const },
            { risk: 'Inspector shortage KP', probability: '75%', impact: 'Medium', timeline: 'Ongoing', action: 'Authorize Hiring', variant: 'action' as const },
            { risk: 'Lab capacity strain', probability: '45%', impact: 'Medium', timeline: '30 days', action: 'Approve Overtime', variant: 'schedule' as const },
          ].map((r, i) => (
            <div key={i} className="flex items-start justify-between p-2.5 rounded-xl border border-red-500/20 bg-red-500/5">
              <div className="flex items-start gap-2 flex-1">
                <AlertTriangle className="size-3.5 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium">{r.risk}</p>
                  <div className="flex gap-3 mt-0.5">
                    <span className="text-[10px] text-muted-foreground">Prob: <span className="font-mono text-foreground">{r.probability}</span></span>
                    <span className="text-[10px] text-muted-foreground">Impact: <span className="font-mono text-foreground">{r.impact}</span></span>
                    <span className="text-[10px] text-muted-foreground">Window: <span className="font-mono text-foreground">{r.timeline}</span></span>
                  </div>
                </div>
              </div>
              <div className="ml-2 shrink-0">
                <ActionButton label={r.action} icon={Zap} variant={r.variant} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Opportunities */}
      <section>
        <h3 className="text-sm font-semibold text-emerald-500 uppercase tracking-wider mb-3">Opportunity Identification</h3>
        <div className="space-y-2">
          {[
            { opp: 'Thailand Export Market', revenue: 'PKR 45M/yr', window: '90 days', action: 'Initiate MOU', icon: Rocket },
            { opp: 'IoT Sensor Deployment', revenue: 'PKR 1.7M saving/yr', window: '6 months', action: 'Commission Pilot', icon: Zap },
            { opp: 'Strain Optimization', revenue: '23% yield increase', window: 'Next season', action: 'Fund Research', icon: FlaskConical },
            { opp: 'Inspector Training Academy', revenue: '40% compliance gap fix', window: '6 months', action: 'Approve Program', icon: Award },
          ].map((o, i) => (
            <div key={i} className="flex items-start justify-between p-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <div className="flex items-start gap-2 flex-1">
                <o.icon className="size-3.5 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium">{o.opp}</p>
                  <div className="flex gap-3 mt-0.5">
                    <span className="text-[10px] text-muted-foreground">Value: <span className="font-mono text-emerald-500">{o.revenue}</span></span>
                    <span className="text-[10px] text-muted-foreground">Window: <span className="font-mono text-foreground">{o.window}</span></span>
                  </div>
                </div>
              </div>
              <div className="ml-2 shrink-0">
                <ActionButton label={o.action} icon={o.icon} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Priority Actions */}
      <section>
        <h3 className="text-sm font-semibold text-emerald-500 uppercase tracking-wider mb-3">Priority Action Queue</h3>
        <div className="space-y-2">
          {[
            { priority: 'URGENT', label: 'Convene emergency Board session for Panjgur resolution', cost: 'Minimal', impact: 'High', action: 'Schedule Now', icon: CalendarClock, variant: 'urgent' as const },
            { priority: 'HIGH', label: 'Deploy 2 mobile water monitoring units to Chagai', cost: 'PKR 2.4M', impact: 'High', action: 'Authorize Purchase', icon: Zap, variant: 'urgent' as const },
            { priority: 'HIGH', label: 'Fast-track 4 pending license applications', cost: 'Staff time', impact: 'PKR 8M revenue', action: 'Approve Fast-Track', icon: Rocket, variant: 'action' as const },
            { priority: 'MEDIUM', label: 'Initiate Thailand export MOU discussions', cost: 'Diplomatic', impact: 'PKR 45M/yr', action: 'Draft MOU', icon: Send, variant: 'action' as const },
            { priority: 'MEDIUM', label: 'Commission IoT pilot for top 8 farms', cost: 'PKR 5.2M', impact: '18mo ROI', action: 'Launch Pilot', icon: Target, variant: 'schedule' as const },
          ].map((a, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-border/50 bg-muted/30">
              <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500 text-[10px] font-bold mt-0.5">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={a.priority === 'URGENT' ? 'destructive' : 'secondary'} className="text-[9px]">{a.priority}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{a.label}</p>
                <div className="flex gap-3 mt-0.5">
                  <span className="text-[10px] text-muted-foreground">Cost: <span className="font-mono text-foreground">{a.cost}</span></span>
                  <span className="text-[10px] text-muted-foreground">Impact: <span className="font-mono text-foreground">{a.impact}</span></span>
                </div>
                <div className="mt-1.5">
                  <ActionButton label={a.action} icon={a.icon} variant={a.variant} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function getReportBody(report: ReportTemplate) {
  switch (report.id) {
    case 'rpt-board': return <BoardReport report={report} />
    case 'rpt-intl': return <InternationalReport report={report} />
    case 'rpt-revenue': return <RevenueReport report={report} />
    case 'rpt-regional': return <RegionalReport report={report} />
    case 'rpt-compliance': return <ComplianceReport report={report} />
    case 'rpt-ai': return <AIStrategicReport report={report} />
    default: return null
  }
}

export function ReportPreview({ report, open, onOpenChange }: ReportPreviewProps) {
  if (!report) return null

  const categoryColors: Record<string, string> = {
    governance: 'text-purple-500',
    compliance: 'text-amber-500',
    financial: 'text-emerald-500',
    regional: 'text-blue-500',
    ai: 'text-emerald-500',
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="sm:max-w-2xl max-h-[85vh] overflow-y-auto"
      >
        <DialogHeader>
          {/* Report Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <span className="text-emerald-500 text-xs font-bold">CCRA</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Cannabis Regulatory Authority</p>
                    <p className="text-[9px] text-muted-foreground">Government of Pakistan</p>
                  </div>
                </div>
              </div>
              <Badge variant="destructive" className="text-[9px] uppercase tracking-wider">Confidential</Badge>
            </div>
            <DialogTitle className="text-lg font-bold">
              {report.title}
            </DialogTitle>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="size-3" />
                <span>Generated: {new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <Badge variant="secondary" className="text-[9px]">{report.frequency}</Badge>
              {report.id === 'rpt-ai' && <StryderBadge />}
            </div>
            <div className="h-px bg-border" />
          </div>
        </DialogHeader>

        {/* Report Body */}
        <div className="mt-1">
          {getReportBody(report)}
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-2">
          <Button
            className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white border-0 gap-1.5"
            onClick={() => {
              toast.success('PDF Download Started', {
                description: `${report.title} is being generated and will download shortly.`,
              })
            }}
          >
            <Download className="size-3.5" />
            Download PDF
          </Button>
          <Button
            variant="outline"
            className="gap-1.5"
            onClick={() => {
              toast.success('Auto-Generation Scheduled', {
                description: `${report.title} will be automatically generated ${report.frequency === 'monthly' ? 'on the 1st of each month' : report.frequency === 'quarterly' ? 'at the start of each quarter' : 'on demand'}.`,
              })
            }}
          >
            <CalendarClock className="size-3.5" />
            Schedule Auto-Generate
          </Button>
          <Button
            variant="outline"
            className="gap-1.5"
            onClick={() => {
              toast.success('Report Shared', {
                description: 'Report has been shared with all Board of Governors members via secure channel.',
              })
            }}
          >
            <Share2 className="size-3.5" />
            Share with Board
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
