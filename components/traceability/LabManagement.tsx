'use client'

import { useState } from 'react'
import { GlassCard } from '@/design-system/glass-card'
import { AiInsightCard } from '@/components/ai/AiInsightCard'
import { StryderBadge } from '@/components/ai/StryderBadge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { batches } from '@/data/mock-traceability'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  FlaskConical, Clock, CheckCircle, AlertTriangle, Beaker,
  Thermometer, Droplets, Bug, Shield, FileText, TrendingUp,
  ArrowRight
} from 'lucide-react'

interface LabQueueItem {
  batchCode: string
  farmName: string
  strain: string
  quantity: number
  priority: 'urgent' | 'high' | 'normal'
  submittedDate: string
  expectedCompletion: string
  assignedLab: string
  testType: string
  status: 'queued' | 'in-progress' | 'awaiting-results'
}

const labQueue: LabQueueItem[] = [
  { batchCode: 'CCRA-BTH-2025-003', farmName: 'Chitral Purple Farms', strain: 'Chitral Purple', quantity: 1800, priority: 'urgent', submittedDate: '2025-12-06', expectedCompletion: '2025-12-25', assignedLab: 'CCRA Central Lab Islamabad', testType: 'Pharmaceutical-Grade Certification', status: 'in-progress' },
  { batchCode: 'CCRA-BTH-2025-004', farmName: 'Chagai Desert Bloom', strain: 'Industrial Hemp (CBD)', quantity: 5000, priority: 'high', submittedDate: '2026-01-15', expectedCompletion: '2026-02-01', assignedLab: 'CCRA Regional Lab Balochistan', testType: 'Standard Compliance Testing', status: 'queued' },
  { batchCode: 'CCRA-BTH-2026-006', farmName: 'Buner Valley Organics', strain: 'Industrial Hemp (CBD)', quantity: 2100, priority: 'normal', submittedDate: '2026-02-20', expectedCompletion: '2026-03-10', assignedLab: 'CCRA Regional Lab KP', testType: 'Organic Certification Testing', status: 'queued' },
]

interface LabReportDetail {
  batchCode: string
  farmName: string
  strain: string
  labName: string
  analyst: string
  methodology: string
  equipmentCalibration: string
  sampleId: string
  certificateId: string
  results: { test: string; result: string; threshold: string; status: 'pass' | 'fail' | 'warning' }[]
}

