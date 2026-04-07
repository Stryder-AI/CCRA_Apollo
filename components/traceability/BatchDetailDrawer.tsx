'use client'

import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { GlassCard } from '@/design-system/glass-card'
import { AiInsightCard } from '@/components/ai/AiInsightCard'
import { StryderBadge } from '@/components/ai/StryderBadge'
import { useTraceabilityStore } from '@/store/useTraceabilityStore'
import { cn } from '@/lib/utils'
import { ExportCertificate } from './ExportCertificate'
import type { StageType, BatchStage } from '@/types/traceability'
import {
  Sprout,
  Leaf,
  Scissors,
  Factory,
  FlaskConical,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  FileText,
  CalendarDays,
} from 'lucide-react'

const stageOrder: StageType[] = [
  'seed',
  'cultivation',
  'harvest',
  'processing',
  'lab-testing',
  'packaging',
  'distribution',
]

const stageConfig: Record<StageType, { label: string; icon: typeof Sprout }> = {
  seed: { label: 'Seed', icon: Sprout },
  cultivation: { label: 'Cultivation', icon: Leaf },
  harvest: { label: 'Harvest', icon: Scissors },
  processing: { label: 'Processing', icon: Factory },
  'lab-testing': { label: 'Lab Testing', icon: FlaskConical },
  packaging: { label: 'Packaging', icon: Package },
  distribution: { label: 'Distribution', icon: Truck },
}

