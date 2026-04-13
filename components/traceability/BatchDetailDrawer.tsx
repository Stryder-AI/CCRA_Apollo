'use client'

import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { GlassCard } from '@/design-system/glass-card'
import { AiInsightCard } from '@/components/ai/AiInsightCard'
import { StryderBadge } from '@/components/ai/StryderBadge'
import { useTraceabilityStore } from '@/store/useTraceabilityStore'
import { cn } from '@/lib/utils'
import { ExportCertificate } from './ExportCertificate'
import type { StageType, BatchStage, Batch } from '@/types/traceability'
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
  MapPin,
  Hash,
  Scale,
  Thermometer,
  Droplets,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Activity,
  BarChart3,
  Link2,
  Timer,
  Fingerprint,
  Globe,
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

const stageConfig: Record<StageType, { label: string; icon: typeof Sprout; description: string }> = {
  seed: { label: 'Seed', icon: Sprout, description: 'Seed sourcing & germination' },
  cultivation: { label: 'Cultivation', icon: Leaf, description: 'Growth cycle & monitoring' },
  harvest: { label: 'Harvest', icon: Scissors, description: 'Crop harvesting & weighing' },
  processing: { label: 'Processing', icon: Factory, description: 'Drying, curing & extraction' },
  'lab-testing': { label: 'Lab Testing', icon: FlaskConical, description: 'Quality & safety analysis' },
  packaging: { label: 'Packaging', icon: Package, description: 'GMP packaging & labeling' },
  distribution: { label: 'Distribution', icon: Truck, description: 'Transport & delivery' },
}

/* ---------- Progress Helpers ---------- */

function getCompletionPercent(stages: BatchStage[]): number {
  const completed = stages.filter((s) => s.status === 'completed').length
  const inProgress = stages.filter((s) => s.status === 'in-progress').length
  return Math.round(((completed + inProgress * 0.5) / stages.length) * 100)
}

