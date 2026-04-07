'use client'

import { Transaction } from '@/types/revenue'
import { formatCurrencyFull, formatDate, formatDateShort } from '@/utils/format'
import { cn } from '@/lib/utils'
import { AiInsightCard } from '@/components/ai/AiInsightCard'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  CheckCircle2,
  Clock,
  XCircle,
  Receipt,
  User,
  Calendar,
  Hash,
  CreditCard,
  FileText,
  ArrowRight,
} from 'lucide-react'

interface TransactionDetailModalProps {
  transaction: Transaction | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const statusConfig = {
  completed: {
    color: 'bg-ccra-green/10 text-ccra-green border-ccra-green/30',
    icon: CheckCircle2,
    label: 'Completed',
  },
  pending: {
    color: 'bg-ccra-gold/10 text-ccra-gold border-ccra-gold/30',
    icon: Clock,
    label: 'Pending',
  },
  failed: {
    color: 'bg-ccra-red/10 text-ccra-red border-ccra-red/30',
    icon: XCircle,
    label: 'Failed',
  },
}

const categoryLabels: Record<string, string> = {
  license_fee: 'License Fee',
  penalty: 'Penalty',
  inspection_fee: 'Inspection Fee',
  renewal_fee: 'Renewal Fee',
}

const categoryColors: Record<string, string> = {
  license_fee: 'bg-ccra-green/10 text-ccra-green',
  penalty: 'bg-ccra-red/10 text-ccra-red',
  inspection_fee: 'bg-ccra-teal/10 text-ccra-teal',
  renewal_fee: 'bg-ccra-gold/10 text-ccra-gold',
}

function getAiInsight(status: string) {
  switch (status) {
    case 'completed':
      return {
        insight: 'No anomalies detected. Transaction amount is within expected range for this category. Payer history shows consistent payment behavior with no prior violations.',
        severity: 'info' as const,
        confidence: 96,
      }
    case 'pending':
      return {
        insight: 'Payment overdue — escalation recommended. This transaction has exceeded the standard 7-day processing window. Historical data suggests a 34% probability of default for payments pending beyond 10 days in this category.',
        severity: 'warning' as const,
        confidence: 82,
      }
    case 'failed':
      return {
        insight: 'Transaction failed — retry or investigate. Payment gateway returned an error code. Recommend verifying payer bank details and initiating a manual retry within 48 hours to avoid penalty accrual.',
        severity: 'critical' as const,
        confidence: 88,
      }
    default:
      return { insight: '', severity: 'info' as const, confidence: 0 }
  }
}

function getTimelineSteps(tx: Transaction) {
  const baseDate = new Date(tx.date)
  const initiated = new Date(baseDate)
  initiated.setDate(initiated.getDate() - 2)
  const processing = new Date(baseDate)
  processing.setDate(processing.getDate() - 1)

  const steps = [
    {
      label: 'Initiated',
      date: formatDateShort(initiated.toISOString().split('T')[0]),
      done: true,
    },
    {
      label: 'Verification',
      date: formatDateShort(processing.toISOString().split('T')[0]),
      done: true,
    },
    {
      label: 'Processing',
      date: formatDateShort(baseDate.toISOString().split('T')[0]),
      done: tx.status !== 'pending',
    },
    {
      label: tx.status === 'failed' ? 'Failed' : 'Completed',
      date: tx.status === 'pending' ? 'Awaiting' : formatDateShort(tx.date),
      done: tx.status === 'completed',
      failed: tx.status === 'failed',
    },
  ]
  return steps
}

export function TransactionDetailModal({
  transaction,
  open,
  onOpenChange,
}: TransactionDetailModalProps) {
  if (!transaction) return null

  const status = statusConfig[transaction.status]
  const StatusIcon = status.icon
  const ai = getAiInsight(transaction.status)
  const timeline = getTimelineSteps(transaction)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="sm:max-w-lg glass border border-border/50 max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="text-lg">Transaction Details</DialogTitle>
          <DialogDescription>
            Reference: <span className="font-mono text-foreground">{transaction.referenceNumber}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Amount & Status */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold tracking-tight font-mono">
              {formatCurrencyFull(transaction.amount)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{transaction.description}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border',
                status.color
              )}
            >
              <StatusIcon className="h-3.5 w-3.5" />
              {status.label}
            </span>
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium',
                categoryColors[transaction.type]
              )}
            >
              {categoryLabels[transaction.type]}
            </span>
          </div>
        </div>

        {/* Key Details Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="glass rounded-lg p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              <span className="text-[10px] uppercase tracking-wider font-medium">Payer</span>
            </div>
            <p className="text-sm font-medium">{transaction.payer}</p>
          </div>
          <div className="glass rounded-lg p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span className="text-[10px] uppercase tracking-wider font-medium">Date</span>
            </div>
            <p className="text-sm font-medium">{formatDate(transaction.date)}</p>
          </div>
          <div className="glass rounded-lg p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Hash className="h-3.5 w-3.5" />
              <span className="text-[10px] uppercase tracking-wider font-medium">Reference</span>
            </div>
            <p className="text-sm font-medium font-mono">{transaction.referenceNumber}</p>
          </div>
          <div className="glass rounded-lg p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <FileText className="h-3.5 w-3.5" />
              <span className="text-[10px] uppercase tracking-wider font-medium">Category</span>
            </div>
            <p className="text-sm font-medium capitalize">{categoryLabels[transaction.type]}</p>
          </div>
        </div>

        {/* Payment Details */}
        <div className="glass rounded-lg p-4 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Payment Details
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5" />
                Method
              </span>
              <span className="font-medium">Bank Transfer</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Receipt className="h-3.5 w-3.5" />
                Receipt No.
              </span>
              <span className="font-mono text-xs">RCP-{transaction.referenceNumber.split('-').pop()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Processing Date
              </span>
              <span>{formatDateShort(transaction.date)}</span>
            </div>
          </div>
        </div>

        {/* Transaction Timeline */}
        <div className="glass rounded-lg p-4 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Transaction Timeline
          </h4>
          <div className="space-y-0">
            {timeline.map((step, idx) => (
              <div key={step.label} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'h-3 w-3 rounded-full border-2 mt-0.5',
                      step.failed
                        ? 'bg-ccra-red border-ccra-red'
                        : step.done
                          ? 'bg-ccra-green border-ccra-green'
                          : 'bg-transparent border-muted-foreground/40'
                    )}
                  />
                  {idx < timeline.length - 1 && (
                    <div
                      className={cn(
                        'w-0.5 h-6',
                        step.done ? 'bg-ccra-green/50' : 'bg-border'
                      )}
                    />
                  )}
                </div>
                <div className="flex-1 flex items-center justify-between pb-2">
                  <span
                    className={cn(
                      'text-sm font-medium',
                      step.failed && 'text-ccra-red',
                      !step.done && !step.failed && 'text-muted-foreground'
                    )}
                  >
                    {step.label}
                  </span>
                  <span className="text-xs text-muted-foreground">{step.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Assessment */}
        <AiInsightCard
          title="Risk Assessment"
          insight={ai.insight}
          severity={ai.severity}
          confidence={ai.confidence}
          animate={false}
        />
      </DialogContent>
    </Dialog>
  )
}