function PipelineTab({ stages }: { stages: BatchStage[] }) {
  const stageMap = new Map(stages.map((s) => [s.type, s]))

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-muted-foreground">Pipeline Progress</h4>
      <div className="relative flex items-start justify-between gap-0">
        {/* Connector line */}
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-border z-0" />
        {stageOrder.map((stageType, idx) => {
          const stage = stageMap.get(stageType)
          const status = stage?.status ?? 'pending'
          const config = stageConfig[stageType]
          const Icon = config.icon

          return (
            <div key={stageType} className="relative z-10 flex flex-col items-center w-[calc(100%/7)]">
              <div
                className={cn(
                  'flex items-center justify-center h-10 w-10 rounded-full border-2 transition-all',
                  status === 'completed' && 'bg-ccra-green/20 border-ccra-green text-ccra-green',
                  status === 'in-progress' && 'bg-amber-500/20 border-amber-500 text-amber-500 animate-pulse',
                  status === 'pending' && 'bg-muted border-muted-foreground/30 text-muted-foreground/50'
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className={cn(
                'mt-2 text-[10px] font-medium text-center leading-tight',
                status === 'completed' && 'text-ccra-green',
                status === 'in-progress' && 'text-amber-500',
                status === 'pending' && 'text-muted-foreground/50'
              )}>
                {config.label}
              </span>
              {stage?.startDate && (
                <span className="mt-0.5 text-[9px] text-muted-foreground">
                  {stage.startDate}
                </span>
              )}
              {stage?.endDate && (
                <span className="text-[9px] text-muted-foreground">
                  {stage.endDate}
                </span>
              )}
              {stage?.handler && (
                <span className="mt-1 text-[9px] text-muted-foreground/70 text-center max-w-[80px] truncate" title={stage.handler}>
                  {stage.handler}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function LabResultsTab({ labResults }: { labResults: NonNullable<import('@/types/traceability').Batch['labResults']> }) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-muted-foreground">Laboratory Analysis</h4>

      {/* Cannabinoid & Moisture Grid */}
      <div className="grid grid-cols-3 gap-3">
        <GlassCard padding="sm">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">THC</div>
          <div className={cn(
            'text-2xl font-bold font-mono',
            labResults.thcPercent > 20 ? 'text-red-500' : 'text-ccra-green'
          )}>
            {labResults.thcPercent}%
          </div>
        </GlassCard>
        <GlassCard padding="sm">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">CBD</div>
          <div className="text-2xl font-bold font-mono text-ccra-teal">
            {labResults.cbdPercent}%
          </div>
        </GlassCard>
        <GlassCard padding="sm">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Moisture</div>
          <div className={cn(
            'text-2xl font-bold font-mono',
            labResults.moisture > 13 ? 'text-amber-500' : 'text-foreground'
          )}>
            {labResults.moisture}%
          </div>
        </GlassCard>
      </div>

      {/* Contaminant Tests */}
      <div className="space-y-2">
        <h5 className="text-xs font-medium text-muted-foreground">Safety Tests</h5>
        <div className="grid grid-cols-3 gap-3">
          {([
            ['Contaminants', labResults.contaminants],
            ['Pesticides', labResults.pesticides],
            ['Heavy Metals', labResults.heavyMetals],
          ] as const).map(([label, result]) => (
            <GlassCard key={label} padding="sm">
              <div className="flex items-center gap-2">
                {result === 'pass' ? (
                  <CheckCircle2 className="h-4 w-4 text-ccra-green" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <div>
                  <div className="text-xs font-medium">{label}</div>
                  <div className={cn(
                    'text-[10px] font-semibold uppercase',
                    result === 'pass' ? 'text-ccra-green' : 'text-red-500'
                  )}>
                    {result}
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Lab Info */}
      <GlassCard padding="sm">
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div>
            <div className="text-muted-foreground mb-0.5">Lab Name</div>
            <div className="font-medium">{labResults.labName}</div>
          </div>
          <div>
            <div className="text-muted-foreground mb-0.5">Certificate ID</div>
            <div className="font-mono font-medium">{labResults.certificateId ?? 'N/A'}</div>
          </div>
          <div>
            <div className="text-muted-foreground mb-0.5">Test Date</div>
            <div className="font-medium">{labResults.testedDate}</div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

function ChainOfCustodyTab({ stages }: { stages: BatchStage[] }) {
  const handledStages = stages.filter((s) => s.handler)

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-muted-foreground">Chain of Custody</h4>
      <div className="relative pl-6">
        {/* Vertical connector line */}
        <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-ccra-green/30" />

        <div className="space-y-4">
          {handledStages.map((stage) => {
            const config = stageConfig[stage.type]
            return (
              <div key={stage.type} className="relative flex items-start gap-3">
                {/* Timeline node */}
                <div className={cn(
                  'absolute -left-6 top-1 h-[18px] w-[18px] rounded-full border-2 flex items-center justify-center',
                  stage.status === 'completed' && 'bg-ccra-green/20 border-ccra-green',
                  stage.status === 'in-progress' && 'bg-amber-500/20 border-amber-500 animate-pulse',
                  stage.status === 'pending' && 'bg-muted border-muted-foreground/30'
                )}>
                  <div className={cn(
                    'h-2 w-2 rounded-full',
                    stage.status === 'completed' && 'bg-ccra-green',
                    stage.status === 'in-progress' && 'bg-amber-500',
                    stage.status === 'pending' && 'bg-muted-foreground/30'
                  )} />
                </div>

                <GlassCard padding="sm" className="flex-1 ml-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold">{config.label}</span>
                    <span className={cn(
                      'text-[10px] font-medium px-1.5 py-0.5 rounded-full',
                      stage.status === 'completed' && 'bg-ccra-green/10 text-ccra-green',
                      stage.status === 'in-progress' && 'bg-amber-500/10 text-amber-500',
                    )}>
                      {stage.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1">
                    <User className="h-3 w-3" />
                    <span>{stage.handler}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1">
                    <CalendarDays className="h-3 w-3" />
                    <span>
                      {stage.startDate ?? '—'}
                      {stage.endDate ? ` to ${stage.endDate}` : stage.startDate ? ' (ongoing)' : ''}
                    </span>
                  </div>
                  {stage.notes && (
                    <div className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                      <FileText className="h-3 w-3 mt-0.5 shrink-0" />
                      <span>{stage.notes}</span>
                    </div>
                  )}
                </GlassCard>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function AiAnalysisTab({ batchCode, strain }: { batchCode: string; strain: string }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <h4 className="text-sm font-medium text-muted-foreground">AI Analysis</h4>
        <StryderBadge size="sm" />
      </div>
      <AiInsightCard
        title="Quality Prediction"
        insight={`Batch ${batchCode} (${strain}) shows consistent quality metrics across all pipeline stages. Predicted final grade: Premium A. Cannabinoid profile aligns with expected phenotype expression for this cultivar.`}
        severity="info"
        confidence={94}
        animate={false}
      />
      <AiInsightCard
        title="Optimal Distribution Window"
        insight={`Based on current curing conditions and moisture levels, the optimal distribution window for ${batchCode} is within the next 45 days. Extended storage beyond this period may reduce terpene content by an estimated 8-12%.`}
        severity="warning"
        confidence={87}
        animate={false}
      />
      <AiInsightCard
        title="Export Readiness Score"
        insight={`${batchCode} meets 96% of international export compliance requirements. All chain-of-custody documentation is complete. Recommend final packaging verification before issuing export certificate.`}
        severity="info"
        confidence={96}
        animate={false}
      />
    </div>
  )
}

export function BatchDetailDrawer() {
  const { batches, selectedBatchId, setSelectedBatch } = useTraceabilityStore()
  const batch = batches.find((b) => b.id === selectedBatchId) ?? null
  const isOpen = selectedBatchId !== null && batch !== null

  const showExportCert =
    batch?.currentStage === 'distribution' && batch?.labResults !== undefined

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) setSelectedBatch(null)
      }}
    >
      <SheetContent
        side="right"
        className="sm:max-w-2xl w-full overflow-y-auto"
      >
        {batch && (
          <>
            <SheetHeader>
              <SheetTitle className="font-mono text-lg tracking-tight">
                {batch.batchCode}
              </SheetTitle>
              <SheetDescription className="flex items-center gap-2 flex-wrap">
                <span>{batch.farmName}</span>
                <span className="inline-flex items-center rounded-full bg-ccra-teal/10 text-ccra-teal px-2 py-0.5 text-[10px] font-medium">
                  {batch.strain}
                </span>
                <span className="text-xs text-muted-foreground">
                  {batch.quantity.toLocaleString()} {batch.unit}
                </span>
              </SheetDescription>
            </SheetHeader>

            <div className="px-4 pb-4 flex-1">
              <Tabs defaultValue="pipeline">
                <TabsList className="w-full">
                  <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
                  <TabsTrigger value="lab-results">Lab Results</TabsTrigger>
                  <TabsTrigger value="custody">Chain of Custody</TabsTrigger>
                  <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
                  {showExportCert && (
                    <TabsTrigger value="export-cert">Export Cert</TabsTrigger>
                  )}
                </TabsList>

                <TabsContent value="pipeline" className="mt-4">
                  <PipelineTab stages={batch.stages} />
                </TabsContent>

                <TabsContent value="lab-results" className="mt-4">
                  {batch.labResults ? (
                    <LabResultsTab labResults={batch.labResults} />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <FlaskConical className="h-8 w-8 mb-2 opacity-40" />
                      <p className="text-sm">Lab testing not yet completed for this batch.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="custody" className="mt-4">
                  <ChainOfCustodyTab stages={batch.stages} />
                </TabsContent>

                <TabsContent value="ai-analysis" className="mt-4">
                  <AiAnalysisTab batchCode={batch.batchCode} strain={batch.strain} />
                </TabsContent>

                {showExportCert && (
                  <TabsContent value="export-cert" className="mt-4">
                    <ExportCertificate batch={batch} />
                  </TabsContent>
                )}
              </Tabs>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
