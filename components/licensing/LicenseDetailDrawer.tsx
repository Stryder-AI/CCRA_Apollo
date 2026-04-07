'use client'

import { useState } from 'react'
import { useLicenseStore } from '@/store/useLicenseStore'
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
import { GlassCard } from '@/design-system/glass-card'
import { AiReviewPanel } from '@/components/ai/AiReviewPanel'
import { DocumentViewer } from '@/components/shared/DocumentViewer'
import { licenseReviews, defaultReview } from '@/data/mock-license-reviews'
import { STATUS_COLORS } from '@/config/constants'
import { formatCurrency, formatDateShort } from '@/utils/format'
import { LicenseStatus } from '@/types/license'
import { toast } from 'sonner'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
} from 'recharts'
import {
  CheckCircle2,
  FileText,
  Clock,
  User,
  Building2,
  MapPin,
  Calendar,
  Banknote,
  XCircle,
  AlertCircle,
  TrendingUp,
} from 'lucide-react'

const licenseComplianceTrend = [
  { inspection: 'Jan 25', score: 90 },
  { inspection: 'Apr 25', score: 93 },
  { inspection: 'Jul 25', score: 88 },
  { inspection: 'Oct 25', score: 91 },
  { inspection: 'Jan 26', score: 94 },
  { inspection: 'Mar 26', score: 92 },
]

const statusBadgeClass: Record<LicenseStatus, string> = {
  active:
    'bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30',
  pending:
    'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/30',
  suspended:
    'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30',
  revoked:
    'bg-gray-500/15 text-gray-700 dark:text-gray-400 border-gray-500/30',
  expired:
    'bg-gray-500/15 text-gray-700 dark:text-gray-400 border-gray-500/30',
  'under-review':
    'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30',
  approved:
    'bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30',
  rejected:
    'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30',
}

const timelineEvents = [
  {
    id: 1,
    event: 'Application Submitted',
    date: '2025-06-01',
    description: 'License application submitted by applicant.',
  },
  {
    id: 2,
    event: 'Documents Received',
    date: '2025-06-05',
    description: 'All required documents received and logged.',
  },
  {
    id: 3,
    event: 'AI Review Completed',
    date: '2025-06-10',
    description: 'Automated first-pass review completed by STRYDER AI.',
  },
  {
    id: 4,
    event: 'Under Human Review',
    date: '2025-06-12',
    description: 'Application assigned to licensing officer for final review.',
  },
]

