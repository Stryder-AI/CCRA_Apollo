'use client'

import { useState } from 'react'
import { GlassCard } from '@/design-system/glass-card'
import { StryderBadge } from '@/components/ai/StryderBadge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  FileText,
  Download,
  Calendar,
  BarChart3,
  Shield,
  DollarSign,
  Sprout,
  CheckCircle,
  Loader2,
} from 'lucide-react'
import { dashboardStats } from '@/data/mock-stats'
import { formatCurrency } from '@/utils/format'

export function BoardReportGenerator() {
  const [open, setOpen] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      setGenerated(true)
    }, 2000)
  }

  const handleOpen = () => {
    setOpen(true)
    setGenerated(false)
    setGenerating(false)
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-ccra-green/10 border border-ccra-green/20 text-ccra-green hover:bg-ccra-green/20 transition-colors"
      >
        <FileText className="h-3.5 w-3.5" />
        Generate Board Report
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-ccra-green" />
              Board of Governors Report
              <StryderBadge size="sm" />
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {/* Report Preview */}
            <div className="rounded-xl border border-border bg-white dark:bg-zinc-900 p-6 space-y-6">
              {/* Header */}
              <div className="text-center border-b border-border pb-4">
                <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                  Government of Pakistan
                </p>
                <h2 className="text-lg font-bold mt-1">
                  Cannabis Cultivation Regulatory Authority
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Executive Summary Report — Q1 FY2026
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Generated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>

              {/* KPI Summary */}
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Key Performance Indicators
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/30 border border-border">
                    <Sprout className="h-5 w-5 text-ccra-green shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Registered Farms</p>
                      <p className="text-lg font-bold">{dashboardStats.totalFarms}</p>
                      <p className="text-[10px] text-ccra-green">+{dashboardStats.totalFarmsTrend}% vs prev quarter</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/30 border border-border">
                    <FileText className="h-5 w-5 text-ccra-teal shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Active Licenses</p>
                      <p className="text-lg font-bold">{dashboardStats.activeLicenses}</p>
                      <p className="text-[10px] text-ccra-green">+{dashboardStats.activeLicensesTrend}% vs prev quarter</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/30 border border-border">
                    <DollarSign className="h-5 w-5 text-ccra-gold shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Total Revenue</p>
                      <p className="text-lg font-bold">{formatCurrency(dashboardStats.totalRevenue)}</p>
                      <p className="text-[10px] text-ccra-green">+{dashboardStats.totalRevenueTrend}% vs prev quarter</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/30 border border-border">
                    <Shield className="h-5 w-5 text-ccra-teal shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Compliance Rate</p>
                      <p className="text-lg font-bold">{dashboardStats.complianceRate}%</p>
                      <p className="text-[10px] text-ccra-red">{dashboardStats.complianceRateTrend}% vs prev quarter</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Recommendations */}
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  STRYDER AI Recommendations
                  <StryderBadge size="sm" />
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-ccra-green shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Expand Balochistan Operations:</span> 40% growth potential identified in Chagai and Zhob districts. Recommend 5 additional cultivation licenses.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-ccra-green shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Compliance Enhancement:</span> Deploy mobile inspection units in Dir and Swat regions where compliance declined 2.1%. Estimated cost: PKR 4.5M.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-ccra-green shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Revenue Optimization:</span> Implement tiered penalty structure to improve collection rate from 87.3% to target 95%. Projected additional revenue: PKR 18M annually.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-ccra-green shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Export Readiness:</span> 3 batches ready for international distribution. Recommend prioritizing GCC market entry with pharmaceutical-grade products from Tirah Medicinal Labs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-border pt-3 flex items-center justify-between text-[10px] text-muted-foreground">
                <span>CCRA Intelligence Nexus — Powered by STRYDER AI</span>
                <span>CONFIDENTIAL — For Board Members Only</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Report includes live data from all 10 modules
              </p>
              <div className="flex items-center gap-2">
                {!generated ? (
                  <Button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="gap-2"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        <BarChart3 className="h-4 w-4" />
                        Generate Report
                      </>
                    )}
                  </Button>
                ) : (
                  <Button className="gap-2 bg-ccra-green hover:bg-ccra-green/90">
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
