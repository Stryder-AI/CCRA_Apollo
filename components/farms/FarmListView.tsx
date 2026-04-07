'use client'

import { useFarmStore } from '@/store/useFarmStore'
import { useFilteredFarms } from '@/hooks/useFilteredFarms'
import { Badge } from '@/components/ui/badge'
import { GlassCard } from '@/design-system/glass-card'
import { formatDateShort, formatNumber } from '@/utils/format'
import { FarmStatus } from '@/types/farm'

const statusVariant: Record<FarmStatus, { className: string; label: string }> = {
  active: {
    className: 'bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30',
    label: 'Active',
  },
  pending: {
    className: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/30',
    label: 'Pending',
  },
  suspended: {
    className: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30',
    label: 'Suspended',
  },
  revoked: {
    className: 'bg-gray-500/15 text-gray-700 dark:text-gray-400 border-gray-500/30',
    label: 'Revoked',
  },
}

export function FarmListView() {
  const farms = useFilteredFarms()
  const setSelectedFarm = useFarmStore((s) => s.setSelectedFarm)
  const selectedFarmId = useFarmStore((s) => s.selectedFarmId)

  return (
    <GlassCard padding="none" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Name
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Owner
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Region
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Strain
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                Size (ha)
              </th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                Compliance
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Last Inspection
              </th>
            </tr>
          </thead>
          <tbody>
            {farms.map((farm) => {
              const sv = statusVariant[farm.status]
              return (
                <tr
                  key={farm.id}
                  onClick={() => setSelectedFarm(farm.id)}
                  className={`border-b border-border/50 cursor-pointer transition-colors hover:bg-muted/30 ${
                    selectedFarmId === farm.id ? 'bg-muted/50' : ''
                  }`}
                >
                  <td className="px-4 py-3 font-medium">{farm.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {farm.ownerName}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {farm.region}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {farm.strain}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatNumber(farm.sizeHectares)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant="outline" className={sv.className}>
                      {sv.label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {farm.complianceScore != null
                      ? `${farm.complianceScore}%`
                      : '--'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {farm.lastInspection
                      ? formatDateShort(farm.lastInspection)
                      : '--'}
                  </td>
                </tr>
              )
            })}
            {farms.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  No farms match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </GlassCard>
  )
}
