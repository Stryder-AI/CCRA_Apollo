'use client'

import { useApplicationWizardStore } from '@/store/useApplicationWizardStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FileUploadSlot } from '@/components/licensing/shared/FileUploadSlot'
import { HEMP_USES } from '@/config/constants'
import type { HempSpecific } from '@/types/license'

const defaults: HempSpecific = {
  hempVariety: '',
  intendedUse: 'Fibre',
  cultivationArea: 0,
  expectedYield: '',
}

export function StepHempDetails() {
  const { typeSpecificFields, setTypeSpecificFields } = useApplicationWizardStore()
  const data: HempSpecific = typeSpecificFields?.category === 'INDUSTRIAL_HEMP' ? typeSpecificFields.data : defaults
  const update = (updates: Partial<HempSpecific>) => {
    setTypeSpecificFields({ category: 'INDUSTRIAL_HEMP', data: { ...data, ...updates } })
  }

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-muted-foreground">
        <strong className="text-amber-500">Important:</strong> Industrial hemp must have THC content ≤ 0.3% as per KP regulations. THC certification is mandatory.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm">Hemp Variety <span className="text-red-400">*</span></Label>
          <Input value={data.hempVariety} onChange={(e) => update({ hempVariety: e.target.value })} placeholder="e.g. Industrial Hemp CBD-1" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm">Intended Use <span className="text-red-400">*</span></Label>
          <select value={data.intendedUse} onChange={(e) => update({ intendedUse: e.target.value as HempSpecific['intendedUse'] })} className="flex h-9 w-full rounded-md border border-white/10 bg-transparent px-3 py-1 text-sm">
            {HEMP_USES.map((u) => <option key={u} value={u} className="bg-background">{u}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm">Cultivation Area (acres) <span className="text-red-400">*</span></Label>
          <Input type="number" min={0} value={data.cultivationArea || ''} onChange={(e) => update({ cultivationArea: parseFloat(e.target.value) || 0 })} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm">Expected Yield <span className="text-red-400">*</span></Label>
          <Input value={data.expectedYield} onChange={(e) => update({ expectedYield: e.target.value })} placeholder="e.g. 10 tons/year" />
        </div>
      </div>

      <FileUploadSlot label="THC Certification (≤ 0.3%)" required acceptedFormats="PDF" value={data.thcCertification ?? null} onChange={(doc) => update({ thcCertification: doc ?? undefined })} />
    </div>
  )
}
