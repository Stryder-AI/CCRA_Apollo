// DG Executive Command Center — Mock Data

export interface PendingApproval {
  id: string
  type: 'license' | 'inspection' | 'policy-exception'
  title: string
  description: string
  farmOrApplicant: string
  submittedBy: string
  submittedDate: string
  priority: 'urgent' | 'high' | 'normal'
  aiRecommendation: string
  aiConfidence: number
}

export interface Escalation {
  id: string
  title: string
  description: string
  escalatedBy: { name: string; role: string }
  severity: 'critical' | 'high' | 'medium'
  timestamp: string
  module: string
  suggestedAction: string
}

export interface KPIData {
  id: string
  label: string
  value: number
  target: number
  unit: string
  trend: number
  status: 'on-track' | 'at-risk' | 'behind'
  actionPlan: string[]
}

export interface QuickAction {
  id: string
  label: string
  iconName: string
  description: string
  confirmTitle: string
  confirmDescription: string
}

export interface StrategicPeriod {
  period: string
  predictions: { text: string; type: 'risk' | 'opportunity' }[]
  riskLevel: 'low' | 'medium' | 'high'
}

// --------------- Pending Approvals ---------------

export const pendingApprovals: PendingApproval[] = [
  {
    id: 'PA-001',
    type: 'license',
    title: 'New Cannabis Cultivation License — Tier III',
    description: 'Application for 50-acre cultivation facility in Peshawar District with full processing capabilities. Applicant has completed all prerequisite inspections.',
    farmOrApplicant: 'Green Valley Agri-Corp',
    submittedBy: 'Director Licensing — Amjad Hussain',
    submittedDate: '2026-03-14',
    priority: 'urgent',
    aiRecommendation: 'Approve — Applicant meets all 14 licensing criteria. Background check clear. Facility inspection scored 94/100. Revenue projection: PKR 12.5M annually. No compliance flags.',
    aiConfidence: 96,
  },
  {
    id: 'PA-002',
    type: 'license',
    title: 'License Renewal — Processing Facility',
    description: 'Annual renewal for extraction and processing license. Previous year compliance rate: 98.2%. Minor infraction resolved in Q2.',
    farmOrApplicant: 'Swat Botanicals Ltd.',
    submittedBy: 'Director Licensing — Amjad Hussain',
    submittedDate: '2026-03-12',
    priority: 'normal',
    aiRecommendation: 'Approve — Exemplary compliance history. All fees paid. Q2 infraction was administrative (late reporting by 2 days), not operational. Recommend standard renewal.',
    aiConfidence: 99,
  },
  {
    id: 'PA-003',
    type: 'license',
    title: 'Provisional License — Research Facility',
    description: 'University of Peshawar seeking research-only license for cannabinoid studies. Requires DG sign-off per Section 12(b) of the CRA Act.',
    farmOrApplicant: 'University of Peshawar — Dept. of Pharmacology',
    submittedBy: 'Director Research — Dr. Farah Malik',
    submittedDate: '2026-03-10',
    priority: 'high',
    aiRecommendation: 'Approve with conditions — Strong academic credentials. Recommend imposing quarterly reporting requirements and limiting initial scope to analytical research only. Expansion review in 6 months.',
    aiConfidence: 88,
  },
  {
    id: 'PA-004',
    type: 'inspection',
    title: 'Post-Harvest Facility Inspection — Final Sign-off',
    description: 'Inspection report for Mardan District processing facility. Inspector flagged minor ventilation issue (non-critical). All other parameters passed.',
    farmOrApplicant: 'Highland Hemp Industries',
    submittedBy: 'Chief Inspector — Tariq Mehmood',
    submittedDate: '2026-03-13',
    priority: 'high',
    aiRecommendation: 'Approve — Ventilation issue is cosmetic and does not affect product safety. Facility scored 91/100. Recommend approval with 30-day remediation notice for ventilation.',
    aiConfidence: 92,
  },
  {
    id: 'PA-005',
    type: 'inspection',
    title: 'Seed-to-Sale Audit — Quarterly Review',
    description: 'Complete traceability audit for Q1 2026. Three farms audited across Swabi and Charsadda districts. Minor discrepancy in batch #SB-2026-0441.',
    farmOrApplicant: 'Multi-farm audit (3 facilities)',
    submittedBy: 'Chief Inspector — Tariq Mehmood',
    submittedDate: '2026-03-15',
    priority: 'normal',
    aiRecommendation: 'Approve — Batch discrepancy traced to data entry error (23kg vs 32kg recorded). Physical inventory confirmed 32kg correct. Recommend systemic data validation improvement.',
    aiConfidence: 94,
  },
  {
    id: 'PA-006',
    type: 'policy-exception',
    title: 'Emergency Transport Corridor — Flood Relief',
    description: 'Request to temporarily authorize alternative transport routes for licensed product movement due to flood damage on primary corridor (N-35 Highway). Duration: 45 days.',
    farmOrApplicant: 'KP Cannabis Transport Association',
    submittedBy: 'Director Operations — Bilal Khan',
    submittedDate: '2026-03-16',
    priority: 'urgent',
    aiRecommendation: 'Approve — Flood damage confirmed by NDMA. Alternative routes have been security-assessed. Recommend GPS tracking mandate on all alternative-route shipments and weekly status reviews.',
    aiConfidence: 91,
  },
]

