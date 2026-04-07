'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { GlassCard } from '@/design-system/glass-card'
import { AnimatedNumber } from '@/design-system/animated-number'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { LucideIcon } from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts'

const accentColorMap: Record<string, string> = {
  'bg-ccra-green': 'var(--color-ccra-green)',
  'bg-ccra-teal': 'var(--color-ccra-teal)',
  'bg-ccra-gold': 'var(--color-ccra-gold)',
}

interface StatCardProps {
  label: string
  value: number
  formatter?: (value: number) => string
  trend: number
  icon: LucideIcon
  accentColor: string // tailwind color class like 'bg-ccra-green'
  href?: string
  sparklineData?: number[]
}

export function StatCard({ label, value, formatter, trend, icon: Icon, accentColor, href, sparklineData }: StatCardProps) {
  const isPositive = trend >= 0
  const strokeColor = accentColorMap[accentColor] || 'var(--color-ccra-green)'

  const card = (
    <GlassCard hover glow="green" className={cn('relative overflow-hidden', href && 'cursor-pointer')}>
      <div className={cn('absolute top-0 left-0 w-1 h-full rounded-l-2xl', accentColor)} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <div className="mt-2 text-2xl font-semibold tracking-tight">
            <AnimatedNumber value={value} formatter={formatter || ((v) => v.toLocaleString())} />
          </div>
          <div className={cn(
            'flex items-center gap-1 mt-2 text-[11px] font-medium',
            isPositive ? 'text-ccra-green' : 'text-ccra-red'
          )}>
            {isPositive ? <TrendingUp className="w-3 h-3 shrink-0" /> : <TrendingDown className="w-3 h-3 shrink-0" />}
            <span>{Math.abs(trend)}%</span>
            <span className="text-muted-foreground">vs last mo.</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-accent">
          <Icon className={cn('w-5 h-5', accentColor.replace('bg-', 'text-'))} />
        </div>
      </div>
      {sparklineData && sparklineData.length > 0 && (
        <div className="mt-3 -mx-1 -mb-1">
          <ResponsiveContainer width="100%" height={40}>
            <AreaChart data={sparklineData.map((v) => ({ v }))}>
              <defs>
                <linearGradient id={`sparkFill-${label.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={strokeColor} stopOpacity={0.1} />
                  <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={strokeColor}
                strokeWidth={1.5}
                fill={`url(#sparkFill-${label.replace(/\s/g, '')})`}
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </GlassCard>
  )

  if (href) {
    return <Link href={href} className="block">{card}</Link>
  }

  return card
}
