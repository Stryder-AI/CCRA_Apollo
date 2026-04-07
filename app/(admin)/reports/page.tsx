'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { GlassCard } from '@/design-system/glass-card'
import { AiInsightCard } from '@/components/ai/AiInsightCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { ReportPreview } from '@/components/reports/ReportPreview'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import {
  LayoutDashboard,
  Globe,
  IndianRupee,
  MapPin,
  ShieldCheck,
  Brain,
  Sparkles,
  Download,
  Eye,
  CalendarClock,
  Clock,
  Users,
  FileText,
  Zap,
} from 'lucide-react'
import {
  reportTemplates,
  reportHistory,
  scheduledReports,
} from '@/data/mock-reports'
import type { ReportTemplate, ScheduledReport } from '@/data/mock-reports'

const iconMap: Record<string, any> = {
  LayoutDashboard,
  Globe,
  IndianRupee,
  MapPin,
  ShieldCheck,
  Brain,
}

const categoryColorMap: Record<string, { bg: string; text: string; glow: 'green' | 'gold' | 'teal' | 'red' | 'none' }> = {
  governance: { bg: 'bg-purple-500/10', text: 'text-purple-500', glow: 'none' },
  compliance: { bg: 'bg-amber-500/10', text: 'text-amber-500', glow: 'gold' },
  financial: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', glow: 'green' },
  regional: { bg: 'bg-blue-500/10', text: 'text-blue-500', glow: 'teal' },
  ai: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', glow: 'green' },
}

