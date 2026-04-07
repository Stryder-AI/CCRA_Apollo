'use client'

import { useState } from 'react'
import { useFarmStore } from '@/store/useFarmStore'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PermissionGate } from '@/components/auth/PermissionGate'
import { AiInsightCard } from '@/components/ai/AiInsightCard'
import { DocumentViewer } from '@/components/shared/DocumentViewer'
import { farmDocuments } from '@/data/mock-documents'
import { farmTimeline } from '@/data/mock-timeline'
import { aiInsights } from '@/data/mock-ai-insights'
import { formatDateShort } from '@/utils/format'
import { FarmStatus } from '@/types/farm'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
} from 'recharts'
import {
  MapPin,
  Ruler,
  Leaf,
  FileText,
  Clock,
  ShieldCheck,
  Pencil,
  Ban,
  Trash2,
  CheckCircle,
  AlertCircle,
  XCircle,
  Sprout,
  Droplets,
  Bug,
  Thermometer,
  TrendingUp,
} from 'lucide-react'

const complianceTrendHealthy = [
  { inspection: 'Jan 25', score: 88 },
  { inspection: 'Apr 25', score: 91 },
  { inspection: 'Jul 25', score: 85 },
  { inspection: 'Oct 25', score: 89 },
  { inspection: 'Jan 26', score: 92 },
  { inspection: 'Mar 26', score: 90 },
]

const complianceTrendDeclining = [
  { inspection: 'Jan 25', score: 82 },
  { inspection: 'Apr 25', score: 78 },
  { inspection: 'Jul 25', score: 71 },
  { inspection: 'Oct 25', score: 65 },
  { inspection: 'Jan 26', score: 58 },
  { inspection: 'Mar 26', score: 52 },
]

const statusBadge: Record<FarmStatus, { className: string; label: string }> = {
  active: {
    className:
      'bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30',
    label: 'Active',
  },
  pending: {
    className:
      'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/30',
    label: 'Pending',
  },
  suspended: {
    className:
      'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30',
    label: 'Suspended',
  },
  revoked: {
    className:
      'bg-gray-500/15 text-gray-700 dark:text-gray-400 border-gray-500/30',
    label: 'Revoked',
  },
}

const timelineIcons: Record<string, React.ReactNode> = {
  registration: <CheckCircle className="h-4 w-4 text-green-500" />,
  license: <FileText className="h-4 w-4 text-blue-500" />,
  inspection: <ShieldCheck className="h-4 w-4 text-amber-500" />,
  violation: <AlertCircle className="h-4 w-4 text-red-500" />,
  update: <Clock className="h-4 w-4 text-muted-foreground" />,
}

const docStatusIcons: Record<string, React.ReactNode> = {
  verified: <CheckCircle className="h-4 w-4 text-green-500" />,
  pending: <Clock className="h-4 w-4 text-amber-500" />,
  rejected: <XCircle className="h-4 w-4 text-red-500" />,
}

