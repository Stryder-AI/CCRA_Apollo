'use client'

import { useMemo, useState, useEffect } from 'react'
import { PageTransition } from '@/design-system/page-transition'
import { StatCard } from '@/components/dashboard/StatCard'
import { AuthorityCard } from '@/components/dashboard/AuthorityCard'
import { ComplianceSummary } from '@/components/dashboard/ComplianceSummary'
import { RegionalBreakdown } from '@/components/dashboard/RegionalBreakdown'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { LicensesPieChart } from '@/components/dashboard/LicensesPieChart'
import { RecentApplicationsTable } from '@/components/dashboard/RecentApplicationsTable'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { AlertsPanel } from '@/components/dashboard/AlertsPanel'
import { AiDashboardSummary } from '@/components/dashboard/AiDashboardSummary'
import { BoardReportGenerator } from '@/components/dashboard/BoardReportGenerator'
import { dashboardStats as mockStats } from '@/data/mock-stats'
import { useLicenseStore } from '@/store/useLicenseStore'
import { useAuthStore } from '@/store/useAuthStore'
import { formatCurrency, formatPercent } from '@/utils/format'
import { Sprout, FileCheck, Banknote, ShieldCheck } from 'lucide-react'
import { SkeletonDashboard } from '@/components/ui/skeleton-card'

export default function DashboardPage() {
  const licenses = useLicenseStore((s) => s.licenses)
  const user = useAuthStore((s) => s.user)

  const [isLoading, setIsLoading] = useState(true)
  const [timeOfDay, setTimeOfDay] = useState('')
  const [formattedDate, setFormattedDate] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const now = new Date()
    const hour = now.getHours()
    setTimeOfDay(hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening')
    setFormattedDate(now.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }))
  }, [])

  const dashboardStats = useMemo(() => {
    const totalFarms = licenses.filter((l) =>
      ['CULTIVATION', 'INDUSTRIAL_HEMP'].includes(l.category)
    ).length
    const activeLicenses = licenses.filter((l) =>
      ['APPROVED', 'APPROVED_WITH_CONDITIONS'].includes(l.status)
    ).length

    return {
      ...mockStats,
      totalFarms,
      activeLicenses,
    }
  }, [licenses])

  if (isLoading) {
    return (
      <PageTransition>
        <SkeletonDashboard />
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      {/* Welcome */}
      <div className="mb-6 animate-slide-up">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Good {timeOfDay}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {formattedDate} — Here&apos;s your intelligence briefing for today.
        </p>
      </div>

      {/* AI Briefing + Report Generator */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <AiDashboardSummary />
        </div>
        <div className="ml-4 pt-2 shrink-0">
          <BoardReportGenerator />
        </div>
      </div>

      {/* Alerts */}
      <div className="mb-6">
        <AlertsPanel />
      </div>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-[280px_1fr_320px] gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <AuthorityCard />
          <ComplianceSummary />
          <RegionalBreakdown />
        </div>

        {/* Center Column */}
        <div className="space-y-6">
          {/* Stat Cards Row */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Total Farms" as const, value: dashboardStats.totalFarms, trend: dashboardStats.totalFarmsTrend, icon: Sprout, accentColor: "bg-ccra-green" as const, href: "/farms", sparklineData: dashboardStats.totalFarmsSpark },
              { label: "Active Licenses" as const, value: dashboardStats.activeLicenses, trend: dashboardStats.activeLicensesTrend, icon: FileCheck, accentColor: "bg-ccra-teal" as const, href: "/licensing", sparklineData: dashboardStats.activeLicensesSpark },
              { label: "Revenue" as const, value: dashboardStats.totalRevenue, trend: dashboardStats.totalRevenueTrend, icon: Banknote, accentColor: "bg-ccra-gold" as const, href: "/revenue", sparklineData: dashboardStats.totalRevenueSpark, formatter: (v: number) => formatCurrency(v) },
              { label: "Compliance" as const, value: dashboardStats.complianceRate, trend: dashboardStats.complianceRateTrend, icon: ShieldCheck, accentColor: "bg-ccra-teal" as const, href: "/compliance", sparklineData: dashboardStats.complianceRateSpark, formatter: (v: number) => formatPercent(v) },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="opacity-0 animate-[slide-up-fade_0.6s_ease-out_forwards]"
                style={{ animationDelay: `${i * 100 + 200}ms` }}
              >
                <StatCard
                  label={stat.label}
                  value={stat.value}
                  trend={stat.trend}
                  icon={stat.icon}
                  accentColor={stat.accentColor}
                  href={stat.href}
                  sparklineData={stat.sparklineData}
                  {...(stat.formatter ? { formatter: stat.formatter } : {})}
                />
              </div>
            ))}
          </div>

          {/* Revenue Chart */}
          <RevenueChart />

          {/* Recent Applications */}
          <RecentApplicationsTable />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <LicensesPieChart />
          <ActivityFeed />
        </div>
      </div>
    </PageTransition>
  )
}
