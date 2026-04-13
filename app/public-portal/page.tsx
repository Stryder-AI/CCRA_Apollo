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
  X, PenLine
} from 'lucide-react'
import { farms } from '@/data/mock-farms'
import { batches } from '@/data/mock-traceability'
import { FEE_SCHEDULE, REGIONS } from '@/config/constants'

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
      'relative overflow-hidden rounded-xl border border-green-200 bg-white p-6 shadow-md',
      'hover:shadow-lg transition-all duration-300 group cursor-default'
    )}>
      <div className={cn('absolute top-0 left-0 w-1.5 h-full', color)} />
      <div className="flex items-center justify-between">
        <div className="pl-3">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-bold text-green-900 mt-1">{value}</p>
        </div>
        <div className={cn('h-14 w-14 rounded-xl flex items-center justify-center', color.replace('bg-', 'bg-') + '/10')}>
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
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl border border-green-200 max-w-lg w-full max-h-[80vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-green-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h3 className="text-lg font-bold text-green-900">{title}</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-full hover:bg-green-50 flex items-center justify-center transition-colors">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
        <div className="px-6 py-4">{children}</div>
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
      <div className="w-full bg-gray-50 border-b border-green-200 sticky top-0 z-30">
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
                      ? 'border-green-600 text-green-800 bg-white'
                      : 'border-transparent text-gray-500 hover:text-green-700 hover:border-green-300'
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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 p-10 mb-8 shadow-xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-10 left-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            Welcome to CCRA Public Portal
          </h1>
          <p className="text-xl text-green-100 font-medium mb-2">
            Transparency, Accountability, and Innovation in Cannabis Regulation
          </p>
          <p className="text-sm text-green-200 max-w-2xl mx-auto leading-relaxed">
            The Cannabis Control &amp; Regulatory Authority of Pakistan provides this portal
            for citizens, stakeholders, and international partners to access public information
            about licensed cannabis operations, verify products, and track applications.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-white">
              <Globe className="h-3.5 w-3.5" /> ISO 17025 Compliant Labs
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-white">
              <ShieldCheck className="h-3.5 w-3.5" /> GMP Certified Processing
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-white">
              <BarChart3 className="h-3.5 w-3.5" /> AI-Powered Monitoring
            </span>
          </div>

          {/* Apply for License CTA */}
          <div className="mt-8">
            <Link
              href="/register"
              className="inline-flex items-center gap-3 bg-white text-green-800 font-bold text-lg px-10 py-4 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
            >
              <PenLine className="h-6 w-6" />
              Apply for a Cannabis License
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-green-200 text-xs mt-3">9 license categories available — Cultivation, Processing, Research, Export & more</p>
          </div>
        </div>
      </div>

      {/* Apply Banner — Standalone CTA */}
      <div className="mb-8 rounded-2xl border-2 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 p-8 shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-green-600 flex items-center justify-center shadow-md flex-shrink-0">
              <PenLine className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-green-900">Ready to Apply for a License?</h2>
              <p className="text-gray-600 mt-1">Start your application online — 9 license categories including Cultivation, Processing, Testing, Distribution, Research, Export/Import, and more.</p>
            </div>
          </div>
          <Link
            href="/register"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group"
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
            'relative overflow-hidden rounded-xl border-2 border-green-500 bg-green-50 p-6 shadow-md',
            'hover:shadow-xl transition-all duration-300 hover:border-green-600 h-full'
          )}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-bl-full" />
            <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center mb-4 bg-green-600')}>
              <PenLine className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-green-900 mb-2 group-hover:text-green-700">Apply for a License</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Submit your cannabis license application online. 9 categories available with step-by-step guidance.</p>
            <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-green-700 group-hover:gap-2 transition-all">
              Start Now <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </Link>
        <QuickAccessCard
          icon={Search}
          title="Track Your Application"
          description="Enter your reference number to check the real-time status of your license application with detailed progress timeline."
          color="bg-blue-50 border-blue-200"
          iconColor="text-blue-600"
        />
        <QuickAccessCard
          icon={ShieldCheck}
          title="Verify a Product"
          description="Scan or enter a batch code to verify product authenticity, lab results, and complete chain of custody information."
          color="bg-green-50 border-green-200"
          iconColor="text-green-600"
        />
        <QuickAccessCard
          icon={Users}
          title="Licensed Operators"
          description="Browse the public directory of all CCRA-licensed cannabis operators with compliance scores and licensing details."
          color="bg-purple-50 border-purple-200"
          iconColor="text-purple-600"
        />
      </div>
    </div>
  )
}

