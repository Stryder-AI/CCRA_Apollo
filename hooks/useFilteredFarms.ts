import { useMemo } from 'react'
import { useFarmStore } from '@/store/useFarmStore'
import { Farm } from '@/types/farm'

export function useFilteredFarms(): Farm[] {
  const farms = useFarmStore((s) => s.farms)
  const filters = useFarmStore((s) => s.filters)

  return useMemo(() => {
    return farms.filter((farm) => {
      if (filters.search) {
        const q = filters.search.toLowerCase()
        const match =
          farm.name.toLowerCase().includes(q) ||
          farm.ownerName.toLowerCase().includes(q) ||
          farm.licenseNumber.toLowerCase().includes(q)
        if (!match) return false
      }
      if (filters.region && farm.region !== filters.region) return false
      if (filters.status && farm.status !== filters.status) return false
      if (filters.strain && farm.strain !== filters.strain) return false
      return true
    })
  }, [farms, filters])
}