export function FarmDrawer() {
  const selectedFarmId = useFarmStore((s) => s.selectedFarmId)
  const setSelectedFarm = useFarmStore((s) => s.setSelectedFarm)
  const farms = useFarmStore((s) => s.farms)
  const deleteFarm = useFarmStore((s) => s.deleteFarm)
  const updateFarm = useFarmStore((s) => s.updateFarm)

  const [viewingDoc, setViewingDoc] = useState<string | null>(null)

  const farm = farms.find((f) => f.id === selectedFarmId)
  const documents = selectedFarmId ? farmDocuments[selectedFarmId] ?? [] : []
  const timeline = selectedFarmId ? farmTimeline[selectedFarmId] ?? [] : []

  const complianceTrend =
    farm?.status === 'suspended' || farm?.status === 'revoked'
      ? complianceTrendDeclining
      : complianceTrendHealthy

  return (
    <Sheet
      open={!!selectedFarmId}
      onOpenChange={(open) => {
        if (!open) setSelectedFarm(null)
      }}
    >
      <SheetContent
        side="right"
        className="z-[10000] w-full sm:max-w-md overflow-y-auto"
        showCloseButton
      >
        {farm && (
          <>
            <SheetHeader>
              <SheetTitle>{farm.name}</SheetTitle>
              <SheetDescription>
                {farm.licenseNumber} &middot; {farm.region}, {farm.province}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 px-4 pb-4 overflow-y-auto">
              <Tabs defaultValue="overview">
                <TabsList className="w-full">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                  <TabsTrigger value="ai">AI Insights</TabsTrigger>
                </TabsList>

                {/* ---- Overview Tab ---- */}
                <TabsContent value="overview" className="mt-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={statusBadge[farm.status].className}
                    >
                      {statusBadge[farm.status].label}
                    </Badge>
                    {farm.complianceScore != null && (
                      <Badge variant="outline">
                        <ShieldCheck className="h-3 w-3 mr-1" />
                        {farm.complianceScore}%
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <InfoRow
                      icon={<MapPin className="h-4 w-4" />}
                      label="Owner"
                      value={farm.ownerName}
                    />
                    <InfoRow
                      icon={<MapPin className="h-4 w-4" />}
                      label="Region"
                      value={`${farm.region}, ${farm.province}`}
                    />
                    <InfoRow
                      icon={<Ruler className="h-4 w-4" />}
                      label="Size"
                      value={`${farm.sizeHectares} hectares`}
                    />
                    <InfoRow
                      icon={<Leaf className="h-4 w-4" />}
                      label="Strain"
                      value={farm.strain}
                    />
                    <InfoRow
                      icon={<Clock className="h-4 w-4" />}
                      label="Registered"
                      value={formatDateShort(farm.registeredDate)}
                    />
                    <InfoRow
                      icon={<ShieldCheck className="h-4 w-4" />}
                      label="Last Inspection"
                      value={
                        farm.lastInspection
                          ? formatDateShort(farm.lastInspection)
                          : 'N/A'
                      }
                    />
                  </div>

                  {farm.yieldEstimateTons != null && (
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-xs text-muted-foreground">
                        Yield Estimate
                      </p>
                      <p className="text-lg font-semibold">
                        {farm.yieldEstimateTons} tons
                      </p>
                    </div>
                  )}

                  {farm.notes && (
                    <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                      <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-1">
                        Notes
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {farm.notes}
                      </p>
                    </div>
                  )}

                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground mb-1">
                      Coordinates
                    </p>
                    <p className="text-sm font-mono">
                      {farm.coordinates[0].toFixed(4)},{' '}
                      {farm.coordinates[1].toFixed(4)}
                    </p>
                  </div>
                </TabsContent>

                {/* ---- Documents Tab ---- */}
                <TabsContent value="documents" className="mt-4 space-y-3">
                  {documents.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-8 text-center">
                      No documents on file for this farm.
                    </p>
                  ) : (
                    documents.map((doc) => (
                      <button
                        key={doc.id}
                        type="button"
                        className="flex items-start gap-3 rounded-lg border border-border p-3 w-full text-left hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => setViewingDoc(doc.name)}
                      >
                        <FileText className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {doc.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {doc.type} &middot;{' '}
                            {formatDateShort(doc.uploadDate)}
                          </p>
                        </div>
                        {docStatusIcons[doc.status]}
                      </button>
                    ))
                  )}
                </TabsContent>

                {/* ---- History Tab ---- */}
                <TabsContent value="history" className="mt-4">
                  {timeline.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-8 text-center">
                      No history available for this farm.
                    </p>
                  ) : (
                    <div className="relative space-y-0">
                      {timeline.map((evt, i) => (
                        <div key={evt.id} className="flex gap-3 pb-4">
                          {/* Timeline line + dot */}
                          <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted shrink-0">
                              {timelineIcons[evt.type] ?? (
                                <Clock className="h-3 w-3" />
                              )}
                            </div>
                            {i < timeline.length - 1 && (
                              <div className="w-px flex-1 bg-border mt-1" />
                            )}
                          </div>
                          <div className="pt-0.5">
                            <p className="text-sm font-medium">{evt.event}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDateShort(evt.date)}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {evt.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* ---- AI Insights Tab ---- */}
                <TabsContent value="ai" className="mt-4 space-y-4">
                  {/* Compliance Score Trend Chart */}
                  <div className="rounded-xl border border-border p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm font-semibold">
                        Compliance Score Trend
                      </span>
                    </div>
                    <div style={{ width: '100%', height: 160 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={complianceTrend}>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--background))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              fontSize: '12px',
                            }}
                            labelStyle={{ fontWeight: 600 }}
                            formatter={(value) => [`${value}%`, 'Score']}
                          />
                          <Line
                            type="monotone"
                            dataKey="score"
                            stroke={
                              farm.status === 'suspended' ||
                              farm.status === 'revoked'
                                ? '#ef4444'
                                : '#22c55e'
                            }
                            strokeWidth={2}
                            dot={{
                              r: 4,
                              fill:
                                farm.status === 'suspended' ||
                                farm.status === 'revoked'
                                  ? '#ef4444'
                                  : '#22c55e',
                              strokeWidth: 0,
                            }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {(() => {
                    const insights = farm.status === 'suspended' || farm.status === 'revoked'
                      ? aiInsights.farms.suspended
                      : aiInsights.farms.default
                    return (
                      <>
                        <AiInsightCard
                          title="Yield Prediction"
                          insight={insights.yieldPrediction}
                          severity="info"
                          confidence={farm.status === 'active' ? 89 : undefined}
                        />
                        <AiInsightCard
                          title="Optimal Harvest Window"
                          insight={insights.harvestWindow}
                          severity="info"
                          confidence={farm.status === 'active' ? 85 : undefined}
                        />
                        <AiInsightCard
                          title="Pest & Disease Risk"
                          insight={insights.pestRisk}
                          severity={farm.status === 'active' ? 'info' : 'warning'}
                          confidence={farm.status === 'active' ? 92 : undefined}
                        />
                        {insights.soilHealth > 0 && (
                          <div className="rounded-xl border border-border p-4 space-y-2">
                            <div className="flex items-center gap-2">
                              <Thermometer className="h-4 w-4 text-emerald-500" />
                              <span className="text-sm font-semibold">Soil Health Index</span>
                            </div>
                            <div className="relative h-3 rounded-full bg-muted overflow-hidden">
                              <div
                                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-1000"
                                style={{ width: `${insights.soilHealth}%` }}
                              />
                            </div>
                            <p className="text-right text-sm font-mono font-semibold text-emerald-500">
                              {insights.soilHealth}/100
                            </p>
                          </div>
                        )}
                      </>
                    )
                  })()}
                </TabsContent>
              </Tabs>
            </div>

            {/* Document Viewer */}
            <DocumentViewer
              documentName={viewingDoc ?? ''}
              open={!!viewingDoc}
              onOpenChange={(open) => {
                if (!open) setViewingDoc(null)
              }}
            />

            {/* Action bar */}
            <SheetFooter className="border-t border-border">
              <div className="flex items-center gap-2 w-full">
                <PermissionGate permission="canManageFarms">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </PermissionGate>
                <PermissionGate permission="canChangeStatus">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-amber-600 hover:text-amber-700 border-amber-500/30"
                    onClick={() =>
                      updateFarm(farm.id, {
                        status:
                          farm.status === 'suspended' ? 'active' : 'suspended',
                      })
                    }
                  >
                    <Ban className="h-4 w-4 mr-1" />
                    {farm.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                  </Button>
                </PermissionGate>
                <PermissionGate permission="canDeleteFarms">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive border-destructive/30"
                    onClick={() => {
                      deleteFarm(farm.id)
                      setSelectedFarm(null)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </PermissionGate>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-muted-foreground mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">{value}</p>
      </div>
    </div>
  )
}
