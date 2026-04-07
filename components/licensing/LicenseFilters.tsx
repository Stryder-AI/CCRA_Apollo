'use client'

import { Input } from '@/components/ui/input'
import { useLicenseStore } from '@/store/useLicenseStore'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

const LICENSE_TYPES = ['Cultivation', 'Extraction', 'Manufacturing', 'Sales & Distribution']
const LICENSE_STATUSES = ['active', 'pending', 'expired', 'suspended', 'revoked', 'under-review', 'approved', 'rejected']

const selectClasses =
  'h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'

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
        className={cn(selectClasses, 'min-w-[160px]')}
      >
        <option value="">All Types</option>
        {LICENSE_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className={cn(selectClasses, 'min-w-[150px]')}
      >
        <option value="">All Statuses</option>
        {LICENSE_STATUSES.map((s) => (
          <option key={s} value={s} className="capitalize">
            {s.replace('-', ' ')}
          </option>
        ))}
      </select>
    </div>
  )
}
