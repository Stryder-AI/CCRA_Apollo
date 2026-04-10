'use client'

import { useState } from 'react'
import { useFilteredLicenses } from '@/hooks/useFilteredLicenses'
import { useLicenseStore } from '@/store/useLicenseStore'
import { GlassCard } from '@/design-system/glass-card'
import { Button } from '@/components/ui/button'
import { formatDateShort, formatCurrencyFull } from '@/utils/format'
import { cn } from '@/lib/utils'
import { APPLICATION_STATUS_CONFIG } from '@/config/constants'
import { getLicenseCategoryShortLabel, getTierLabel } from '@/utils/license-helpers'
import { CheckSquare, Square, CheckCircle2, XCircle, Download, Clock } from 'lucide-react'
import type { ApplicationStatus } from '@/types/license'

function getDaysUntilExpiry(expiryDate?: string): number | null {
  if (!expiryDate) return null
  const now = new Date()
  const expiry = new Date(expiryDate)
  const diff = expiry.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function ExpiryCountdown({ days }: { days: number | null }) {
  if (days === null) return null
  if (days > 90) return null

  const isUrgent = days <= 30
  const isWarning = days > 30 && days <= 90

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium',
        isUrgent && 'bg-red-500/10 text-red-500 animate-pulse',
        isWarning && 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
      )}
    >
      <Clock className="h-2.5 w-2.5" />
      {days <= 0 ? 'Expired' : `${days}d left`}
    </span>
  )
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
  const config = APPLICATION_STATUS_CONFIG[status]
  if (!config) return <span className="text-xs">{status}</span>
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border"
      style={{
        backgroundColor: config.bgColor,
        color: config.color,
        borderColor: config.borderColor,
      }}
    >
      {config.label}
    </span>
  )
}

export function LicenseTable() {
  const licenses = useFilteredLicenses()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const allSelected = licenses.length > 0 && selectedIds.size === licenses.length
  const someSelected = selectedIds.size > 0

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(licenses.map((l) => l.id)))
    }
  }

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-0">
      {/* Batch action bar */}
      {someSelected && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-t-2xl glass border border-border border-b-0 bg-accent/30">
          <span className="text-sm font-medium text-foreground">{selectedIds.size} selected</span>
          <div className="flex items-center gap-2 ml-auto">
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1 border-green-600 text-green-600 hover:bg-green-600/10"
              onClick={() => { setSelectedIds(new Set()) }}
            >
              <CheckCircle2 className="h-3 w-3" />
              Approve All
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1 border-red-500 text-red-500 hover:bg-red-500/10"
              onClick={() => { setSelectedIds(new Set()) }}
            >
              <XCircle className="h-3 w-3" />
              Reject All
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1"
              onClick={() => { setSelectedIds(new Set()) }}
            >
              <Download className="h-3 w-3" />
              Export
            </Button>
          </div>
        </div>
      )}

      <GlassCard padding="none" className={cn('overflow-hidden', someSelected && 'rounded-t-none border-t-0')}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-3 py-3 w-10">
                  <button onClick={toggleAll} className="text-muted-foreground hover:text-foreground transition-colors">
                    {allSelected ? <CheckSquare className="h-4 w-4 text-green-600" /> : <Square className="h-4 w-4" />}
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">License #</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Applicant / Company</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Category</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Tier</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Region</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Fee Paid</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Application Date</th>
              </tr>
            </thead>
            <tbody>
              {licenses.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                    No licenses found matching your criteria.
                  </td>
                </tr>
              ) : (
                licenses.map((lic) => {
                  const daysLeft = getDaysUntilExpiry(lic.expiryDate)
                  const isChecked = selectedIds.has(lic.id)
                  return (
                    <tr
                      key={lic.id}
                      className={cn(
                        'border-b border-white/5 cursor-pointer hover:bg-accent/5 transition-colors',
                        isChecked && 'bg-green-600/5'
                      )}
                      onClick={() => useLicenseStore.getState().setSelectedLicense(lic.id)}
                    >
                      <td className="px-3 py-3" onClick={(e) => { e.stopPropagation(); toggleOne(lic.id) }}>
                        {isChecked
                          ? <CheckSquare className="h-4 w-4 text-green-600" />
                          : <Square className="h-4 w-4 text-muted-foreground" />
                        }
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{lic.licenseNumber}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{lic.applicantName}</div>
                        <div className="text-xs text-muted-foreground">{lic.companyName}</div>
                      </td>
                      <td className="px-4 py-3 text-xs">{getLicenseCategoryShortLabel(lic.category)}</td>
                      <td className="px-4 py-3 text-xs">{getTierLabel(lic.category, lic.tier)}</td>
                      <td className="px-4 py-3">{lic.region}</td>
                      <td className="px-4 py-3 text-right font-mono text-xs">
                        {formatCurrencyFull(lic.feePaidPKR)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <StatusBadge status={lic.status} />
                          <ExpiryCountdown days={daysLeft} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {formatDateShort(lic.applicationDate)}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
