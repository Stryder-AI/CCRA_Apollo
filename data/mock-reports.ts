export interface ReportTemplate {
  id: string
  title: string
  description: string
  icon: string
  category: 'governance' | 'compliance' | 'financial' | 'regional' | 'ai'
  lastGenerated: string
  frequency: 'monthly' | 'quarterly' | 'on-demand'
  sections: { title: string; content: string }[]
}

export interface ReportHistoryItem {
  id: string
  templateId: string
  title: string
  generatedBy: string
  generatedDate: string
  format: 'PDF' | 'Excel'
  fileSize: string
  status: 'ready' | 'generating'
}

export interface ScheduledReport {
  id: string
  templateId: string
  frequency: 'weekly' | 'monthly' | 'quarterly'
  nextRun: string
  enabled: boolean
  recipients: number
}

export const reportTemplates: ReportTemplate[] = [
  {
    id: 'rpt-board',
    title: 'Board of Governors Quarterly',
    description: 'Comprehensive executive summary for the BoG with KPIs, revenue performance, compliance status, and strategic recommendations from STRYDER AI.',
    icon: 'LayoutDashboard',
    category: 'governance',
    lastGenerated: '2026-01-15',
    frequency: 'quarterly',
    sections: [
      {
        title: 'Executive Summary',
        content: 'The Cannabis Regulatory Authority has achieved significant operational milestones in Q1 FY2026. Total registered farms increased to 25 across Khyber Pakhtunkhwa (15) and Balochistan (10). Aggregate yield reached 287.5 tonnes, exceeding the quarterly target of 250 tonnes by 15%. License revenue collection stood at PKR 97.5M against a target of PKR 85M. Overall compliance rate is 82.9%, with 3 active enforcement actions pending resolution. STRYDER AI has flagged 4 priority areas requiring Board attention.'
      },
      {
        title: 'KPI Overview',
        content: 'Total Farms: 25 (+4 new registrations) | Active Licenses: 22 | Total Yield: 287.5 tonnes | Revenue Collected: PKR 270M | Compliance Rate: 82.9% | Pending Violations: 7 | Inspector Utilization: 91% | Avg Processing Time: 4.2 days'
      },
      {
        title: 'Revenue Breakdown',
        content: 'License Fees: PKR 97.5M (36.1%) | Penalties & Fines: PKR 152M (56.3%) | Inspection Fees: PKR 6M (2.2%) | Renewal Fees: PKR 14.5M (5.4%) | Total: PKR 270M | Collection Rate: 87.3% | Outstanding: PKR 39.2M | Q2 Projection: PKR 85M'
      },
      {
        title: 'Compliance Status',
        content: 'KP Region — 82.7% avg compliance, 4 active violations (2 water usage, 1 boundary, 1 pesticide). Balochistan Region — 83.4% avg compliance, 3 active violations (1 boundary, 1 documentation, 1 yield reporting). Critical: Panjgur Oasis boundary violation (PKR 25M penalty pending). High Priority: Chagai Desert Bloom water usage requires immediate intervention.'
      },
      {
        title: 'STRYDER AI Strategic Recommendations',
        content: 'REC-1: Deploy additional inspector to Chagai district — water compliance in 3 farms dropped below 75% threshold, risk of cascading violations. | REC-2: Accelerate Board review of Panjgur Oasis penalty — PKR 25M outstanding for 28 days, legal escalation risk. | REC-3: Adjust Q2 revenue target upward by 12% — current trajectory and 4 pending license applications support PKR 95.2M projection. | REC-4: Schedule compliance review workshop for Balochistan inspectors — pattern analysis shows 18% documentation gap vs KP region.'
      }
    ]
  },
  {
    id: 'rpt-intl',
    title: 'International Compliance',
    description: 'Export readiness, WHO/EU GMP alignment, lab testing compliance, and international certification tracking for cross-border regulatory alignment.',
    icon: 'Globe',
    category: 'compliance',
    lastGenerated: '2026-02-28',
    frequency: 'monthly',
    sections: [
      {
        title: 'Export Statistics',
        content: 'Total Export-Ready Farms: 8 of 25 (32%) | Export Applications Pending: 3 | Approved Export Destinations: Germany, Thailand, Australia | Total Export Volume (Q1): 42.3 tonnes | Export Revenue Contribution: PKR 38.5M | Rejected Shipments: 0 | Average Customs Clearance: 6.2 days'
      },
      {
        title: 'Lab Testing Compliance',
        content: 'Samples Tested (Q1): 156 | Pass Rate: 94.2% | Failed — Pesticide Residue: 4 | Failed — Heavy Metals: 2 | Failed — Microbial: 3 | Pending Results: 7 | Average Turnaround: 3.8 days | Accredited Labs: 4 (2 KP, 2 Balochistan) | ISO 17025 Certified: 3 of 4'
      },
      {
        title: 'WHO/EU GMP Alignment',
        content: 'GMP Compliant Facilities: 6 of 12 processing units (50%) | EU GMP Certification: 2 facilities fully certified | WHO Guidelines Alignment: 78% overall score | Gap Areas: Documentation control (62%), Environmental monitoring (71%), Validation protocols (68%) | Timeline to Full Alignment: Est. 8 months | Required Investment: PKR 45M across 6 facilities'
      },
      {
        title: 'Certification Status',
        content: 'GACP Certified Farms: 12 of 25 (48%) | ISO 9001: 4 processing units | HACCP: 3 processing units | Organic Certification: 2 farms (Tirah Valley, Malakand Sunrise) | EU-GMP: 2 facilities | WHO PQ Status: Under review (2 products) | UNODC Compliance: Full alignment confirmed'
      }
    ]
  },
  {
    id: 'rpt-revenue',
    title: 'Revenue & Financial Statement',
    description: 'Detailed financial reporting with monthly breakdowns, collection rates, outstanding balances, and revenue projections powered by AI forecasting.',
    icon: 'IndianRupee',
    category: 'financial',
    lastGenerated: '2026-03-01',
    frequency: 'monthly',
    sections: [
      {
        title: 'Monthly Revenue Breakdown',
        content: 'Apr 2025: PKR 12.9M | May 2025: PKR 15.6M | Jun 2025: PKR 10.8M | Jul 2025: PKR 14.5M | Aug 2025: PKR 8.2M | Sep 2025: PKR 83.4M | Oct 2025: PKR 58.6M | Nov 2025: PKR 32.8M | Dec 2025: PKR 4.4M | Jan 2026: PKR 10.6M | Feb 2026: PKR 9.2M | Mar 2026: PKR 9.0M (projected)'
      },
      {
        title: 'Collection Rates',
        content: 'Overall Collection Rate: 87.3% | License Fees: 94.1% collection | Penalties: 78.2% collection (PKR 33.1M outstanding) | Inspection Fees: 99.8% collection | Renewal Fees: 91.5% collection | Trend: +2.3pp improvement over previous quarter | Target: 92% by Q2 end'
      },
      {
        title: 'Outstanding Amounts',
        content: 'Total Outstanding: PKR 39.2M | Panjgur Oasis — PKR 25M (boundary violation penalty, 28 days overdue) | Quetta Highland Farm — PKR 1M (water usage violation, 9 days overdue) | 3 farms with overdue inspection fees — PKR 0.95M combined | 2 farms with pending renewal — PKR 3M combined | Aging 30+: PKR 25M | Aging 15-30: PKR 10.2M | Aging 0-15: PKR 4M'
      },
      {
        title: 'AI Revenue Projections',
        content: 'Q2 FY2026 Projected: PKR 95.2M (+12% above baseline target) | Drivers: 4 new license applications (est. PKR 8M), 6 renewals due (est. PKR 9M), seasonal yield increase. Risk Factors: Outstanding penalty collection (-PKR 15M if unresolved), 2 suspension reviews could reduce inspection fees. Confidence: 84% | Best Case: PKR 108M | Worst Case: PKR 72M'
      }
    ]
  },
  {
    id: 'rpt-regional',
    title: 'Regional Performance',
    description: 'Side-by-side KP vs Balochistan comparison across all operational metrics, farm performance, yield analysis, and regional growth trajectories.',
    icon: 'MapPin',
    category: 'regional',
    lastGenerated: '2026-02-15',
    frequency: 'quarterly',
    sections: [
      {
        title: 'Khyber Pakhtunkhwa Overview',
        content: 'Farms: 15 | Active Licenses: 13 | Total Yield: 156.8 tonnes | Avg Yield/Farm: 10.45 tonnes | Revenue: PKR 148.5M | Compliance: 82.7% | Top Performing: Tirah Valley Estate (18.2t, 91% compliance) | Underperforming: Dir Cannabis Co-op (6.8t, 72% compliance) | New Registrations (Q1): 3 | Pending Applications: 2'
      },
      {
        title: 'Balochistan Overview',
        content: 'Farms: 10 | Active Licenses: 9 | Total Yield: 130.7 tonnes | Avg Yield/Farm: 13.07 tonnes | Revenue: PKR 121.5M | Compliance: 83.4% | Top Performing: Chagai Desert Bloom (22.5t, 89% compliance) | Underperforming: Panjgur Oasis (8.1t, 61% compliance — boundary violation) | New Registrations (Q1): 1 | Pending Applications: 2'
      },
      {
        title: 'Comparative Analysis',
        content: 'Yield Efficiency: Balochistan leads with 13.07t/farm vs KP 10.45t/farm (+25% advantage due to larger farm sizes in Chagai). Compliance: Balochistan marginally higher at 83.4% vs 82.7% but has higher variance (std dev 9.2 vs 5.8). Revenue per Farm: KP PKR 9.9M vs Balochistan PKR 12.15M. Inspector Coverage: KP 1:5 ratio vs Balochistan 1:3.3 ratio — KP needs 1 additional inspector.'
      },
      {
        title: 'Growth Trajectories',
        content: 'KP: 12% YoY farm growth, yield plateauing due to water constraints in Lower Dir. Balochistan: 8% YoY growth, high potential in Zhob district (3 pre-applications in pipeline). Recommendation: Prioritize KP inspector hiring. Allocate PKR 12M for Balochistan lab infrastructure. Target 30 total farms by Q4 FY2026.'
      }
    ]
  },
  {
    id: 'rpt-compliance',
    title: 'Compliance & Enforcement',
    description: 'Violations summary, inspector performance analytics, risk trend analysis, and enforcement action tracker with resolution timelines.',
    icon: 'ShieldCheck',
    category: 'compliance',
    lastGenerated: '2026-03-10',
    frequency: 'monthly',
    sections: [
      {
        title: 'Violations Summary',
        content: 'Total Active Violations: 7 | Critical: 2 (Panjgur boundary, Chagai water) | Major: 3 (pesticide use, documentation gaps) | Minor: 2 (reporting delays) | Resolved (Q1): 14 | Avg Resolution Time: 18.3 days | Penalty Revenue: PKR 152M | Repeat Offenders: 2 farms (Quetta Highland, Dir Co-op) | Escalated to Legal: 1'
      },
      {
        title: 'Inspector Performance',
        content: 'Total Inspectors: 8 | Inspections Completed (Q1): 67 | Avg per Inspector: 8.4 | Top Performer: Inspector Khalid Afridi (12 inspections, 96% accuracy) | Lowest: Inspector Mir Hamza (5 inspections, delayed reporting) | Field Days: 312 total | Report Submission (avg): 2.1 days after visit | Utilization Rate: 91%'
      },
      {
        title: 'Risk Trends',
        content: 'Water compliance violations up 34% QoQ — drought conditions in Chagai contributing factor. Boundary violations stable at 2 per quarter. Pesticide violations down 22% after Q4 enforcement action. Documentation compliance improving — 88% vs 79% previous quarter. Emerging Risk: 3 farms approaching license expiry without renewal applications. STRYDER AI Risk Score: Regional avg 6.2/10 (moderate).'
      },
      {
        title: 'Enforcement Actions',
        content: 'Suspensions: 1 active (Panjgur Oasis — pending Board review) | Warnings Issued: 4 (Q1) | Show-Cause Notices: 2 | Fines Levied: PKR 152M total | Fines Collected: PKR 118.8M (78.2%) | License Revocations: 0 | Remediation Plans Active: 5 | Compliance Improvement Orders: 3 | Next Review Date: April 5, 2026'
      }
    ]
  },
  {
    id: 'rpt-ai',
    title: 'STRYDER AI Strategic Brief',
    description: 'AI-generated strategic intelligence report with predictive analytics, risk forecasting, opportunity identification, and actionable recommendations.',
    icon: 'Brain',
    category: 'ai',
    lastGenerated: '2026-03-15',
    frequency: 'on-demand',
    sections: [
      {
        title: 'Strategic Intelligence Overview',
        content: 'STRYDER AI has analyzed 2,847 data points across farm operations, compliance records, financial transactions, and environmental sensors to generate this strategic brief. Analysis period: January 1 — March 15, 2026. Key finding: The CCRA is operating at 87% of optimal capacity with 4 high-impact intervention opportunities identified.'
      },
      {
        title: 'Predictive Analytics',
        content: 'YIELD FORECAST: Q2 aggregate yield projected at 310 tonnes (±8%, confidence 89%). Three farms in KP showing early indicators of yield decline — soil nutrient depletion pattern matches historical failures. COMPLIANCE FORECAST: Overall compliance expected to improve to 85.1% by June if current enforcement trajectory holds. Risk: Chagai water compliance could trigger cascade affecting 3 neighboring farms. REVENUE FORECAST: PKR 95.2M Q2 (confidence 84%). Upside scenario with all pending applications: PKR 108M.'
      },
      {
        title: 'Risk Assessment Matrix',
        content: 'CRITICAL RISKS (2): 1) Panjgur Oasis escalation — 35% probability of legal challenge if not resolved within 14 days. Recommended action: Expedite Board hearing. 2) Water table decline in Chagai — satellite data shows 12% drop in 90 days. 3 farms at risk of non-compliance. ELEVATED RISKS (3): License renewal backlog (6 due in 45 days), Inspector shortage in KP (ratio 1:5 exceeds recommended 1:4), Lab capacity strain (7-day backlog emerging).'
      },
      {
        title: 'Opportunity Identification',
        content: 'OPP-1: International market expansion — Thailand regulatory framework now accepts Pakistani cannabis certificates. Potential PKR 45M annual export revenue. OPP-2: Digital monitoring rollout — IoT sensor deployment across 8 farms would reduce inspection costs by 28% (PKR 1.7M annual saving). OPP-3: Strain optimization — Balochi Gold and KP Heritage strains show 23% higher yield potential with controlled environment adjustments. OPP-4: Training academy — Regional inspector certification program could address 40% of compliance gaps within 6 months.'
      },
      {
        title: 'Priority Action Recommendations',
        content: 'ACTION-1: Convene emergency Board session for Panjgur Oasis resolution (Priority: URGENT, Impact: High, Cost: Minimal). | ACTION-2: Deploy 2 mobile water monitoring units to Chagai district (Priority: HIGH, Impact: High, Cost: PKR 2.4M). | ACTION-3: Fast-track 4 pending license applications — projected PKR 8M revenue within 30 days (Priority: HIGH, Impact: Medium). | ACTION-4: Initiate Thailand export MOU discussions — first-mover advantage window estimated at 90 days (Priority: MEDIUM, Impact: Very High). | ACTION-5: Commission IoT pilot program for top 8 farms (Priority: MEDIUM, Impact: High, Cost: PKR 5.2M, ROI: 18 months).'
      }
    ]
  }
]

