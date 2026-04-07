'use client'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useFarmStore } from '@/store/useFarmStore'
import { REGIONS, STRAINS } from '@/config/constants'
import { Search, RotateCcw } from 'lucide-react'

const STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'revoked', label: 'Revoked' },
] as const

export function FarmFilters() {
  const filters = useFarmStore((s) => s.filters)
  const setFilters = useFarmStore((s) => s.setFilters)
  const resetFilters = useFarmStore((s) => s.resetFilters)

  const hasFilters =
    filters.search || filters.region || filters.status || filters.strain

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-xs">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search farms..."
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          className="pl-8"
        />
      </div>

      {/* Region */}
      <Select
        value={filters.region}
        onValueChange={(val) => setFilters({ region: val ?? '' })}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="All Regions" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Regions</SelectItem>
          {REGIONS.map((r) => (
            <SelectItem key={r} value={r}>
              {r}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status */}
      <Select
        value={filters.status}
        onValueChange={(val) => setFilters({ status: val ?? '' })}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Statuses</SelectItem>
          {STATUSES.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Strain */}
      <Select
        value={filters.strain}
        onValueChange={(val) => setFilters({ strain: val ?? '' })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Strains" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Strains</SelectItem>
          {STRAINS.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Reset */}
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </Button>
      )}
    </div>
  )
}
