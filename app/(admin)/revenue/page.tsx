'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatCard } from '@/components/dashboard/StatCard'
import { GlassCard } from '@/design-system/glass-card'
import { AiInsightCard } from '@/components/ai/AiInsightCard'
import { TransactionDetailModal } from '@/components/revenue/TransactionDetailModal'
import { revenueRecords, transactions, financialSummary } from '@/data/mock-revenue'
import { formatCurrency, formatDateShort } from '@/utils/format'
import { DollarSign, AlertTriangle, TrendingUp, Target } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Transaction } from '@/types/revenue'
import {
  AreaChart,
  Area,
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

const statusColors: Record<string, string> = {
  completed: 'bg-ccra-green/10 text-ccra-green',
  pending: 'bg-ccra-gold/10 text-ccra-gold',
  failed: 'bg-ccra-red/10 text-ccra-red',
}

export default function RevenuePage() {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [txModalOpen, setTxModalOpen] = useState(false)

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <PageHeader
        title="Revenue & Financial Management"
        description="Fee collection, penalties, and financial analytics"
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue"
          value={financialSummary.totalRevenue}
          formatter={(v) => formatCurrency(v)}
          trend={12.5}
          icon={DollarSign}
          accentColor="bg-ccra-green"
        />
        <StatCard
          label="Penalty Income"
          value={financialSummary.totalPenalties}
          formatter={(v) => formatCurrency(v)}
          trend={-8.2}
          icon={AlertTriangle}
          accentColor="bg-ccra-red"
        />
        <StatCard
          label="Collection Rate"
          value={financialSummary.collectionRate}
          formatter={(v) => `${v.toFixed(1)}%`}
          trend={3.1}
          icon={TrendingUp}
          accentColor="bg-ccra-teal"
        />
        <StatCard
          label="Projected Q2"
          value={92000000}
          formatter={(v) => formatCurrency(v)}
          trend={8.2}
          icon={Target}
          accentColor="bg-ccra-gold"
        />
      </div>

      {/* Revenue Chart */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">Revenue Breakdown by Category</h3>
          <span className="text-xs text-muted-foreground">Last 12 months</span>
        </div>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueRecords}>
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
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
              />
              <Area
                type="monotone"
                dataKey="licenseFees"
                name="License Fees"
                stackId="1"
                fill="#22c55e"
                stroke="#22c55e"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="penalties"
                name="Penalties"
                stackId="1"
                fill="#ef4444"
                stroke="#ef4444"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="inspectionFees"
                name="Inspection Fees"
                stackId="1"
                fill="#14b8a6"
                stroke="#14b8a6"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="renewalFees"
                name="Renewal Fees"
                stackId="1"
                fill="#eab308"
                stroke="#eab308"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Recent Transactions */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">Recent Transactions</h3>
          <span className="text-xs text-muted-foreground">{transactions.length} transactions</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 font-medium text-muted-foreground">Date</th>
                <th className="pb-3 font-medium text-muted-foreground">Description</th>
                <th className="pb-3 font-medium text-muted-foreground">Payer</th>
                <th className="pb-3 font-medium text-muted-foreground text-right">Amount</th>
                <th className="pb-3 font-medium text-muted-foreground text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b border-border/50 hover:bg-accent/30 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedTransaction(tx)
                    setTxModalOpen(true)
                  }}
                >
                  <td className="py-3 text-muted-foreground">{formatDateShort(tx.date)}</td>
                  <td className="py-3">{tx.description}</td>
                  <td className="py-3 text-muted-foreground">{tx.payer}</td>
                  <td className="py-3 text-right font-mono">
                    {formatCurrency(tx.amount)}
                  </td>
                  <td className="py-3 text-center">
                    <span className={cn(
                      'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                      statusColors[tx.status]
                    )}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* AI Insight */}
      <AiInsightCard
        title="Revenue Forecast"
        insight="Q1 FY2026 revenue is tracking 12.5% above projections, driven primarily by new license applications from Balochistan. Penalty income decreased 8.2% MoM — a positive compliance signal. Collection rate of 87.3% is strong but 2 outstanding penalties (PKR 26M combined) remain unpaid beyond 30 days. Recommend initiating enforcement proceedings for TXN-2026-0271 and TXN-2026-0205."
        severity="info"
        confidence={91}
      />

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        transaction={selectedTransaction}
        open={txModalOpen}
        onOpenChange={setTxModalOpen}
      />
    </div>
  )
}
