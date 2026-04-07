import { useMemo } from 'react'
import { useLicenseStore } from '@/store/useLicenseStore'
import { License } from '@/types/license'

export function useFilteredLicenses(): License[] {
  const licenses = useLicenseStore((s) => s.licenses)
  const searchQuery = useLicenseStore((s) => s.searchQuery)
  const filterType = useLicenseStore((s) => s.filterType)
  const filterStatus = useLicenseStore((s) => s.filterStatus)

  return useMemo(() => {
    return licenses.filter((license) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const match =
          license.applicantName.toLowerCase().includes(q) ||
          license.companyName.toLowerCase().includes(q) ||
          license.licenseNumber.toLowerCase().includes(q)
        if (!match) return false
      }
      if (filterType && license.type !== filterType) return false
      if (filterStatus && license.status !== filterStatus) return false
      return true
    })
  }, [licenses, searchQuery, filterType, filterStatus])
}
