'use client'

import { Input } from '@/components/ui/input'
import { useLicenseStore } from '@/store/useLicenseStore'
import { LICENSE_CATEGORIES, APPLICATION_STATUS_CONFIG } from '@/config/constants'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ApplicationStatus } from '@/types/license'

const selectClasses =
  'h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'

const STATUS_GROUPS: { group: string; statuses: ApplicationStatus[] }[] = [
  { group: 'Pre-Application', statuses: ['DRAFT'] },
  { group: 'Submission', statuses: ['SUBMITTED'] },
  { group: 'Review', statuses: ['UNDER_REVIEW_SCREENING', 'RFI_ISSUED', 'UNDER_REVIEW_TECHNICAL'] },
  { group: 'Clearance', statuses: ['SECURITY_CLEARANCE_PENDING', 'INSPECTION_SCHEDULED', 'INSPECTION_COMPLETE'] },
  { group: 'Decision', statuses: ['APPROVED', 'APPROVED_WITH_CONDITIONS', 'DENIED'] },
  { group: 'Post-Issue', statuses: ['SUSPENDED', 'REVOKED', 'EXPIRED', 'LAPSED', 'RENEWAL_IN_PROGRESS'] },
]

export function LicenseFilters() {
  const searchQuery = useLicenseStore((s) => s.searchQuery)
  const filterType = useLicenseStore((s) => s.filterType)
  const filterStatus = useLicenseStore((s) => s.filterStatus)
  const setSearchQuery = useLicenseStore((s) => s.setSearchQuery)
  const setFilterType = useLicenseStore((s) => s.setFilterType)
  const setFilterStatus = useLicenseStore((s) => s.setFilterStatus)

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[220px]">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search applicant, company, or license #..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>

      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className={cn(selectClasses, 'min-w-[180px]')}
      >
        <option value="">All Categories</option>
        {LICENSE_CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>

      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className={cn(selectClasses, 'min-w-[200px]')}
      >
        <option value="">All Statuses</option>
        {STATUS_GROUPS.map((g) => (
          <optgroup key={g.group} label={g.group}>
            {g.statuses.map((s) => (
              <option key={s} value={s}>
                {APPLICATION_STATUS_CONFIG[s].label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  )
}
