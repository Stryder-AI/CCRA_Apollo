'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  Leaf, Search, Shield, ShieldCheck, CheckCircle2, Clock, FileText,
  ChevronDown, ChevronRight, Award, Trophy, Medal, Users, BarChart3,
  Package, MapPin, Phone, Mail, Building2, Calendar, AlertCircle,
  Sprout, FlaskConical, Factory, Truck, Microscope, Box, ArrowRight,
  Star, BadgeCheck, Globe, Hash, Scale, ClipboardCheck, HelpCircle,
  X, PenLine, ScanLine, Camera, Fingerprint, Link2, Database, XCircle
} from 'lucide-react'
import { farms } from '@/data/mock-farms'
import { batches } from '@/data/mock-traceability'
import { FEE_SCHEDULE, REGIONS, APPLICATION_STATUS_CONFIG } from '@/config/constants'
import { useLicenseStore } from '@/store/useLicenseStore'
import { getLicenseCategoryLabel, getStatusLabel } from '@/utils/license-helpers'
import type { ApplicationStatus } from '@/types/license'

// ─── TYPES ───
type TabKey = 'home' | 'track' | 'verify' | 'operators' | 'fees' | 'leaderboard' | 'faq'

interface ApplicationStep {
  title: string
  date: string
  status: 'completed' | 'current' | 'pending'
  details: string
  reviewer?: string
  notes?: string
}

// ─── HELPERS ───
function formatPKR(amount: number): string {
  return 'PKR ' + amount.toLocaleString('en-PK')
}

const activeFarms = farms.filter(f => f.status === 'active')
const uniqueRegions = new Set(farms.map(f => f.region))

// ─── STAT CARD ───
function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number; color: string }) {
  return (
    <div className={cn(
      'relative overflow-hidden rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] p-6 shadow-2xl',
      'hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 group cursor-default'
    )}>
      <div className={cn('absolute top-0 left-0 w-1.5 h-full', color)} />
      <div className="flex items-center justify-between">
        <div className="pl-3">
          <p className="text-sm font-medium text-green-400/70 uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className={cn('h-14 w-14 rounded-xl flex items-center justify-center bg-white/[0.05]')}>
          <Icon className={cn('h-7 w-7', color.replace('bg-', 'text-'))} />
        </div>
      </div>
    </div>
  )
}

// ─── DETAIL MODAL ───
function DetailModal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-[#0d1f0d]/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 max-w-lg w-full max-h-[80vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-[#0d1f0d]/95 backdrop-blur-2xl border-b border-white/[0.08] px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-full hover:bg-white/[0.08] flex items-center justify-center transition-colors">
            <X className="h-4 w-4 text-green-400/70" />
          </button>
        </div>
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  )
}

// ─── BARCODE SCANNER MODAL ───
function BarcodeScannerModal({ open, onClose, onSubmit }: { open: boolean; onClose: () => void; onSubmit: (code: string) => void }) {
  const [manualCode, setManualCode] = useState('')
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-[#0d1f0d]/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 max-w-md w-full animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="border-b border-white/[0.08] px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ScanLine className="h-5 w-5 text-green-400" /> Barcode Scanner
          </h3>
          <button onClick={onClose} className="h-8 w-8 rounded-full hover:bg-white/[0.08] flex items-center justify-center transition-colors">
            <X className="h-4 w-4 text-green-400/70" />
          </button>
        </div>
        <div className="p-6">
          {/* Simulated camera viewfinder */}
          <div className="relative w-full h-48 bg-black/40 rounded-xl border border-white/[0.08] overflow-hidden mb-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <Camera className="h-12 w-12 text-green-500/30" />
            </div>
            {/* Scanning line animation */}
            <div className="absolute left-4 right-4 h-0.5 bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" style={{ top: '50%' }} />
            {/* Corner markers */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-green-500/60 rounded-tl" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-green-500/60 rounded-tr" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-green-500/60 rounded-bl" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-green-500/60 rounded-br" />
            <p className="absolute bottom-4 left-0 right-0 text-center text-xs text-green-400/60">Position barcode within frame</p>
          </div>
          <p className="text-xs text-green-400/70 text-center mb-4">Camera access simulated. Enter code manually below.</p>
          <div className="flex gap-3">
            <input
              type="text"
              value={manualCode}
              onChange={e => setManualCode(e.target.value)}
              placeholder="Enter batch code manually..."
              className="flex-1 px-4 py-2.5 bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-green-400/50 rounded-lg outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 text-sm font-mono"
            />
            <button
              onClick={() => { if (manualCode.trim()) { onSubmit(manualCode.trim()); onClose() } }}
              className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-medium rounded-lg transition-all shadow-lg shadow-green-900/30 text-sm"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN PAGE ───
export default function PublicPortalPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('home')

  const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: 'home', label: 'Home', icon: Leaf },
    { key: 'track', label: 'Track Application', icon: Search },
    { key: 'verify', label: 'Verify Product', icon: ShieldCheck },
    { key: 'operators', label: 'Licensed Operators', icon: Users },
    { key: 'fees', label: 'Fee Schedule', icon: Scale },
    { key: 'leaderboard', label: 'Compliance Leaders', icon: Trophy },
    { key: 'faq', label: 'FAQ & Contact', icon: HelpCircle },
  ]

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="w-full bg-[#061a06]/80 backdrop-blur-xl border-b border-white/[0.08] sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    'flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-all border-b-2',
                    activeTab === tab.key
                      ? 'border-green-500 text-green-400 bg-white/[0.05]'
                      : 'border-transparent text-green-300/60 hover:text-green-300'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {activeTab === 'home' && <HeroSection />}
        {activeTab === 'track' && <TrackApplicationSection />}
        {activeTab === 'verify' && <VerifyProductSection />}
        {activeTab === 'operators' && <OperatorsSection />}
        {activeTab === 'fees' && <FeeScheduleSection />}
        {activeTab === 'leaderboard' && <LeaderboardSection />}
        {activeTab === 'faq' && <FAQSection />}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SECTION 1: HERO / WELCOME
// ═══════════════════════════════════════════════════════════════
function HeroSection() {
  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-900 via-emerald-800 to-green-900 p-10 mb-8 shadow-2xl border border-white/[0.08]">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 h-72 w-72 rounded-full bg-green-400/10 blur-3xl" />
          <div className="absolute bottom-10 left-10 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-green-600/5 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-40 w-40 rounded-full bg-teal-400/10 blur-3xl" />
        </div>
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-white/[0.1] backdrop-blur-xl border border-white/[0.15] flex items-center justify-center shadow-lg shadow-green-900/50">
              <Shield className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            Welcome to CCRA Public Portal
          </h1>
          <p className="text-xl text-green-200 font-medium mb-2">
            Transparency, Accountability, and Innovation in Cannabis Regulation
          </p>
          <p className="text-sm text-green-300/70 max-w-2xl mx-auto leading-relaxed">
            The Cannabis Control &amp; Regulatory Authority of Pakistan provides this portal
            for citizens, stakeholders, and international partners to access public information
            about licensed cannabis operations, verify products, and track applications.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs bg-white/[0.08] backdrop-blur border border-white/[0.1] rounded-full px-4 py-1.5 text-green-300">
              <Globe className="h-3.5 w-3.5" /> ISO 17025 Compliant Labs
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs bg-white/[0.08] backdrop-blur border border-white/[0.1] rounded-full px-4 py-1.5 text-green-300">
              <ShieldCheck className="h-3.5 w-3.5" /> GMP Certified Processing
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs bg-white/[0.08] backdrop-blur border border-white/[0.1] rounded-full px-4 py-1.5 text-green-300">
              <BarChart3 className="h-3.5 w-3.5" /> AI-Powered Monitoring
            </span>
          </div>

          {/* Apply for License CTA */}
          <div className="mt-8">
            <Link
              href="/register"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold text-lg px-10 py-4 rounded-xl shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 hover:scale-105 transition-all duration-300 group border border-green-400/20"
            >
              <PenLine className="h-6 w-6" />
              Apply for a Cannabis License
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-green-400/60 text-xs mt-3">9 license categories available — Cultivation, Processing, Research, Export & more</p>
          </div>
        </div>
      </div>

      {/* Apply Banner — Standalone CTA */}
      <div className="mb-8 rounded-2xl border border-green-500/30 bg-white/[0.03] backdrop-blur-xl p-8 shadow-2xl shadow-green-900/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-900/40 flex-shrink-0 border border-green-400/20">
              <PenLine className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Ready to Apply for a License?</h2>
              <p className="text-green-200 mt-1">Start your application online — 9 license categories including Cultivation, Processing, Testing, Distribution, Research, Export/Import, and more.</p>
            </div>
          </div>
          <Link
            href="/register"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg shadow-green-900/30 hover:shadow-xl transition-all duration-300 group border border-green-400/20"
          >
            Start Application
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Leaf} label="Total Licensed Farms" value={25} color="bg-green-600" />
        <StatCard icon={CheckCircle2} label="Active Licenses" value={22} color="bg-emerald-500" />
        <StatCard icon={MapPin} label="Regions Covered" value={11} color="bg-teal-500" />
        <StatCard icon={Package} label="Batches Tracked" value={8} color="bg-green-700" />
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/register" className="block group">
          <div className={cn(
            'relative overflow-hidden rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-green-500/30 p-6 shadow-2xl',
            'hover:bg-white/[0.06] hover:border-green-500/50 hover:shadow-green-900/20 transition-all duration-300 h-full'
          )}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-bl-full" />
            <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br from-green-600 to-emerald-600 shadow-lg shadow-green-900/30">
              <PenLine className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-green-300">Apply for a License</h3>
            <p className="text-sm text-green-200 leading-relaxed">Submit your cannabis license application online. 9 categories available with step-by-step guidance.</p>
            <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-green-400 group-hover:gap-2 transition-all">
              Start Now <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </Link>
        <QuickAccessCard
          icon={Search}
          title="Track Your Application"
          description="Enter your reference number to check the real-time status of your license application with detailed progress timeline."
          accentColor="blue"
        />
        <QuickAccessCard
          icon={ShieldCheck}
          title="Verify a Product"
          description="Scan or enter a batch code to verify product authenticity, lab results, and complete chain of custody information."
          accentColor="green"
        />
        <QuickAccessCard
          icon={Users}
          title="Licensed Operators"
          description="Browse the public directory of all CCRA-licensed cannabis operators with compliance scores and licensing details."
          accentColor="purple"
        />
      </div>
    </div>
  )
}

