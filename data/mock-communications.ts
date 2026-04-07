'use client'

export interface Communication {
  id: string
  type: 'announcement' | 'notice' | 'reminder' | 'congratulations'
  title: string
  body: string
  recipients: 'all-farmers' | 'region-kp' | 'region-balochistan' | 'individual'
  recipientCount: number
  sentBy: string
  sentDate: string
  status: 'sent' | 'draft' | 'scheduled'
  deliveryRate: number
  readRate: number
  priority: 'urgent' | 'normal' | 'low'
}

export interface MessageTemplate {
  id: string
  name: string
  category: string
  subject: string
  body: string
  variables: string[]
}

export const communications: Communication[] = [
  {
    id: 'com-001',
    type: 'announcement',
    title: 'Q2 2026 Compliance Deadline Reminder',
    body: 'All licensed cultivators must submit Q2 compliance documentation by April 15, 2026. Failure to comply may result in license suspension. Contact your regional office for assistance.',
    recipients: 'all-farmers',
    recipientCount: 25,
    sentBy: 'DG Office',
    sentDate: '2026-03-15',
    status: 'sent',
    deliveryRate: 96,
    readRate: 78,
    priority: 'urgent',
  },
  {
    id: 'com-002',
    type: 'notice',
    title: 'Updated THC Testing Thresholds',
    body: 'Effective April 1, 2026, the maximum permissible THC level for cultivation licenses has been revised to 19.5% in alignment with international standards. All farms will be re-tested during next scheduled inspection.',
    recipients: 'all-farmers',
    recipientCount: 25,
    sentBy: 'Dir. Operations',
    sentDate: '2026-03-12',
    status: 'sent',
    deliveryRate: 100,
    readRate: 65,
    priority: 'normal',
  },
  {
    id: 'com-003',
    type: 'reminder',
    title: 'License Renewal — 30 Day Notice',
    body: 'Your cultivation license (LIC-2025-XXX) expires on April 20, 2026. Please submit renewal documentation and fees at least 14 days before expiry to avoid service interruption.',
    recipients: 'individual',
    recipientCount: 4,
    sentBy: 'Licensing Office',
    sentDate: '2026-03-10',
    status: 'sent',
    deliveryRate: 100,
    readRate: 100,
    priority: 'urgent',
  },
  {
    id: 'com-004',
    type: 'congratulations',
    title: 'Compliance Excellence Award — Q1 2026',
    body: 'Congratulations! Your farm has been recognized for achieving a 95%+ compliance score across all Q1 inspections. You are eligible for the CCRA Excellence Certificate and fast-tracked renewal processing.',
    recipients: 'individual',
    recipientCount: 3,
    sentBy: 'DG Office',
    sentDate: '2026-03-08',
    status: 'sent',
    deliveryRate: 100,
    readRate: 100,
    priority: 'normal',
  },
  {
    id: 'com-005',
    type: 'announcement',
    title: 'KP Region — Seasonal Cultivation Advisory',
    body: 'Based on meteorological data and STRYDER AI analysis, the optimal planting window for Tirah Valley and Swat regions begins March 25. Recommended strains for this season: Pakistani Landrace, Swat Valley Kush. Pest monitoring advisories will follow weekly.',
    recipients: 'region-kp',
    recipientCount: 15,
    sentBy: 'Research Division',
    sentDate: '2026-03-05',
    status: 'sent',
    deliveryRate: 93,
    readRate: 87,
    priority: 'normal',
  },
  {
    id: 'com-006',
    type: 'notice',
    title: 'Inspection Team Deployment — Balochistan',
    body: 'CCRA inspection teams will conduct scheduled compliance inspections across Zhob, Quetta, and Chagai districts from March 20 to April 5. Please ensure all documentation and facilities are prepared for review.',
    recipients: 'region-balochistan',
    recipientCount: 10,
    sentBy: 'Inspection Division',
    sentDate: '2026-03-01',
    status: 'sent',
    deliveryRate: 100,
    readRate: 90,
    priority: 'normal',
  },
  {
    id: 'com-007',
    type: 'announcement',
    title: 'New Export Certification Process',
    body: 'Starting Q2 2026, all export batches require digital chain-of-custody verification through the CCRA Traceability System. Training sessions available at regional offices. Contact export@ccra.gov.pk for details.',
    recipients: 'all-farmers',
    recipientCount: 25,
    sentBy: 'Export Division',
    sentDate: '2026-02-28',
    status: 'sent',
    deliveryRate: 88,
    readRate: 52,
    priority: 'normal',
  },
  {
    id: 'com-008',
    type: 'reminder',
    title: 'Water Usage Report Submission',
    body: 'Monthly water usage reports for February 2026 are due by March 20. Submit through the CCRA portal or email to compliance@ccra.gov.pk. Late submissions may affect compliance scoring.',
    recipients: 'all-farmers',
    recipientCount: 25,
    sentBy: 'Compliance Office',
    sentDate: '2026-03-14',
    status: 'scheduled',
    deliveryRate: 0,
    readRate: 0,
    priority: 'low',
  },
]