export function LicenseDetailDrawer() {
  const selectedLicenseId = useLicenseStore((s) => s.selectedLicenseId)
  const setSelectedLicense = useLicenseStore((s) => s.setSelectedLicense)
  const licenses = useLicenseStore((s) => s.licenses)
  const updateLicense = useLicenseStore((s) => s.updateLicense)

  const [viewingDoc, setViewingDoc] = useState<string | null>(null)

  const license = licenses.find((l) => l.id === selectedLicenseId)
  const review = selectedLicenseId
    ? licenseReviews[selectedLicenseId] ?? defaultReview
    : defaultReview

  return (
    <Sheet
      open={!!selectedLicenseId}
      onOpenChange={(open) => {
        if (!open) setSelectedLicense(null)
      }}
    >
      <SheetContent
        side="right"
        className="z-[10000] w-full sm:max-w-md overflow-y-auto"
        showCloseButton
      >
        {license && (
          <>
            <SheetHeader>
              <SheetTitle>{license.licenseNumber}</SheetTitle>
              <SheetDescription>
                {license.applicantName} &middot; {license.companyName}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 px-4 pb-4 overflow-y-auto">
              <Tabs defaultValue="overview">
                <TabsList className="w-full">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="ai-review">AI Review</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>

                {/* ---- Overview Tab ---- */}
                <TabsContent value="overview" className="mt-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={statusBadgeClass[license.status]}
                    >
                      {license.status.replace('-', ' ')}
                    </Badge>
                    <Badge variant="outline">
                      {license.type}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <InfoRow
                      icon={<User className="h-4 w-4" />}
                      label="Applicant"
                      value={license.applicantName}
                    />
                    <InfoRow
                      icon={<Building2 className="h-4 w-4" />}
                      label="Company"
                      value={license.companyName}
                    />
                    <InfoRow
                      icon={<MapPin className="h-4 w-4" />}
                      label="Region"
                      value={license.region}
                    />
                    <InfoRow
                      icon={<Banknote className="h-4 w-4" />}
                      label="Fee Paid"
                      value={formatCurrency(license.feePaidPKR)}
                    />
                    <InfoRow
                      icon={<Calendar className="h-4 w-4" />}
                      label="Application Date"
                      value={formatDateShort(license.applicationDate)}
                    />
                    <InfoRow
                      icon={<Calendar className="h-4 w-4" />}
                      label="Issue Date"
                      value={
                        license.issueDate
                          ? formatDateShort(license.issueDate)
                          : 'N/A'
                      }
                    />
                    <InfoRow
                      icon={<Clock className="h-4 w-4" />}
                      label="Expiry Date"
                      value={
                        license.expiryDate
                          ? formatDateShort(license.expiryDate)
                          : 'N/A'
                      }
                    />
                  </div>

                  {license.notes && (
                    <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                      <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-1">
                        Notes
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {license.notes}
                      </p>
                    </div>
                  )}
                </TabsContent>

                {/* ---- Documents Tab ---- */}
                <TabsContent value="documents" className="mt-4 space-y-3">
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
                        <LineChart data={licenseComplianceTrend}>
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
                            stroke="#22c55e"
                            strokeWidth={2}
                            dot={{
                              r: 4,
                              fill: '#22c55e',
                              strokeWidth: 0,
                            }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {license.documents.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-8 text-center">
                      No documents on file for this license.
                    </p>
                  ) : (
                    license.documents.map((doc, i) => (
                      <button
                        key={i}
                        type="button"
                        className="flex items-start gap-3 rounded-lg border border-border p-3 w-full text-left hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => setViewingDoc(doc)}
                      >
                        <FileText className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{doc}</p>
                        </div>
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                      </button>
                    ))
                  )}
                </TabsContent>

                {/* ---- AI Review Tab ---- */}
                <TabsContent value="ai-review" className="mt-4">
                  <GlassCard padding="md">
                    <AiReviewPanel
                      verdict={review.verdict}
                      riskScore={review.riskScore}
                      flags={review.flags}
                      recommendation={review.recommendation}
                      reviewDate={review.reviewDate}
                    />
                  </GlassCard>
                </TabsContent>

                {/* ---- Timeline Tab ---- */}
                <TabsContent value="timeline" className="mt-4">
                  <div className="relative space-y-0">
                    {timelineEvents.map((evt, i) => (
                      <div key={evt.id} className="flex gap-3 pb-4">
                        <div className="flex flex-col items-center">
                          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-500/15 shrink-0">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                          </div>
                          {i < timelineEvents.length - 1 && (
                            <div className="w-px flex-1 bg-green-500/40 mt-1" />
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
              <PermissionGate permission="canApproveLicenses">
                <div className="flex items-center gap-2 w-full">
                  <Button
                    size="sm"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      updateLicense(license.id, { status: 'approved' })
                      toast.success(
                        `License ${license.licenseNumber} approved`
                      )
                      setSelectedLicense(null)
                    }}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-red-600 hover:text-red-700 border-red-500/30 hover:bg-red-500/10"
                    onClick={() => {
                      updateLicense(license.id, { status: 'rejected' })
                      toast.error(
                        `License ${license.licenseNumber} rejected`
                      )
                      setSelectedLicense(null)
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-amber-600 hover:text-amber-700 border-amber-500/30 hover:bg-amber-500/10"
                    onClick={() => {
                      updateLicense(license.id, { status: 'under-review' })
                      toast.info(
                        `Changes requested for ${license.licenseNumber}`
                      )
                      setSelectedLicense(null)
                    }}
                  >
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Request Changes
                  </Button>
                </div>
              </PermissionGate>
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
