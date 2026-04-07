'use client'

import Link from 'next/link'
import { GlassCard } from '@/design-system/glass-card'
import { licenses } from '@/data/mock-licenses'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const COLORS = ['#22c55e', '#14b8a6', '#eab308', '#3b82f6']

export function LicensesPieChart() {
  const data = [
    { name: 'Cultivation', value: licenses.filter((l) => l.type === 'Cultivation').length },
    { name: 'Extraction', value: licenses.filter((l) => l.type === 'Extraction').length },
    { name: 'Manufacturing', value: licenses.filter((l) => l.type === 'Manufacturing').length },
    { name: 'Sales & Distribution', value: licenses.filter((l) => l.type === 'Sales & Distribution').length },
  ]

  const total = data.reduce((acc, d) => acc + d.value, 0)

  return (
    <Link href="/licensing" className="block">
      <GlassCard hover glow="green" className="cursor-pointer">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">License Distribution</h3>
        <div className="relative h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold font-mono">{total}</span>
            <span className="text-[10px] text-muted-foreground">Total</span>
          </div>
        </div>
        <div className="space-y-2 mt-3">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[index] }} />
                <span className="text-muted-foreground">{item.name}</span>
              </div>
              <span className="font-mono font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </Link>
  )
}
