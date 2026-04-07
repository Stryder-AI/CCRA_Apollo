'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { GlassCard } from '@/design-system/glass-card'
import { AiInsightCard } from '@/components/ai/AiInsightCard'
import { StryderBadge } from '@/components/ai/StryderBadge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  Calendar, Users, Radio, Smartphone, ChevronLeft, ChevronRight,
  MapPin, Phone, Mail, Star, Clock, CheckCircle2, AlertTriangle,
  Camera, Navigation, FileText, Shield, Eye, UserPlus, ArrowRight,
  RefreshCw, Flag, ThumbsUp, Send, Droplets, Leaf, FlaskConical,
  Lock, Truck, ClipboardCheck, HardHat, Tag, Trash2, BookOpen,
  Sparkles, Activity, TrendingUp, BarChart3, Zap, Search
} from 'lucide-react'
import { inspectors, liveInspectionFeed, inspectionChecklist } from '@/data/mock-inspectors'
import { inspections } from '@/data/mock-inspections'
import type { Inspector, LiveInspectionEntry, ChecklistItem } from '@/data/mock-inspectors'

// ── Helpers ──────────────────────────────────────────────
const inspectorColors: Record<string, string> = {
  'Col. Tariq Mehmood': 'bg-emerald-500',
  'Maj. Saeed Anwar': 'bg-blue-500',
  'Lt. Col. Imran Shah': 'bg-amber-500',
  'Capt. Zubair Ali': 'bg-purple-500',
}

const inspectorTextColors: Record<string, string> = {
  'Col. Tariq Mehmood': 'text-emerald-500',
  'Maj. Saeed Anwar': 'text-blue-500',
  'Lt. Col. Imran Shah': 'text-amber-500',
  'Capt. Zubair Ali': 'text-purple-500',
}

const statusConfig = {
  'in-field': { label: 'In Field', color: 'bg-emerald-500', textColor: 'text-emerald-500' },
  'available': { label: 'Available', color: 'bg-blue-500', textColor: 'text-blue-500' },
  'on-leave': { label: 'On Leave', color: 'bg-gray-400', textColor: 'text-gray-400' },
}

const feedStatusConfig = {
  submitted: { label: 'Submitted', variant: 'outline' as const, color: 'text-blue-500 border-blue-500/30' },
  reviewing: { label: 'Under Review', variant: 'outline' as const, color: 'text-amber-500 border-amber-500/30' },
  approved: { label: 'Approved', variant: 'outline' as const, color: 'text-emerald-500 border-emerald-500/30' },
}

function getScoreColor(score: number) {
  if (score >= 90) return 'text-emerald-500'
  if (score >= 70) return 'text-amber-500'
  return 'text-red-500'
}

function getScoreBg(score: number) {
  if (score >= 90) return 'bg-emerald-500/10'
  if (score >= 70) return 'bg-amber-500/10'
  return 'bg-red-500/10'
}

function getInitials(name: string) {
  return name.replace(/^(Col\.|Maj\.|Lt\. Col\.|Capt\.)\s*/, '').split(' ').map(w => w[0]).join('')
}

