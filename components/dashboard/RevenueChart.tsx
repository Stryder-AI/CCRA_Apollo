'use client'

import { GlassCard } from '@/design-system/glass-card'
import { monthlyRevenue } from '@/data/mock-stats'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null
  return (
    <div className="glass rounded-lg p-3 text-sm">
      <p className="font-medium mb-1">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} className="flex items-center gap-2 text-muted-foreground">
          <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          {entry.name}: PKR {(entry.value / 1_000_000).toFixed(1)}M
        </p>
      ))}
    </div>
  )
}

export function RevenueChart() {
  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">Revenue & Cash Flow</h3>
        <span className="text-xs text-muted-foreground">Last 12 months</span>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyRevenue} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
              tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(34, 197, 94, 0.05)' }} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
            />
            <Bar
              dataKey="income"
              name="Income"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
              animationBegin={300}
              animationDuration={1000}
            />
            <Bar
              dataKey="expense"
              name="Expense"
              fill="#e5e7eb"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
              animationBegin={300}
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  )
}