// --------------- Escalations ---------------

export const escalations: Escalation[] = [
  {
    id: 'ESC-001',
    title: 'Unlicensed Cultivation Detected — Bajaur District',
    description: 'Satellite imagery analysis identified 3 potential unlicensed cultivation sites totaling approximately 12 acres in Bajaur tribal area. Requires immediate enforcement action.',
    escalatedBy: { name: 'Nazia Afridi', role: 'Director Enforcement' },
    severity: 'critical',
    timestamp: '2026-03-17T08:30:00Z',
    module: 'Compliance & Enforcement',
    suggestedAction: 'Deploy joint inspection team with law enforcement support. Issue cease-and-desist notices. Coordinate with District Administration for ground verification within 48 hours. Initiate prosecution proceedings if confirmed.',
  },
  {
    id: 'ESC-002',
    title: 'Revenue Collection Shortfall — Q1 Target at Risk',
    description: 'Current Q1 revenue collection stands at PKR 89.2M against target of PKR 125M (71.4%). With 14 days remaining, projected shortfall of PKR 18.3M unless corrective action taken.',
    escalatedBy: { name: 'Imran Yousafzai', role: 'Director Revenue' },
    severity: 'high',
    timestamp: '2026-03-16T14:15:00Z',
    module: 'Revenue Intelligence',
    suggestedAction: 'Accelerate pending license fee collections (PKR 8.5M outstanding). Issue reminder notices for overdue renewal fees. Consider early processing of 12 pending applications to capture associated fees. Schedule emergency revenue review meeting.',
  },
  {
    id: 'ESC-003',
    title: 'Inspector Misconduct Allegation — Nowshera District',
    description: 'Whistleblower report received alleging Inspector Khalid Shah accepted PKR 200,000 from Nowshera Green Farms to overlook seed tracking violations. Internal Affairs has preliminary evidence.',
    escalatedBy: { name: 'Saira Begum', role: 'Director Internal Affairs' },
    severity: 'critical',
    timestamp: '2026-03-16T09:45:00Z',
    module: 'Internal Affairs',
    suggestedAction: 'Immediately suspend Inspector Khalid Shah pending investigation. Assign independent re-inspection of Nowshera Green Farms. Preserve all digital evidence. Brief Legal Division. Consider referring to Anti-Corruption Establishment if evidence warrants.',
  },
  {
    id: 'ESC-004',
    title: 'THC Limit Exceedance — Export Batch Held',
    description: 'Lab results show Batch #EXP-2026-0087 destined for export tested at 0.42% THC (limit: 0.3%). Shipment valued at PKR 4.2M currently held at Peshawar Export Hub.',
    escalatedBy: { name: 'Dr. Adeel Raza', role: 'Chief Scientific Officer' },
    severity: 'high',
    timestamp: '2026-03-15T16:20:00Z',
    module: 'Quality Assurance',
    suggestedAction: 'Quarantine batch immediately. Order re-testing by independent lab. If confirmed, divert to domestic market (higher THC threshold) or order remediation processing. Notify export partner of delay. Review source farm cultivation practices.',
  },
  {
    id: 'ESC-005',
    title: 'Cybersecurity Alert — Unusual Access Pattern',
    description: 'SOC detected 847 failed login attempts against CCRA licensing portal from IP range 185.x.x.x (foreign origin) over 6-hour period. No breach confirmed but pattern suggests coordinated attack.',
    escalatedBy: { name: 'Usman Ghani', role: 'Chief Information Security Officer' },
    severity: 'medium',
    timestamp: '2026-03-15T11:00:00Z',
    module: 'IT Security',
    suggestedAction: 'Block identified IP range at firewall level. Enable enhanced monitoring on licensing portal. Mandate password resets for all admin accounts. Deploy additional WAF rules. Schedule security briefing with IT team within 24 hours.',
  },
]