function formatTimestamp(ts: string) {
  const d = new Date(ts)
  const today = new Date('2026-03-17')
  const isToday = d.toDateString() === today.toDateString()
  const yesterday = new Date('2026-03-16')
  const isYesterday = d.toDateString() === yesterday.toDateString()
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  if (isToday) return `Today, ${time}`
  if (isYesterday) return `Yesterday, ${time}`
  return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${time}`
}

const categoryIcons: Record<string, React.ReactNode> = {
  'Security': <Lock className="h-3.5 w-3.5" />,
  'Cultivation': <Leaf className="h-3.5 w-3.5" />,
  'Administration': <BookOpen className="h-3.5 w-3.5" />,
  'Storage': <Shield className="h-3.5 w-3.5" />,
  'Environmental': <Droplets className="h-3.5 w-3.5" />,
  'Compliance': <FlaskConical className="h-3.5 w-3.5" />,
  'Safety': <HardHat className="h-3.5 w-3.5" />,
  'Quality': <Tag className="h-3.5 w-3.5" />,
}

// ── Calendar Data ────────────────────────────────────────
interface CalendarDay {
  day: number
  inspections: { id: string; farmName: string; inspectorName: string; status: string; score?: number }[]
}

function buildCalendar(): CalendarDay[][] {
  // March 2026 starts on Sunday (day 0). We want Mon-Sun grid.
  // March 1, 2026 = Sunday → offset 6 in Mon-Sun grid
  const daysInMonth = 31
  const startOffset = 6 // Sunday = 6th column in Mon-Sun
  const weeks: CalendarDay[][] = []
  let currentWeek: CalendarDay[] = []

  // Fill leading empty days
  for (let i = 0; i < startOffset; i++) {
    currentWeek.push({ day: 0, inspections: [] })
  }

  // Calendar inspection events (from existing data + mock additions)
  const calendarEvents: Record<number, { id: string; farmName: string; inspectorName: string; status: string; score?: number }[]> = {
    3: [{ id: 'ci-01', farmName: 'Swat Green Fields', inspectorName: 'Maj. Saeed Anwar', status: 'completed', score: 88 }],
    5: [{ id: 'ci-02', farmName: 'Buner Valley Organics', inspectorName: 'Capt. Zubair Ali', status: 'completed', score: 97 }],
    7: [{ id: 'ci-03', farmName: 'Dir Highland Farms', inspectorName: 'Lt. Col. Imran Shah', status: 'completed', score: 95 }],
    10: [
      { id: 'ci-04', farmName: 'Tirah Valley Estate', inspectorName: 'Col. Tariq Mehmood', status: 'completed', score: 91 },
      { id: 'ci-05', farmName: 'Quetta Highland Farm', inspectorName: 'Lt. Col. Imran Shah', status: 'completed', score: 84 },
    ],
    12: [{ id: 'ci-06', farmName: 'Panjgur Oasis', inspectorName: 'Maj. Saeed Anwar', status: 'completed', score: 58 }],
    15: [{ id: 'ci-07', farmName: 'Tirah Medicinal Labs', inspectorName: 'Capt. Zubair Ali', status: 'completed', score: 98 }],
    17: [
      { id: 'ci-08', farmName: 'Tirah Valley Estate', inspectorName: 'Col. Tariq Mehmood', status: 'in-progress' },
      { id: 'ci-09', farmName: 'Swat Green Fields', inspectorName: 'Maj. Saeed Anwar', status: 'in-progress' },
      { id: 'ci-10', farmName: 'Dir Highland Farms', inspectorName: 'Lt. Col. Imran Shah', status: 'in-progress' },
    ],
    20: [{ id: 'i011', farmName: 'Tirah Gold Plantation', inspectorName: 'Col. Tariq Mehmood', status: 'scheduled' }],
    22: [{ id: 'ci-11', farmName: 'Buner Valley Organics', inspectorName: 'Capt. Zubair Ali', status: 'scheduled' }],
    25: [{ id: 'i012', farmName: 'Malakand Green Acres', inspectorName: 'Maj. Saeed Anwar', status: 'scheduled' }],
    27: [{ id: 'ci-12', farmName: 'Quetta Highland Farm', inspectorName: 'Lt. Col. Imran Shah', status: 'scheduled' }],
    30: [
      { id: 'ci-13', farmName: 'Chagai Desert Bloom', inspectorName: 'Col. Tariq Mehmood', status: 'scheduled' },
      { id: 'ci-14', farmName: 'Swat River Valley', inspectorName: 'Maj. Saeed Anwar', status: 'scheduled' },
    ],
  }

  for (let d = 1; d <= daysInMonth; d++) {
    currentWeek.push({ day: d, inspections: calendarEvents[d] || [] })
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }

  // Fill trailing empty days
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ day: 0, inspections: [] })
    }
    weeks.push(currentWeek)
  }

  return weeks
}

// ═══════════════════════════════════════════════════════════
// ── MAIN PAGE COMPONENT ──────────────────────────────────
// ═══════════════════════════════════════════════════════════
export default function InspectionsPage() {
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null)
  const [dayDialogOpen, setDayDialogOpen] = useState(false)
  const [selectedInspector, setSelectedInspector] = useState<Inspector | null>(null)
  const [inspectorDialogOpen, setInspectorDialogOpen] = useState(false)
  const [selectedFeedEntry, setSelectedFeedEntry] = useState<LiveInspectionEntry | null>(null)
  const [feedDialogOpen, setFeedDialogOpen] = useState(false)

  const calendarWeeks = buildCalendar()

  // ── Calendar View ───────────────────────────────────────
  function CalendarView() {
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const today = 17

    return (
      <div className="space-y-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => toast.info('Navigating to February 2026')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold">March 2026</h2>
            <Button variant="ghost" size="icon" onClick={() => toast.info('Navigating to April 2026')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {Object.entries(inspectorColors).map(([name, color]) => (
              <div key={name} className="flex items-center gap-1.5">
                <span className={cn('h-2.5 w-2.5 rounded-full', color)} />
                <span>{name.split(' ').pop()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Grid */}
        <GlassCard padding="none" className="overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-border/50">
            {dayNames.map(d => (
              <div key={d} className="px-2 py-2.5 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/30">
                {d}
              </div>
            ))}
          </div>

          {/* Week Rows */}
          {calendarWeeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 border-b border-border/20 last:border-b-0">
              {week.map((day, di) => (
                <div
                  key={di}
                  className={cn(
                    'min-h-[90px] p-1.5 border-r border-border/10 last:border-r-0 transition-colors',
                    day.day === 0 && 'bg-muted/10',
                    day.day === today && 'bg-emerald-500/5 ring-1 ring-inset ring-emerald-500/30',
                    day.inspections.length > 0 && day.day > 0 && 'cursor-pointer hover:bg-muted/30',
                  )}
                  onClick={() => {
                    if (day.day > 0 && day.inspections.length > 0) {
                      setSelectedDay(day)
                      setDayDialogOpen(true)
                    }
                  }}
                >
                  {day.day > 0 && (
                    <>
                      <div className={cn(
                        'text-xs font-medium mb-1',
                        day.day === today ? 'text-emerald-500 font-bold' : 'text-foreground/70'
                      )}>
                        {day.day === today ? (
                          <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500 text-white text-[10px]">{day.day}</span>
                        ) : day.day}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        {day.inspections.map((insp, ii) => (
                          <div key={ii} className="flex items-center gap-1">
                            <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', inspectorColors[insp.inspectorName] || 'bg-gray-400')} />
                            <span className="text-[10px] text-muted-foreground truncate leading-tight">{insp.farmName.length > 14 ? insp.farmName.slice(0, 14) + '...' : insp.farmName}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </GlassCard>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Total Scheduled', value: '14', icon: Calendar, color: 'text-blue-500' },
            { label: 'Completed', value: '8', icon: CheckCircle2, color: 'text-emerald-500' },
            { label: 'In Progress', value: '3', icon: Activity, color: 'text-amber-500' },
            { label: 'Upcoming', value: '6', icon: Clock, color: 'text-purple-500' },
          ].map((stat, i) => (
            <GlassCard key={i} padding="sm" hover glow="teal">
              <div className="flex items-center gap-3">
                <div className={cn('p-2 rounded-lg bg-background/50', stat.color)}>
                  <stat.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    )
  }

  // ── Inspector Roster ────────────────────────────────────
  function InspectorRoster() {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inspectors.map((inspector) => {
            const sc = statusConfig[inspector.status]
            return (
              <GlassCard
                key={inspector.id}
                padding="none"
                hover
                glow={inspector.status === 'in-field' ? 'green' : inspector.status === 'available' ? 'teal' : 'none'}
                onClick={() => {
                  setSelectedInspector(inspector)
                  setInspectorDialogOpen(true)
                }}
              >
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn('h-11 w-11 rounded-full flex items-center justify-center text-white font-bold text-sm', inspectorColors[inspector.name] || 'bg-gray-500')}>
                        {getInitials(inspector.name)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-base">{inspector.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{inspector.rank}</Badge>
                          <div className="flex items-center gap-1">
                            <span className={cn('h-2 w-2 rounded-full animate-pulse', sc.color)} />
                            <span className={cn('text-[11px] font-medium', sc.textColor)}>{sc.label}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span>{inspector.region}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3 shrink-0" />
                      <span>{inspector.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Shield className="h-3 w-3 shrink-0" />
                      <span>{inspector.specialization}</span>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[
                      { label: 'Active', value: inspector.activeInspections },
                      { label: 'This Month', value: inspector.completedThisMonth },
                      { label: 'Rate', value: `${inspector.completionRate}%` },
                      { label: 'Avg Score', value: inspector.avgComplianceScore },
                    ].map((s, i) => (
                      <div key={i} className="text-center p-1.5 rounded-lg bg-muted/30">
                        <p className="text-sm font-bold">{s.value}</p>
                        <p className="text-[9px] text-muted-foreground uppercase tracking-wide">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                      <span>Completion Rate</span>
                      <span className="font-semibold text-foreground">{inspector.completionRate}%</span>
                    </div>
                    <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all', inspector.completionRate >= 95 ? 'bg-emerald-500' : inspector.completionRate >= 85 ? 'bg-amber-500' : 'bg-red-500')}
                        style={{ width: `${inspector.completionRate}%` }}
                      />
                    </div>
                  </div>

                  {/* Next Scheduled */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/20 rounded-lg px-3 py-2 mb-4">
                    <Clock className="h-3 w-3 shrink-0 text-blue-500" />
                    <span>Next: <strong className="text-foreground">{inspector.nextScheduledFarm}</strong> on {new Date(inspector.nextScheduled).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button size="xs" className="flex-1" onClick={(e) => { e.stopPropagation(); toast.success(`Inspection assignment initiated for ${inspector.name}`) }}>
                      <UserPlus className="h-3 w-3" />
                      Assign
                    </Button>
                    <Button size="xs" variant="outline" className="flex-1" onClick={(e) => { e.stopPropagation(); setSelectedInspector(inspector); setInspectorDialogOpen(true) }}>
                      <Eye className="h-3 w-3" />
                      History
                    </Button>
                    <Button size="xs" variant="outline" onClick={(e) => { e.stopPropagation(); toast.success(`Contacting ${inspector.name} at ${inspector.phone}`) }}>
                      <Phone className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </GlassCard>
            )
          })}
        </div>
      </div>
    )
  }

  // ── Live Feed ───────────────────────────────────────────
  function LiveFeed() {
    return (
      <div className="space-y-4">
        {/* Live indicator */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
          </span>
          <span className="text-xs font-semibold text-red-500 uppercase tracking-wider">Live Feed</span>
          <span className="text-xs text-muted-foreground">— {liveInspectionFeed.length} recent submissions</span>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-border/50" />
          <div className="space-y-3">
            {liveInspectionFeed.map((entry, idx) => {
              const fsc = feedStatusConfig[entry.status]
              return (
                <div
                  key={entry.id}
                  className="relative pl-12 cursor-pointer group"
                  onClick={() => {
                    setSelectedFeedEntry(entry)
                    setFeedDialogOpen(true)
                  }}
                >
                  {/* Timeline dot */}
                  <div className={cn(
                    'absolute left-3 top-4 h-5 w-5 rounded-full flex items-center justify-center text-white text-[8px] font-bold ring-2 ring-background',
                    inspectorColors[entry.inspectorName] || 'bg-gray-500'
                  )}>
                    {getInitials(entry.inspectorName)}
                  </div>

                  <GlassCard padding="sm" hover glow={entry.score < 60 ? 'red' : entry.score >= 90 ? 'green' : 'gold'} className="group-hover:translate-x-1 transition-transform">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm">{entry.farmName}</h4>
                          <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0', fsc.color)}>{fsc.label}</Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{entry.region}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatTimestamp(entry.timestamp)}</span>
                          <span>{entry.inspectorName}</span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{entry.summary}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <Badge variant="secondary" className="text-[10px] gap-1"><Camera className="h-2.5 w-2.5" />{entry.photoCount} Photos</Badge>
                          <Badge variant="secondary" className="text-[10px] gap-1"><Navigation className="h-2.5 w-2.5" />{entry.gpsCoords}</Badge>
                        </div>
                      </div>
                      <div className={cn('text-2xl font-bold shrink-0 p-2 rounded-xl min-w-[60px] text-center', getScoreColor(entry.score), getScoreBg(entry.score))}>
                        {entry.score}
                        <p className="text-[9px] font-normal text-muted-foreground">Score</p>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // ── Mobile Preview ──────────────────────────────────────
  function MobilePreview() {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center">
          {/* Phone Frame */}
          <div className="relative w-[320px] h-[568px] rounded-[36px] border-[3px] border-foreground/20 bg-background shadow-2xl shadow-black/20 overflow-hidden">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[24px] bg-foreground/20 rounded-b-2xl z-10" />

            {/* Screen Content */}
            <div className="h-full overflow-y-auto pt-8 pb-4 px-3 bg-gradient-to-b from-background to-muted/20">
              {/* App Header */}
              <div className="flex items-center justify-between mb-4 px-1">
                <div>
                  <h3 className="text-sm font-bold">CCRA Field Inspector</h3>
                  <p className="text-[10px] text-muted-foreground">Mobile Inspection Suite</p>
                </div>
                <StryderBadge size="sm" />
              </div>

              {/* Farm Info */}
              <div className="bg-muted/30 rounded-xl p-3 mb-3 border border-border/30">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Current Inspection</p>
                <p className="text-sm font-semibold mt-0.5">Tirah Valley Estate</p>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-500">
                  <Navigation className="h-2.5 w-2.5" />
                  <span>GPS Verified — 33.9272°N, 70.5531°E</span>
                  <CheckCircle2 className="h-2.5 w-2.5 ml-auto" />
                </div>
              </div>

              {/* Checklist */}
              <div className="mb-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                  12-Point Inspection Checklist
                </p>
                <div className="space-y-1.5">
                  {inspectionChecklist.map((item, idx) => (
                    <div key={item.id} className="flex items-center gap-2 bg-muted/20 rounded-lg px-2.5 py-1.5 border border-border/20">
                      <div className={cn(
                        'h-4 w-4 rounded border-2 flex items-center justify-center shrink-0',
                        idx < 7 ? 'border-emerald-500 bg-emerald-500' : 'border-border'
                      )}>
                        {idx < 7 && <CheckCircle2 className="h-2.5 w-2.5 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-medium truncate">{item.item}</p>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        {idx < 7 ? (
                          <span className="text-[9px] font-bold text-emerald-500">{85 + Math.floor(Math.random() * 15)}</span>
                        ) : (
                          <div className="w-12 h-1.5 bg-muted/50 rounded-full overflow-hidden">
                            <div className="h-full w-0 bg-blue-500 rounded-full" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Capture Photo Button */}
              <button className="w-full flex items-center justify-center gap-2 bg-blue-500/10 text-blue-500 rounded-xl py-2.5 mb-3 border border-blue-500/20 text-xs font-semibold">
                <Camera className="h-3.5 w-3.5" />
                Capture Photo (7/12)
              </button>

              {/* Submit Button */}
              <button className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-white rounded-xl py-2.5 text-xs font-bold shadow-lg shadow-emerald-500/25">
                <Send className="h-3.5 w-3.5" />
                Submit Inspection
              </button>
            </div>
          </div>

          {/* Description below phone */}
          <div className="max-w-md text-center mt-6 space-y-3">
            <h3 className="text-lg font-semibold">Mobile Inspection Suite</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Field inspectors use the CCRA Mobile Inspector app to conduct standardized 12-point inspections with GPS verification, photo documentation, and real-time STRYDER AI compliance scoring. All submissions are instantly synced to the Intelligence Nexus for DG review.
            </p>
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { icon: Navigation, label: 'GPS Verified', desc: 'Auto-locate & verify' },
                { icon: Camera, label: 'Photo Evidence', desc: 'Mandatory capture' },
                { icon: Sparkles, label: 'AI Scoring', desc: 'Real-time analysis' },
              ].map((feat, i) => (
                <GlassCard key={i} padding="sm" hover glow="teal" className="text-center">
                  <feat.icon className="h-5 w-5 mx-auto mb-1 text-emerald-500" />
                  <p className="text-xs font-semibold">{feat.label}</p>
                  <p className="text-[10px] text-muted-foreground">{feat.desc}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════
  // ── DIALOGS ─────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════

  // ── Day Detail Dialog ─────────────────────────────────
  function DayDetailDialog() {
    if (!selectedDay) return null
    return (
      <Dialog open={dayDialogOpen} onOpenChange={setDayDialogOpen}>
        <DialogContent showCloseButton className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>March {selectedDay.day}, 2026 — {selectedDay.inspections.length} Inspection{selectedDay.inspections.length > 1 ? 's' : ''}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {selectedDay.inspections.map((insp, idx) => (
              <div key={idx} className="border border-border/30 rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{insp.farmName}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn('h-2 w-2 rounded-full', inspectorColors[insp.inspectorName])} />
                      <span className="text-xs text-muted-foreground">{insp.inspectorName}</span>
                    </div>
                  </div>
                  <Badge variant={insp.status === 'completed' ? 'default' : insp.status === 'scheduled' ? 'secondary' : 'outline'} className="text-[10px]">
                    {insp.status === 'in-progress' ? 'In Progress' : insp.status.charAt(0).toUpperCase() + insp.status.slice(1)}
                  </Badge>
                </div>
                {insp.score && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Compliance Score:</span>
                    <span className={cn('font-bold', getScoreColor(insp.score))}>{insp.score}/100</span>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button size="xs" variant="outline" onClick={() => {
                    toast.success(`Reassignment initiated for ${insp.farmName}`)
                    setDayDialogOpen(false)
                  }}>
                    <RefreshCw className="h-3 w-3" />
                    Reassign
                  </Button>
                  <Button size="xs" variant="outline" onClick={() => {
                    toast.success(`Inspection at ${insp.farmName} postponed. Inspector notified.`)
                    setDayDialogOpen(false)
                  }}>
                    <Clock className="h-3 w-3" />
                    Postpone
                  </Button>
                  <Button size="xs" onClick={() => {
                    toast.success(`Additional inspector assigned to ${insp.farmName}`)
                    setDayDialogOpen(false)
                  }}>
                    <UserPlus className="h-3 w-3" />
                    Add Inspector
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // ── Inspector Detail Dialog ────────────────────────────
  function InspectorDetailDialog() {
    if (!selectedInspector) return null
    const insp = selectedInspector
    const sc = statusConfig[insp.status]
    // Mock history from existing inspections data
    const history = inspections.filter(i => i.inspectorName === insp.name).slice(0, 5)

    return (
      <Dialog open={inspectorDialogOpen} onOpenChange={setInspectorDialogOpen}>
        <DialogContent showCloseButton className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className={cn('h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm', inspectorColors[insp.name])}>
                {getInitials(insp.name)}
              </div>
              <div>
                <div>{insp.name}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge variant="secondary" className="text-[10px]">{insp.rank}</Badge>
                  <span className={cn('text-xs font-medium', sc.textColor)}>{sc.label}</span>
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {/* Contact & Location */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/20 rounded-lg p-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Contact</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs"><Phone className="h-3 w-3 text-blue-500" />{insp.phone}</div>
                  <div className="flex items-center gap-2 text-xs"><Mail className="h-3 w-3 text-blue-500" />{insp.email}</div>
                </div>
              </div>
              <div className="bg-muted/20 rounded-lg p-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Current Location</p>
                <div className="flex items-center gap-2 text-xs"><MapPin className="h-3 w-3 text-emerald-500" />{insp.currentLocation}</div>
                <p className="text-[10px] text-muted-foreground mt-1.5">Region: {insp.region}</p>
              </div>
            </div>

            {/* Performance Stats */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Performance Metrics</p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Total Completed', value: insp.totalCompleted, icon: CheckCircle2, color: 'text-emerald-500' },
                  { label: 'This Month', value: insp.completedThisMonth, icon: Calendar, color: 'text-blue-500' },
                  { label: 'Completion Rate', value: `${insp.completionRate}%`, icon: TrendingUp, color: 'text-amber-500' },
                  { label: 'Avg Score', value: insp.avgComplianceScore, icon: BarChart3, color: 'text-purple-500' },
                ].map((stat, i) => (
                  <div key={i} className="text-center p-3 bg-muted/20 rounded-lg">
                    <stat.icon className={cn('h-4 w-4 mx-auto mb-1', stat.color)} />
                    <p className="text-lg font-bold">{stat.value}</p>
                    <p className="text-[9px] text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Bar Chart (mock) */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Monthly Performance (Last 6 Months)</p>
              <div className="flex items-end gap-2 h-24 bg-muted/10 rounded-lg p-3">
                {[78, 85, 82, 91, 88, 96].map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[9px] font-bold">{val}%</span>
                    <div className="w-full bg-muted/30 rounded-t-sm overflow-hidden" style={{ height: '60px' }}>
                      <div
                        className={cn('w-full rounded-t-sm transition-all', val >= 90 ? 'bg-emerald-500' : val >= 80 ? 'bg-blue-500' : 'bg-amber-500')}
                        style={{ height: `${(val / 100) * 60}px`, marginTop: `${60 - (val / 100) * 60}px` }}
                      />
                    </div>
                    <span className="text-[8px] text-muted-foreground">
                      {['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Inspection History */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Recent Inspection History</p>
              <div className="space-y-2">
                {history.map((h) => (
                  <div key={h.id} className="flex items-center justify-between bg-muted/20 rounded-lg px-3 py-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium">{h.farmName}</p>
                      <p className="text-[10px] text-muted-foreground">{h.region} — {h.completedDate || h.scheduledDate}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {h.complianceScore !== undefined && (
                        <span className={cn('text-sm font-bold', getScoreColor(h.complianceScore))}>{h.complianceScore}</span>
                      )}
                      <Badge variant={h.status === 'completed' ? 'default' : 'secondary'} className="text-[10px]">
                        {h.status.charAt(0).toUpperCase() + h.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-border/30">
              <Button size="sm" className="flex-1" onClick={() => { toast.success(`New inspection assigned to ${insp.name}`); setInspectorDialogOpen(false) }}>
                <UserPlus className="h-3.5 w-3.5" />
                Assign New Inspection
              </Button>
              <Button size="sm" variant="outline" className="flex-1" onClick={() => { toast.success(`Performance report for ${insp.name} generated`) }}>
                <FileText className="h-3.5 w-3.5" />
                Generate Report
              </Button>
              <Button size="sm" variant="outline" onClick={() => { toast.success(`Calling ${insp.name}...`); setInspectorDialogOpen(false) }}>
                <Phone className="h-3.5 w-3.5" />
                Contact
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // ── Feed Entry Detail Dialog ───────────────────────────
  function FeedEntryDetailDialog() {
    if (!selectedFeedEntry) return null
    const entry = selectedFeedEntry

    // Mock score breakdown
    const scoreBreakdown = inspectionChecklist.map((item) => ({
      ...item,
      score: Math.max(40, Math.min(100, entry.score + Math.floor(Math.random() * 20) - 10)),
    }))

    return (
      <Dialog open={feedDialogOpen} onOpenChange={setFeedDialogOpen}>
        <DialogContent showCloseButton className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>{entry.farmName}</span>
              <Badge variant="outline" className={cn('text-[10px]', feedStatusConfig[entry.status].color)}>
                {feedStatusConfig[entry.status].label}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {/* Overview */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-muted/20 rounded-lg p-3 text-center">
                <p className={cn('text-3xl font-bold', getScoreColor(entry.score))}>{entry.score}</p>
                <p className="text-[10px] text-muted-foreground">Compliance Score</p>
              </div>
              <div className="bg-muted/20 rounded-lg p-3">
                <p className="text-[10px] text-muted-foreground uppercase mb-1">Inspector</p>
                <div className="flex items-center gap-2">
                  <span className={cn('h-5 w-5 rounded-full flex items-center justify-center text-white text-[8px] font-bold', inspectorColors[entry.inspectorName])}>{getInitials(entry.inspectorName)}</span>
                  <span className="text-xs font-medium">{entry.inspectorName}</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">{formatTimestamp(entry.timestamp)}</p>
              </div>
              <div className="bg-muted/20 rounded-lg p-3">
                <p className="text-[10px] text-muted-foreground uppercase mb-1">Location</p>
                <div className="flex items-center gap-1 text-xs"><MapPin className="h-3 w-3 text-emerald-500" />{entry.region}</div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1"><Navigation className="h-2.5 w-2.5" />{entry.gpsCoords}</div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-muted/20 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Inspector Summary</p>
              <p className="text-sm leading-relaxed">{entry.summary}</p>
            </div>

            {/* Photo Grid (placeholders) */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Photo Evidence ({entry.photoCount} photos)</p>
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: Math.min(4, entry.photoCount) }).map((_, i) => (
                  <div key={i} className="aspect-square bg-muted/30 rounded-lg border border-border/30 flex flex-col items-center justify-center gap-1">
                    <Camera className="h-5 w-5 text-muted-foreground/50" />
                    <span className="text-[9px] text-muted-foreground">Photo {i + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* GPS Map Placeholder */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">GPS Verification</p>
              <div className="h-32 bg-muted/20 rounded-lg border border-border/30 flex items-center justify-center gap-2">
                <Navigation className="h-5 w-5 text-emerald-500" />
                <div>
                  <p className="text-xs font-semibold">{entry.gpsCoords}</p>
                  <p className="text-[10px] text-emerald-500">GPS Location Verified</p>
                </div>
              </div>
            </div>

            {/* Score Breakdown */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Score Breakdown</p>
              <div className="space-y-1.5">
                {scoreBreakdown.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 text-xs">
                    <span className="w-40 truncate text-muted-foreground">{item.item}</span>
                    <div className="flex-1 h-1.5 bg-muted/30 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full', item.score >= 90 ? 'bg-emerald-500' : item.score >= 70 ? 'bg-amber-500' : 'bg-red-500')}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                    <span className={cn('w-8 text-right font-bold', getScoreColor(item.score))}>{item.score}</span>
                    <span className="w-8 text-right text-muted-foreground text-[10px]">{item.weight}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2 border-t border-border/30">
              <Button size="sm" className="flex-1" onClick={() => {
                toast.success(`Inspection report for ${entry.farmName} approved`)
                setFeedDialogOpen(false)
              }}>
                <ThumbsUp className="h-3.5 w-3.5" />
                Approve Report
              </Button>
              <Button size="sm" variant="outline" className="flex-1" onClick={() => {
                toast.info(`Revision requested from ${entry.inspectorName} for ${entry.farmName}`)
                setFeedDialogOpen(false)
              }}>
                <RefreshCw className="h-3.5 w-3.5" />
                Request Revision
              </Button>
              <Button size="sm" variant="destructive" onClick={() => {
                toast.warning(`${entry.farmName} flagged for DG review`)
                setFeedDialogOpen(false)
              }}>
                <Flag className="h-3.5 w-3.5" />
                Flag for Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // ═══════════════════════════════════════════════════════
  // ── RENDER ─────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Field Inspection Module"
        description="Inspector operations, live field submissions, scheduling, and mobile deployment overview"
      >
        <StryderBadge size="md" />
      </PageHeader>

      <Tabs defaultValue="calendar">
        <TabsList>
          <TabsTrigger value="calendar">
            <Calendar className="h-3.5 w-3.5" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="roster">
            <Users className="h-3.5 w-3.5" />
            Inspector Roster
          </TabsTrigger>
          <TabsTrigger value="feed">
            <Radio className="h-3.5 w-3.5" />
            Live Feed
          </TabsTrigger>
          <TabsTrigger value="mobile">
            <Smartphone className="h-3.5 w-3.5" />
            Mobile Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <CalendarView />
        </TabsContent>

        <TabsContent value="roster">
          <InspectorRoster />
        </TabsContent>

        <TabsContent value="feed">
          <LiveFeed />
        </TabsContent>

        <TabsContent value="mobile">
          <MobilePreview />
        </TabsContent>
      </Tabs>

      {/* AI Insight at bottom */}
      <div className="mt-6">
        <AiInsightCard
          title="Inspector Deployment Optimization"
          insight="Analysis of 475 inspections reveals Capt. Zubair Ali achieves the highest avg compliance score (94) but has the lowest throughput (63 total). Recommend redistributing 2 inspections from Col. Mehmood's Tirah Valley cluster to Capt. Ali upon return from leave on March 22. This balances workload and leverages his environmental compliance specialization for the upcoming Panjgur boundary violation follow-up."
          severity="warning"
          confidence={87}
        />
        <div className="flex gap-2 mt-3">
          <Button size="sm" onClick={() => toast.success('Inspector redistribution plan activated. Capt. Zubair Ali will receive 2 reassigned inspections effective March 22.')}>
            <Zap className="h-3.5 w-3.5" />
            Apply Redistribution Plan
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.info('Full deployment analysis report generated and sent to DG inbox.')}>
            <FileText className="h-3.5 w-3.5" />
            View Full Analysis
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.success('Workload balancing simulation started. Results will be available in the Analytics module.')}>
            <BarChart3 className="h-3.5 w-3.5" />
            Run Simulation
          </Button>
        </div>
      </div>

      {/* Dialogs */}
      <DayDetailDialog />
      <InspectorDetailDialog />
      <FeedEntryDetailDialog />
    </div>
  )
}
