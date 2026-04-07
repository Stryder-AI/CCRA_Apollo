'use client'

import { PageHeader } from '@/components/layout/PageHeader'
import { StatCard } from '@/components/dashboard/StatCard'
import { GlassCard } from '@/design-system/glass-card'
import { AiInsightCard } from '@/components/ai/AiInsightCard'
import { BatchDetailDrawer } from '@/components/traceability/BatchDetailDrawer'
import { LabManagement } from '@/components/traceability/LabManagement'
import { useTraceabilityStore } from '@/store/useTraceabilityStore'
import { batches } from '@/data/mock-traceability'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { GitBranch, FlaskConical, PackageCheck, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { StageType } from '@/types/traceability'

const stageOrder: StageType[] = [
  'seed',
  'cultivation',
  'harvest',
  'processing',
  'lab-testing',
  'packaging',
  'distribution',
]

const stageLabels: Record<StageType, string> = {
  seed: 'Seed',
  cultivation: 'Cultivation',
  harvest: 'Harvest',
  processing: 'Processing',
  'lab-testing': 'Lab Testing',
  packaging: 'Packaging',
  distribution: 'Distribution',
}

function StagePipeline({ stages }: { stages: { type: StageType; status: 'completed' | 'in-progress' | 'pending' }[] }) {
  const stageMap = new Map(stages.map((s) => [s.type, s.status]))

  return (
    <div className="flex items-center gap-1">
      {stageOrder.map((stage) => {
        const status = stageMap.get(stage) ?? 'pending'
        return (
          <div
            key={stage}
            title={`${stageLabels[stage]}: ${status}`}
            className={cn(
              'h-2.5 w-2.5 rounded-full transition-all',
              status === 'completed' && 'bg-ccra-green',
              status === 'in-progress' && 'bg-ccra-green animate-pulse',
              status === 'pending' && 'bg-muted-foreground/30'
            )}
          />
        )
      })}
    </div>
  )
}

export default function TraceabilityPage() {
  const totalBatches = batches.length
  const inLabTesting = batches.filter((b) => b.currentStage === 'lab-testing').length
  const readyForExport = batches.filter(
    (b) => b.currentStage === 'distribution' || b.currentStage === 'packaging'
  ).length
  const avgProcessingDays = 85

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <PageHeader
        title="Seed-to-Export Traceability"
        description="Chain-of-custody tracking for all cannabis batches"
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Total Batches"
          value={totalBatches}
          trend={0}
          icon={GitBranch}
          accentColor="bg-ccra-green"
        />
        <StatCard
          label="In Lab Testing"
          value={inLabTesting}
          trend={0}
          icon={FlaskConical}
          accentColor="bg-ccra-teal"
        />
        <StatCard
          label="Ready for Export"
          value={readyForExport}
          trend={0}
          icon={PackageCheck}
          accentColor="bg-ccra-gold"
        />
        <StatCard
          label="Avg Processing Days"
          value={avgProcessingDays}
          trend={0}
          icon={Clock}
          accentColor="bg-blue-500"
        />
      </div>

      <Tabs defaultValue="pipeline">
        <TabsList>
          <TabsTrigger value="pipeline">Batch Pipeline</TabsTrigger>
          <TabsTrigger value="lab">Lab Management</TabsTrigger>
        </TabsList>

        <TabsContent value="lab">
          <LabManagement />
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-6 mt-4">

      {/* Batch Table */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">Batch Tracking</h3>
          <span className="text-xs text-muted-foreground">{totalBatches} active batches</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 font-medium text-muted-foreground">Batch Code</th>
                <th className="pb-3 font-medium text-muted-foreground">Farm</th>
                <th className="pb-3 font-medium text-muted-foreground">Strain</th>
                <th className="pb-3 font-medium text-muted-foreground">Current Stage</th>
                <th className="pb-3 font-medium text-muted-foreground text-right">Quantity</th>
                <th className="pb-3 font-medium text-muted-foreground text-center">Pipeline</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => (
                <tr
                  key={batch.id}
                  onClick={() => useTraceabilityStore.getState().setSelectedBatch(batch.id)}
                  className="border-b border-border/50 hover:bg-accent/30 cursor-pointer transition-colors"
                >
                  <td className="py-3 font-mono text-xs">{batch.batchCode}</td>
                  <td className="py-3">{batch.farmName}</td>
                  <td className="py-3">{batch.strain}</td>
                  <td className="py-3">
                    <span className={cn(
                      'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                      batch.currentStage === 'distribution' && 'bg-ccra-green/10 text-ccra-green',
                      batch.currentStage === 'packaging' && 'bg-ccra-gold/10 text-ccra-gold',
                      batch.currentStage === 'lab-testing' && 'bg-ccra-teal/10 text-ccra-teal',
                      batch.currentStage === 'processing' && 'bg-blue-500/10 text-blue-500',
                      batch.currentStage === 'harvest' && 'bg-amber-500/10 text-amber-500',
                      batch.currentStage === 'cultivation' && 'bg-lime-500/10 text-lime-500',
                      batch.currentStage === 'seed' && 'bg-purple-500/10 text-purple-500',
                    )}>
                      {stageLabels[batch.currentStage]}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    {batch.quantity.toLocaleString()} {batch.unit}
                  </td>
                  <td className="py-3 flex justify-center">
                    <StagePipeline stages={batch.stages} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* AI Insight */}
      <AiInsightCard
        title="Traceability Quality Analysis"
        insight="All 8 active batches maintain full chain-of-custody integrity. Batch CCRA-BTH-2025-003 (Chitral Purple) is undergoing extended pharmaceutical-grade lab testing — estimated 5 additional days. Recommend prioritizing Batch CCRA-BTH-2025-002 packaging completion for Q1 export targets. Overall traceability compliance is at 100% with zero gaps detected across all pipeline stages."
        severity="info"
        confidence={96}
      />

      {/* Batch Detail Drawer */}
      <BatchDetailDrawer />

        </TabsContent>
      </Tabs>
    </div>
  )
}