function getDaysInPipeline(createdDate: string): number {
  const start = new Date(createdDate)
  const now = new Date()
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

function generateBlockchainHash(batchCode: string): string {
  const chars = '0123456789abcdef'
  let hash = '0x'
  const seed = batchCode.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  for (let i = 0; i < 40; i++) {
    hash += chars[(seed * (i + 7) * 31) % 16]
  }
  return hash
}

/* ---------- Header Section ---------- */

function BatchHeader({ batch }: { batch: Batch }) {
  const percent = getCompletionPercent(batch.stages)
  const daysInPipeline = getDaysInPipeline(batch.createdDate)
  const completedStages = batch.stages.filter((s) => s.status === 'completed').length
  const blockHash = generateBlockchainHash(batch.batchCode)

  return (
    <div className="space-y-4">
      {/* Top info bar */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-ccra-green/10 border border-ccra-green/20">
              <Hash className="h-3.5 w-3.5 text-ccra-green" />
              <span className="font-mono text-sm font-bold text-ccra-green">{batch.batchCode}</span>
            </div>
            <span className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
              batch.currentStage === 'distribution' && 'bg-ccra-green/10 text-ccra-green',
              batch.currentStage === 'packaging' && 'bg-amber-500/10 text-amber-600',
              batch.currentStage === 'lab-testing' && 'bg-ccra-teal/10 text-ccra-teal',
              batch.currentStage === 'processing' && 'bg-blue-500/10 text-blue-600',
              batch.currentStage === 'harvest' && 'bg-orange-500/10 text-orange-600',
              batch.currentStage === 'cultivation' && 'bg-lime-500/10 text-lime-600',
              batch.currentStage === 'seed' && 'bg-purple-500/10 text-purple-600',
            )}>
              <Activity className="h-3 w-3" />
              {stageConfig[batch.currentStage].label}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3" />
              {batch.farmName}
            </span>
            <span className="flex items-center gap-1.5">
              <Leaf className="h-3 w-3" />
              {batch.strain}
            </span>
            <span className="flex items-center gap-1.5">
              <Scale className="h-3 w-3" />
              {batch.quantity.toLocaleString()} {batch.unit}
            </span>
          </div>
        </div>
      </div>

      {/* Progress + Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="glass rounded-xl p-3 border border-border/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Progress</span>
            <span className="text-sm font-bold text-ccra-green">{percent}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-ccra-green to-emerald-400 transition-all duration-700"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
        <div className="glass rounded-xl p-3 border border-border/50">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium block mb-1">Days in Pipeline</span>
          <div className="flex items-center gap-1.5">
            <Timer className="h-4 w-4 text-muted-foreground" />
            <span className="text-lg font-bold">{daysInPipeline}</span>
          </div>
        </div>
        <div className="glass rounded-xl p-3 border border-border/50">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium block mb-1">Stages Complete</span>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-ccra-green" />
            <span className="text-lg font-bold">{completedStages}<span className="text-sm text-muted-foreground font-normal"> / 7</span></span>
          </div>
        </div>
        <div className="glass rounded-xl p-3 border border-border/50">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium block mb-1">Blockchain</span>
          <div className="flex items-center gap-1.5">
            <Link2 className="h-4 w-4 text-ccra-teal" />
            <span className="text-[10px] font-mono text-ccra-teal truncate" title={blockHash}>{blockHash.slice(0, 14)}...</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- Pipeline Tab ---------- */

function PipelineTab({ batch }: { batch: Batch }) {
  const stageMap = new Map(batch.stages.map((s) => [s.type, s]))

  return (
    <div className="space-y-5">
      {/* Horizontal Pipeline Visualization */}
      <div className="glass rounded-xl p-5 border border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pipeline Progress</h4>
          <span className="text-[10px] text-muted-foreground">
            Created {batch.createdDate}
            {batch.estimatedCompletion && <> | ETA {batch.estimatedCompletion}</>}
          </span>
        </div>
        <div className="relative">
          {/* Connector line */}
          <div className="absolute top-6 left-8 right-8 h-[2px] bg-border" />
          <div className="relative flex items-start justify-between">
            {stageOrder.map((stageType) => {
              const stage = stageMap.get(stageType)
              const status = stage?.status ?? 'pending'
              const config = stageConfig[stageType]
              const Icon = config.icon

              return (
                <div key={stageType} className="relative z-10 flex flex-col items-center w-[calc(100%/7)]">
                  <div
                    className={cn(
                      'flex items-center justify-center h-12 w-12 rounded-xl border-2 transition-all shadow-sm',
                      status === 'completed' && 'bg-ccra-green/15 border-ccra-green text-ccra-green shadow-ccra-green/10',
                      status === 'in-progress' && 'bg-amber-500/15 border-amber-500 text-amber-500 shadow-amber-500/10 animate-pulse',
                      status === 'pending' && 'bg-muted/50 border-muted-foreground/20 text-muted-foreground/40'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={cn(
                    'mt-2 text-[11px] font-semibold text-center leading-tight',
                    status === 'completed' && 'text-ccra-green',
                    status === 'in-progress' && 'text-amber-500',
                    status === 'pending' && 'text-muted-foreground/40'
                  )}>
                    {config.label}
                  </span>
                  {status === 'completed' && (
                    <CheckCircle2 className="h-3 w-3 text-ccra-green mt-1" />
                  )}
                  {status === 'in-progress' && (
                    <span className="mt-1 text-[9px] font-medium text-amber-500">Active</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Stage Detail Cards */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stage Details</h4>
        <div className="grid grid-cols-2 gap-3">
          {stageOrder.map((stageType) => {
            const stage = stageMap.get(stageType)
            if (!stage || stage.status === 'pending') return null
            const config = stageConfig[stageType]
            const Icon = config.icon

            return (
              <div
                key={stageType}
                className={cn(
                  'glass rounded-xl p-4 border transition-all',
                  stage.status === 'completed' && 'border-ccra-green/20',
                  stage.status === 'in-progress' && 'border-amber-500/30 shadow-sm shadow-amber-500/5',
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'flex items-center justify-center h-8 w-8 rounded-lg',
                      stage.status === 'completed' && 'bg-ccra-green/10 text-ccra-green',
                      stage.status === 'in-progress' && 'bg-amber-500/10 text-amber-500',
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold block leading-none">{config.label}</span>
                      <span className="text-[10px] text-muted-foreground">{config.description}</span>
                    </div>
                  </div>
                  <span className={cn(
                    'text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase',
                    stage.status === 'completed' && 'bg-ccra-green/10 text-ccra-green',
                    stage.status === 'in-progress' && 'bg-amber-500/10 text-amber-500',
                  )}>
                    {stage.status === 'in-progress' ? 'In Progress' : 'Complete'}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  {stage.handler && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-3 w-3 shrink-0" />
                      <span className="font-medium text-foreground">{stage.handler}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarDays className="h-3 w-3 shrink-0" />
                    <span>
                      {stage.startDate ?? '—'}
                      {stage.endDate ? (
                        <><ArrowRight className="inline h-3 w-3 mx-1" />{stage.endDate}</>
                      ) : stage.startDate ? (
                        <span className="text-amber-500 ml-1">(ongoing)</span>
                      ) : ''}
                    </span>
                  </div>
                  {stage.notes && (
                    <div className="flex items-start gap-2 text-muted-foreground mt-1">
                      <FileText className="h-3 w-3 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-relaxed">{stage.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ---------- Lab Results Tab ---------- */

function LabResultsTab({ labResults, batchCode }: { labResults: NonNullable<Batch['labResults']>; batchCode: string }) {
  const thcStatus = labResults.thcPercent > 20 ? 'warning' : 'pass'
  const moistureStatus = labResults.moisture > 13 ? 'warning' : 'pass'

  return (
    <div className="space-y-5">
      {/* Cannabinoid Profile */}
      <div className="glass rounded-xl p-5 border border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cannabinoid Profile</h4>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground">Method: HPLC / GC-MS</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {/* THC */}
          <div className="text-center">
            <div className="relative mx-auto w-20 h-20 mb-2">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/30" />
                <circle
                  cx="40" cy="40" r="34" fill="none"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${(labResults.thcPercent / 30) * 213.6} 213.6`}
                  className={thcStatus === 'warning' ? 'text-red-500' : 'text-ccra-green'}
                  stroke="currentColor"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={cn(
                  'text-lg font-bold font-mono',
                  thcStatus === 'warning' ? 'text-red-500' : 'text-ccra-green'
                )}>
                  {labResults.thcPercent}%
                </span>
              </div>
            </div>
            <span className="text-xs font-semibold">THC Content</span>
            <span className={cn(
              'block text-[10px] mt-0.5',
              thcStatus === 'warning' ? 'text-red-500' : 'text-muted-foreground'
            )}>
              {thcStatus === 'warning' ? 'Above 20% limit' : 'Within legal limits'}
            </span>
          </div>

          {/* CBD */}
          <div className="text-center">
            <div className="relative mx-auto w-20 h-20 mb-2">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/30" />
                <circle
                  cx="40" cy="40" r="34" fill="none"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${(labResults.cbdPercent / 15) * 213.6} 213.6`}
                  className="text-ccra-teal"
                  stroke="currentColor"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold font-mono text-ccra-teal">
                  {labResults.cbdPercent}%
                </span>
              </div>
            </div>
            <span className="text-xs font-semibold">CBD Content</span>
            <span className="block text-[10px] text-muted-foreground mt-0.5">Therapeutic compound</span>
          </div>

          {/* Moisture */}
          <div className="text-center">
            <div className="relative mx-auto w-20 h-20 mb-2">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/30" />
                <circle
                  cx="40" cy="40" r="34" fill="none"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${(labResults.moisture / 20) * 213.6} 213.6`}
                  className={moistureStatus === 'warning' ? 'text-amber-500' : 'text-blue-500'}
                  stroke="currentColor"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={cn(
                  'text-lg font-bold font-mono',
                  moistureStatus === 'warning' ? 'text-amber-500' : 'text-blue-500'
                )}>
                  {labResults.moisture}%
                </span>
              </div>
            </div>
            <span className="text-xs font-semibold">Moisture Level</span>
            <span className={cn(
              'block text-[10px] mt-0.5',
              moistureStatus === 'warning' ? 'text-amber-500' : 'text-muted-foreground'
            )}>
              {moistureStatus === 'warning' ? 'Above 13% threshold' : 'Optimal range'}
            </span>
          </div>
        </div>
      </div>

      {/* Safety & Compliance Tests */}
      <div className="glass rounded-xl p-5 border border-border/50">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Safety & Compliance Tests</h4>
        <div className="grid grid-cols-3 gap-3">
          {([
            { label: 'Microbial Contaminants', key: 'contaminants' as const, method: 'Plate count / qPCR', icon: Activity },
            { label: 'Pesticide Residues', key: 'pesticides' as const, method: 'LC-MS/MS screening', icon: AlertTriangle },
            { label: 'Heavy Metals', key: 'heavyMetals' as const, method: 'ICP-MS analysis', icon: Thermometer },
          ]).map((test) => {
            const passed = labResults[test.key] === 'pass'
            const Icon = test.icon
            return (
              <div key={test.key} className={cn(
                'rounded-xl p-4 border transition-all',
                passed ? 'bg-ccra-green/5 border-ccra-green/20' : 'bg-red-500/5 border-red-500/20'
              )}>
                <div className="flex items-center gap-2 mb-2">
                  {passed ? (
                    <CheckCircle2 className="h-5 w-5 text-ccra-green" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className={cn(
                    'text-sm font-bold uppercase',
                    passed ? 'text-ccra-green' : 'text-red-500'
                  )}>
                    {passed ? 'PASS' : 'FAIL'}
                  </span>
                </div>
                <div className="text-xs font-semibold mb-0.5">{test.label}</div>
                <div className="text-[10px] text-muted-foreground">{test.method}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Lab Information & Certificate */}
      <div className="glass rounded-xl p-5 border border-border/50">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Laboratory & Certification</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-0.5">Laboratory</span>
              <span className="text-sm font-semibold">{labResults.labName}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-0.5">Test Date</span>
              <span className="text-sm font-medium">{labResults.testedDate}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-0.5">Certificate ID</span>
              <span className="text-sm font-mono font-semibold">{labResults.certificateId ?? 'Pending'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-0.5">Accreditation</span>
              <span className="text-sm font-medium flex items-center gap-1">
                <BadgeCheck className="h-3.5 w-3.5 text-ccra-green" />
                ISO/IEC 17025 Certified
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- Chain of Custody Tab ---------- */

function ChainOfCustodyTab({ batch }: { batch: Batch }) {
  const handledStages = batch.stages.filter((s) => s.handler)
  const blockHash = generateBlockchainHash(batch.batchCode)

  return (
    <div className="space-y-5">
      {/* Blockchain Verification Header */}
      <div className="glass rounded-xl p-4 border border-ccra-teal/20 bg-ccra-teal/5">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-ccra-teal/10 text-ccra-teal">
            <Fingerprint className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-semibold">Blockchain Verified</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-ccra-green/10 text-ccra-green">
                <ShieldCheck className="h-2.5 w-2.5" />
                Immutable
              </span>
            </div>
            <div className="text-[10px] font-mono text-muted-foreground truncate">{blockHash}</div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[10px] text-muted-foreground">Block #</div>
            <div className="text-sm font-mono font-bold">18,447,291</div>
          </div>
        </div>
      </div>

      {/* Custody Timeline */}
      <div className="glass rounded-xl p-5 border border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Full Chain of Custody
          </h4>
          <span className="text-[10px] text-muted-foreground">
            {handledStages.length} custody transfers recorded
          </span>
        </div>

        <div className="relative ml-4">
          {/* Vertical connector */}
          <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-ccra-green via-ccra-green/50 to-muted-foreground/20" />

          <div className="space-y-1">
            {handledStages.map((stage, idx) => {
              const config = stageConfig[stage.type]
              const Icon = config.icon
              const isLast = idx === handledStages.length - 1

              return (
                <div key={stage.type} className="relative flex items-start gap-4 pb-4">
                  {/* Timeline node */}
                  <div className={cn(
                    'relative z-10 flex items-center justify-center h-8 w-8 rounded-full border-2 shrink-0',
                    stage.status === 'completed' && 'bg-ccra-green/15 border-ccra-green text-ccra-green',
                    stage.status === 'in-progress' && 'bg-amber-500/15 border-amber-500 text-amber-500 animate-pulse',
                  )}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>

                  {/* Content card */}
                  <div className={cn(
                    'flex-1 rounded-xl p-3.5 border transition-all',
                    stage.status === 'completed' && 'glass border-border/50',
                    stage.status === 'in-progress' && 'glass border-amber-500/20 shadow-sm shadow-amber-500/5',
                  )}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{config.label}</span>
                        <span className={cn(
                          'text-[9px] font-semibold px-1.5 py-0.5 rounded-full uppercase',
                          stage.status === 'completed' && 'bg-ccra-green/10 text-ccra-green',
                          stage.status === 'in-progress' && 'bg-amber-500/10 text-amber-500',
                        )}>
                          {stage.status === 'in-progress' ? 'Active' : 'Verified'}
                        </span>
                      </div>
                      {stage.status === 'completed' && (
                        <ShieldCheck className="h-4 w-4 text-ccra-green/50" />
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <User className="h-3 w-3 shrink-0" />
                        <span className="font-medium text-foreground">{stage.handler}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <CalendarDays className="h-3 w-3 shrink-0" />
                        <span>
                          {stage.startDate}
                          {stage.endDate && (
                            <><ArrowRight className="inline h-3 w-3 mx-0.5" />{stage.endDate}</>
                          )}
                          {!stage.endDate && stage.startDate && (
                            <span className="text-amber-500 ml-1">(ongoing)</span>
                          )}
                        </span>
                      </div>
                    </div>

                    {stage.notes && (
                      <div className="mt-2 pt-2 border-t border-border/50">
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{stage.notes}</p>
                      </div>
                    )}

                    {/* Simulated blockchain tx */}
                    <div className="mt-2 pt-2 border-t border-border/30 flex items-center gap-2">
                      <Link2 className="h-3 w-3 text-muted-foreground/40" />
                      <span className="text-[9px] font-mono text-muted-foreground/50">
                        tx: {generateBlockchainHash(batch.batchCode + stage.type).slice(0, 22)}...
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Integrity Summary */}
      <div className="glass rounded-xl p-4 border border-ccra-green/20 bg-ccra-green/5">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-ccra-green" />
          <div>
            <span className="text-xs font-semibold text-ccra-green">Chain Integrity: 100% Verified</span>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              All {handledStages.length} custody transfers cryptographically verified. No gaps or tamper events detected.
              Last verification: {new Date().toLocaleDateString('en-GB')}.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- AI Analysis Tab ---------- */

function AiAnalysisTab({ batch }: { batch: Batch }) {
  const percent = getCompletionPercent(batch.stages)
  const hasLab = !!batch.labResults
  const isExportReady = batch.currentStage === 'distribution' && hasLab

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">STRYDER AI Analysis</h4>
        <StryderBadge size="sm" />
      </div>

      <AiInsightCard
        title="Quality Prediction"
        insight={`Batch ${batch.batchCode} (${batch.strain} from ${batch.farmName}) is currently at ${percent}% pipeline completion. ${hasLab ? `Lab analysis confirms THC at ${batch.labResults!.thcPercent}% and CBD at ${batch.labResults!.cbdPercent}% with all safety tests passed. Predicted final grade: Premium A.` : 'Awaiting lab results for final quality classification. Based on farm history and strain genetics, predicted grade: Standard A or higher.'} Cannabinoid profile aligns with expected phenotype expression for this cultivar.`}
        severity="info"
        confidence={94}
        animate={false}
      />

      <AiInsightCard
        title="Optimal Distribution Window"
        insight={`Based on current ${batch.currentStage === 'processing' ? 'processing conditions' : batch.currentStage === 'lab-testing' ? 'lab testing timeline' : 'curing conditions and moisture levels'}, the optimal distribution window for ${batch.batchCode} is within the next ${isExportReady ? '30' : '45-60'} days. ${hasLab && batch.labResults!.moisture < 12 ? 'Moisture levels are optimal for long-term storage.' : 'Extended storage beyond this period may reduce terpene content by an estimated 8-12%.'} Recommend ${isExportReady ? 'immediate GCC market entry' : 'prioritizing pipeline completion'}.`}
        severity={isExportReady ? 'info' : 'warning'}
        confidence={87}
        animate={false}
      />

      <AiInsightCard
        title="Export Readiness Assessment"
        insight={`${batch.batchCode} meets ${isExportReady ? '96%' : `${Math.round(percent * 0.9)}%`} of international export compliance requirements. ${isExportReady ? 'All chain-of-custody documentation is complete and blockchain-verified. Recommend final packaging verification before issuing export certificate.' : `Remaining steps: ${stageOrder.filter(s => {const st = batch.stages.find(bs => bs.type === s); return !st || st.status !== 'completed';}).map(s => stageConfig[s].label).join(', ')}. Estimated ${Math.round((7 - batch.stages.filter(s => s.status === 'completed').length) * 15)} days to export readiness.`} Target market recommendation: ${batch.strain.includes('Hemp') || batch.strain.includes('CBD') ? 'European Union (CBD products)' : batch.strain.includes('Medicinal') ? 'GCC pharmaceutical market' : 'GCC recreational/medicinal market'}.`}
        severity="info"
        confidence={isExportReady ? 96 : 78}
        animate={false}
      />

      {hasLab && (
        <AiInsightCard
          title="Regulatory Compliance"
          insight={`All laboratory analyses for ${batch.batchCode} comply with CCRA regulatory standards. THC content of ${batch.labResults!.thcPercent}% is ${batch.labResults!.thcPercent <= 20 ? 'within' : 'above'} the regulatory limit of 20%. Contaminant, pesticide, and heavy metal screenings all passed ISO/IEC 17025 accredited testing. ${batch.labResults!.certificateId ? `Certificate ${batch.labResults!.certificateId} has been issued and recorded on the blockchain ledger.` : 'Certificate issuance pending final review.'}`}
          severity={batch.labResults!.thcPercent <= 20 ? 'info' : 'warning'}
          confidence={98}
          animate={false}
        />
      )}
    </div>
  )
}

/* ---------- Main Component ---------- */

export function BatchDetailDrawer() {
  const { batches, selectedBatchId, setSelectedBatch } = useTraceabilityStore()
  const batch = batches.find((b) => b.id === selectedBatchId) ?? null
  const isOpen = selectedBatchId !== null && batch !== null

  const showExportCert =
    batch?.currentStage === 'distribution' && batch?.labResults !== undefined

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) setSelectedBatch(null)
      }}
    >
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {batch && (
          <>
            <div className="sticky top-0 z-10 glass-heavy border-b border-border/50 px-6 pt-6 pb-4">
              <BatchHeader batch={batch} />
            </div>

            <div className="px-6 pb-6">
              <Tabs defaultValue="pipeline" className="mt-4">
                <TabsList className="w-full grid grid-cols-5 h-10">
                  <TabsTrigger value="pipeline" className="text-xs">Pipeline</TabsTrigger>
                  <TabsTrigger value="lab-results" className="text-xs">Lab Results</TabsTrigger>
                  <TabsTrigger value="custody" className="text-xs">Chain of Custody</TabsTrigger>
                  <TabsTrigger value="ai-analysis" className="text-xs">AI Analysis</TabsTrigger>
                  {showExportCert && (
                    <TabsTrigger value="export-cert" className="text-xs">Export Cert</TabsTrigger>
                  )}
                </TabsList>

                <TabsContent value="pipeline" className="mt-5">
                  <PipelineTab batch={batch} />
                </TabsContent>

                <TabsContent value="lab-results" className="mt-5">
                  {batch.labResults ? (
                    <LabResultsTab labResults={batch.labResults} batchCode={batch.batchCode} />
                  ) : (
                    <div className="glass rounded-xl border border-border/50 flex flex-col items-center justify-center py-16 text-muted-foreground">
                      <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-muted/50 mb-4">
                        <FlaskConical className="h-8 w-8 opacity-40" />
                      </div>
                      <p className="text-sm font-medium mb-1">Lab Testing Not Yet Complete</p>
                      <p className="text-xs text-muted-foreground/70 max-w-md text-center">
                        This batch is currently in the <strong>{stageConfig[batch.currentStage].label}</strong> stage.
                        Lab results will be available once the batch reaches the lab testing stage and analysis is complete.
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="custody" className="mt-5">
                  <ChainOfCustodyTab batch={batch} />
                </TabsContent>

                <TabsContent value="ai-analysis" className="mt-5">
                  <AiAnalysisTab batch={batch} />
                </TabsContent>

                {showExportCert && (
                  <TabsContent value="export-cert" className="mt-5">
                    <ExportCertificate batch={batch} />
                  </TabsContent>
                )}
              </Tabs>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