const completedLabReports: LabReportDetail[] = [
  {
    batchCode: 'CCRA-BTH-2025-001', farmName: 'Tirah Valley Estate', strain: 'Pakistani Landrace',
    labName: 'CCRA Central Lab Islamabad', analyst: 'Dr. Amina Tariq', methodology: 'HPLC (High Performance Liquid Chromatography)',
    equipmentCalibration: '2025-10-01', sampleId: 'SAMP-2025-00847', certificateId: 'LAB-2025-00147',
    results: [
      { test: 'THC Content', result: '18.4%', threshold: '≤ 20.0%', status: 'pass' },
      { test: 'CBD Content', result: '0.8%', threshold: '≥ 0.3%', status: 'pass' },
      { test: 'Moisture Level', result: '11.2%', threshold: '≤ 13.0%', status: 'pass' },
      { test: 'Aflatoxin B1', result: '< 2 µg/kg', threshold: '≤ 5 µg/kg', status: 'pass' },
      { test: 'Pesticide Residue', result: 'Not Detected', threshold: '≤ 0.01 mg/kg', status: 'pass' },
      { test: 'Heavy Metals (Pb)', result: '0.12 mg/kg', threshold: '≤ 0.5 mg/kg', status: 'pass' },
      { test: 'Heavy Metals (Cd)', result: '0.03 mg/kg', threshold: '≤ 0.3 mg/kg', status: 'pass' },
      { test: 'Microbial Count', result: '< 1000 CFU/g', threshold: '≤ 10000 CFU/g', status: 'pass' },
    ],
  },
  {
    batchCode: 'CCRA-BTH-2025-002', farmName: 'Dir Highland Farms', strain: 'Hindu Kush',
    labName: 'CCRA Regional Lab KP', analyst: 'Dr. Hassan Mehmood', methodology: 'GC-MS (Gas Chromatography-Mass Spectrometry)',
    equipmentCalibration: '2025-10-15', sampleId: 'SAMP-2025-01023', certificateId: 'LAB-2025-00183',
    results: [
      { test: 'THC Content', result: '19.1%', threshold: '≤ 20.0%', status: 'warning' },
      { test: 'CBD Content', result: '0.6%', threshold: '≥ 0.3%', status: 'pass' },
      { test: 'Moisture Level', result: '10.8%', threshold: '≤ 13.0%', status: 'pass' },
      { test: 'Aflatoxin B1', result: '< 2 µg/kg', threshold: '≤ 5 µg/kg', status: 'pass' },
      { test: 'Pesticide Residue', result: 'Not Detected', threshold: '≤ 0.01 mg/kg', status: 'pass' },
      { test: 'Heavy Metals (Pb)', result: '0.08 mg/kg', threshold: '≤ 0.5 mg/kg', status: 'pass' },
      { test: 'Heavy Metals (Cd)', result: '0.02 mg/kg', threshold: '≤ 0.3 mg/kg', status: 'pass' },
      { test: 'Microbial Count', result: '< 500 CFU/g', threshold: '≤ 10000 CFU/g', status: 'pass' },
    ],
  },
  {
    batchCode: 'CCRA-BTH-2025-005', farmName: 'Tirah Medicinal Labs', strain: 'Medicinal Grade A',
    labName: 'CCRA Central Lab + DRAP', analyst: 'Dr. Faisal Khan', methodology: 'HPLC + LC-MS/MS (Pharmaceutical Grade)',
    equipmentCalibration: '2025-10-05', sampleId: 'SAMP-PHARMA-00012', certificateId: 'LAB-PHARMA-2025-00012',
    results: [
      { test: 'THC Content', result: '15.2%', threshold: '≤ 20.0%', status: 'pass' },
      { test: 'CBD Content', result: '8.4%', threshold: '≥ 0.3%', status: 'pass' },
      { test: 'Moisture Level', result: '9.5%', threshold: '≤ 13.0%', status: 'pass' },
      { test: 'Aflatoxin B1', result: '< 1 µg/kg', threshold: '≤ 2 µg/kg', status: 'pass' },
      { test: 'Pesticide Residue', result: 'Not Detected', threshold: '≤ 0.005 mg/kg', status: 'pass' },
      { test: 'Heavy Metals (Pb)', result: '0.05 mg/kg', threshold: '≤ 0.3 mg/kg', status: 'pass' },
      { test: 'Sterility Test', result: 'Sterile', threshold: 'Sterile Required', status: 'pass' },
      { test: 'Endotoxin Level', result: '< 0.25 EU/mL', threshold: '≤ 0.5 EU/mL', status: 'pass' },
    ],
  },
]

const priorityConfig = {
  urgent: { color: 'bg-red-500/10 text-red-500', label: 'Urgent' },
  high: { color: 'bg-amber-500/10 text-amber-500', label: 'High' },
  normal: { color: 'bg-blue-500/10 text-blue-500', label: 'Normal' },
}

