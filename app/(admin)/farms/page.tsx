'use client'

import { useState } from 'react'
import { PageTransition } from '@/design-system/page-transition'
import { PageHeader } from '@/design-system/page-header'
import { FarmMap } from '@/components/farms/FarmMap'
import { FarmListView } from '@/components/farms/FarmListView'
import { FarmFilters } from '@/components/farms/FarmFilters'
import { FarmDrawer } from '@/components/farms/FarmDrawer'
import { AddFarmModal } from '@/components/farms/AddFarmModal'
import { Button } from '@/components/ui/button'
import { PermissionGate } from '@/components/auth/PermissionGate'
import { useFarmStore } from '@/store/useFarmStore'
import { Map, List, Plus, Sprout } from 'lucide-react'

export default function FarmsPage() {
  const viewMode = useFarmStore((s) => s.viewMode)
  const setViewMode = useFarmStore((s) => s.setViewMode)
  const [addModalOpen, setAddModalOpen] = useState(false)

  return (
    <PageTransition>
      <PageHeader
        title="Farm Registry"
        subtitle="Monitor and manage all registered cannabis cultivation sites"
        icon={Sprout}
      >
        {/* View toggle */}
        <div className="flex items-center rounded-lg border border-border bg-muted/40 p-0.5">
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              viewMode === 'map'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Map className="h-3.5 w-3.5" />
            Map
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <List className="h-3.5 w-3.5" />
            List
          </button>
        </div>

        <PermissionGate permission="canAddFarms">
          <Button size="sm" onClick={() => setAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Farm
          </Button>
        </PermissionGate>
      </PageHeader>

      {/* Filters */}
      <div className="mb-4">
        <FarmFilters />
      </div>

      {/* Main content */}
      {viewMode === 'map' ? <FarmMap /> : <FarmListView />}

      {/* Drawer (always rendered, opens when a farm is selected) */}
      <FarmDrawer />

      {/* Add Farm modal */}
      <AddFarmModal open={addModalOpen} onOpenChange={setAddModalOpen} />
    </PageTransition>
  )
}
