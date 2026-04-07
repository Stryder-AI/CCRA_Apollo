import { TimelineEvent } from '@/types/common'

export const farmTimeline: Record<string, TimelineEvent[]> = {
  f001: [
    { id: 't001', farmId: 'f001', event: 'Farm Registered', date: '2025-06-15', description: 'Initial registration approved by DG office', type: 'registration' },
    { id: 't002', farmId: 'f001', event: 'License Issued', date: '2025-06-15', description: 'Cultivation license CCRA-LIC-2025-001 issued', type: 'license' },
    { id: 't003', farmId: 'f001', event: 'First Inspection', date: '2025-09-01', description: 'Routine inspection — Score: 90%', type: 'inspection' },
    { id: 't004', farmId: 'f001', event: 'Compliance Update', date: '2025-12-01', description: 'Annual inspection — Score: 92%. Exemplary record.', type: 'inspection' },
  ],
  f009: [
    { id: 't005', farmId: 'f009', event: 'Farm Registered', date: '2025-04-15', description: 'Initial registration approved', type: 'registration' },
    { id: 't006', farmId: 'f009', event: 'License Issued', date: '2025-04-15', description: 'Cultivation license CCRA-LIC-2025-009 issued', type: 'license' },
    { id: 't007', farmId: 'f009', event: 'Violation Detected', date: '2025-09-01', description: 'Critical: THC levels exceeded permissible limit (28% vs 20%)', type: 'violation' },
    { id: 't008', farmId: 'f009', event: 'Farm Suspended', date: '2025-09-05', description: 'Operations suspended pending investigation', type: 'update' },
    { id: 't009', farmId: 'f009', event: 'Appeal Filed', date: '2025-10-01', description: 'Owner filed appeal for unauthorized additives violation', type: 'update' },
  ],
}