export function LabManagement() {
  const [selectedReport, setSelectedReport] = useState<LabReportDetail | null>(null)
  const [selectedQueueItem, setSelectedQueueItem] = useState<LabQueueItem | null>(null)

  const batchesWithLab = batches.filter((b) => b.labResults)
  const avgThc = batchesWithLab.reduce((s, b) => s + (b.labResults?.thcPercent || 0), 0) / batchesWithLab.length
  const avgCbd = batchesWithLab.reduce((s, b) => s + (b.labResults?.cbdPercent || 0), 0) / batchesWithLab.length
  const passRate = 100

  return (
    <div className="space-y-6 mt-4">
      {/* Lab Overview Stats */}
      <div className="grid grid-cols-4 gap-4">
        <GlassCard padding="sm" className="border-l-4 border-l-ccra-teal">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ccra-teal/10 flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-ccra-teal" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">In Lab Queue</p>
              <p className="text-xl font-bold">{labQueue.length}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard padding="sm" className="border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pass Rate</p>
              <p className="text-xl font-bold text-emerald-500">{passRate}%</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard padding="sm" className="border-l-4 border-l-blue-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Thermometer className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg THC</p>
              <p className="text-xl font-bold">{avgThc.toFixed(1)}%</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard padding="sm" className="border-l-4 border-l-purple-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Droplets className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg CBD</p>
              <p className="text-xl font-bold">{avgCbd.toFixed(1)}%</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Lab Queue */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-ccra-teal" />
            <h3 className="text-sm font-medium">Lab Testing Queue</h3>
          </div>
          <span className="text-xs text-muted-foreground">{labQueue.length} batches pending</span>
        </div>
        <div className="space-y-3">
          {labQueue.map((item) => (
            <div
              key={item.batchCode}
              onClick={() => setSelectedQueueItem(item)}
              className="p-3 rounded-xl bg-accent/30 hover:bg-accent/50 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={cn('inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium', priorityConfig[item.priority].color)}>
                    {priorityConfig[item.priority].label}
                  </span>
                  <span className="font-mono text-xs font-medium">{item.batchCode}</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground" />
                  <span className="text-sm">{item.farmName}</span>
                </div>
                <span className={cn(
                  'inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium',
                  item.status === 'in-progress' ? 'bg-ccra-green/10 text-ccra-green animate-pulse' : 'bg-blue-500/10 text-blue-500'
                )}>
                  {item.status}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span>Strain: {item.strain}</span>
                <span>Qty: {item.quantity.toLocaleString()} kg</span>
                <span>Lab: {item.assignedLab}</span>
                <span>ETA: {item.expectedCompletion}</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Completed Lab Reports */}
      <GlassCard padding="none">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Beaker className="w-5 h-5 text-emerald-500" />
            <h3 className="text-sm font-medium">Completed Lab Reports</h3>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="p-3 font-medium text-muted-foreground">Batch</th>
              <th className="p-3 font-medium text-muted-foreground">Farm</th>
              <th className="p-3 font-medium text-muted-foreground">Lab</th>
              <th className="p-3 font-medium text-muted-foreground">Analyst</th>
              <th className="p-3 font-medium text-muted-foreground text-center">THC%</th>
              <th className="p-3 font-medium text-muted-foreground text-center">CBD%</th>
              <th className="p-3 font-medium text-muted-foreground text-center">Result</th>
              <th className="p-3 font-medium text-muted-foreground">Certificate</th>
            </tr>
          </thead>
          <tbody>
            {completedLabReports.map((report) => {
              const allPass = report.results.every((r) => r.status === 'pass')
              const hasWarning = report.results.some((r) => r.status === 'warning')
              return (
                <tr
                  key={report.batchCode}
                  onClick={() => setSelectedReport(report)}
                  className="border-b border-border/50 hover:bg-accent/30 cursor-pointer transition-colors"
                >
                  <td className="p-3 font-mono text-xs">{report.batchCode}</td>
                  <td className="p-3">{report.farmName}</td>
                  <td className="p-3 text-muted-foreground text-xs">{report.labName}</td>
                  <td className="p-3 text-muted-foreground">{report.analyst}</td>
                  <td className="p-3 text-center">
                    <span className={cn('font-medium', parseFloat(report.results[0].result) > 19 ? 'text-amber-500' : 'text-emerald-500')}>
                      {report.results[0].result}
                    </span>
                  </td>
                  <td className="p-3 text-center font-medium text-blue-500">{report.results[1].result}</td>
                  <td className="p-3 text-center">
                    <span className={cn(
                      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                      hasWarning ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                    )}>
                      {hasWarning ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                      {hasWarning ? 'Warning' : 'Pass'}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-[10px] text-muted-foreground">{report.certificateId}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </GlassCard>

      {/* AI Insight */}
      <AiInsightCard
        title="Lab Testing Analysis"
        insight="THC levels are trending 2.3% higher in Tirah Valley this season compared to last year's average. Batch CCRA-BTH-2025-002 (Hindu Kush, Dir) tested at 19.1% THC — within limits but approaching the 20% threshold. Recommendation: Implement pre-harvest THC monitoring for Dir Highland Farms and consider adjusting the harvest window 5-7 days earlier to optimize cannabinoid profiles. All contamination and pesticide tests are passing at 100% — excellent quality control."
        severity="warning"
        confidence={93}
      />

      {/* Lab Queue Detail Dialog */}
      <Dialog open={!!selectedQueueItem} onOpenChange={(open) => !open && setSelectedQueueItem(null)}>
        <DialogContent showCloseButton className="max-w-md">
          <DialogHeader>
            <DialogTitle>Lab Queue — {selectedQueueItem?.batchCode}</DialogTitle>
          </DialogHeader>
          {selectedQueueItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Farm:</span> <span className="font-medium">{selectedQueueItem.farmName}</span></div>
                <div><span className="text-muted-foreground">Strain:</span> <span className="font-medium">{selectedQueueItem.strain}</span></div>
                <div><span className="text-muted-foreground">Quantity:</span> <span className="font-medium">{selectedQueueItem.quantity.toLocaleString()} kg</span></div>
                <div><span className="text-muted-foreground">Priority:</span> <span className={cn('inline-flex rounded-full px-2 py-0.5 text-xs font-medium', priorityConfig[selectedQueueItem.priority].color)}>{priorityConfig[selectedQueueItem.priority].label}</span></div>
                <div><span className="text-muted-foreground">Lab:</span> <span className="font-medium">{selectedQueueItem.assignedLab}</span></div>
                <div><span className="text-muted-foreground">Test Type:</span> <span className="font-medium">{selectedQueueItem.testType}</span></div>
                <div><span className="text-muted-foreground">Submitted:</span> <span className="font-medium">{selectedQueueItem.submittedDate}</span></div>
                <div><span className="text-muted-foreground">Expected:</span> <span className="font-medium">{selectedQueueItem.expectedCompletion}</span></div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="bg-gradient-to-r from-ccra-green to-emerald-600 text-white" onClick={() => toast.success('Priority escalated to urgent')}>
                  Escalate Priority
                </Button>
                <Button size="sm" variant="outline" onClick={() => toast.success('Reassigned to CCRA Central Lab')}>
                  Reassign Lab
                </Button>
                <Button size="sm" variant="outline" onClick={() => toast.success('Status update requested from lab')}>
                  Request Update
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Lab Report Detail Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
        <DialogContent showCloseButton className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Certificate of Analysis — {selectedReport?.certificateId}</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              {/* Header Info */}
              <div className="p-4 rounded-xl bg-accent/30 grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Batch:</span> <span className="font-mono font-medium">{selectedReport.batchCode}</span></div>
                <div><span className="text-muted-foreground">Farm:</span> <span className="font-medium">{selectedReport.farmName}</span></div>
                <div><span className="text-muted-foreground">Strain:</span> <span className="font-medium">{selectedReport.strain}</span></div>
                <div><span className="text-muted-foreground">Lab:</span> <span className="font-medium">{selectedReport.labName}</span></div>
                <div><span className="text-muted-foreground">Analyst:</span> <span className="font-medium">{selectedReport.analyst}</span></div>
                <div><span className="text-muted-foreground">Sample ID:</span> <span className="font-mono text-xs">{selectedReport.sampleId}</span></div>
                <div><span className="text-muted-foreground">Methodology:</span> <span className="font-medium text-xs">{selectedReport.methodology}</span></div>
                <div><span className="text-muted-foreground">Calibration:</span> <span className="font-medium">{selectedReport.equipmentCalibration}</span></div>
              </div>

              {/* Test Results Table */}
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-2 text-left font-medium text-muted-foreground">Test</th>
                    <th className="pb-2 text-center font-medium text-muted-foreground">Result</th>
                    <th className="pb-2 text-center font-medium text-muted-foreground">Threshold</th>
                    <th className="pb-2 text-center font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedReport.results.map((r, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-2">{r.test}</td>
                      <td className="py-2 text-center font-medium">{r.result}</td>
                      <td className="py-2 text-center text-muted-foreground">{r.threshold}</td>
                      <td className="py-2 text-center">
                        <span className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                          r.status === 'pass' && 'bg-emerald-500/10 text-emerald-500',
                          r.status === 'warning' && 'bg-amber-500/10 text-amber-500',
                          r.status === 'fail' && 'bg-red-500/10 text-red-500',
                        )}>
                          {r.status === 'pass' ? <CheckCircle className="w-3 h-3" /> : r.status === 'warning' ? <AlertTriangle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Actions */}
              <div className="flex gap-2">
                <Button size="sm" className="bg-gradient-to-r from-ccra-green to-emerald-600 text-white" onClick={() => toast.success('Certificate of Analysis exported as PDF')}>
                  <FileText className="w-3.5 h-3.5 mr-1" />
                  Export Certificate
                </Button>
                <Button size="sm" variant="outline" onClick={() => toast.success('Shared with export division')}>
                  Share with Export Team
                </Button>
                {selectedReport.results.some((r) => r.status === 'warning') && (
                  <Button size="sm" variant="outline" className="text-amber-500 border-amber-500/30" onClick={() => toast.success('Re-test requested for flagged parameters')}>
                    Request Re-test
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
