'use client'

import { useEffect, useMemo } from 'react'
import { useApplicationWizardStore } from '@/store/useApplicationWizardStore'
import { calculateFees } from '@/utils/fees'
import { formatCurrencyFull } from '@/utils/format'
import { PAYMENT_METHODS } from '@/config/constants'
import { getLicenseCategoryLabel, getTierLabel } from '@/utils/license-helpers'
import { cn } from '@/lib/utils'
import {
  CreditCard, Building2, FileText, Banknote, Coins, Zap,
} from 'lucide-react'

const PAYMENT_ICONS: Record<string, typeof CreditCard> = {
  'Online Payment': CreditCard,
  'Bank Transfer': Building2,
  'Cheque': FileText,
  'Money Order': FileText,
  'Cash Deposit': Banknote,
  'RAAST': Zap,
}

export function StepFeePayment() {
  const {
    category, tier, keyPersonnel, paymentMethod, validationErrors,
    setFeeBreakdown, setPaymentMethod,
  } = useApplicationWizardStore()

  const fees = useMemo(() => {
    if (!category || !tier) return null
    return calculateFees(category, tier, Math.max(keyPersonnel.length, 1))
  }, [category, tier, keyPersonnel.length])

  useEffect(() => {
    if (fees) setFeeBreakdown(fees)
  }, [fees, setFeeBreakdown])

  if (!fees || !category || !tier) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Please select a licence type and tier first.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Fee Calculation & Payment</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Review the fee breakdown for your <strong>{getLicenseCategoryLabel(category)}</strong> — <strong>{getTierLabel(category, tier)}</strong> application.
        </p>
      </div>

      {/* Fee Breakdown Table */}
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02]">
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Fee Item</th>
              <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Amount (PKR)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/5">
              <td className="px-4 py-2.5">Application Fee</td>
              <td className="text-right px-4 py-2.5 font-mono">{formatCurrencyFull(fees.applicationFee)}</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="px-4 py-2.5">Licence Fee</td>
              <td className="text-right px-4 py-2.5 font-mono">{formatCurrencyFull(fees.licenseFee)}</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="px-4 py-2.5">
                Security Clearance
                <span className="text-xs text-muted-foreground ml-1">
                  ({Math.max(keyPersonnel.length, 1)} personnel × Rs 5,000)
                </span>
              </td>
              <td className="text-right px-4 py-2.5 font-mono">{formatCurrencyFull(fees.securityClearanceFee)}</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="px-4 py-2.5">Track & Trace System Setup</td>
              <td className="text-right px-4 py-2.5 font-mono">{formatCurrencyFull(fees.trackAndTraceSetup)}</td>
            </tr>
            <tr className="border-b border-white/10 bg-green-500/5">
              <td className="px-4 py-3 font-semibold">Total Due Now</td>
              <td className="text-right px-4 py-3 font-mono font-bold text-green-500 text-base">
                {formatCurrencyFull(fees.totalDueNow)}
              </td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="px-4 py-2.5 text-muted-foreground">Total First Year (all fees)</td>
              <td className="text-right px-4 py-2.5 font-mono text-muted-foreground">{formatCurrencyFull(fees.totalFirstYear)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Annual Preview */}
      <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4 space-y-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Annual Renewal Preview</p>
        <p className="text-sm">
          Annual renewal fee: <span className="font-mono font-medium">{formatCurrencyFull(fees.annualRenewalPreview)}</span>
          <span className="text-xs text-muted-foreground ml-1">(includes inspection + track & trace monthly)</span>
        </p>
        {fees.trackAndTraceMonthly > 0 && (
          <p className="text-xs text-muted-foreground">
            Track & trace monthly: {formatCurrencyFull(fees.trackAndTraceMonthly)}/month
          </p>
        )}
      </div>

      {/* Payment Method */}
      <div className="space-y-3">
        <h3 className={cn("text-sm font-semibold", validationErrors.includes('paymentMethod') && 'text-red-400')}>
          Select Payment Method <span className="text-red-400">*</span>
          {validationErrors.includes('paymentMethod') && <span className="font-normal ml-2">— Please select one</span>}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PAYMENT_METHODS.map((method) => {
            const Icon = PAYMENT_ICONS[method] ?? CreditCard
            const isSelected = paymentMethod === method
            return (
              <div
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={cn(
                  'cursor-pointer rounded-lg border-2 p-3 transition-all flex items-center gap-3',
                  isSelected
                    ? 'border-green-500 bg-green-500/5'
                    : 'border-white/10 hover:border-white/20'
                )}
              >
                <Icon className={cn('size-4', isSelected ? 'text-green-500' : 'text-muted-foreground')} />
                <span className="text-sm font-medium">{method}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Refund Policy */}
      <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-xs text-muted-foreground space-y-1">
        <p className="font-medium text-foreground">Refund Policy</p>
        <ul className="list-disc pl-4 space-y-0.5">
          <li>Application screening fee: Non-refundable after 5 business days</li>
          <li>Licence fee: Refundable only if application denied (minus processing costs)</li>
          <li>Administrative fees: Non-refundable</li>
        </ul>
      </div>
    </div>
  )
}