function QuickAccessCard({ icon: Icon, title, description, accentColor }: {
  icon: React.ElementType; title: string; description: string; accentColor: string
}) {
  const iconColors: Record<string, string> = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
  }
  return (
    <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] p-6 hover:bg-white/[0.06] hover:border-white/[0.12] hover:shadow-2xl transition-all duration-300 cursor-default group">
      <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-4 bg-white/[0.05] border border-white/[0.08]">
        <Icon className={cn('h-6 w-6', iconColors[accentColor] || 'text-green-400')} />
      </div>
      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-green-300">{title}</h3>
      <p className="text-sm text-green-200 leading-relaxed">{description}</p>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SECTION 2: APPLICATION STATUS TRACKER
// ═══════════════════════════════════════════════════════════════
function generateTimelineSteps(status: ApplicationStatus, submissionDate?: string): ApplicationStep[] {
  const dateStr = submissionDate
    ? new Date(submissionDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'N/A'

  const allSteps: { title: string; details: string }[] = [
    { title: 'Application Submitted', details: 'Application form, supporting documents, and fees received and logged into the CCRA system.' },
    { title: 'Documents Verified', details: 'All submitted documents verified for completeness and authenticity.' },
    { title: 'Screening Review', details: 'Initial screening review of application eligibility and completeness.' },
    { title: 'Technical Review', details: 'Detailed technical assessment of the application by the licensing team.' },
    { title: 'Security Clearance', details: 'Background checks and security clearance processing for all key personnel.' },
    { title: 'Inspection Scheduled', details: 'Physical site inspection scheduled and coordination underway.' },
    { title: 'Inspection Complete', details: 'Site inspection completed. Findings being compiled for final review.' },
    { title: 'Final Decision', details: 'Application forwarded for final decision by the Director General.' },
  ]

  const statusProgressMap: Record<string, { completed: number; denied?: boolean; rfiNote?: boolean }> = {
    SUBMITTED: { completed: 1 },
    UNDER_REVIEW_SCREENING: { completed: 2 },
    RFI_ISSUED: { completed: 2, rfiNote: true },
    UNDER_REVIEW_TECHNICAL: { completed: 3 },
    SECURITY_CLEARANCE_PENDING: { completed: 4 },
    INSPECTION_SCHEDULED: { completed: 5 },
    INSPECTION_COMPLETE: { completed: 6 },
    APPROVED: { completed: 8 },
    APPROVED_WITH_CONDITIONS: { completed: 8 },
    DENIED: { completed: 2, denied: true },
    LAPSED: { completed: 1 },
    SUSPENDED: { completed: 8 },
    REVOKED: { completed: 8 },
    EXPIRED: { completed: 8 },
    RENEWAL_IN_PROGRESS: { completed: 8 },
    DRAFT: { completed: 0 },
  }

  const progress = statusProgressMap[status] ?? { completed: 0 }
  const completedCount = progress.completed

  return allSteps.map((step, idx) => {
    const stepNum = idx + 1
    let stepStatus: 'completed' | 'current' | 'pending'
    let stepDate = 'Pending'

    if (progress.denied && stepNum > completedCount) {
      stepStatus = 'pending'
    } else if (stepNum < completedCount) {
      stepStatus = 'completed'
      stepDate = stepNum === 1 ? dateStr : ''
    } else if (stepNum === completedCount) {
      stepStatus = completedCount === allSteps.length ? 'completed' : 'completed'
      stepDate = stepNum === 1 ? dateStr : ''
    } else if (stepNum === completedCount + 1 && !progress.denied) {
      stepStatus = 'current'
      stepDate = 'In Progress'
    } else {
      stepStatus = 'pending'
    }

    if (completedCount >= allSteps.length) {
      stepStatus = 'completed'
      stepDate = stepNum === 1 ? dateStr : ''
    }

    const notes = progress.rfiNote && stepNum === completedCount + 1
      ? 'A Request for Information (RFI) has been issued. Please check your email and respond promptly.'
      : undefined

    return { ...step, date: stepDate, status: stepStatus, notes }
  })
}

function TrackApplicationSection() {
  const [refNumber, setRefNumber] = useState('CCRA-REG-2026-0042')
  const [tracked, setTracked] = useState(false)
  const [expandedStep, setExpandedStep] = useState<number | null>(null)
  const [notFound, setNotFound] = useState(false)

  const licenses = useLicenseStore((s) => s.licenses)

  const hardcodedSteps: ApplicationStep[] = [
    {
      title: 'Application Submitted',
      date: 'March 1, 2026',
      status: 'completed',
      details: 'Application form, supporting documents, and application fee of PKR 500,000 received and logged into the CCRA system.',
      reviewer: 'System (Auto)',
      notes: 'Reference number CCRA-REG-2026-0042 generated. Applicant notified via email and SMS.'
    },
    {
      title: 'Documents Verified',
      date: 'March 5, 2026',
      status: 'completed',
      details: 'All submitted documents verified for completeness and authenticity. CNIC validated via NADRA, land title verified via revenue department records, agricultural assessment report confirmed by provincial agriculture department.',
      reviewer: 'Ayesha Malik — Document Verification Officer',
      notes: 'CNIC Match: Confirmed. Land Title: Verified (22 hectares, Swat District). Agricultural Assessment: Grade A suitability.'
    },
    {
      title: 'AI Pre-Screening',
      date: 'March 7, 2026',
      status: 'completed',
      details: 'STRYDER AI engine performed automated risk assessment, satellite imagery analysis, environmental impact pre-screening, and compliance history check. No red flags detected.',
      reviewer: 'STRYDER AI Engine v2.4',
      notes: 'Risk Score: 12/100 (Low Risk). Satellite Analysis: Land boundaries confirmed. Environmental: No protected zones within 5km. Historical: No prior violations.'
    },
    {
      title: 'Under Review by Licensing Officer',
      date: 'March 12, 2026',
      status: 'current',
      details: 'Application assigned to regional licensing officer for detailed review. Physical site inspection to be scheduled. Applicant may be contacted for additional information.',
      reviewer: 'Major Tariq Hussain — Regional Licensing Officer (KP)',
      notes: 'Site inspection tentatively scheduled for March 20, 2026. Applicant has been contacted for pre-inspection coordination.'
    },
    {
      title: 'Final Approval',
      date: 'Pending',
      status: 'pending',
      details: 'Upon successful completion of the review and site inspection, the application will be forwarded to the Director General for final approval and license issuance.',
      reviewer: 'Director General, CCRA',
      notes: 'License, if approved, will be valid for one year from date of issuance.'
    },
  ]

  const matchedLicense = licenses.find(
    (l) => l.applicationId === refNumber || l.licenseNumber === refNumber
  )

  const isHardcodedDemo = refNumber.trim() === 'CCRA-REG-2026-0042'

  const useHardcoded = isHardcodedDemo && !matchedLicense
  const applicationFound = useHardcoded || !!matchedLicense

  const steps: ApplicationStep[] = useHardcoded
    ? hardcodedSteps
    : matchedLicense
      ? generateTimelineSteps(matchedLicense.status, matchedLicense.applicationDate)
      : []

  const applicationTypeLabel = useHardcoded
    ? 'Cultivation License'
    : matchedLicense
      ? getLicenseCategoryLabel(matchedLicense.category)
      : ''

  const applicationStatusLabel = matchedLicense
    ? getStatusLabel(matchedLicense.status)
    : useHardcoded
      ? 'Under Review'
      : ''

  const applicantNameLabel = matchedLicense?.applicantName ?? (useHardcoded ? '' : '')

  const handleTrack = () => {
    setTracked(true)
    setNotFound(!applicationFound && refNumber.trim() !== '')
    setExpandedStep(null)
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Application Status Tracker</h2>
        <p className="text-green-200">Track the progress of your CCRA license application in real-time</p>
      </div>

      {/* Search Box */}
      <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-2xl p-6 mb-8">
        <label className="block text-sm font-medium text-green-200 mb-2">
          Enter your reference number
        </label>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-400/50" />
            <input
              type="text"
              value={refNumber}
              onChange={e => setRefNumber(e.target.value)}
              placeholder="e.g., CCRA-REG-2026-0001"
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-green-400/50 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 outline-none text-sm font-mono"
            />
          </div>
          <button
            onClick={handleTrack}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-medium rounded-lg transition-all shadow-lg shadow-green-900/30 flex items-center gap-2"
          >
            <Search className="h-4 w-4" /> Track
          </button>
        </div>
      </div>

      {/* Results */}
      {tracked && notFound && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center backdrop-blur-xl">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-red-300 mb-1">No Application Found</h3>
            <p className="text-sm text-red-300/80">
              No application matching reference <span className="font-mono font-semibold text-red-300">{refNumber}</span> was found.
              Please double-check the reference number and try again.
            </p>
          </div>
        </div>
      )}

      {tracked && applicationFound && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Application Header */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 mb-6 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-green-400/70 font-medium">Application Reference</p>
                <p className="text-lg font-bold font-mono text-white">{refNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-400/70 font-medium">Application Type</p>
                <p className="text-lg font-bold text-white">{applicationTypeLabel}</p>
              </div>
            </div>
            {(applicantNameLabel || applicationStatusLabel) && (
              <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
                {applicantNameLabel && (
                  <div>
                    <p className="text-sm text-green-400/70 font-medium">Applicant</p>
                    <p className="text-base font-semibold text-white">{applicantNameLabel}</p>
                  </div>
                )}
                {applicationStatusLabel && (
                  <div className="text-right">
                    <p className="text-sm text-green-400/70 font-medium">Status</p>
                    <p className="text-base font-semibold text-green-400">{applicationStatusLabel}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="space-y-0 mb-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                {/* Connector line */}
                {idx < steps.length - 1 && (
                  <div className={cn(
                    'absolute left-6 top-14 w-0.5 h-full -translate-x-1/2',
                    step.status === 'completed' ? 'bg-green-500/40' : 'bg-white/[0.06]'
                  )} />
                )}

                <div
                  className={cn(
                    'relative flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all',
                    'hover:bg-white/[0.04]',
                    expandedStep === idx && 'bg-white/[0.04]'
                  )}
                  onClick={() => setExpandedStep(expandedStep === idx ? null : idx)}
                >
                  {/* Status icon */}
                  <div className={cn(
                    'relative z-10 flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center',
                    step.status === 'completed' && 'bg-green-600 text-white shadow-lg shadow-green-900/40',
                    step.status === 'current' && 'bg-blue-500 text-white animate-pulse shadow-lg shadow-blue-900/40',
                    step.status === 'pending' && 'bg-white/[0.06] text-green-400/40 border border-white/[0.08]'
                  )}>
                    {step.status === 'completed' && <CheckCircle2 className="h-6 w-6" />}
                    {step.status === 'current' && <Clock className="h-6 w-6" />}
                    {step.status === 'pending' && <Clock className="h-6 w-6" />}
                  </div>

                  {/* Step info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-semibold text-white">{step.title}</h4>
                        {idx === 2 && step.status === 'completed' && (
                          <span className="inline-flex items-center gap-1 bg-purple-500/20 text-purple-400 text-xs font-bold px-2 py-0.5 rounded-full border border-purple-500/20">
                            <Sprout className="h-3 w-3" /> STRYDER AI
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'text-xs font-medium px-2.5 py-1 rounded-full',
                          step.status === 'completed' && 'bg-green-500/20 text-green-400',
                          step.status === 'current' && 'bg-blue-500/20 text-blue-400',
                          step.status === 'pending' && 'bg-white/[0.05] text-green-400/50'
                        )}>
                          {step.status === 'completed' ? 'Completed' : step.status === 'current' ? 'In Progress' : 'Pending'}
                        </span>
                        {expandedStep === idx ? <ChevronDown className="h-4 w-4 text-green-400/50" /> : <ChevronRight className="h-4 w-4 text-green-400/50" />}
                      </div>
                    </div>
                    <p className="text-sm text-green-400/60 mt-0.5">{step.date}</p>

                    {/* Expanded details */}
                    {expandedStep === idx && (
                      <div className="mt-3 bg-white/[0.03] border border-white/[0.06] rounded-lg p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <p className="text-sm text-green-200 leading-relaxed mb-3">{step.details}</p>
                        {step.reviewer && (
                          <div className="flex items-center gap-2 text-xs text-green-400/60 mb-1">
                            <BadgeCheck className="h-3.5 w-3.5 text-green-500" />
                            <span className="font-medium">Reviewed by:</span> {step.reviewer}
                          </div>
                        )}
                        {step.notes && (
                          <div className="mt-2 bg-green-500/10 border border-green-500/10 rounded-md p-3 text-xs text-green-300 leading-relaxed">
                            <span className="font-semibold">Notes:</span> {step.notes}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Info */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 space-y-2 shadow-2xl">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-400" />
              <p className="text-sm font-medium text-green-200">Estimated completion: 7-10 business days</p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-400" />
              <p className="text-sm text-green-200">Contact <span className="font-mono font-medium text-green-400">licensing@ccra.gov.pk</span> for inquiries</p>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-blue-400" />
              <p className="text-sm text-green-200">Helpline: <span className="font-mono font-medium text-green-400">+92-51-111-CCRA (2272)</span></p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SECTION 3: PRODUCT VERIFICATION
// ═══════════════════════════════════════════════════════════════
function VerifyProductSection() {
  const [batchCode, setBatchCode] = useState('CCRA-BTH-2025-001')
  const [verified, setVerified] = useState(false)
  const [stageModal, setStageModal] = useState<number | null>(null)
  const [scannerOpen, setScannerOpen] = useState(false)

  const batch = batches.find(b => b.batchCode === batchCode) || batches[0]

  const stageIcons: Record<string, React.ElementType> = {
    seed: Sprout,
    cultivation: Leaf,
    harvest: Package,
    processing: Factory,
    'lab-testing': Microscope,
    packaging: Box,
    distribution: Truck,
  }

  const stageLabels: Record<string, string> = {
    seed: 'Seed Bank',
    cultivation: 'Cultivation',
    harvest: 'Harvest',
    processing: 'Processing',
    'lab-testing': 'Lab Testing',
    packaging: 'Packaging',
    distribution: 'Distribution',
  }

  // Simulated blockchain and evidence data per stage
  const stageEvidence: Record<string, { gps: string; temp: string; conditions: string; hash: string; photo: string }> = {
    seed: { gps: '34.7723° N, 72.3612° E', temp: '22°C', conditions: 'Controlled vault, 45% humidity', hash: '0x7f2c4d8e...a4b8', photo: 'Certified seed packets in sealed vault compartment #14' },
    cultivation: { gps: '34.7701° N, 72.3589° E', temp: '28°C', conditions: 'Open field, irrigated', hash: '0x3a9b1f7c...d2e1', photo: 'Aerial drone capture of cultivation plot A-7, 22 hectares' },
    harvest: { gps: '34.7701° N, 72.3589° E', temp: '24°C', conditions: 'Manual harvest, sorted', hash: '0x5e8d2c4a...f7b3', photo: 'Harvest crew with weighed bundles at field station' },
    processing: { gps: '34.7680° N, 72.3550° E', temp: '20°C', conditions: 'GMP facility, Class B cleanroom', hash: '0x1c7f9b3e...a6d4', photo: 'Processing line at CCRA-certified facility, batch tagged' },
    'lab-testing': { gps: '33.6844° N, 73.0479° E', temp: '21°C', conditions: 'ISO 17025 Lab', hash: '0x8b4e2d6f...c1a9', photo: 'Sample vials in chromatography queue, Lab ID: CCRA-LAB-07' },
    packaging: { gps: '34.7680° N, 72.3550° E', temp: '18°C', conditions: 'Sealed packaging line', hash: '0x2f6a8c1d...e5b7', photo: 'Finished packages with QR labels and tamper seals applied' },
    distribution: { gps: '33.6844° N, 73.0479° E', temp: '22°C', conditions: 'Temperature-controlled vehicle', hash: '0x9d3b7e5a...f2c8', photo: 'Loaded transport vehicle with GPS tracker activated' },
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Product Verification</h2>
        <p className="text-green-200">Verify the authenticity and compliance of any CCRA-regulated cannabis product</p>
      </div>

      {/* Search */}
      <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-2xl p-6 mb-8">
        <label className="block text-sm font-medium text-green-200 mb-2">
          Enter Batch Code
        </label>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-400/50" />
            <input
              type="text"
              value={batchCode}
              onChange={e => setBatchCode(e.target.value)}
              placeholder="e.g., CCRA-BTH-2025-001"
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-green-400/50 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 outline-none text-sm font-mono"
            />
          </div>
          <button
            onClick={() => setScannerOpen(true)}
            className="px-6 py-3 bg-white/[0.05] border border-white/10 hover:bg-white/[0.08] text-green-400 font-medium rounded-lg transition-all flex items-center gap-2"
          >
            <ScanLine className="h-4 w-4" /> Scan Barcode
          </button>
          <button
            onClick={() => setVerified(true)}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-medium rounded-lg transition-all shadow-lg shadow-green-900/30 flex items-center gap-2"
          >
            <ShieldCheck className="h-4 w-4" /> Verify
          </button>
        </div>
      </div>

      {/* Barcode Scanner Modal */}
      <BarcodeScannerModal
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onSubmit={(code) => { setBatchCode(code); setVerified(true) }}
      />

      {verified && batch && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
          {/* Verification Badge */}
          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5 flex items-center gap-4 backdrop-blur-xl">
            <div className="h-14 w-14 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-900/50">
              <ShieldCheck className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Product Verified</h3>
              <p className="text-sm text-green-300">This product has been verified by CCRA and meets all regulatory requirements</p>
            </div>
          </div>

          {/* Batch Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Batch Info */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-2xl">
              <h4 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-4">Batch Information</h4>
              <div className="space-y-3">
                <InfoRow label="Batch Code" value={batch.batchCode} mono />
                <InfoRow label="Farm Name" value={batch.farmName} />
                <InfoRow label="Strain" value={batch.strain} />
                <InfoRow label="Quantity" value={`${batch.quantity.toLocaleString()} ${batch.unit}`} />
                <InfoRow label="Current Stage" value={stageLabels[batch.currentStage] || batch.currentStage} />
                <InfoRow label="Created" value={batch.createdDate} />
                <InfoRow label="Est. Completion" value={batch.estimatedCompletion || 'TBD'} />
              </div>
            </div>

            {/* Lab Results - Enhanced Visual Dashboard */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-2xl">
              <h4 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-4">Laboratory Results</h4>
              {batch.labResults ? (
                <div className="space-y-4">
                  {/* THC/CBD Circular Indicators */}
                  <div className="flex items-center gap-6 justify-center mb-2">
                    <CircularProgress label="THC" value={batch.labResults.thcPercent} max={30} color="green" />
                    <CircularProgress label="CBD" value={batch.labResults.cbdPercent} max={30} color="emerald" />
                  </div>

                  {/* Moisture Gauge */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-green-400/70">Moisture</span>
                      <span className="text-xs font-mono text-green-300">{batch.labResults.moisture}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all"
                        style={{ width: `${Math.min(100, batch.labResults.moisture * 5)}%` }}
                      />
                    </div>
                  </div>

                  {/* Pass/Fail Badges */}
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <PassFailBadge label="Contaminants" pass={batch.labResults.contaminants === 'pass'} />
                    <PassFailBadge label="Pesticides" pass={batch.labResults.pesticides === 'pass'} />
                    <PassFailBadge label="Heavy Metals" pass={batch.labResults.heavyMetals === 'pass'} />
                  </div>

                  {/* Lab Certification */}
                  <div className="mt-3 bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <ClipboardCheck className="h-4 w-4 text-green-500" />
                      <span className="text-xs font-semibold text-green-400">Lab Certification</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-green-400/60">Lab</span>
                        <span className="text-xs text-green-200">{batch.labResults.labName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-green-400/60">Tested</span>
                        <span className="text-xs text-green-200">{batch.labResults.testedDate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-green-400/60">Certificate</span>
                        <span className="text-xs font-mono text-green-300">{batch.labResults.certificateId || 'Pending'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-400 text-sm">
                  <AlertCircle className="h-4 w-4" /> Lab testing not yet completed
                </div>
              )}
            </div>
          </div>

          {/* Chain of Custody Pipeline - Enhanced with larger stage cards */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-2xl">
            <h4 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-6">Chain of Custody</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {batch.stages.map((stage, idx) => {
                const Icon = stageIcons[stage.type] || Package
                const evidence = stageEvidence[stage.type]
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <button
                      onClick={() => setStageModal(idx)}
                      className={cn(
                        'w-full flex flex-col items-center gap-2 p-4 rounded-xl transition-all cursor-pointer border',
                        'hover:bg-white/[0.06] hover:border-white/[0.12]',
                        stage.status === 'completed' && 'bg-white/[0.04] border-green-500/20',
                        stage.status === 'in-progress' && 'bg-white/[0.04] border-blue-500/20',
                        stage.status === 'pending' && 'bg-white/[0.02] border-white/[0.04] opacity-50'
                      )}
                    >
                      <div className={cn(
                        'h-14 w-14 rounded-xl flex items-center justify-center',
                        stage.status === 'completed' && 'bg-green-600/20 text-green-400 shadow-lg shadow-green-900/20',
                        stage.status === 'in-progress' && 'bg-blue-500/20 text-blue-400 animate-pulse shadow-lg shadow-blue-900/20',
                        stage.status === 'pending' && 'bg-white/[0.04] text-green-400/30'
                      )}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-xs font-medium text-green-200 text-center leading-tight">
                        {stageLabels[stage.type]}
                      </span>
                      <span className="text-[10px] text-green-400/50 font-mono">
                        {stage.startDate || '--'}
                      </span>
                      {stage.status === 'completed' && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      )}
                    </button>
                    {/* Connector line between cards (horizontal on larger screens) */}
                    {idx < batch.stages.length - 1 && (
                      <div className={cn(
                        'hidden lg:block absolute',
                      )} />
                    )}
                  </div>
                )
              })}
            </div>
            {/* Horizontal connector bar */}
            <div className="hidden lg:flex items-center justify-center mt-2 px-8">
              <div className="flex-1 flex items-center">
                {batch.stages.map((stage, idx) => (
                  idx < batch.stages.length - 1 ? (
                    <div key={idx} className="flex-1 flex items-center">
                      <div className={cn(
                        'h-0.5 w-full',
                        stage.status === 'completed' ? 'bg-green-500/40' : 'bg-white/[0.06]'
                      )} />
                    </div>
                  ) : null
                ))}
              </div>
            </div>
          </div>

          {/* Blockchain Verification Badge */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Link2 className="h-5 w-5 text-emerald-400" />
              </div>
              <h4 className="text-sm font-bold text-green-400 uppercase tracking-wider">Blockchain Ledger Entry</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                <p className="text-[10px] text-green-400/60 uppercase tracking-wider mb-1">Hash</p>
                <p className="text-sm font-mono text-green-300 truncate">0x7f2c4d8e...a4b8</p>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                <p className="text-[10px] text-green-400/60 uppercase tracking-wider mb-1">Block</p>
                <p className="text-sm font-mono text-green-300">#1,247,893</p>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                <p className="text-[10px] text-green-400/60 uppercase tracking-wider mb-1">Timestamp</p>
                <p className="text-sm font-mono text-green-300">2025-10-18 14:32 UTC</p>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                <p className="text-[10px] text-green-400/60 uppercase tracking-wider mb-1">Network</p>
                <p className="text-sm text-green-300">CCRA Hyperledger</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                <p className="text-[10px] text-green-400/60 uppercase tracking-wider mb-1">Status</p>
                <p className="text-sm font-semibold text-green-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Verified
                </p>
              </div>
            </div>
          </div>

          {/* Stage detail modal - Enhanced with photo evidence, GPS, blockchain hash */}
          <DetailModal
            open={stageModal !== null}
            onClose={() => setStageModal(null)}
            title={stageModal !== null ? `${stageLabels[batch.stages[stageModal].type]} Details` : ''}
          >
            {stageModal !== null && (() => {
              const stage = batch.stages[stageModal]
              const evidence = stageEvidence[stage.type]
              return (
                <div className="space-y-4">
                  {/* Stage Photo Evidence */}
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Camera className="h-4 w-4 text-green-500" />
                      <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">Photo Evidence</span>
                    </div>
                    <div className="h-32 bg-black/30 rounded-lg border border-white/[0.06] flex items-center justify-center mb-2">
                      <div className="text-center">
                        <Camera className="h-8 w-8 text-green-500/30 mx-auto mb-1" />
                        <p className="text-[10px] text-green-400/40">Photographic Record</p>
                      </div>
                    </div>
                    <p className="text-xs text-green-300/70 italic">{evidence?.photo}</p>
                  </div>

                  <div className="space-y-2">
                    <InfoRow label="Stage" value={stageLabels[stage.type]} />
                    <InfoRow label="Status" value={stage.status === 'completed' ? 'Completed' : stage.status === 'in-progress' ? 'In Progress' : 'Pending'} />
                    {stage.startDate && <InfoRow label="Start Date" value={stage.startDate} />}
                    {stage.endDate && <InfoRow label="End Date" value={stage.endDate} />}
                  </div>

                  {/* GPS Location */}
                  {evidence && (
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-blue-400" />
                        <span className="text-xs text-green-400/70">GPS Location:</span>
                        <span className="text-xs font-mono text-green-300">{evidence.gps}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-green-400/70 ml-5">Temperature:</span>
                        <span className="text-xs text-green-300">{evidence.temp}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-green-400/70 ml-5">Conditions:</span>
                        <span className="text-xs text-green-300">{evidence.conditions}</span>
                      </div>
                    </div>
                  )}

                  {/* Handler with CNIC verification */}
                  {stage.handler && (
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Fingerprint className="h-3.5 w-3.5 text-green-500" />
                          <span className="text-xs text-green-400/70">Handler:</span>
                          <span className="text-xs text-green-200">{stage.handler}</span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">
                          <BadgeCheck className="h-3 w-3" /> CNIC Verified
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Blockchain Hash & Digital Signature */}
                  {evidence && (
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <Database className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-xs text-green-400/70">Blockchain Hash:</span>
                        <span className="text-xs font-mono text-emerald-400">{evidence.hash}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
                        <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          Digitally Signed
                        </span>
                      </div>
                    </div>
                  )}

                  {stage.notes && (
                    <div className="bg-green-500/10 border border-green-500/10 rounded-lg p-3 text-sm text-green-300">{stage.notes}</div>
                  )}
                </div>
              )
            })()}
          </DetailModal>

          {/* QR & Export */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* QR Code placeholder */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-2xl flex items-center gap-6">
              <div className="h-28 w-28 bg-white/[0.04] border-2 border-dashed border-white/[0.1] rounded-xl flex items-center justify-center flex-shrink-0">
                <svg width="80" height="80" viewBox="0 0 80 80" className="text-green-400/40">
                  <rect x="5" y="5" width="25" height="25" rx="2" fill="currentColor" />
                  <rect x="50" y="5" width="25" height="25" rx="2" fill="currentColor" />
                  <rect x="5" y="50" width="25" height="25" rx="2" fill="currentColor" />
                  <rect x="12" y="12" width="11" height="11" rx="1" fill="#0d1f0d" />
                  <rect x="57" y="12" width="11" height="11" rx="1" fill="#0d1f0d" />
                  <rect x="12" y="57" width="11" height="11" rx="1" fill="#0d1f0d" />
                  <rect x="35" y="5" width="5" height="5" fill="currentColor" />
                  <rect x="35" y="15" width="5" height="5" fill="currentColor" />
                  <rect x="35" y="35" width="5" height="5" fill="currentColor" />
                  <rect x="45" y="35" width="5" height="5" fill="currentColor" />
                  <rect x="55" y="35" width="5" height="5" fill="currentColor" />
                  <rect x="65" y="35" width="5" height="5" fill="currentColor" />
                  <rect x="50" y="55" width="5" height="5" fill="currentColor" />
                  <rect x="60" y="55" width="5" height="5" fill="currentColor" />
                  <rect x="50" y="65" width="5" height="5" fill="currentColor" />
                  <rect x="65" y="65" width="5" height="5" fill="currentColor" />
                  <rect x="55" y="45" width="5" height="5" fill="currentColor" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-white mb-1">QR Verification Code</h4>
                <p className="text-sm text-green-200 leading-relaxed">
                  Scan this QR code on the product packaging to instantly verify authenticity through the CCRA mobile app or web portal.
                </p>
              </div>
            </div>

            {/* Export Status */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-2xl">
              <h4 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-4">Export Certification</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-green-200">CCRA Domestic Sale Approved</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-green-200">Lab Certificate Issued</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-green-200">GMP Compliance Confirmed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-400" />
                  <span className="text-sm text-green-200">International Export Clearance — Under Review</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Circular Progress Component ───
function CircularProgress({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const radius = 30
  const circumference = 2 * Math.PI * radius
  const percentage = Math.min(100, (value / max) * 100)
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  const strokeColor = color === 'green' ? '#22c55e' : '#10b981'

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="76" height="76" viewBox="0 0 76 76">
          <circle cx="38" cy="38" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
          <circle
            cx="38" cy="38" r={radius} fill="none"
            stroke={strokeColor} strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 38 38)"
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-white">{value}%</span>
        </div>
      </div>
      <span className="text-xs text-green-400/70 mt-1">{label}</span>
    </div>
  )
}

// ─── Pass/Fail Badge Component ───
function PassFailBadge({ label, pass }: { label: string; pass: boolean }) {
  return (
    <div className={cn(
      'flex flex-col items-center gap-1 p-2 rounded-lg border',
      pass
        ? 'bg-green-500/10 border-green-500/20'
        : 'bg-red-500/10 border-red-500/20'
    )}>
      {pass ? (
        <CheckCircle2 className="h-5 w-5 text-green-400" />
      ) : (
        <XCircle className="h-5 w-5 text-red-400" />
      )}
      <span className={cn('text-[10px] font-semibold', pass ? 'text-green-400' : 'text-red-400')}>
        {pass ? 'PASS' : 'FAIL'}
      </span>
      <span className="text-[9px] text-green-400/50 text-center leading-tight">{label}</span>
    </div>
  )
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
      <span className="text-sm text-green-400/70">{label}</span>
      <span className={cn('text-sm font-medium text-green-200', mono && 'font-mono')}>{value}</span>
    </div>
  )
}

function LabRow({ label, value, pass }: { label: string; value: string; pass?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
      <span className="text-sm text-green-400/70">{label}</span>
      {pass !== undefined ? (
        <span className={cn(
          'text-xs font-bold px-2.5 py-0.5 rounded-full',
          pass ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        )}>
          {value}
        </span>
      ) : (
        <span className="text-sm font-medium text-green-200">{value}</span>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SECTION 4: LICENSED OPERATORS DIRECTORY
// ═══════════════════════════════════════════════════════════════
function OperatorsSection() {
  const [search, setSearch] = useState('')
  const [selectedFarm, setSelectedFarm] = useState<string | null>(null)

  const filtered = farms.filter(f => {
    const term = search.toLowerCase()
    return (
      f.name.toLowerCase().includes(term) ||
      f.region.toLowerCase().includes(term) ||
      f.licenseNumber.toLowerCase().includes(term)
    )
  })

  const selected = farms.find(f => f.id === selectedFarm)

  return (
    <div className="animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Licensed Operators Directory</h2>
        <p className="text-green-200">Public registry of all CCRA-licensed cannabis operators across Pakistan</p>
      </div>

      {/* Search + Count */}
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-400/50" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by farm name, region, or license number..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-green-400/50 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 outline-none text-sm"
          />
        </div>
        <span className="text-sm text-green-400/70 font-medium">{filtered.length} operator{filtered.length !== 1 ? 's' : ''} found</span>
      </div>

      {/* Table */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/[0.06]">
                <th className="text-left px-4 py-3 font-semibold text-green-400">Farm Name</th>
                <th className="text-left px-4 py-3 font-semibold text-green-400">Region</th>
                <th className="text-left px-4 py-3 font-semibold text-green-400">Province</th>
                <th className="text-left px-4 py-3 font-semibold text-green-400">License No.</th>
                <th className="text-left px-4 py-3 font-semibold text-green-400">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-green-400">Compliance</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(farm => (
                <tr
                  key={farm.id}
                  onClick={() => setSelectedFarm(farm.id)}
                  className="border-b border-white/[0.04] hover:bg-white/[0.04] cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-white">{farm.name}</td>
                  <td className="px-4 py-3 text-green-200">{farm.region}</td>
                  <td className="px-4 py-3 text-green-200">{farm.province}</td>
                  <td className="px-4 py-3 font-mono text-xs text-green-400/70">{farm.licenseNumber}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'text-xs font-medium px-2.5 py-1 rounded-full capitalize',
                      farm.status === 'active' && 'bg-green-500/20 text-green-400',
                      farm.status === 'pending' && 'bg-amber-500/20 text-amber-400',
                      farm.status === 'suspended' && 'bg-red-500/20 text-red-400',
                      farm.status === 'revoked' && 'bg-white/[0.05] text-green-400/50'
                    )}>
                      {farm.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {farm.complianceScore != null ? (
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-white/[0.06] rounded-full overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full',
                              farm.complianceScore >= 90 ? 'bg-green-500' :
                              farm.complianceScore >= 70 ? 'bg-amber-500' : 'bg-red-500'
                            )}
                            style={{ width: `${farm.complianceScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-green-200">{farm.complianceScore}%</span>
                      </div>
                    ) : (
                      <span className="text-xs text-green-400/40">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Farm Detail Modal */}
      <DetailModal
        open={!!selected}
        onClose={() => setSelectedFarm(null)}
        title={selected?.name || ''}
      >
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/20">
                <Leaf className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <h4 className="font-bold text-white">{selected.name}</h4>
                <p className="text-sm text-green-400/70">{selected.region}, {selected.province}</p>
              </div>
            </div>

            <div className="space-y-2">
              <InfoRow label="License Number" value={selected.licenseNumber} mono />
              <InfoRow label="License Type" value="Cultivation" />
              <InfoRow label="Status" value={selected.status.charAt(0).toUpperCase() + selected.status.slice(1)} />
              <InfoRow label="Region" value={selected.region} />
              <InfoRow label="Province" value={selected.province} />
              <InfoRow label="Farm Size" value={`${selected.sizeHectares} hectares`} />
              <InfoRow label="Strain" value={selected.strain} />
              <InfoRow label="Registered" value={selected.registeredDate} />
              {selected.lastInspection && <InfoRow label="Last Inspection" value={selected.lastInspection} />}
              {selected.complianceScore != null && (
                <div className="flex items-center justify-between py-1.5 border-b border-white/[0.04]">
                  <span className="text-sm text-green-400/70">Compliance Score</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full',
                          selected.complianceScore >= 90 ? 'bg-green-500' :
                          selected.complianceScore >= 70 ? 'bg-amber-500' : 'bg-red-500'
                        )}
                        style={{ width: `${selected.complianceScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-white">{selected.complianceScore}%</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 bg-white/[0.03] border border-white/[0.06] rounded-lg p-3 text-xs text-green-400/60">
              Note: Sensitive operator information (owner identity, CNIC) is not disclosed in the public portal in accordance with CCRA data protection policy.
            </div>
          </div>
        )}
      </DetailModal>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SECTION 5: FEE SCHEDULE & REQUIREMENTS
// ═══════════════════════════════════════════════════════════════
function FeeScheduleSection() {
  const [selectedFee, setSelectedFee] = useState<string | null>(null)

  const feeCategories = Object.entries(FEE_SCHEDULE).map(([category, tiers]) => {
    const firstTier = Object.values(tiers)[0]
    const tierCount = Object.keys(tiers).length
    return { category, tiers, firstTier, tierCount }
  })

  const feeIcons: Record<string, React.ElementType> = {
    'CULTIVATION': Leaf,
    'PROCESSING_EXTRACTION': FlaskConical,
    'TESTING_LABORATORY': Factory,
    'DISTRIBUTION_TRANSPORT': Truck,
    'RETAIL_DISPENSARY': Factory,
    'RESEARCH': Leaf,
    'EXPORT_IMPORT': Truck,
    'INDUSTRIAL_HEMP': Leaf,
    'CANNABIS_DRUG': FlaskConical,
  }

  const feeColors: Record<string, string> = {
    'CULTIVATION': 'from-green-600 to-green-700',
    'PROCESSING_EXTRACTION': 'from-blue-600 to-blue-700',
    'TESTING_LABORATORY': 'from-purple-600 to-purple-700',
    'DISTRIBUTION_TRANSPORT': 'from-amber-600 to-amber-700',
    'RETAIL_DISPENSARY': 'from-teal-600 to-teal-700',
    'RESEARCH': 'from-cyan-600 to-cyan-700',
    'EXPORT_IMPORT': 'from-orange-600 to-orange-700',
    'INDUSTRIAL_HEMP': 'from-lime-600 to-lime-700',
    'CANNABIS_DRUG': 'from-rose-600 to-rose-700',
  }

  const categoryLabels: Record<string, string> = {
    'CULTIVATION': 'Cultivation',
    'PROCESSING_EXTRACTION': 'Processing & Extraction',
    'TESTING_LABORATORY': 'Testing Laboratory',
    'DISTRIBUTION_TRANSPORT': 'Distribution & Transport',
    'RETAIL_DISPENSARY': 'Retail & Dispensary',
    'RESEARCH': 'Research',
    'EXPORT_IMPORT': 'Export / Import',
    'INDUSTRIAL_HEMP': 'Industrial Hemp',
    'CANNABIS_DRUG': 'Cannabis Drug',
  }

  const requiredDocs = [
    { doc: 'Computerized National Identity Card (CNIC)', desc: 'Valid NADRA-issued CNIC of the applicant and all partners/directors' },
    { doc: 'Land Title / Ownership Documents', desc: 'Revenue department-verified land ownership or lease agreement (minimum 5 years)' },
    { doc: 'Land Survey Report', desc: 'Certified survey report from licensed surveyor showing plot boundaries and measurements' },
    { doc: 'Passport-size Photographs', desc: 'Four recent photographs of the applicant (white background, 2x2 inches)' },
    { doc: 'Agricultural Assessment Report', desc: 'Soil analysis, water availability, and climate suitability report from provincial agriculture department' },
    { doc: 'Environmental Impact Assessment', desc: 'Preliminary environmental impact report from EPA-registered consultant' },
    { doc: 'Police Clearance Certificate', desc: 'Character certificate from local police station (not older than 3 months)' },
    { doc: 'Business Registration', desc: 'NTN certificate, SECP registration (if company), or sole proprietorship certificate' },
  ]

  return (
    <div className="animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Fee Schedule &amp; Requirements</h2>
        <p className="text-green-200">Complete fee structure and documentation requirements for CCRA licensing</p>
      </div>

      {/* Fee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {feeCategories.map(({ category, firstTier, tierCount }) => {
          const Icon = feeIcons[category] || Leaf
          const label = categoryLabels[category] || category
          return (
            <div
              key={category}
              className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden hover:bg-white/[0.05] hover:border-white/[0.12] transition-all cursor-pointer"
              onClick={() => setSelectedFee(selectedFee === category ? null : category)}
            >
              <div className={cn('p-5 text-white bg-gradient-to-br', feeColors[category] || 'from-green-600 to-green-700')}>
                <Icon className="h-8 w-8 mb-3 opacity-90" />
                <h3 className="text-lg font-bold">{label}</h3>
                <p className="text-xs opacity-80 mt-1">{tierCount} tier{tierCount > 1 ? 's' : ''} available</p>
              </div>
              <div className="p-5 space-y-3">
                <FeeRow label="Application Fee (from)" value={formatPKR(firstTier.applicationFee)} />
                <FeeRow label="License Fee (from)" value={formatPKR(firstTier.licenseFee)} />
                <FeeRow label="Annual Renewal (from)" value={formatPKR(firstTier.annualRenewal)} />
                <div className="pt-2 border-t border-white/[0.06]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-green-400/50">First Year (from)</span>
                    <span className="text-sm font-bold text-green-400">
                      {formatPKR(firstTier.totalFirstYear)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Fee Detail Modal */}
      <DetailModal
        open={selectedFee !== null}
        onClose={() => setSelectedFee(null)}
        title={selectedFee !== null ? `${categoryLabels[selectedFee] || selectedFee} License — Fee Breakdown` : ''}
      >
        {selectedFee !== null && (() => {
          const tiers = FEE_SCHEDULE[selectedFee as keyof typeof FEE_SCHEDULE]
          return (
            <div className="space-y-4">
              {Object.entries(tiers).map(([tierKey, fee]) => (
                <div key={tierKey} className="space-y-2 border-b border-white/[0.06] pb-3 last:border-0">
                  <p className="font-semibold text-green-400 text-sm">{tierKey.replace(/_/g, ' ')}</p>
                  <InfoRow label="Application Fee (one-time)" value={formatPKR(fee.applicationFee)} />
                  <InfoRow label="License Fee" value={formatPKR(fee.licenseFee)} />
                  <InfoRow label="Annual Renewal" value={formatPKR(fee.annualRenewal)} />
                  <InfoRow label="First Year Total" value={formatPKR(fee.totalFirstYear)} />
                </div>
              ))}
              <div className="bg-green-500/10 border border-green-500/10 rounded-lg p-4 text-sm text-green-300 space-y-1">
                <p className="font-semibold text-green-400">Payment Information:</p>
                <p>All fees are payable in Pakistani Rupees (PKR) via bank draft or online transfer to the CCRA designated account at the State Bank of Pakistan.</p>
                <p className="mt-2 text-green-400/70">Account: CCRA-FEE-COLLECTION-001</p>
                <p className="text-green-400/70">Bank: National Bank of Pakistan, Islamabad Main Branch</p>
              </div>
            </div>
          )
        })()}
      </DetailModal>

      {/* Required Documents */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl p-6 mb-8">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-green-400" /> Required Documents
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requiredDocs.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/[0.04] transition-colors">
              <div className="h-7 w-7 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 border border-green-500/20">
                <span className="text-xs font-bold text-green-400">{idx + 1}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">{item.doc}</p>
                <p className="text-xs text-green-400/60 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Processing Timeline */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-green-400" /> Processing Timeline
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/[0.03] rounded-xl p-5 border border-white/[0.06]">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="h-8 w-8 text-green-400" />
              <div>
                <h4 className="font-bold text-white">Standard Processing</h4>
                <p className="text-2xl font-bold text-green-400">30-45 days</p>
              </div>
            </div>
            <p className="text-sm text-green-200">
              Regular processing timeline including document verification, AI pre-screening, field inspection, and DG approval.
            </p>
          </div>
          <div className="bg-white/[0.03] rounded-xl p-5 border border-amber-500/20">
            <div className="flex items-center gap-3 mb-3">
              <ArrowRight className="h-8 w-8 text-amber-400" />
              <div>
                <h4 className="font-bold text-white">Expedited Processing</h4>
                <p className="text-2xl font-bold text-amber-400">15-20 days</p>
              </div>
            </div>
            <p className="text-sm text-green-200">
              Expedited review available for applications meeting all criteria. Additional PKR 250,000 expedited processing fee applies.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeeRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-green-400/60">{label}</span>
      <span className="text-sm font-semibold text-green-200">{value}</span>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SECTION 6: COMPLIANCE LEADERBOARD
// ═══════════════════════════════════════════════════════════════
function LeaderboardSection() {
  const [selectedFarm, setSelectedFarm] = useState<string | null>(null)

  const rankedFarms = farms
    .filter(f => f.complianceScore != null && f.status === 'active')
    .sort((a, b) => (b.complianceScore || 0) - (a.complianceScore || 0))
    .slice(0, 10)

  const badgeConfig: Record<number, { icon: React.ElementType; label: string; color: string; bg: string }> = {
    0: { icon: Trophy, label: 'Gold', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    1: { icon: Medal, label: 'Silver', color: 'text-gray-300', bg: 'bg-gray-400/20' },
    2: { icon: Award, label: 'Bronze', color: 'text-amber-500', bg: 'bg-amber-500/20' },
  }

  const selected = farms.find(f => f.id === selectedFarm)

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Compliance Leaderboard</h2>
        <p className="text-green-200">Top 10 most compliant licensed cannabis farms, ranked by CCRA compliance score</p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {rankedFarms.slice(0, 3).map((farm, idx) => {
          const badge = badgeConfig[idx]
          const BadgeIcon = badge.icon
          const order = idx === 0 ? 'order-2' : idx === 1 ? 'order-1' : 'order-3'
          return (
            <div
              key={farm.id}
              className={cn(
                'bg-white/[0.03] backdrop-blur-xl border rounded-2xl p-5 text-center cursor-pointer hover:bg-white/[0.06] transition-all shadow-2xl',
                idx === 0 ? 'border-yellow-500/30 scale-105 shadow-yellow-900/10' : 'border-white/[0.08]',
                order
              )}
              onClick={() => setSelectedFarm(farm.id)}
            >
              <div className={cn('h-14 w-14 rounded-full mx-auto flex items-center justify-center mb-3 border', badge.bg, idx === 0 ? 'border-yellow-500/30' : 'border-white/[0.06]')}>
                <BadgeIcon className={cn('h-7 w-7', badge.color)} />
              </div>
              <div className="text-xs font-bold text-green-400/60 uppercase mb-1">#{idx + 1} {badge.label}</div>
              <h4 className="font-bold text-white text-sm mb-1">{farm.name}</h4>
              <p className="text-xs text-green-400/60 mb-2">{farm.region}</p>
              <div className="text-3xl font-bold text-green-400">{farm.complianceScore}%</div>
            </div>
          )
        })}
      </div>

      {/* Remaining rankings */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">
        {rankedFarms.slice(3).map((farm, idx) => (
          <div
            key={farm.id}
            onClick={() => setSelectedFarm(farm.id)}
            className="flex items-center gap-4 px-6 py-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.04] cursor-pointer transition-colors"
          >
            <div className="h-10 w-10 rounded-full bg-white/[0.05] flex items-center justify-center flex-shrink-0 border border-white/[0.06]">
              <span className="text-sm font-bold text-green-400/60">#{idx + 4}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white">{farm.name}</h4>
              <p className="text-xs text-green-400/60">{farm.region}, {farm.province}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-32 h-2.5 bg-white/[0.06] rounded-full overflow-hidden hidden sm:block">
                <div
                  className={cn(
                    'h-full rounded-full',
                    (farm.complianceScore || 0) >= 90 ? 'bg-green-500' : 'bg-amber-500'
                  )}
                  style={{ width: `${farm.complianceScore}%` }}
                />
              </div>
              <span className="text-lg font-bold text-green-400 w-14 text-right">{farm.complianceScore}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      <DetailModal
        open={!!selected}
        onClose={() => setSelectedFarm(null)}
        title={selected ? `${selected.name} — Compliance Details` : ''}
      >
        {selected && (
          <div className="space-y-4">
            <div className="text-center pb-4 border-b border-white/[0.06]">
              <div className="text-5xl font-bold text-green-400 mb-1">{selected.complianceScore}%</div>
              <p className="text-sm text-green-400/60">Overall Compliance Score</p>
            </div>
            <div className="space-y-2">
              <InfoRow label="Farm Name" value={selected.name} />
              <InfoRow label="Region" value={`${selected.region}, ${selected.province}`} />
              <InfoRow label="License" value={selected.licenseNumber} mono />
              <InfoRow label="Strain" value={selected.strain} />
              <InfoRow label="Farm Size" value={`${selected.sizeHectares} ha`} />
              {selected.lastInspection && <InfoRow label="Last Inspection" value={selected.lastInspection} />}
              {selected.yieldEstimateTons && <InfoRow label="Yield Estimate" value={`${selected.yieldEstimateTons} tons`} />}
            </div>
            <div className="mt-4 space-y-2">
              <h5 className="text-sm font-bold text-green-400">Compliance Breakdown</h5>
              <ComplianceBar label="Documentation" value={Math.min(100, (selected.complianceScore || 0) + 3)} />
              <ComplianceBar label="Field Standards" value={selected.complianceScore || 0} />
              <ComplianceBar label="Lab Compliance" value={Math.min(100, (selected.complianceScore || 0) + 1)} />
              <ComplianceBar label="Reporting" value={Math.max(70, (selected.complianceScore || 0) - 5)} />
            </div>
          </div>
        )}
      </DetailModal>
    </div>
  )
}

function ComplianceBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-green-400/60 w-28 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
        <div className="h-full bg-green-500 rounded-full" style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-medium text-green-200 w-10 text-right">{value}%</span>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SECTION 7: FAQ & CONTACT
// ═══════════════════════════════════════════════════════════════
function FAQSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const faqs = [
    {
      q: 'How do I apply for a cannabis cultivation license?',
      a: 'To apply for a cultivation license, visit the CCRA Registration Portal and complete the online application form. You will need to provide your CNIC, land ownership documents, agricultural assessment report, environmental impact assessment, police clearance certificate, and passport-size photographs. The application fee of PKR 500,000 must be paid at the time of submission. Once submitted, your application will go through document verification, AI pre-screening, field inspection, and final approval by the Director General.'
    },
    {
      q: 'What is the processing time for license applications?',
      a: 'Standard processing takes 30-45 business days from the date of complete application submission. This includes 5-7 days for document verification, 2-3 days for AI pre-screening, 10-15 days for field inspection scheduling and execution, and 5-10 days for final review and DG approval. An expedited processing option is available for PKR 250,000 additional fee, which reduces the timeline to 15-20 business days.'
    },
    {
      q: 'How are compliance inspections conducted?',
      a: 'CCRA conducts both scheduled and unannounced inspections. Scheduled inspections occur quarterly and are coordinated with the farm operator in advance. Unannounced inspections may occur at any time. Inspections cover cultivation practices, safety protocols, record-keeping, boundary compliance (verified via satellite imagery and GPS), pesticide use, water management, and product quality. Inspectors use the STRYDER AI platform for real-time data validation during field visits. Inspection results are recorded digitally and contribute to the farm\'s compliance score.'
    },
    {
      q: 'What happens if my farm fails an inspection?',
      a: 'If a farm fails an inspection, the severity determines the response. Minor violations (documentation gaps, minor facility issues) result in a Corrective Action Notice with a 30-day remediation period. Moderate violations (boundary breaches, unapproved strain cultivation) may result in license suspension pending investigation. Severe violations (contaminant presence, unauthorized distribution) trigger immediate suspension and may lead to permanent license revocation. All operators have the right to appeal decisions through the CCRA Appeals Board within 14 days of notification.'
    },
    {
      q: 'How do I renew my license?',
      a: 'License renewal applications must be submitted at least 60 days before the current license expiry date. The renewal process requires updated documentation, a clean compliance record (minimum 70% compliance score), payment of the renewal fee, and a satisfactory renewal inspection. Renewals for operators with compliance scores above 90% are processed on a fast-track basis. Late renewal applications incur a 25% surcharge on the renewal fee.'
    },
    {
      q: 'What strains are permitted for cultivation?',
      a: 'CCRA currently permits the following strains: Pakistani Landrace, Peshawar Purple, Balochi Gold, Tirah Valley Green, Swat Valley Kush, Hindu Kush, Chitral Purple, Malakand Express, Industrial Hemp (CBD), and Medicinal Grade A. Each strain must be sourced from CCRA-certified seed banks. Cultivation of unapproved strains is a severe violation that may result in immediate license revocation. New strain applications can be submitted to the CCRA Genetics Review Board for evaluation.'
    },
    {
      q: 'How does the traceability system work?',
      a: 'CCRA maintains a comprehensive seed-to-sale traceability system powered by the Intelligence Nexus platform. Every batch is tracked through seven stages: Seed Bank, Cultivation, Harvest, Processing, Lab Testing, Packaging, and Distribution. Each stage records the handler, dates, quantities, and quality notes. QR codes on final products link to the complete chain of custody. Lab results, including THC/CBD content, moisture levels, contaminant testing, and heavy metals screening, are permanently recorded and publicly verifiable.'
    },
    {
      q: 'How can I verify a product\'s authenticity?',
      a: 'Products can be verified through this Public Portal by entering the batch code (found on product packaging) in the "Verify Product" section. You can also scan the QR code on the packaging using any QR reader or the CCRA mobile app. Verified products display complete batch information, lab results, chain of custody history, and CCRA certification status. If a product cannot be verified or shows discrepancies, report it immediately to the CCRA Anti-Counterfeiting Unit at counterfeit@ccra.gov.pk or call the hotline at +92-51-111-FAKE (3253).'
    },
  ]

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Frequently Asked Questions</h2>
        <p className="text-green-200">Find answers to common questions about CCRA licensing and regulation</p>
      </div>

      {/* FAQ Accordions */}
      <div className="space-y-3 mb-10">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl hover:bg-white/[0.05] hover:border-white/[0.12] transition-all"
          >
            <button
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              className="w-full flex items-center justify-between px-6 py-4 text-left"
            >
              <span className="text-sm font-semibold text-white pr-4">{faq.q}</span>
              <ChevronDown className={cn(
                'h-5 w-5 text-green-400 flex-shrink-0 transition-transform duration-200',
                openFaq === idx && 'rotate-180'
              )} />
            </button>
            {openFaq === idx && (
              <div className="px-6 pb-5 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="border-t border-white/[0.06] pt-4">
                  <p className="text-sm text-green-200 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <div className="bg-gradient-to-br from-green-900 via-emerald-800 to-green-900 rounded-2xl p-8 text-white shadow-2xl border border-white/[0.08]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-10 h-40 w-40 rounded-full bg-green-400/5 blur-3xl" />
          <div className="absolute bottom-10 left-10 h-32 w-32 rounded-full bg-emerald-500/5 blur-3xl" />
        </div>
        <div className="relative text-center mb-6">
          <h3 className="text-xl font-bold mb-2">Contact CCRA</h3>
          <p className="text-green-300/70 text-sm">We are here to assist you with any inquiries regarding cannabis regulation</p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-xl p-5 space-y-4">
            <h4 className="font-semibold text-green-400 uppercase text-xs tracking-wider">Head Office</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-green-400/70 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">CCRA Headquarters</p>
                  <p className="text-xs text-green-300/60">Blue Area, Islamabad 44000, Pakistan</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-green-400/70 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">info@ccra.gov.pk</p>
                  <p className="text-xs text-green-300/60">General inquiries</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-green-400/70 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">licensing@ccra.gov.pk</p>
                  <p className="text-xs text-green-300/60">License applications</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-xl p-5 space-y-4">
            <h4 className="font-semibold text-green-400 uppercase text-xs tracking-wider">Helpline &amp; Hours</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-green-400/70 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">+92-51-111-CCRA (2272)</p>
                  <p className="text-xs text-green-300/60">Toll-free helpline</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-green-400/70 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">Monday - Friday</p>
                  <p className="text-xs text-green-300/60">9:00 AM - 5:00 PM (PKT, GMT+5)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-green-400/70 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">www.ccra.gov.pk</p>
                  <p className="text-xs text-green-300/60">Official website</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-6 pt-5 border-t border-white/[0.08] text-center">
          <p className="text-xs text-green-400/60">
            For emergencies related to unauthorized cannabis activities, contact the CCRA Enforcement Hotline: +92-51-111-ENFC (3632)
          </p>
        </div>
      </div>
    </div>
  )
}
