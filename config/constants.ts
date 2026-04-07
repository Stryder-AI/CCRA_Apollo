export const APP_NAME = 'CCRA Intelligence Nexus'
export const APP_VERSION = '0.2.0'
export const ORGANIZATION = 'Cannabis Control & Regulatory Authority'
export const ORGANIZATION_SHORT = 'CCRA'
export const BUILT_BY = 'TechGIS — Technology & GIS Solutions'

export const MAP_CENTER: [number, number] = [30.3753, 69.3451]
export const MAP_ZOOM = 6

export const TILE_URLS = {
  light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
}

export const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'

export const REGIONS = [
  'Tirah Valley', 'Swat', 'Dir', 'Chitral', 'Malakand', 'Buner',
  'Zhob', 'Quetta', 'Chagai', 'Panjgur', 'Khuzdar',
] as const

export const KP_REGIONS = ['Tirah Valley', 'Swat', 'Dir', 'Chitral', 'Malakand', 'Buner'] as const
export const BALOCHISTAN_REGIONS = ['Zhob', 'Quetta', 'Chagai', 'Panjgur', 'Khuzdar'] as const

export const STRAINS = [
  'Pakistani Landrace',
  'Peshawar Purple',
  'Balochi Gold',
  'Tirah Valley Green',
  'Swat Valley Kush',
  'Hindu Kush',
  'Chitral Purple',
  'Malakand Express',
  'Industrial Hemp (CBD)',
  'Medicinal Grade A',
] as const

export const FEE_SCHEDULE = [
  { type: 'Cultivation', application: 500000, annual: 2000000, renewal: 1500000, inspection: 200000 },
  { type: 'Extraction', application: 1000000, annual: 4000000, renewal: 3000000, inspection: 350000 },
  { type: 'Manufacturing', application: 2000000, annual: 6000000, renewal: 5000000, inspection: 500000 },
  { type: 'Sales & Distribution', application: 1500000, annual: 3000000, renewal: 2500000, inspection: 300000 },
]

export const STATUS_COLORS = {
  active: { bg: 'rgba(34, 197, 94, 0.15)', text: '#16a34a', darkText: '#4ade80', border: '#22c55e' },
  pending: { bg: 'rgba(234, 179, 8, 0.15)', text: '#a16207', darkText: '#facc15', border: '#eab308' },
  suspended: { bg: 'rgba(239, 68, 68, 0.12)', text: '#dc2626', darkText: '#f87171', border: '#ef4444' },
  revoked: { bg: 'rgba(107, 114, 128, 0.12)', text: '#4b5563', darkText: '#9ca3af', border: '#6b7280' },
  expired: { bg: 'rgba(107, 114, 128, 0.12)', text: '#4b5563', darkText: '#9ca3af', border: '#6b7280' },
  'under-review': { bg: 'rgba(59, 130, 246, 0.12)', text: '#2563eb', darkText: '#60a5fa', border: '#3b82f6' },
  approved: { bg: 'rgba(34, 197, 94, 0.15)', text: '#16a34a', darkText: '#4ade80', border: '#22c55e' },
  rejected: { bg: 'rgba(239, 68, 68, 0.12)', text: '#dc2626', darkText: '#f87171', border: '#ef4444' },
} as const
