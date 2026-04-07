import { Inspection } from '@/types/compliance'

export const inspections: Inspection[] = [
  // Completed (10)
  { id: 'i001', farmId: 'f001', farmName: 'Tirah Valley Estate', inspectorName: 'Col. Tariq Mehmood', scheduledDate: '2025-11-25', completedDate: '2025-12-01', status: 'completed', complianceScore: 92, findings: 'All parameters within acceptable range. Minor documentation gap noted.', region: 'Tirah Valley' },
  { id: 'i002', farmId: 'f002', farmName: 'Swat Green Fields', inspectorName: 'Maj. Saeed Anwar', scheduledDate: '2025-11-10', completedDate: '2025-11-15', status: 'completed', complianceScore: 88, findings: 'Good cultivation practices. Irrigation system needs upgrade.', region: 'Swat' },
  { id: 'i003', farmId: 'f003', farmName: 'Dir Highland Farms', inspectorName: 'Lt. Col. Imran Shah', scheduledDate: '2025-10-25', completedDate: '2025-10-30', status: 'completed', complianceScore: 95, findings: 'Exemplary compliance. Recommended for excellence award.', region: 'Dir' },
  { id: 'i004', farmId: 'f009', farmName: 'Dir Cannabis Co-op', inspectorName: 'Col. Tariq Mehmood', scheduledDate: '2025-08-28', completedDate: '2025-09-01', status: 'completed', complianceScore: 45, findings: 'Critical: THC levels at 28% — exceeds 20% permissible limit. Unauthorized additives detected.', region: 'Dir' },
  { id: 'i005', farmId: 'f014', farmName: 'Swat River Valley', inspectorName: 'Maj. Saeed Anwar', scheduledDate: '2025-08-10', completedDate: '2025-08-15', status: 'completed', complianceScore: 32, findings: 'Critical violation: Unauthorized strain cultivation. Farm cultivating Balochi Gold instead of approved Pakistani Landrace.', region: 'Swat' },
  { id: 'i006', farmId: 'f006', farmName: 'Buner Valley Organics', inspectorName: 'Capt. Zubair Ali', scheduledDate: '2026-01-05', completedDate: '2026-01-10', status: 'completed', complianceScore: 97, findings: 'Outstanding organic practices. All certifications current.', region: 'Buner' },
  { id: 'i007', farmId: 'f017', farmName: 'Quetta Highland Farm', inspectorName: 'Lt. Col. Imran Shah', scheduledDate: '2025-12-01', completedDate: '2025-12-05', status: 'completed', complianceScore: 86, findings: 'Satisfactory. Water usage slightly above recommended levels.', region: 'Quetta' },
  { id: 'i008', farmId: 'f018', farmName: 'Chagai Desert Bloom', inspectorName: 'Col. Tariq Mehmood', scheduledDate: '2026-01-15', completedDate: '2026-01-20', status: 'completed', complianceScore: 90, findings: 'Good compliance. Novel desert irrigation system noted as best practice.', region: 'Chagai' },
  { id: 'i009', farmId: 'f019', farmName: 'Panjgur Oasis', inspectorName: 'Maj. Saeed Anwar', scheduledDate: '2025-09-28', completedDate: '2025-10-01', status: 'completed', complianceScore: 52, findings: 'Major: Cultivation extends 2.3 hectares beyond permitted boundary. Immediate corrective action required.', region: 'Panjgur' },
  { id: 'i010', farmId: 'f013', farmName: 'Tirah Medicinal Labs', inspectorName: 'Capt. Zubair Ali', scheduledDate: '2026-02-10', completedDate: '2026-02-15', status: 'completed', complianceScore: 98, findings: 'Pharmaceutical-grade standards maintained. Lab certification current.', region: 'Tirah Valley' },

  // Scheduled (5)
  { id: 'i011', farmId: 'f007', farmName: 'Tirah Gold Plantation', inspectorName: 'Col. Tariq Mehmood', scheduledDate: '2026-03-20', status: 'scheduled', region: 'Tirah Valley' },
  { id: 'i012', farmId: 'f011', farmName: 'Malakand Green Acres', inspectorName: 'Maj. Saeed Anwar', scheduledDate: '2026-03-25', status: 'scheduled', region: 'Malakand' },
  { id: 'i013', farmId: 'f023', farmName: 'Chagai Golden Fields', inspectorName: 'Lt. Col. Imran Shah', scheduledDate: '2026-04-01', status: 'scheduled', region: 'Chagai' },
  { id: 'i014', farmId: 'f024', farmName: 'Panjgur Valley Farm', inspectorName: 'Capt. Zubair Ali', scheduledDate: '2026-04-10', status: 'scheduled', region: 'Panjgur' },
  { id: 'i015', farmId: 'f025', farmName: 'Khuzdar Heritage Gardens', inspectorName: 'Col. Tariq Mehmood', scheduledDate: '2026-04-15', status: 'scheduled', region: 'Khuzdar' },
]
