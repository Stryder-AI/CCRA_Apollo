'use client'

import { PageHeader } from '@/components/layout/PageHeader'
import { GlassCard } from '@/design-system/glass-card'
import { AiInsightCard } from '@/components/ai/AiInsightCard'
import {
  yieldByRegion,
  strainPerformance,
  complianceDistribution,
  monthlyRegistrations,
  regionalComparison,
} from '@/data/mock-analytics'
import { formatCurrency, formatNumber } from '@/utils/format'
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null
  return (
    <div className="glass rounded-lg p-3 text-sm">
      <p className="font-medium mb-1">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} className="flex items-center gap-2 text-muted-foreground">
          <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
        </p>
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <PageHeader
        title="Research & Analytics"
        description="Yield data, strain performance, and climate correlation"
      />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Yield by Region */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Yield by Region (tonnes)</h3>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yieldByRegion}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="region"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                  angle={-35}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(34, 197, 94, 0.05)' }} />
                <Bar
                  dataKey="yield"
                  name="Yield (t)"
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Strain Performance */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Strain Performance (Avg Yield)</h3>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={strainPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                />
                <YAxis
                  type="category"
                  dataKey="strain"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                  width={130}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(34, 197, 94, 0.05)' }} />
                <Bar
                  dataKey="avgYield"
                  name="Avg Yield (t)"
                  fill="#14b8a6"
                  radius={[0, 4, 4, 0]}
                  maxBarSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Compliance Distribution */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Compliance Score Distribution</h3>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complianceDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="range"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                  label={{ value: 'Compliance %', position: 'insideBottom', offset: -5, fontSize: 11, fill: 'var(--muted-foreground)' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                  allowDecimals={false}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(34, 197, 94, 0.05)' }} />
                <Bar
                  dataKey="count"
                  name="Farms"
                  fill="#eab308"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Monthly Registrations */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Monthly Farm Registrations</h3>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRegistrations}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                  allowDecimals={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="registrations"
                  name="Registrations"
                  fill="#22c55e"
                  stroke="#22c55e"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Regional Comparison */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Regional Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* KP */}
          <GlassCard hover glow="green">
            <h4 className="text-lg font-semibold mb-4">Khyber Pakhtunkhwa</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Farms</span>
                <span className="font-medium">{regionalComparison.kp.farms}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Yield</span>
                <span className="font-medium">{regionalComparison.kp.totalYield} tonnes</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Avg Compliance</span>
                <span className="font-medium">{regionalComparison.kp.avgCompliance}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Revenue</span>
                <span className="font-medium">{formatCurrency(regionalComparison.kp.revenue)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Active Licenses</span>
                <span className="font-medium">{regionalComparison.kp.activeLicenses}</span>
              </div>
            </div>
          </GlassCard>

          {/* Balochistan */}
          <GlassCard hover glow="teal">
            <h4 className="text-lg font-semibold mb-4">Balochistan</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Farms</span>
                <span className="font-medium">{regionalComparison.balochistan.farms}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Yield</span>
                <span className="font-medium">{regionalComparison.balochistan.totalYield} tonnes</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Avg Compliance</span>
                <span className="font-medium">{regionalComparison.balochistan.avgCompliance}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Revenue</span>
                <span className="font-medium">{formatCurrency(regionalComparison.balochistan.revenue)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Active Licenses</span>
                <span className="font-medium">{regionalComparison.balochistan.activeLicenses}</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* AI Insight */}
      <AiInsightCard
        title="Yield & Performance Analysis"
        insight="Chagai district leads in total yield (44.5t) driven by large-scale industrial hemp operations with 22.25t per-farm average. However, Balochi Gold strain shows concerning compliance variance (77% avg) despite strong yields — recommend targeted compliance audits for 4 farms growing this strain. KP maintains higher farm density (15 vs 10) but Balochistan shows marginally better per-farm compliance (83.4% vs 82.7%). Registration velocity has slowed to 1/month in Q1 — seasonal pattern expected to reverse in Q2."
        severity="info"
        confidence={88}
      />
    </div>
  )
}
