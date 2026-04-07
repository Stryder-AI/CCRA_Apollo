'use client'

import { useState } from 'react'
import { PageTransition } from '@/design-system/page-transition'
import { PageHeader } from '@/components/layout/PageHeader'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { InspectionTable } from '@/components/compliance/InspectionTable'
import { ViolationTable } from '@/components/compliance/ViolationTable'
import { ScheduleInspectionModal } from '@/components/compliance/ScheduleInspectionModal'
import { InspectionDetailModal } from '@/components/compliance/InspectionDetailModal'
import { ViolationDetailModal } from '@/components/compliance/ViolationDetailModal'
import { ComplianceRiskPredictor } from '@/components/compliance/ComplianceRiskPredictor'
import { PenaltyCalculator } from '@/components/compliance/PenaltyCalculator'
import { PermissionGate } from '@/components/auth/PermissionGate'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function CompliancePage() {
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)

  return (
    <PageTransition>
      <PageHeader
        title="Compliance & Inspection"
        description="Manage inspections, track violations, and monitor regulatory compliance"
      >
        <PermissionGate permission="canScheduleInspections">
          <Button onClick={() => setScheduleModalOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-1.5" />
            Schedule Inspection
          </Button>
        </PermissionGate>
      </PageHeader>

      <ComplianceRiskPredictor />

      <Tabs defaultValue="inspections">
        <TabsList>
          <TabsTrigger value="inspections">Inspections</TabsTrigger>
          <TabsTrigger value="violations">Violations</TabsTrigger>
          <TabsTrigger value="penalties">Penalty Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="inspections">
          <InspectionTable />
        </TabsContent>

        <TabsContent value="violations">
          <ViolationTable />
        </TabsContent>

        <TabsContent value="penalties">
          <PenaltyCalculator />
        </TabsContent>
      </Tabs>

      <ScheduleInspectionModal
        open={scheduleModalOpen}
        onOpenChange={setScheduleModalOpen}
      />
      <InspectionDetailModal />
      <ViolationDetailModal />
    </PageTransition>
  )
}
