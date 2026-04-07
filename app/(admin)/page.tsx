'use client'

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
import { dashboardStats } from '@/data/mock-stats'
import { formatCurrency, formatPercent } from '@/utils/format'
import { Sprout, FileCheck, Banknote, ShieldCheck } from 'lucide-react'

export default function DashboardPage() {
  return (
    <PageTransition>
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
            <StatCard
              label="Total Farms"
              value={dashboardStats.totalFarms}
              trend={dashboardStats.totalFarmsTrend}
              icon={Sprout}
              accentColor="bg-ccra-green"
              href="/farms"
              sparklineData={dashboardStats.totalFarmsSpark}
            />
            <StatCard
              label="Active Licenses"
              value={dashboardStats.activeLicenses}
              trend={dashboardStats.activeLicensesTrend}
              icon={FileCheck}
              accentColor="bg-ccra-teal"
              href="/licensing"
              sparklineData={dashboardStats.activeLicensesSpark}
            />
            <StatCard
              label="Revenue"
              value={dashboardStats.totalRevenue}
              formatter={(v) => formatCurrency(v)}
              trend={dashboardStats.totalRevenueTrend}
              icon={Banknote}
              accentColor="bg-ccra-gold"
              href="/revenue"
              sparklineData={dashboardStats.totalRevenueSpark}
            />
            <StatCard
              label="Compliance"
              value={dashboardStats.complianceRate}
              formatter={(v) => formatPercent(v)}
              trend={dashboardStats.complianceRateTrend}
              icon={ShieldCheck}
              accentColor="bg-ccra-teal"
              href="/compliance"
              sparklineData={dashboardStats.complianceRateSpark}
            />
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
