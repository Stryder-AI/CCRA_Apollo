import { Alert } from '@/types/compliance'

export const alerts: Alert[] = [
  { id: 'al001', type: 'danger', title: 'Critical Violation Unresolved', message: 'Dir Cannabis Co-op THC violation (v001) has been open for 197 days. Immediate action required.', timestamp: '2026-03-15T08:00:00Z', read: false },
  { id: 'al002', type: 'warning', title: 'License Expiring Soon', message: '3 cultivation licenses expire within 90 days. Review renewal pipeline.', timestamp: '2026-03-14T09:00:00Z', read: false },
  { id: 'al003', type: 'info', title: '5 Inspections Scheduled', message: 'Upcoming inspections between March 20 — April 15, 2026. Confirm inspector availability.', timestamp: '2026-03-10T10:00:00Z', read: true },
  { id: 'al004', type: 'warning', title: 'Pending Applications', message: '5 farm registrations and 2 license applications awaiting review.', timestamp: '2026-03-08T11:00:00Z', read: true },
  { id: 'al005', type: 'danger', title: 'Appeal Hearing Due', message: 'Dir Cannabis Co-op appeal for unauthorized additives violation (v007) hearing date approaching.', timestamp: '2026-03-12T08:30:00Z', read: true },
  { id: 'al006', type: 'warning', title: '[STRYDER AI] Anomaly Detected', message: 'Unusual water consumption spike at Tirah Valley Estate — 34% above baseline for this time of year. Recommend field verification.', timestamp: '2026-03-16T14:00:00Z', read: false },
  { id: 'al007', type: 'info', title: '[STRYDER AI] Compliance Prediction', message: '3 farms predicted to miss next compliance deadline based on historical reporting patterns: Panjgur Valley Farm, Quetta Highland Farm, Tirah Gold Plantation.', timestamp: '2026-03-16T10:00:00Z', read: false },
]