export default function ReportsPage() {
  const [previewReport, setPreviewReport] = useState<ReportTemplate | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
  const [scheduleTarget, setScheduleTarget] = useState<ReportTemplate | null>(null)
  const [schedules, setSchedules] = useState<ScheduledReport[]>(scheduledReports)

  function openPreview(templateId: string) {
    const template = reportTemplates.find((t) => t.id === templateId)
    if (template) {
      setPreviewReport(template)
      setPreviewOpen(true)
    }
  }

  function openScheduleDialog(template: ReportTemplate) {
    setScheduleTarget(template)
    setScheduleDialogOpen(true)
  }

  function toggleSchedule(id: string) {
    setSchedules((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, enabled: !s.enabled } : s
      )
    )
    const schedule = schedules.find((s) => s.id === id)
    const template = reportTemplates.find((t) => t.id === schedule?.templateId)
    toast.success(
      schedule?.enabled ? 'Schedule Paused' : 'Schedule Activated',
      { description: `${template?.title} auto-generation has been ${schedule?.enabled ? 'paused' : 'activated'}.` }
    )
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <PageHeader
        title="Reports & Intelligence"
        description="Generate executive reports with one click — powered by STRYDER AI"
      />

      {/* AI Insight */}
      <AiInsightCard
        title="Report Generation Advisory"
        insight="Based on current data patterns, I recommend generating the Board of Governors report this week. Revenue exceeded Q1 targets by 15% and compliance in KP needs Board attention — 4 active violations including 2 water usage infractions in Chagai require strategic direction. The Panjgur Oasis penalty (PKR 25M) has been outstanding for 28 days and risks legal escalation."
        severity="warning"
        confidence={92}
        animate
      />

      {/* Report Templates Grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FileText className="size-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Report Templates</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {reportTemplates.map((template, i) => {
            const Icon = iconMap[template.icon] || FileText
            const colors = categoryColorMap[template.category]
            return (
              <GlassCard
                key={template.id}
                hover
                glow={colors.glow}
                className="flex flex-col"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`size-10 rounded-xl ${colors.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`size-5 ${colors.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold leading-tight">{template.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-[9px]">{template.frequency}</Badge>
                      {template.id === 'rpt-ai' && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] text-emerald-500 font-semibold">
                          <Sparkles className="size-2.5" /> AI Powered
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3 flex-1">
                  {template.description}
                </p>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="size-3" />
                    Last: {new Date(template.lastGenerated).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <span>{template.sections.length} sections</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white border-0 gap-1.5 text-xs"
                    size="sm"
                    onClick={() => openPreview(template.id)}
                  >
                    <Zap className="size-3" />
                    Generate Now
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs gap-1"
                    onClick={() => openScheduleDialog(template)}
                  >
                    <CalendarClock className="size-3" />
                    Schedule
                  </Button>
                </div>
              </GlassCard>
            )
          })}
        </div>
      </div>

      {/* Scheduled Reports */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <CalendarClock className="size-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Scheduled Reports</h2>
        </div>
        <GlassCard padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground p-3">Report Name</th>
                  <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground p-3">Frequency</th>
                  <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground p-3">Next Run</th>
                  <th className="text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground p-3">Recipients</th>
                  <th className="text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground p-3">Status</th>
                  <th className="text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule) => {
                  const template = reportTemplates.find((t) => t.id === schedule.templateId)
                  if (!template) return null
                  const Icon = iconMap[template.icon] || FileText
                  const colors = categoryColorMap[template.category]
                  return (
                    <tr
                      key={schedule.id}
                      className="border-b border-border/30 hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => openPreview(schedule.templateId)}
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className={`size-7 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}>
                            <Icon className={`size-3.5 ${colors.text}`} />
                          </div>
                          <span className="text-xs font-medium">{template.title}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant="secondary" className="text-[9px] capitalize">{schedule.frequency}</Badge>
                      </td>
                      <td className="p-3 text-xs text-muted-foreground">
                        {new Date(schedule.nextRun).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                          <Users className="size-3" />
                          {schedule.recipients}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                          <Switch
                            checked={schedule.enabled}
                            onCheckedChange={() => toggleSchedule(schedule.id)}
                            size="sm"
                          />
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <Button
                          variant="ghost"
                          size="xs"
                          className="text-xs gap-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            openPreview(schedule.templateId)
                          }}
                        >
                          <Eye className="size-3" />
                          Preview
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      {/* Report History */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="size-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Report History</h2>
        </div>
        <GlassCard padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground p-3">Report Title</th>
                  <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground p-3">Generated By</th>
                  <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground p-3">Date</th>
                  <th className="text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground p-3">Format</th>
                  <th className="text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground p-3">Size</th>
                  <th className="text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reportHistory.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-border/30 hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => openPreview(record.templateId)}
                  >
                    <td className="p-3">
                      <span className="text-xs font-medium">{record.title}</span>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">{record.generatedBy}</td>
                    <td className="p-3 text-xs text-muted-foreground">
                      {new Date(record.generatedDate).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-3 text-center">
                      <Badge
                        variant="secondary"
                        className={`text-[9px] ${record.format === 'PDF' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}
                      >
                        {record.format}
                      </Badge>
                    </td>
                    <td className="p-3 text-right text-xs text-muted-foreground font-mono">{record.fileSize}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="xs"
                          className="text-xs gap-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            toast.success('Download Started', {
                              description: `${record.title} (${record.fileSize}) is downloading.`,
                            })
                          }}
                        >
                          <Download className="size-3" />
                          Download
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          className="text-xs gap-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            openPreview(record.templateId)
                          }}
                        >
                          <Eye className="size-3" />
                          Preview
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      {/* Report Preview Dialog */}
      <ReportPreview
        report={previewReport}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />

      {/* Schedule Sub-Dialog */}
      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent showCloseButton className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Report Generation</DialogTitle>
          </DialogHeader>
          {scheduleTarget && (
            <div className="space-y-4 mt-2">
              <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                <p className="text-sm font-medium">{scheduleTarget.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{scheduleTarget.description}</p>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Frequency</label>
                  <div className="flex gap-2 mt-1.5">
                    {['Weekly', 'Monthly', 'Quarterly'].map((freq) => (
                      <Button
                        key={freq}
                        variant={freq.toLowerCase() === scheduleTarget.frequency ? 'default' : 'outline'}
                        size="sm"
                        className="text-xs flex-1"
                      >
                        {freq}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Auto-distribute to</label>
                  <div className="mt-1.5 space-y-1.5">
                    {[
                      { label: 'Board of Governors', count: 7 },
                      { label: 'Director General', count: 1 },
                      { label: 'Regional Directors', count: 4 },
                    ].map((group) => (
                      <div key={group.label} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/30">
                        <span className="text-xs">{group.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground">{group.count} members</span>
                          <Switch checked size="sm" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <Button
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white border-0 gap-1.5"
                onClick={() => {
                  setScheduleDialogOpen(false)
                  toast.success('Schedule Created', {
                    description: `${scheduleTarget.title} has been scheduled for automatic generation.`,
                  })
                }}
              >
                <CalendarClock className="size-3.5" />
                Confirm Schedule
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
