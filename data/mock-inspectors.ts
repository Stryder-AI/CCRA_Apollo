export interface Inspector {
  id: string
  name: string
  rank: string
  region: string
  phone: string
  email: string
  activeInspections: number
  completedThisMonth: number
  totalCompleted: number
  completionRate: number
  avgComplianceScore: number
  nextScheduled: string
  nextScheduledFarm: string
  status: 'in-field' | 'available' | 'on-leave'
  currentLocation: string
  specialization: string
}

export interface LiveInspectionEntry {
  id: string
  inspectorName: string
  farmName: string
  region: string
  timestamp: string
  score: number
  status: 'submitted' | 'reviewing' | 'approved'
  photoCount: number
  gpsCoords: string
  summary: string
}

export interface ChecklistItem {
  id: string
  category: string
  item: string
  description: string
  weight: number
}

export const inspectors: Inspector[] = [
  {
    id: 'insp-001',
    name: 'Col. Tariq Mehmood',
    rank: 'Colonel',
    region: 'Tirah Valley & Chagai',
    phone: '+92-321-5551001',
    email: 'tariq.mehmood@ccra.gov.pk',
    activeInspections: 3,
    completedThisMonth: 7,
    totalCompleted: 142,
    completionRate: 96,
    avgComplianceScore: 82,
    nextScheduled: '2026-03-20',
    nextScheduledFarm: 'Tirah Gold Plantation',
    status: 'in-field',
    currentLocation: 'Tirah Valley, inspecting northern cultivation zone',
    specialization: 'High-altitude cultivation & THC compliance',
  },
  {
    id: 'insp-002',
    name: 'Maj. Saeed Anwar',
    rank: 'Major',
    region: 'Swat & Malakand',
    phone: '+92-321-5552002',
    email: 'saeed.anwar@ccra.gov.pk',
    activeInspections: 2,
    completedThisMonth: 5,
    totalCompleted: 98,
    completionRate: 91,
    avgComplianceScore: 76,
    nextScheduled: '2026-03-25',
    nextScheduledFarm: 'Malakand Green Acres',
    status: 'available',
    currentLocation: 'Swat HQ, completing reports',
    specialization: 'Irrigation systems & water usage compliance',
  },
  {
    id: 'insp-003',
    name: 'Lt. Col. Imran Shah',
    rank: 'Lieutenant Colonel',
    region: 'Dir & Quetta',
    phone: '+92-321-5553003',
    email: 'imran.shah@ccra.gov.pk',
    activeInspections: 1,
    completedThisMonth: 8,
    totalCompleted: 167,
    completionRate: 98,
    avgComplianceScore: 91,
    nextScheduled: '2026-04-01',
    nextScheduledFarm: 'Chagai Golden Fields',
    status: 'in-field',
    currentLocation: 'Dir district, en route to highland farms',
    specialization: 'Organic certification & lab compliance',
  },
  {
    id: 'insp-004',
    name: 'Capt. Zubair Ali',
    rank: 'Captain',
    region: 'Buner & Panjgur',
    phone: '+92-321-5554004',
    email: 'zubair.ali@ccra.gov.pk',
    activeInspections: 2,
    completedThisMonth: 4,
    totalCompleted: 63,
    completionRate: 88,
    avgComplianceScore: 94,
    nextScheduled: '2026-04-10',
    nextScheduledFarm: 'Panjgur Valley Farm',
    status: 'on-leave',
    currentLocation: 'On leave — returns March 22',
    specialization: 'Waste management & environmental compliance',
  },
]