function QuickAccessCard({ icon: Icon, title, description, color, iconColor }: {
  icon: React.ElementType; title: string; description: string; color: string; iconColor: string
}) {
  return (
    <div className={cn('rounded-xl border p-6 hover:shadow-lg transition-all duration-300 cursor-default', color)}>
      <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center mb-4', color)}>
        <Icon className={cn('h-6 w-6', iconColor)} />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SECTION 2: APPLICATION STATUS TRACKER
// ═══════════════════════════════════════════════════════════════
function TrackApplicationSection() {
  const [refNumber, setRefNumber] = useState('CCRA-REG-2026-0042')
  const [tracked, setTracked] = useState(false)
  const [expandedStep, setExpandedStep] = useState<number | null>(null)

  const steps: ApplicationStep[] = [
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

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-green-900 mb-2">Application Status Tracker</h2>
        <p className="text-gray-600">Track the progress of your CCRA license application in real-time</p>
      </div>

      {/* Search Box */}
      <div className="bg-white rounded-xl border border-green-200 shadow-md p-6 mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter your reference number
        </label>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={refNumber}
              onChange={e => setRefNumber(e.target.value)}
              placeholder="e.g., CCRA-REG-2026-0001"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none text-sm font-mono"
            />
          </div>
          <button
            onClick={() => setTracked(true)}
            className="px-8 py-3 bg-green-700 hover:bg-green-800 text-white font-medium rounded-lg transition-colors shadow-md flex items-center gap-2"
          >
            <Search className="h-4 w-4" /> Track
          </button>
        </div>
      </div>

      {/* Results */}
      {tracked && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Application Header */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Application Reference</p>
              <p className="text-lg font-bold font-mono text-green-900">{refNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-600 font-medium">Application Type</p>
              <p className="text-lg font-bold text-green-900">Cultivation License</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-0 mb-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                {/* Connector line */}
                {idx < steps.length - 1 && (
                  <div className={cn(
                    'absolute left-6 top-14 w-0.5 h-full -translate-x-1/2',
                    step.status === 'completed' ? 'bg-green-400' : 'bg-gray-200'
                  )} />
                )}

                <div
                  className={cn(
                    'relative flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all',
                    'hover:bg-gray-50',
                    expandedStep === idx && 'bg-gray-50'
                  )}
                  onClick={() => setExpandedStep(expandedStep === idx ? null : idx)}
                >
                  {/* Status icon */}
                  <div className={cn(
                    'relative z-10 flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center shadow-md',
                    step.status === 'completed' && 'bg-green-600 text-white',
                    step.status === 'current' && 'bg-blue-500 text-white animate-pulse',
                    step.status === 'pending' && 'bg-gray-200 text-gray-400'
                  )}>
                    {step.status === 'completed' && <CheckCircle2 className="h-6 w-6" />}
                    {step.status === 'current' && <Clock className="h-6 w-6" />}
                    {step.status === 'pending' && <Clock className="h-6 w-6" />}
                  </div>

                  {/* Step info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-semibold text-gray-900">{step.title}</h4>
                        {idx === 2 && step.status === 'completed' && (
                          <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full">
                            <Sprout className="h-3 w-3" /> STRYDER AI
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'text-xs font-medium px-2.5 py-1 rounded-full',
                          step.status === 'completed' && 'bg-green-100 text-green-700',
                          step.status === 'current' && 'bg-blue-100 text-blue-700',
                          step.status === 'pending' && 'bg-gray-100 text-gray-500'
                        )}>
                          {step.status === 'completed' ? 'Completed' : step.status === 'current' ? 'In Progress' : 'Pending'}
                        </span>
                        {expandedStep === idx ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{step.date}</p>

                    {/* Expanded details */}
                    {expandedStep === idx && (
                      <div className="mt-3 bg-white border border-green-100 rounded-lg p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <p className="text-sm text-gray-700 leading-relaxed mb-3">{step.details}</p>
                        {step.reviewer && (
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                            <BadgeCheck className="h-3.5 w-3.5 text-green-600" />
                            <span className="font-medium">Reviewed by:</span> {step.reviewer}
                          </div>
                        )}
                        {step.notes && (
                          <div className="mt-2 bg-green-50 rounded-md p-3 text-xs text-green-800 leading-relaxed">
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
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <p className="text-sm font-medium text-blue-900">Estimated completion: 7-10 business days</p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-blue-800">Contact <span className="font-mono font-medium">licensing@ccra.gov.pk</span> for inquiries</p>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-blue-800">Helpline: <span className="font-mono font-medium">+92-51-111-CCRA (2272)</span></p>
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

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-green-900 mb-2">Product Verification</h2>
        <p className="text-gray-600">Verify the authenticity and compliance of any CCRA-regulated cannabis product</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-green-200 shadow-md p-6 mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter Batch Code
        </label>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={batchCode}
              onChange={e => setBatchCode(e.target.value)}
              placeholder="e.g., CCRA-BTH-2025-001"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none text-sm font-mono"
            />
          </div>
          <button
            onClick={() => setVerified(true)}
            className="px-8 py-3 bg-green-700 hover:bg-green-800 text-white font-medium rounded-lg transition-colors shadow-md flex items-center gap-2"
          >
            <ShieldCheck className="h-4 w-4" /> Verify
          </button>
        </div>
      </div>

      {verified && batch && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
          {/* Verification Badge */}
          <div className="bg-green-50 border border-green-300 rounded-xl p-5 flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 shadow-lg">
              <ShieldCheck className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-green-900">Product Verified</h3>
              <p className="text-sm text-green-700">This product has been verified by CCRA and meets all regulatory requirements</p>
            </div>
          </div>

          {/* Batch Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Batch Info */}
            <div className="bg-white border border-green-200 rounded-xl p-6 shadow-sm">
              <h4 className="text-sm font-bold text-green-800 uppercase tracking-wider mb-4">Batch Information</h4>
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

            {/* Lab Results */}
            <div className="bg-white border border-green-200 rounded-xl p-6 shadow-sm">
              <h4 className="text-sm font-bold text-green-800 uppercase tracking-wider mb-4">Laboratory Results</h4>
              {batch.labResults ? (
                <div className="space-y-3">
                  <LabRow label="THC Content" value={`${batch.labResults.thcPercent}%`} />
                  <LabRow label="CBD Content" value={`${batch.labResults.cbdPercent}%`} />
                  <LabRow label="Moisture" value={`${batch.labResults.moisture}%`} />
                  <LabRow label="Contaminants" value={batch.labResults.contaminants === 'pass' ? 'PASS' : 'FAIL'} pass={batch.labResults.contaminants === 'pass'} />
                  <LabRow label="Pesticides" value={batch.labResults.pesticides === 'pass' ? 'PASS' : 'FAIL'} pass={batch.labResults.pesticides === 'pass'} />
                  <LabRow label="Heavy Metals" value={batch.labResults.heavyMetals === 'pass' ? 'PASS' : 'FAIL'} pass={batch.labResults.heavyMetals === 'pass'} />
                  <div className="pt-2 border-t border-gray-100">
                    <InfoRow label="Lab" value={batch.labResults.labName} />
                    <InfoRow label="Tested" value={batch.labResults.testedDate} />
                    <InfoRow label="Certificate" value={batch.labResults.certificateId || 'Pending'} mono />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-600 text-sm">
                  <AlertCircle className="h-4 w-4" /> Lab testing not yet completed
                </div>
              )}
            </div>
          </div>

          {/* Chain of Custody Pipeline */}
          <div className="bg-white border border-green-200 rounded-xl p-6 shadow-sm">
            <h4 className="text-sm font-bold text-green-800 uppercase tracking-wider mb-6">Chain of Custody</h4>
            <div className="flex items-center justify-between overflow-x-auto pb-4">
              {batch.stages.map((stage, idx) => {
                const Icon = stageIcons[stage.type] || Package
                return (
                  <div key={idx} className="flex items-center flex-shrink-0">
                    <button
                      onClick={() => setStageModal(idx)}
                      className={cn(
                        'flex flex-col items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer',
                        'hover:bg-green-50',
                        stage.status === 'completed' && 'opacity-100',
                        stage.status === 'in-progress' && 'opacity-100',
                        stage.status === 'pending' && 'opacity-40'
                      )}
                    >
                      <div className={cn(
                        'h-12 w-12 rounded-full flex items-center justify-center shadow-md',
                        stage.status === 'completed' && 'bg-green-600 text-white',
                        stage.status === 'in-progress' && 'bg-blue-500 text-white animate-pulse',
                        stage.status === 'pending' && 'bg-gray-200 text-gray-400'
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-medium text-gray-700 text-center max-w-[80px]">
                        {stageLabels[stage.type]}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {stage.startDate || '--'}
                      </span>
                    </button>
                    {idx < batch.stages.length - 1 && (
                      <div className={cn(
                        'h-0.5 w-8 mx-1 flex-shrink-0',
                        stage.status === 'completed' ? 'bg-green-400' : 'bg-gray-200'
                      )} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Stage detail modal */}
          <DetailModal
            open={stageModal !== null}
            onClose={() => setStageModal(null)}
            title={stageModal !== null ? `${stageLabels[batch.stages[stageModal].type]} Details` : ''}
          >
            {stageModal !== null && (() => {
              const stage = batch.stages[stageModal]
              return (
                <div className="space-y-3">
                  <InfoRow label="Stage" value={stageLabels[stage.type]} />
                  <InfoRow label="Status" value={stage.status === 'completed' ? 'Completed' : stage.status === 'in-progress' ? 'In Progress' : 'Pending'} />
                  {stage.startDate && <InfoRow label="Start Date" value={stage.startDate} />}
                  {stage.endDate && <InfoRow label="End Date" value={stage.endDate} />}
                  {stage.handler && <InfoRow label="Handler" value={stage.handler} />}
                  {stage.notes && (
                    <div className="mt-3 bg-green-50 rounded-lg p-3 text-sm text-green-800">{stage.notes}</div>
                  )}
                </div>
              )
            })()}
          </DetailModal>

          {/* QR & Export */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* QR Code placeholder */}
            <div className="bg-white border border-green-200 rounded-xl p-6 shadow-sm flex items-center gap-6">
              <div className="h-28 w-28 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg width="80" height="80" viewBox="0 0 80 80" className="text-gray-400">
                  <rect x="5" y="5" width="25" height="25" rx="2" fill="currentColor" />
                  <rect x="50" y="5" width="25" height="25" rx="2" fill="currentColor" />
                  <rect x="5" y="50" width="25" height="25" rx="2" fill="currentColor" />
                  <rect x="12" y="12" width="11" height="11" rx="1" fill="white" />
                  <rect x="57" y="12" width="11" height="11" rx="1" fill="white" />
                  <rect x="12" y="57" width="11" height="11" rx="1" fill="white" />
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
                <h4 className="font-bold text-gray-900 mb-1">QR Verification Code</h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Scan this QR code on the product packaging to instantly verify authenticity through the CCRA mobile app or web portal.
                </p>
              </div>
            </div>

            {/* Export Status */}
            <div className="bg-white border border-green-200 rounded-xl p-6 shadow-sm">
              <h4 className="text-sm font-bold text-green-800 uppercase tracking-wider mb-4">Export Certification</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-700">CCRA Domestic Sale Approved</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-700">Lab Certificate Issued</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-700">GMP Compliance Confirmed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-500" />
                  <span className="text-sm text-gray-700">International Export Clearance — Under Review</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={cn('text-sm font-medium text-gray-900', mono && 'font-mono')}>{value}</span>
    </div>
  )
}

function LabRow({ label, value, pass }: { label: string; value: string; pass?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      {pass !== undefined ? (
        <span className={cn(
          'text-xs font-bold px-2.5 py-0.5 rounded-full',
          pass ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        )}>
          {value}
        </span>
      ) : (
        <span className="text-sm font-medium text-gray-900">{value}</span>
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
        <h2 className="text-2xl font-bold text-green-900 mb-2">Licensed Operators Directory</h2>
        <p className="text-gray-600">Public registry of all CCRA-licensed cannabis operators across Pakistan</p>
      </div>

      {/* Search + Count */}
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by farm name, region, or license number..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none text-sm"
          />
        </div>
        <span className="text-sm text-gray-500 font-medium">{filtered.length} operator{filtered.length !== 1 ? 's' : ''} found</span>
      </div>

      {/* Table */}
      <div className="bg-white border border-green-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-green-50 border-b border-green-200">
                <th className="text-left px-4 py-3 font-semibold text-green-900">Farm Name</th>
                <th className="text-left px-4 py-3 font-semibold text-green-900">Region</th>
                <th className="text-left px-4 py-3 font-semibold text-green-900">Province</th>
                <th className="text-left px-4 py-3 font-semibold text-green-900">License No.</th>
                <th className="text-left px-4 py-3 font-semibold text-green-900">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-green-900">Compliance</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(farm => (
                <tr
                  key={farm.id}
                  onClick={() => setSelectedFarm(farm.id)}
                  className="border-b border-gray-100 hover:bg-green-50/50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">{farm.name}</td>
                  <td className="px-4 py-3 text-gray-600">{farm.region}</td>
                  <td className="px-4 py-3 text-gray-600">{farm.province}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{farm.licenseNumber}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'text-xs font-medium px-2.5 py-1 rounded-full capitalize',
                      farm.status === 'active' && 'bg-green-100 text-green-700',
                      farm.status === 'pending' && 'bg-amber-100 text-amber-700',
                      farm.status === 'suspended' && 'bg-red-100 text-red-700',
                      farm.status === 'revoked' && 'bg-gray-100 text-gray-600'
                    )}>
                      {farm.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {farm.complianceScore != null ? (
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full',
                              farm.complianceScore >= 90 ? 'bg-green-500' :
                              farm.complianceScore >= 70 ? 'bg-amber-500' : 'bg-red-500'
                            )}
                            style={{ width: `${farm.complianceScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-600">{farm.complianceScore}%</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">N/A</span>
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
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Leaf className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{selected.name}</h4>
                <p className="text-sm text-gray-500">{selected.region}, {selected.province}</p>
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
                <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Compliance Score</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full',
                          selected.complianceScore >= 90 ? 'bg-green-500' :
                          selected.complianceScore >= 70 ? 'bg-amber-500' : 'bg-red-500'
                        )}
                        style={{ width: `${selected.complianceScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-900">{selected.complianceScore}%</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 bg-gray-50 rounded-lg p-3 text-xs text-gray-500">
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
        <h2 className="text-2xl font-bold text-green-900 mb-2">Fee Schedule &amp; Requirements</h2>
        <p className="text-gray-600">Complete fee structure and documentation requirements for CCRA licensing</p>
      </div>

      {/* Fee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {feeCategories.map(({ category, firstTier, tierCount }) => {
          const Icon = feeIcons[category] || Leaf
          const label = categoryLabels[category] || category
          return (
            <div
              key={category}
              className="bg-white border border-green-200 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all cursor-pointer"
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
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">First Year (from)</span>
                    <span className="text-sm font-bold text-green-800">
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
                <div key={tierKey} className="space-y-2 border-b border-gray-100 pb-3 last:border-0">
                  <p className="font-semibold text-green-800 text-sm">{tierKey.replace(/_/g, ' ')}</p>
                  <InfoRow label="Application Fee (one-time)" value={formatPKR(fee.applicationFee)} />
                  <InfoRow label="License Fee" value={formatPKR(fee.licenseFee)} />
                  <InfoRow label="Annual Renewal" value={formatPKR(fee.annualRenewal)} />
                  <InfoRow label="First Year Total" value={formatPKR(fee.totalFirstYear)} />
                </div>
              ))}
              <div className="bg-green-50 rounded-lg p-4 text-sm text-green-800 space-y-1">
                <p className="font-semibold">Payment Information:</p>
                <p>All fees are payable in Pakistani Rupees (PKR) via bank draft or online transfer to the CCRA designated account at the State Bank of Pakistan.</p>
                <p className="mt-2">Account: CCRA-FEE-COLLECTION-001</p>
                <p>Bank: National Bank of Pakistan, Islamabad Main Branch</p>
              </div>
            </div>
          )
        })()}
      </DetailModal>

      {/* Required Documents */}
      <div className="bg-white border border-green-200 rounded-xl shadow-sm p-6 mb-8">
        <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-green-600" /> Required Documents
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requiredDocs.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-green-50 transition-colors">
              <div className="h-7 w-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-green-700">{idx + 1}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{item.doc}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Processing Timeline */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-green-600" /> Processing Timeline
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-5 border border-green-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="h-8 w-8 text-green-600" />
              <div>
                <h4 className="font-bold text-gray-900">Standard Processing</h4>
                <p className="text-2xl font-bold text-green-700">30-45 days</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Regular processing timeline including document verification, AI pre-screening, field inspection, and DG approval.
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-amber-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <ArrowRight className="h-8 w-8 text-amber-600" />
              <div>
                <h4 className="font-bold text-gray-900">Expedited Processing</h4>
                <p className="text-2xl font-bold text-amber-600">15-20 days</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
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
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-800">{value}</span>
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
    0: { icon: Trophy, label: 'Gold', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    1: { icon: Medal, label: 'Silver', color: 'text-gray-500', bg: 'bg-gray-100' },
    2: { icon: Award, label: 'Bronze', color: 'text-amber-700', bg: 'bg-amber-100' },
  }

  const selected = farms.find(f => f.id === selectedFarm)

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-green-900 mb-2">Compliance Leaderboard</h2>
        <p className="text-gray-600">Top 10 most compliant licensed cannabis farms, ranked by CCRA compliance score</p>
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
                'bg-white border-2 rounded-2xl p-5 text-center cursor-pointer hover:shadow-lg transition-all',
                idx === 0 ? 'border-yellow-300 shadow-lg scale-105' : 'border-green-200',
                order
              )}
              onClick={() => setSelectedFarm(farm.id)}
            >
              <div className={cn('h-14 w-14 rounded-full mx-auto flex items-center justify-center mb-3', badge.bg)}>
                <BadgeIcon className={cn('h-7 w-7', badge.color)} />
              </div>
              <div className="text-xs font-bold text-gray-400 uppercase mb-1">#{idx + 1} {badge.label}</div>
              <h4 className="font-bold text-gray-900 text-sm mb-1">{farm.name}</h4>
              <p className="text-xs text-gray-500 mb-2">{farm.region}</p>
              <div className="text-3xl font-bold text-green-700">{farm.complianceScore}%</div>
            </div>
          )
        })}
      </div>

      {/* Remaining rankings */}
      <div className="bg-white border border-green-200 rounded-xl shadow-sm overflow-hidden">
        {rankedFarms.slice(3).map((farm, idx) => (
          <div
            key={farm.id}
            onClick={() => setSelectedFarm(farm.id)}
            className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 last:border-0 hover:bg-green-50/50 cursor-pointer transition-colors"
          >
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-gray-500">#{idx + 4}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900">{farm.name}</h4>
              <p className="text-xs text-gray-500">{farm.region}, {farm.province}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-32 h-2.5 bg-gray-200 rounded-full overflow-hidden hidden sm:block">
                <div
                  className={cn(
                    'h-full rounded-full',
                    (farm.complianceScore || 0) >= 90 ? 'bg-green-500' : 'bg-amber-500'
                  )}
                  style={{ width: `${farm.complianceScore}%` }}
                />
              </div>
              <span className="text-lg font-bold text-green-700 w-14 text-right">{farm.complianceScore}%</span>
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
            <div className="text-center pb-4 border-b border-gray-100">
              <div className="text-5xl font-bold text-green-700 mb-1">{selected.complianceScore}%</div>
              <p className="text-sm text-gray-500">Overall Compliance Score</p>
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
              <h5 className="text-sm font-bold text-gray-700">Compliance Breakdown</h5>
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
      <span className="text-xs text-gray-500 w-28 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-green-500 rounded-full" style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-medium text-gray-600 w-10 text-right">{value}%</span>
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
        <h2 className="text-2xl font-bold text-green-900 mb-2">Frequently Asked Questions</h2>
        <p className="text-gray-600">Find answers to common questions about CCRA licensing and regulation</p>
      </div>

      {/* FAQ Accordions */}
      <div className="space-y-3 mb-10">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white border border-green-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            <button
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              className="w-full flex items-center justify-between px-6 py-4 text-left"
            >
              <span className="text-sm font-semibold text-gray-900 pr-4">{faq.q}</span>
              <ChevronDown className={cn(
                'h-5 w-5 text-green-600 flex-shrink-0 transition-transform duration-200',
                openFaq === idx && 'rotate-180'
              )} />
            </button>
            {openFaq === idx && (
              <div className="px-6 pb-5 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="border-t border-green-100 pt-4">
                  <p className="text-sm text-gray-700 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-2xl p-8 text-white shadow-xl">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold mb-2">Contact CCRA</h3>
          <p className="text-green-200 text-sm">We are here to assist you with any inquiries regarding cannabis regulation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur rounded-xl p-5 space-y-4">
            <h4 className="font-semibold text-green-100 uppercase text-xs tracking-wider">Head Office</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-green-300 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">CCRA Headquarters</p>
                  <p className="text-xs text-green-300">Blue Area, Islamabad 44000, Pakistan</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-green-300 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">info@ccra.gov.pk</p>
                  <p className="text-xs text-green-300">General inquiries</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-green-300 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">licensing@ccra.gov.pk</p>
                  <p className="text-xs text-green-300">License applications</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl p-5 space-y-4">
            <h4 className="font-semibold text-green-100 uppercase text-xs tracking-wider">Helpline &amp; Hours</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-green-300 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">+92-51-111-CCRA (2272)</p>
                  <p className="text-xs text-green-300">Toll-free helpline</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-green-300 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Monday - Friday</p>
                  <p className="text-xs text-green-300">9:00 AM - 5:00 PM (PKT, GMT+5)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-green-300 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">www.ccra.gov.pk</p>
                  <p className="text-xs text-green-300">Official website</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-green-700 text-center">
          <p className="text-xs text-green-400">
            For emergencies related to unauthorized cannabis activities, contact the CCRA Enforcement Hotline: +92-51-111-ENFC (3632)
          </p>
        </div>
      </div>
    </div>
  )
}