export const reportHistory: ReportHistoryItem[] = [
  { id: 'rh-01', templateId: 'rpt-ai', title: 'STRYDER AI Strategic Brief — March 2026', generatedBy: 'DG Cannabis Authority', generatedDate: '2026-03-15', format: 'PDF', fileSize: '2.4 MB', status: 'ready' },
  { id: 'rh-02', templateId: 'rpt-compliance', title: 'Compliance & Enforcement — March 2026', generatedBy: 'Director Compliance', generatedDate: '2026-03-10', format: 'PDF', fileSize: '1.8 MB', status: 'ready' },
  { id: 'rh-03', templateId: 'rpt-revenue', title: 'Revenue & Financial Statement — March 2026', generatedBy: 'CFO Office', generatedDate: '2026-03-01', format: 'Excel', fileSize: '3.1 MB', status: 'ready' },
  { id: 'rh-04', templateId: 'rpt-intl', title: 'International Compliance — February 2026', generatedBy: 'Director International Affairs', generatedDate: '2026-02-28', format: 'PDF', fileSize: '2.1 MB', status: 'ready' },
  { id: 'rh-05', templateId: 'rpt-regional', title: 'Regional Performance — Q4 FY2025', generatedBy: 'DG Cannabis Authority', generatedDate: '2026-02-15', format: 'PDF', fileSize: '4.2 MB', status: 'ready' },
  { id: 'rh-06', templateId: 'rpt-board', title: 'Board of Governors Quarterly — Q4 FY2025', generatedBy: 'DG Cannabis Authority', generatedDate: '2026-01-15', format: 'PDF', fileSize: '5.7 MB', status: 'ready' },
  { id: 'rh-07', templateId: 'rpt-revenue', title: 'Revenue & Financial Statement — January 2026', generatedBy: 'CFO Office', generatedDate: '2026-01-05', format: 'Excel', fileSize: '2.9 MB', status: 'ready' },
  { id: 'rh-08', templateId: 'rpt-compliance', title: 'Compliance & Enforcement — December 2025', generatedBy: 'Director Compliance', generatedDate: '2025-12-31', format: 'PDF', fileSize: '1.6 MB', status: 'ready' },
  { id: 'rh-09', templateId: 'rpt-ai', title: 'STRYDER AI Strategic Brief — Q4 Review', generatedBy: 'DG Cannabis Authority', generatedDate: '2025-12-20', format: 'PDF', fileSize: '2.8 MB', status: 'ready' },
  { id: 'rh-10', templateId: 'rpt-intl', title: 'International Compliance — November 2025', generatedBy: 'Director International Affairs', generatedDate: '2025-11-30', format: 'PDF', fileSize: '1.9 MB', status: 'ready' },
]

export const scheduledReports: ScheduledReport[] = [
  { id: 'sr-01', templateId: 'rpt-board', frequency: 'quarterly', nextRun: '2026-04-01', enabled: true, recipients: 12 },
  { id: 'sr-02', templateId: 'rpt-revenue', frequency: 'monthly', nextRun: '2026-04-01', enabled: true, recipients: 8 },
  { id: 'sr-03', templateId: 'rpt-compliance', frequency: 'monthly', nextRun: '2026-04-01', enabled: true, recipients: 6 },
  { id: 'sr-04', templateId: 'rpt-intl', frequency: 'monthly', nextRun: '2026-04-01', enabled: false, recipients: 5 },
]