export const liveInspectionFeed: LiveInspectionEntry[] = [
  {
    id: 'live-001',
    inspectorName: 'Col. Tariq Mehmood',
    farmName: 'Tirah Valley Estate',
    region: 'Tirah Valley',
    timestamp: '2026-03-17T09:45:00',
    score: 91,
    status: 'submitted',
    photoCount: 12,
    gpsCoords: '33.9272°N, 70.5531°E',
    summary: 'Routine quarterly inspection complete. All cultivation parameters within range. Minor gap in pesticide application logs — last 3 entries undated.',
  },
  {
    id: 'live-002',
    inspectorName: 'Lt. Col. Imran Shah',
    farmName: 'Dir Highland Farms',
    region: 'Dir',
    timestamp: '2026-03-17T08:30:00',
    score: 95,
    status: 'approved',
    photoCount: 8,
    gpsCoords: '35.2028°N, 71.8747°E',
    summary: 'Exemplary compliance standards maintained. Organic certification verified and current. Recommended for excellence award consideration.',
  },
  {
    id: 'live-003',
    inspectorName: 'Maj. Saeed Anwar',
    farmName: 'Swat Green Fields',
    region: 'Swat',
    timestamp: '2026-03-17T07:15:00',
    score: 72,
    status: 'reviewing',
    photoCount: 15,
    gpsCoords: '35.2227°N, 72.3526°E',
    summary: 'Irrigation system operating below efficiency thresholds. Water wastage estimated at 23% above permissible limits. Cultivation area compliant.',
  },
  {
    id: 'live-004',
    inspectorName: 'Capt. Zubair Ali',
    farmName: 'Buner Valley Organics',
    region: 'Buner',
    timestamp: '2026-03-16T16:20:00',
    score: 97,
    status: 'approved',
    photoCount: 10,
    gpsCoords: '34.3943°N, 72.6336°E',
    summary: 'Outstanding organic practices verified. All certifications current. Soil testing results within optimal range. Zero violations noted.',
  },
  {
    id: 'live-005',
    inspectorName: 'Col. Tariq Mehmood',
    farmName: 'Chagai Desert Bloom',
    region: 'Chagai',
    timestamp: '2026-03-16T14:00:00',
    score: 88,
    status: 'approved',
    photoCount: 9,
    gpsCoords: '29.3191°N, 64.6855°E',
    summary: 'Novel desert irrigation system performing well. Storage conditions adequate. Documentation complete. Minor transport logging gap.',
  },
  {
    id: 'live-006',
    inspectorName: 'Lt. Col. Imran Shah',
    farmName: 'Quetta Highland Farm',
    region: 'Quetta',
    timestamp: '2026-03-16T11:30:00',
    score: 84,
    status: 'submitted',
    photoCount: 14,
    gpsCoords: '30.1798°N, 66.9750°E',
    summary: 'Water usage 15% above recommended levels. Cultivation area fully compliant. Worker safety equipment inspection passed. Storage temps borderline.',
  },
  {
    id: 'live-007',
    inspectorName: 'Maj. Saeed Anwar',
    farmName: 'Panjgur Oasis',
    region: 'Panjgur',
    timestamp: '2026-03-16T09:45:00',
    score: 58,
    status: 'reviewing',
    photoCount: 18,
    gpsCoords: '26.9671°N, 64.0978°E',
    summary: 'ALERT: Cultivation extends 1.8 hectares beyond permitted boundary. Boundary markers displaced. Immediate corrective action recommended.',
  },
  {
    id: 'live-008',
    inspectorName: 'Capt. Zubair Ali',
    farmName: 'Tirah Medicinal Labs',
    region: 'Tirah Valley',
    timestamp: '2026-03-15T15:10:00',
    score: 98,
    status: 'approved',
    photoCount: 6,
    gpsCoords: '33.9350°N, 70.5620°E',
    summary: 'Pharmaceutical-grade standards fully maintained. Lab certification current. All product testing documentation complete and verified.',
  },
]

export const inspectionChecklist: ChecklistItem[] = [
  {
    id: 'chk-01',
    category: 'Security',
    item: 'Facility Security',
    description: 'Perimeter fencing, access control systems, surveillance cameras, guard presence, and entry/exit logging compliance.',
    weight: 10,
  },
  {
    id: 'chk-02',
    category: 'Cultivation',
    item: 'Cultivation Area Compliance',
    description: 'Cultivation within permitted boundaries, approved strain verification, plant count accuracy, and growth stage documentation.',
    weight: 12,
  },
  {
    id: 'chk-03',
    category: 'Administration',
    item: 'Record-Keeping',
    description: 'Daily logs, harvest records, inventory tracking, personnel records, and visitor logs maintained as per CCRA standards.',
    weight: 8,
  },
  {
    id: 'chk-04',
    category: 'Storage',
    item: 'Storage Conditions',
    description: 'Temperature control (18-22°C), humidity levels (55-62%), light exposure prevention, and secure vault access protocols.',
    weight: 10,
  },
  {
    id: 'chk-05',
    category: 'Environmental',
    item: 'Waste Management',
    description: 'Plant waste disposal procedures, chemical waste handling, composting protocols, and waste tracking documentation.',
    weight: 7,
  },
  {
    id: 'chk-06',
    category: 'Environmental',
    item: 'Water Usage',
    description: 'Water consumption within allocated limits, irrigation efficiency, runoff management, and water quality testing records.',
    weight: 8,
  },
  {
    id: 'chk-07',
    category: 'Compliance',
    item: 'Pesticide Compliance',
    description: 'Approved pesticide usage only, application records, residue testing, and integrated pest management plan adherence.',
    weight: 9,
  },
  {
    id: 'chk-08',
    category: 'Safety',
    item: 'Worker Safety',
    description: 'PPE availability and usage, safety training records, first aid stations, emergency procedures, and incident reporting.',
    weight: 8,
  },
  {
    id: 'chk-09',
    category: 'Quality',
    item: 'Labeling Accuracy',
    description: 'Product labels match contents, THC/CBD levels clearly stated, batch numbers traceable, and expiry dates accurate.',
    weight: 7,
  },
  {
    id: 'chk-10',
    category: 'Quality',
    item: 'Product Testing',
    description: 'Third-party lab testing compliance, THC levels within 20% limit, contaminant screening, and certificate of analysis validity.',
    weight: 9,
  },
  {
    id: 'chk-11',
    category: 'Security',
    item: 'Transport Security',
    description: 'Licensed transport vehicles, GPS tracking active, sealed containers, chain of custody documentation, and escort protocols.',
    weight: 7,
  },
  {
    id: 'chk-12',
    category: 'Administration',
    item: 'Documentation Completeness',
    description: 'All CCRA-mandated forms filed, license displayed, inspection history accessible, and regulatory correspondence archived.',
    weight: 5,
  },
]
