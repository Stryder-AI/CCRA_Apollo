import { Document } from '@/types/common'

export const farmDocuments: Record<string, Document[]> = {
  f001: [
    { id: 'd001', name: 'CNIC — Khan Muhammad Afridi', type: 'Identity', uploadDate: '2025-06-10', status: 'verified' },
    { id: 'd002', name: 'Land Title Deed — Tirah Valley', type: 'Land Ownership', uploadDate: '2025-06-10', status: 'verified' },
    { id: 'd003', name: 'Agricultural Survey Report', type: 'Survey', uploadDate: '2025-06-12', status: 'verified' },
    { id: 'd004', name: 'Environmental Impact Assessment', type: 'Environmental', uploadDate: '2025-06-14', status: 'pending' },
  ],
  f002: [
    { id: 'd005', name: 'CNIC — Abdul Wahab Khan', type: 'Identity', uploadDate: '2025-06-25', status: 'verified' },
    { id: 'd006', name: 'Land Title Deed — Swat', type: 'Land Ownership', uploadDate: '2025-06-25', status: 'verified' },
    { id: 'd007', name: 'Agricultural Survey Report', type: 'Survey', uploadDate: '2025-06-28', status: 'verified' },
  ],
  f009: [
    { id: 'd008', name: 'CNIC — Bakht Zaman', type: 'Identity', uploadDate: '2025-04-01', status: 'verified' },
    { id: 'd009', name: 'Land Title Deed — Dir', type: 'Land Ownership', uploadDate: '2025-04-01', status: 'verified' },
    { id: 'd010', name: 'Suspension Notice', type: 'Legal', uploadDate: '2025-09-05', status: 'verified' },
    { id: 'd011', name: 'Lab Analysis Report — THC', type: 'Lab Report', uploadDate: '2025-09-02', status: 'verified' },
  ],
}