export const messageTemplates: MessageTemplate[] = [
  {
    id: 'tpl-001',
    name: 'License Renewal Reminder',
    category: 'Licensing',
    subject: 'License Renewal — {{daysRemaining}} Day Notice',
    body: 'Dear {{farmerName}},\n\nYour {{licenseType}} license ({{licenseNumber}}) expires on {{expiryDate}}. Please submit renewal documentation and the renewal fee of PKR {{renewalFee}} at least 14 days before expiry.\n\nRequired documents:\n1. Updated land survey\n2. Previous compliance reports\n3. Renewal application form\n\nContact licensing@ccra.gov.pk for assistance.\n\nRegards,\nCCRA Licensing Division',
    variables: ['farmerName', 'licenseType', 'licenseNumber', 'expiryDate', 'renewalFee', 'daysRemaining'],
  },
  {
    id: 'tpl-002',
    name: 'Inspection Notice',
    category: 'Compliance',
    subject: 'Scheduled Compliance Inspection — {{inspectionDate}}',
    body: 'Dear {{farmerName}},\n\nA compliance inspection has been scheduled for your farm ({{farmName}}) on {{inspectionDate}}. Inspector {{inspectorName}} will conduct a 12-point evaluation.\n\nPlease ensure:\n- All cultivation records are up to date\n- Storage facilities are accessible\n- Required personnel are available on-site\n\nEstimated duration: 3-4 hours.\n\nRegards,\nCCRA Inspection Division',
    variables: ['farmerName', 'farmName', 'inspectionDate', 'inspectorName'],
  },
  {
    id: 'tpl-003',
    name: 'Violation Notice',
    category: 'Enforcement',
    subject: 'Compliance Violation — Immediate Action Required',
    body: 'Dear {{farmerName}},\n\nDuring the inspection on {{inspectionDate}}, the following violation was identified at {{farmName}}:\n\nViolation: {{violationType}}\nSeverity: {{severity}}\nPenalty: PKR {{penaltyAmount}}\n\nYou are required to submit a corrective action plan within 14 days. Failure to respond may result in license suspension.\n\nAppeal process available through CCRA regional office.\n\nRegards,\nCCRA Enforcement Division',
    variables: ['farmerName', 'farmName', 'inspectionDate', 'violationType', 'severity', 'penaltyAmount'],
  },
  {
    id: 'tpl-004',
    name: 'Compliance Congratulations',
    category: 'Recognition',
    subject: 'Compliance Excellence — {{farmName}}',
    body: 'Dear {{farmerName}},\n\nCongratulations! {{farmName}} has achieved a compliance score of {{score}}% in the {{quarter}} inspection cycle.\n\nBenefits of your excellence status:\n- Fast-tracked license renewal\n- Reduced inspection frequency\n- CCRA Excellence Certificate\n- Priority export certification\n\nThank you for your commitment to quality and regulatory compliance.\n\nRegards,\nOffice of the Director General, CCRA',
    variables: ['farmerName', 'farmName', 'score', 'quarter'],
  },
  {
    id: 'tpl-005',
    name: 'Seasonal Advisory',
    category: 'Operations',
    subject: 'Seasonal Cultivation Advisory — {{season}} {{year}}',
    body: 'Dear Cultivators,\n\nBased on STRYDER AI analysis of meteorological data and historical yield patterns:\n\nOptimal Planting Window: {{startDate}} to {{endDate}}\nRecommended Strains: {{strains}}\n\nKey advisories:\n- Monitor soil moisture levels daily\n- Pest risk level: {{pestRisk}}\n- Expected rainfall: {{rainfall}}mm\n\nWeekly updates will be provided through the CCRA portal.\n\nRegards,\nCCRA Research Division',
    variables: ['season', 'year', 'startDate', 'endDate', 'strains', 'pestRisk', 'rainfall'],
  },
]
