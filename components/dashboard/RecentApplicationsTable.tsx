'use client'

import { useRouter } from 'next/navigation'
import { GlassCard } from '@/design-system/glass-card'
import { licenses } from '@/data/mock-licenses'
import { useLicenseStore } from '@/store/useLicenseStore'
import { formatDateShort, formatCurrency } from '@/utils/format'
import { cn } from '@/lib/utils'

const statusStyles: Record<string, string> = {
  active: 'badge-active',
  pending: 'badge-pending',
  suspended: 'badge-suspended',
  revoked: 'badge-revoked',
  'under-review': 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  approved: 'badge-active',
  rejected: 'badge-suspended',
  expired: 'badge-revoked',
}

export function RecentApplicationsTable() {
  const router = useRouter()
  const recent = [...licenses]
    .sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime())
    .slice(0, 5)

  const handleRowClick = (licId: string) => {
    useLicenseStore.getState().setSelectedLicense(licId)
    router.push('/licensing')
  }

  return (
    <GlassCard padding="none">
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">Recent Applications</h3>
          <span className="text-xs text-muted-foreground">This Month</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Applicant</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-3 py-3">Type</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-3 py-3">Date</th>
              <th className="text-right text-xs font-medium text-muted-foreground px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((lic) => (
              <tr key={lic.id} className="border-b border-border/30 last:border-0 hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => handleRowClick(lic.id)}>
                <td className="px-6 py-3">
                  <p className="font-medium">{lic.applicantName}</p>
                  <p className="text-xs text-muted-foreground">{lic.companyName}</p>
                </td>
                <td className="px-3 py-3 text-muted-foreground">{lic.type}</td>
                <td className="px-3 py-3 text-muted-foreground font-mono text-xs">{formatDateShort(lic.applicationDate)}</td>
                <td className="px-6 py-3 text-right">
                  <span className={cn('inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize', statusStyles[lic.status] || 'badge-revoked')}>
                    {lic.status.replace('-', ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  )
}
