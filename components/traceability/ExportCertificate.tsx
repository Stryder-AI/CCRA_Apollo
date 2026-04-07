'use client'

import { GlassCard } from '@/design-system/glass-card'
import { cn } from '@/lib/utils'
import { CheckCircle2, Shield } from 'lucide-react'
import type { Batch } from '@/types/traceability'

interface ExportCertificateProps {
  batch: Batch
}

function QrCodePlaceholder() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="h-24 w-24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* QR code pattern placeholder */}
      <rect x="0" y="0" width="100" height="100" rx="4" fill="currentColor" className="text-muted/30" />
      {/* Top-left finder */}
      <rect x="5" y="5" width="25" height="25" rx="2" fill="currentColor" className="text-foreground/70" />
      <rect x="9" y="9" width="17" height="17" rx="1" fill="currentColor" className="text-muted/30" />
      <rect x="13" y="13" width="9" height="9" rx="1" fill="currentColor" className="text-foreground/70" />
      {/* Top-right finder */}
      <rect x="70" y="5" width="25" height="25" rx="2" fill="currentColor" className="text-foreground/70" />
      <rect x="74" y="9" width="17" height="17" rx="1" fill="currentColor" className="text-muted/30" />
      <rect x="78" y="13" width="9" height="9" rx="1" fill="currentColor" className="text-foreground/70" />
      {/* Bottom-left finder */}
      <rect x="5" y="70" width="25" height="25" rx="2" fill="currentColor" className="text-foreground/70" />
      <rect x="9" y="74" width="17" height="17" rx="1" fill="currentColor" className="text-muted/30" />
      <rect x="13" y="78" width="9" height="9" rx="1" fill="currentColor" className="text-foreground/70" />
      {/* Data pattern */}
      {[35, 42, 49, 56, 63].map((x) =>
        [35, 42, 49, 56, 63, 70, 77, 84].map((y) => (
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width="5"
            height="5"
            fill="currentColor"
            className={cn(
              (x + y) % 14 === 0 ? 'text-foreground/70' : 'text-foreground/40'
            )}
          />
        ))
      )}
      {[35, 42, 49, 56, 63].map((y) =>
        [5, 12, 19, 26].map((x) => (
          <rect
            key={`d-${x}-${y}`}
            x={x}
            y={y}
            width="5"
            height="5"
            fill="currentColor"
            className={cn(
              (x + y) % 7 === 0 ? 'text-foreground/70' : 'text-foreground/30'
            )}
          />
        ))
      )}
    </svg>
  )
}

export function ExportCertificate({ batch }: ExportCertificateProps) {
  if (batch.currentStage !== 'distribution' || !batch.labResults) {
    return null
  }

  const lab = batch.labResults
  const certNumber = `CCRA-EXP-${batch.batchCode.split('-').slice(-2).join('-')}`
  const issueDate = new Date().toISOString().split('T')[0]

  const custodyStages = batch.stages.filter((s) => s.handler && s.status === 'completed')

  return (
    <div className="space-y-4">
      <GlassCard padding="lg" className="border border-ccra-green/20">
        {/* Header */}
        <div className="text-center border-b border-border pb-4 mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-ccra-green" />
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-ccra-green">
              Cannabis Crop Regulatory Authority
            </span>
            <Shield className="h-6 w-6 text-ccra-green" />
          </div>
          <h2 className="text-xl font-bold tracking-wide text-foreground">
            EXPORT CERTIFICATE
          </h2>
          <p className="text-[10px] text-muted-foreground mt-1">
            Islamic Republic of Pakistan | Ministry of Narcotics Control
          </p>
        </div>

        {/* Certificate Number & Date */}
        <div className="flex items-center justify-between mb-4 px-2">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Certificate No.</div>
            <div className="font-mono text-sm font-bold">{certNumber}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Issue Date</div>
            <div className="text-sm font-medium">{issueDate}</div>
          </div>
        </div>

        {/* Batch Details */}
        <div className="border border-border rounded-lg p-3 mb-4">
          <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-semibold">
            Batch Information
          </h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Batch Code:</span>
              <span className="font-mono font-semibold">{batch.batchCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Farm:</span>
              <span className="font-medium">{batch.farmName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Strain:</span>
              <span className="font-medium">{batch.strain}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Quantity:</span>
              <span className="font-medium">{batch.quantity.toLocaleString()} {batch.unit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created:</span>
              <span className="font-medium">{batch.createdDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Completed:</span>
              <span className="font-medium">{batch.estimatedCompletion ?? '—'}</span>
            </div>
          </div>
        </div>

        {/* Lab Results Summary */}
        <div className="border border-border rounded-lg p-3 mb-4">
          <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-semibold">
            Laboratory Analysis Summary
          </h3>
          <div className="grid grid-cols-3 gap-3 text-xs mb-3">
            <div className="text-center">
              <div className="text-muted-foreground mb-0.5">THC</div>
              <div className="font-mono font-bold text-sm">{lab.thcPercent}%</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground mb-0.5">CBD</div>
              <div className="font-mono font-bold text-sm">{lab.cbdPercent}%</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground mb-0.5">Moisture</div>
              <div className="font-mono font-bold text-sm">{lab.moisture}%</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 text-xs">
            {(['Contaminants', 'Pesticides', 'Heavy Metals'] as const).map((test) => {
              const key = test === 'Heavy Metals' ? 'heavyMetals' : test.toLowerCase() as 'contaminants' | 'pesticides'
              const passed = lab[key] === 'pass'
              return (
                <div key={test} className="flex items-center gap-1">
                  <CheckCircle2 className={cn('h-3.5 w-3.5', passed ? 'text-ccra-green' : 'text-red-500')} />
                  <span className={cn(passed ? 'text-ccra-green' : 'text-red-500', 'font-medium')}>{test}</span>
                </div>
              )
            })}
          </div>
          <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Lab: {lab.labName}</span>
            <span>Certificate: {lab.certificateId ?? 'N/A'}</span>
            <span>Tested: {lab.testedDate}</span>
          </div>
        </div>

        {/* Chain of Custody Summary */}
        <div className="border border-border rounded-lg p-3 mb-4">
          <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-semibold">
            Chain of Custody ({custodyStages.length} stages verified)
          </h3>
          <div className="space-y-1">
            {custodyStages.map((stage) => (
              <div key={stage.type} className="flex items-center justify-between text-[11px]">
                <span className="font-medium capitalize">{stage.type.replace('-', ' ')}</span>
                <span className="text-muted-foreground">{stage.handler}</span>
                <span className="text-muted-foreground font-mono text-[10px]">
                  {stage.startDate} {stage.endDate ? `- ${stage.endDate}` : ''}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* QR Code & Signature */}
        <div className="flex items-end justify-between pt-4 border-t border-border">
          <div className="flex flex-col items-center">
            <QrCodePlaceholder />
            <span className="text-[9px] text-muted-foreground mt-1">Scan to verify</span>
          </div>

          <div className="text-right">
            <div className="w-48 border-b border-foreground/30 mb-1" />
            <div className="text-[10px] text-muted-foreground">Authorized Signatory</div>
            <div className="text-[10px] font-medium mt-0.5">Director General, CCRA</div>
            <div className="text-[9px] text-muted-foreground">
              Cannabis Crop Regulatory Authority
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