// --------------- KPI Data ---------------

export const kpiData: KPIData[] = [
  {
    id: 'kpi-1',
    label: 'Active Licenses',
    value: 1247,
    target: 1500,
    unit: 'licenses',
    trend: 8.3,
    status: 'at-risk',
    actionPlan: [
      'Accelerate processing of 38 pending applications currently in review queue',
      'Launch outreach campaign targeting 200+ identified potential applicants in Malakand Division',
      'Reduce average processing time from 21 days to 14 days by deploying additional review officers',
      'Partner with District Administrations for facilitation camps in underserved areas',
    ],
  },
  {
    id: 'kpi-2',
    label: 'Revenue Collected',
    value: 89200000,
    target: 125000000,
    unit: 'PKR',
    trend: -4.2,
    status: 'behind',
    actionPlan: [
      'Issue final notices for PKR 8.5M in overdue license renewal fees (47 accounts)',
      'Fast-track 12 high-value license applications (est. PKR 15M in fees)',
      'Deploy mobile collection teams to 5 remote districts with outstanding balances',
      'Implement automated payment reminders via SMS for upcoming due dates',
      'Consider early invoicing for Q2 renewals due within 30 days',
    ],
  },
  {
    id: 'kpi-3',
    label: 'Compliance Rate',
    value: 94.7,
    target: 98,
    unit: '%',
    trend: 2.1,
    status: 'at-risk',
    actionPlan: [
      'Focus enforcement on 67 facilities with repeat minor violations',
      'Launch compliance awareness workshops in 3 lowest-performing districts',
      'Deploy AI-powered continuous monitoring for real-time violation detection',
      'Implement graduated penalty framework to incentivize self-correction',
    ],
  },
  {
    id: 'kpi-4',
    label: 'Inspections Completed',
    value: 342,
    target: 400,
    unit: 'inspections',
    trend: 12.5,
    status: 'on-track',
    actionPlan: [
      'Current pace projects 395-410 completions by quarter end',
      'Prioritize 28 high-risk facility inspections scheduled for final 2 weeks',
      'Deploy 2 additional mobile inspection teams to Hazara Division',
      'Maintain current momentum — no corrective action needed',
    ],
  },
  {
    id: 'kpi-5',
    label: 'Avg. Processing Time',
    value: 18,
    target: 14,
    unit: 'days',
    trend: -8.6,
    status: 'behind',
    actionPlan: [
      'Identify and resolve bottleneck at document verification stage (avg. 6 days)',
      'Deploy 3 additional review officers to licensing division',
      'Implement automated document pre-screening to reduce manual review load by 40%',
      'Establish expedited track for renewal applications (target: 7 days)',
      'Set up daily queue management meetings to track processing velocity',
    ],
  },
  {
    id: 'kpi-6',
    label: 'Enforcement Actions',
    value: 23,
    target: 15,
    unit: 'actions',
    trend: 34.2,
    status: 'on-track',
    actionPlan: [
      'Enforcement rate exceeds target — reflects improved detection capabilities',
      'Review whether increased actions indicate systemic compliance issues',
      'Analyze geographic distribution to identify hotspot patterns',
      'Ensure due process adherence across all 23 active enforcement cases',
    ],
  },
]

// --------------- Quick Actions ---------------

