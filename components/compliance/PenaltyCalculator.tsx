'use client'

import { useState } from 'react'
import { GlassCard } from '@/design-system/glass-card'
import { AiInsightCard } from '@/components/ai/AiInsightCard'
import { StryderBadge } from '@/components/ai/StryderBadge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Calculator, Scale, AlertTriangle, CheckCircle, History, TrendingDown, Gavel, FileText } from 'lucide-react'

interface PenaltyResult {
  basePenalty: number
  multiplier: number
  finalPenalty: number
  suspensionRecommended: boolean
  suspensionDays: number
  correctiveActions: string[]
  aiAssessment: string
  aiConfidence: number
  similarCases: { farmName: string; violation: string; penalty: number; date: string }[]
}

const violationTypes = [
  { value: 'thc-exceeds', label: 'THC Level Exceeds Limit', basePenalty: 500000 },
  { value: 'unauthorized-strain', label: 'Unauthorized Strain Cultivation', basePenalty: 750000 },
  { value: 'boundary-violation', label: 'Cultivation Beyond Permitted Boundary', basePenalty: 300000 },
  { value: 'documentation-gap', label: 'Documentation Non-Compliance', basePenalty: 100000 },
  { value: 'storage-violation', label: 'Improper Storage Conditions', basePenalty: 200000 },
  { value: 'waste-management', label: 'Waste Management Violation', basePenalty: 150000 },
  { value: 'pesticide-violation', label: 'Unauthorized Pesticide Use', basePenalty: 400000 },
  { value: 'worker-safety', label: 'Worker Safety Non-Compliance', basePenalty: 250000 },
  { value: 'labeling-violation', label: 'Product Labeling Violation', basePenalty: 175000 },
  { value: 'transport-violation', label: 'Transport Security Breach', basePenalty: 600000 },
]

const severityMultipliers = [
  { value: 'minor', label: 'Minor', multiplier: 0.5, description: 'First-time, no harm, easily correctable' },
  { value: 'moderate', label: 'Moderate', multiplier: 1.0, description: 'Second offense or moderate impact' },
  { value: 'major', label: 'Major', multiplier: 1.5, description: 'Significant regulatory breach' },
  { value: 'critical', label: 'Critical', multiplier: 2.5, description: 'Severe violation, potential public harm' },
]

const historyMultipliers = [
  { value: 'first', label: 'First Offense', multiplier: 1.0 },
  { value: 'second', label: 'Second Offense', multiplier: 1.5 },
  { value: 'third', label: 'Third Offense', multiplier: 2.0 },
  { value: 'repeat', label: 'Repeat Offender (4+)', multiplier: 3.0 },
]

const enforcementHistory = [
  { id: 'eh-001', farmName: 'Dir Cannabis Co-op', violation: 'THC Level Exceeds Limit', penalty: 1250000, collected: 1250000, date: '2025-09-15', status: 'collected' },
  { id: 'eh-002', farmName: 'Swat River Valley', violation: 'Unauthorized Strain Cultivation', penalty: 750000, collected: 500000, date: '2025-08-20', status: 'partial' },
  { id: 'eh-003', farmName: 'Panjgur Oasis', violation: 'Boundary Violation', penalty: 450000, collected: 0, date: '2025-10-05', status: 'outstanding' },
  { id: 'eh-004', farmName: 'Malakand Green Acres', violation: 'Documentation Gap', penalty: 50000, collected: 50000, date: '2025-11-10', status: 'collected' },
  { id: 'eh-005', farmName: 'Dir Cannabis Co-op', violation: 'Storage Violation', penalty: 200000, collected: 200000, date: '2025-07-22', status: 'collected' },
  { id: 'eh-006', farmName: 'Swat River Valley', violation: 'Pesticide Violation', penalty: 400000, collected: 0, date: '2025-12-01', status: 'outstanding' },
]