export const quickActions: QuickAction[] = [
  {
    id: 'qa-1',
    label: 'Schedule Board Meeting',
    iconName: 'Calendar',
    description: 'Convene an emergency or regular CCRA board session',
    confirmTitle: 'Schedule Board Meeting',
    confirmDescription: 'This will send meeting invitations to all 9 CCRA Board Members, prepare the standard agenda template, and reserve the Executive Conference Room. Default scheduling: next available slot within 72 hours.',
  },
  {
    id: 'qa-2',
    label: 'Generate Quarterly Report',
    iconName: 'FileBarChart',
    description: 'AI-compiled comprehensive quarterly performance report',
    confirmTitle: 'Generate Quarterly Report',
    confirmDescription: 'STRYDER AI will compile data from all modules (Licensing, Revenue, Compliance, Inspections, Enforcement) into a comprehensive Q1 2026 report. Estimated generation time: 3-5 minutes. Report will include executive summary, KPI analysis, and strategic recommendations.',
  },
  {
    id: 'qa-3',
    label: 'Deploy Inspection Team',
    iconName: 'Shield',
    description: 'Dispatch field inspection team to a target area',
    confirmTitle: 'Deploy Inspection Team',
    confirmDescription: 'Select target district and inspection type. Available teams: 4 mobile units currently on standby. Deployment includes pre-loaded inspection checklists, GPS tracking, and real-time reporting capabilities. Average deployment time: 4 hours.',
  },
  {
    id: 'qa-4',
    label: 'Broadcast Policy Update',
    iconName: 'Megaphone',
    description: 'Push official policy notification to all stakeholders',
    confirmTitle: 'Broadcast Policy Update',
    confirmDescription: 'Distribute official CCRA policy notification to all registered licensees (1,247), inspectors (89), and district officers (34). Channels: SMS, Email, and CCRA Portal notification. Requires your digital signature for authentication.',
  },
  {
    id: 'qa-5',
    label: 'Review Compliance Alerts',
    iconName: 'AlertTriangle',
    description: 'View all active compliance alerts requiring attention',
    confirmTitle: 'Review Compliance Alerts',
    confirmDescription: 'Opening filtered compliance dashboard showing 12 active alerts: 3 Critical (unlicensed activity), 5 High (violation escalations), 4 Medium (reporting delays). Sorted by severity and recency.',
  },
  {
    id: 'qa-6',
    label: 'Export Intelligence Brief',
    iconName: 'Download',
    description: 'Generate classified intelligence briefing document',
    confirmTitle: 'Export Intelligence Brief',
    confirmDescription: 'STRYDER AI will generate a classified intelligence brief covering: active enforcement operations, threat assessments, market intelligence, and cross-border activity analysis. Document classification: CONFIDENTIAL. Export formats: PDF (encrypted), DOCX.',
  },
]

// --------------- Strategic Outlook ---------------

export const strategicOutlook: StrategicPeriod[] = [
  {
    period: '30 Days',
    riskLevel: 'medium',
    predictions: [
      { text: 'Q1 revenue gap will widen to PKR 22M without intervention — immediate collection drive required', type: 'risk' },
      { text: 'Flood-affected transport corridor expected to reopen by April 5 — normalize logistics', type: 'opportunity' },
      { text: '18 license applications nearing approval — potential PKR 9.2M in new revenue', type: 'opportunity' },
    ],
  },
  {
    period: '60 Days',
    riskLevel: 'high',
    predictions: [
      { text: 'Monsoon season preparation needed — 40% of licensed farms in flood-prone zones', type: 'risk' },
      { text: 'Federal Cannabis Export Policy draft expected — position CCRA for first-mover advantage', type: 'opportunity' },
      { text: 'Inspector shortage in Hazara Division will reach critical levels — 3 retirements pending', type: 'risk' },
    ],
  },
  {
    period: '90 Days',
    riskLevel: 'medium',
    predictions: [
      { text: 'Annual compliance audit by Federal Ministry scheduled for June — preparation needed', type: 'risk' },
      { text: 'International hemp conference in Islamabad — showcase CCRA model for national adoption', type: 'opportunity' },
      { text: 'Q2 licensing surge projected (35% increase) — ensure processing capacity is scaled', type: 'opportunity' },
    ],
  },
]