export function PenaltyCalculator() {
  const [selectedViolation, setSelectedViolation] = useState('')
  const [selectedSeverity, setSelectedSeverity] = useState('')
  const [selectedHistory, setSelectedHistory] = useState('')
  const [result, setResult] = useState<PenaltyResult | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedEnforcement, setSelectedEnforcement] = useState<typeof enforcementHistory[0] | null>(null)

  const calculate = () => {
    const viol = violationTypes.find((v) => v.value === selectedViolation)
    const sev = severityMultipliers.find((s) => s.value === selectedSeverity)
    const hist = historyMultipliers.find((h) => h.value === selectedHistory)
    if (!viol || !sev || !hist) return

    const basePenalty = viol.basePenalty
    const multiplier = sev.multiplier * hist.multiplier
    const finalPenalty = Math.round(basePenalty * multiplier)
    const suspensionRecommended = sev.value === 'critical' || hist.value === 'repeat' || finalPenalty >= 1000000
    const suspensionDays = suspensionRecommended ? (sev.value === 'critical' ? 90 : hist.value === 'repeat' ? 60 : 30) : 0

    const correctiveActions = [
      'Submit corrective action plan within 14 days',
      sev.value === 'critical' ? 'Immediate cessation of non-compliant activity' : 'Rectify violation within 30 days',
      'Schedule follow-up inspection within 45 days',
      hist.value !== 'first' ? 'Mandatory compliance training for all farm staff' : 'Review CCRA compliance guidelines',
    ]

    const avgPenalty = Math.round(basePenalty * 1.2)
    const variance = Math.round(((finalPenalty - avgPenalty) / avgPenalty) * 100)

    setResult({
      basePenalty,
      multiplier,
      finalPenalty,
      suspensionRecommended,
      suspensionDays,
      correctiveActions,
      aiAssessment: variance > 30
        ? `This penalty of PKR ${finalPenalty.toLocaleString()} is ${variance}% higher than the average for similar "${viol.label}" violations (PKR ${avgPenalty.toLocaleString()}). Consider reviewing the severity classification or applying a mitigating factor for fairness and consistency. Recommendation: Reduce to PKR ${Math.round(finalPenalty * 0.8).toLocaleString()} with enhanced corrective requirements instead.`
        : variance < -20
        ? `This penalty of PKR ${finalPenalty.toLocaleString()} is ${Math.abs(variance)}% lower than average. For deterrent effectiveness, consider applying the standard rate. Current calculation appears lenient for this violation type.`
        : `This penalty of PKR ${finalPenalty.toLocaleString()} is within the normal range for "${viol.label}" violations (within ${Math.abs(variance)}% of average). The calculation is consistent with similar cases and CCRA enforcement precedent.`,
      aiConfidence: variance > 30 ? 88 : 95,
      similarCases: [
        { farmName: 'Dir Cannabis Co-op', violation: viol.label, penalty: Math.round(basePenalty * 1.25), date: '2025-09-15' },
        { farmName: 'Swat River Valley', violation: viol.label, penalty: Math.round(basePenalty * 0.75), date: '2025-08-20' },
        { farmName: 'Panjgur Oasis', violation: viol.label, penalty: Math.round(basePenalty * 1.5), date: '2025-10-05' },
      ],
    })
  }

  const totalPenalties = enforcementHistory.reduce((s, e) => s + e.penalty, 0)
  const totalCollected = enforcementHistory.reduce((s, e) => s + e.collected, 0)
  const collectionRate = Math.round((totalCollected / totalPenalties) * 100)

  return (
    <div className="space-y-6 mt-4">
      {/* Calculator */}
      <div className="grid grid-cols-2 gap-6">
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-5 h-5 text-ccra-green" />
            <h3 className="font-medium">Penalty Calculator</h3>
            <StryderBadge />
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Violation Type</label>
              <select
                className="w-full p-2.5 rounded-lg bg-accent/30 border border-border text-sm"
                value={selectedViolation}
                onChange={(e) => setSelectedViolation(e.target.value)}
              >
                <option value="">Select violation type...</option>
                {violationTypes.map((v) => (
                  <option key={v.value} value={v.value}>
                    {v.label} — Base: PKR {v.basePenalty.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Severity</label>
              <div className="grid grid-cols-2 gap-2">
                {severityMultipliers.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setSelectedSeverity(s.value)}
                    className={cn(
                      'p-2 rounded-lg border text-left transition-all text-xs',
                      selectedSeverity === s.value
                        ? 'border-ccra-green bg-ccra-green/10'
                        : 'border-border bg-accent/30 hover:border-ccra-green/50'
                    )}
                  >
                    <span className="font-medium">{s.label}</span> <span className="text-muted-foreground">×{s.multiplier}</span>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{s.description}</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Offense History</label>
              <div className="grid grid-cols-2 gap-2">
                {historyMultipliers.map((h) => (
                  <button
                    key={h.value}
                    onClick={() => setSelectedHistory(h.value)}
                    className={cn(
                      'p-2 rounded-lg border text-xs font-medium transition-all',
                      selectedHistory === h.value
                        ? 'border-ccra-green bg-ccra-green/10'
                        : 'border-border bg-accent/30 hover:border-ccra-green/50'
                    )}
                  >
                    {h.label} <span className="text-muted-foreground font-normal">×{h.multiplier}</span>
                  </button>
                ))}
              </div>
            </div>
            <Button
              className="w-full bg-gradient-to-r from-ccra-green to-emerald-600 text-white"
              disabled={!selectedViolation || !selectedSeverity || !selectedHistory}
              onClick={calculate}
            >
              <Scale className="w-4 h-4 mr-2" />
              Calculate Penalty
            </Button>
          </div>
        </GlassCard>

        {/* Result */}
        <div className="space-y-4">
          {result ? (
            <>
              <GlassCard className={cn('border-l-4', result.suspensionRecommended ? 'border-l-red-500' : 'border-l-ccra-green')}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium flex items-center gap-2">
                    <Gavel className="w-5 h-5 text-ccra-green" />
                    Calculated Penalty
                  </h3>
                  <StryderBadge />
                </div>
                <div className="text-center py-4">
                  <p className="text-4xl font-bold text-foreground">
                    PKR {result.finalPenalty.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Base: PKR {result.basePenalty.toLocaleString()} × {result.multiplier.toFixed(1)} multiplier
                  </p>
                </div>
                {result.suspensionRecommended && (
                  <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 mb-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium text-red-500">
                        License Suspension Recommended: {result.suspensionDays} days
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="mt-2 bg-red-500 text-white hover:bg-red-600"
                      onClick={() => toast.success('Suspension order drafted')}
                    >
                      Draft Suspension Order
                    </Button>
                  </div>
                )}
                <div>
                  <p className="text-xs font-medium mb-2">Required Corrective Actions:</p>
                  <div className="space-y-1.5">
                    {result.correctiveActions.map((action, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <CheckCircle className="w-3.5 h-3.5 text-ccra-green shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-3 border-t border-border/50">
                  <Button size="sm" className="bg-gradient-to-r from-ccra-green to-emerald-600 text-white" onClick={() => toast.success('Penalty notice generated')}>
                    <FileText className="w-3.5 h-3.5 mr-1" />
                    Generate Notice
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.success('Sent to farm operator')}>
                    Send to Farm
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => { setResult(null); setSelectedViolation(''); setSelectedSeverity(''); setSelectedHistory('') }}>
                    Clear
                  </Button>
                </div>
              </GlassCard>

              {/* AI Fairness Check */}
              <AiInsightCard
                title="AI Fairness Assessment"
                insight={result.aiAssessment}
                severity={result.aiConfidence < 90 ? 'warning' : 'info'}
                confidence={result.aiConfidence}
              />

              {/* Similar Cases */}
              <GlassCard padding="sm">
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Similar Cases for Reference</h4>
                {result.similarCases.map((c, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0 text-xs">
                    <span>{c.farmName}</span>
                    <span className="text-muted-foreground">{c.date}</span>
                    <span className="font-medium">PKR {c.penalty.toLocaleString()}</span>
                  </div>
                ))}
              </GlassCard>
            </>
          ) : (
            <GlassCard className="flex flex-col items-center justify-center min-h-[300px] text-center">
              <Scale className="w-12 h-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">Select violation parameters and click Calculate</p>
              <p className="text-xs text-muted-foreground/70 mt-1">STRYDER AI will assess fairness and consistency</p>
            </GlassCard>
          )}
        </div>
      </div>

      {/* Penalty Schedule */}
      <GlassCard padding="none">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-medium">Official Penalty Schedule</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Base penalties per violation type (multiplied by severity and history)</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="p-3 font-medium text-muted-foreground">Violation Type</th>
              <th className="p-3 font-medium text-muted-foreground text-right">Base Penalty (PKR)</th>
              <th className="p-3 font-medium text-muted-foreground text-right">Minor (×0.5)</th>
              <th className="p-3 font-medium text-muted-foreground text-right">Moderate (×1.0)</th>
              <th className="p-3 font-medium text-muted-foreground text-right">Major (×1.5)</th>
              <th className="p-3 font-medium text-muted-foreground text-right">Critical (×2.5)</th>
            </tr>
          </thead>
          <tbody>
            {violationTypes.map((v) => (
              <tr key={v.value} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                <td className="p-3">{v.label}</td>
                <td className="p-3 text-right font-mono text-xs">{v.basePenalty.toLocaleString()}</td>
                <td className="p-3 text-right font-mono text-xs text-muted-foreground">{(v.basePenalty * 0.5).toLocaleString()}</td>
                <td className="p-3 text-right font-mono text-xs">{(v.basePenalty * 1.0).toLocaleString()}</td>
                <td className="p-3 text-right font-mono text-xs text-amber-500">{(v.basePenalty * 1.5).toLocaleString()}</td>
                <td className="p-3 text-right font-mono text-xs text-red-500">{(v.basePenalty * 2.5).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      {/* Enforcement History */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-ccra-green" />
            <h3 className="text-sm font-medium">Enforcement History</h3>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span>Total: <span className="font-bold">PKR {totalPenalties.toLocaleString()}</span></span>
            <span>Collected: <span className="font-bold text-emerald-500">PKR {totalCollected.toLocaleString()}</span></span>
            <span>Rate: <span className={cn('font-bold', collectionRate >= 80 ? 'text-emerald-500' : 'text-amber-500')}>{collectionRate}%</span></span>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-2 font-medium text-muted-foreground">Farm</th>
              <th className="pb-2 font-medium text-muted-foreground">Violation</th>
              <th className="pb-2 font-medium text-muted-foreground">Date</th>
              <th className="pb-2 font-medium text-muted-foreground text-right">Penalty</th>
              <th className="pb-2 font-medium text-muted-foreground text-right">Collected</th>
              <th className="pb-2 font-medium text-muted-foreground">Status</th>
              <th className="pb-2 font-medium text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {enforcementHistory.map((e) => (
              <tr
                key={e.id}
                onClick={() => { setSelectedEnforcement(e); setDetailOpen(true) }}
                className="border-b border-border/50 hover:bg-accent/30 cursor-pointer transition-colors"
              >
                <td className="py-2.5">{e.farmName}</td>
                <td className="py-2.5 text-muted-foreground">{e.violation}</td>
                <td className="py-2.5 text-muted-foreground">{e.date}</td>
                <td className="py-2.5 text-right font-mono text-xs">PKR {e.penalty.toLocaleString()}</td>
                <td className="py-2.5 text-right font-mono text-xs">PKR {e.collected.toLocaleString()}</td>
                <td className="py-2.5">
                  <span className={cn(
                    'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                    e.status === 'collected' && 'bg-emerald-500/10 text-emerald-500',
                    e.status === 'partial' && 'bg-amber-500/10 text-amber-500',
                    e.status === 'outstanding' && 'bg-red-500/10 text-red-500',
                  )}>
                    {e.status}
                  </span>
                </td>
                <td className="py-2.5">
                  {e.status !== 'collected' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 text-xs text-ccra-green"
                      onClick={(ev) => { ev.stopPropagation(); toast.success('Payment reminder sent to ' + e.farmName) }}
                    >
                      Send Reminder
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      {/* Enforcement Detail Dialog */}
      <Dialog open={detailOpen && !!selectedEnforcement} onOpenChange={setDetailOpen}>
        <DialogContent showCloseButton className="max-w-md">
          <DialogHeader>
            <DialogTitle>Enforcement Record</DialogTitle>
          </DialogHeader>
          {selectedEnforcement && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Farm:</span> <span className="font-medium">{selectedEnforcement.farmName}</span></div>
                <div><span className="text-muted-foreground">Date:</span> <span className="font-medium">{selectedEnforcement.date}</span></div>
                <div><span className="text-muted-foreground">Violation:</span> <span className="font-medium">{selectedEnforcement.violation}</span></div>
                <div>
                  <span className="text-muted-foreground">Status:</span>{' '}
                  <span className={cn(
                    'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                    selectedEnforcement.status === 'collected' && 'bg-emerald-500/10 text-emerald-500',
                    selectedEnforcement.status === 'partial' && 'bg-amber-500/10 text-amber-500',
                    selectedEnforcement.status === 'outstanding' && 'bg-red-500/10 text-red-500',
                  )}>
                    {selectedEnforcement.status}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-accent/30 text-center">
                  <p className="text-xl font-bold">PKR {selectedEnforcement.penalty.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Penalty</p>
                </div>
                <div className="p-3 rounded-xl bg-accent/30 text-center">
                  <p className={cn('text-xl font-bold', selectedEnforcement.collected === selectedEnforcement.penalty ? 'text-emerald-500' : 'text-amber-500')}>
                    PKR {selectedEnforcement.collected.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Collected</p>
                </div>
              </div>
              {selectedEnforcement.status !== 'collected' && (
                <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <p className="text-xs text-amber-500 font-medium mb-2">
                    Outstanding: PKR {(selectedEnforcement.penalty - selectedEnforcement.collected).toLocaleString()}
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-amber-500 text-white hover:bg-amber-600" onClick={() => toast.success('Payment reminder sent')}>
                      Send Payment Reminder
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => toast.success('Escalated to enforcement division')}>
                      Escalate
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
