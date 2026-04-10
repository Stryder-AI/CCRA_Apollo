'use client'

import { useApplicationWizardStore } from '@/store/useApplicationWizardStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FileUploadSlot } from '@/components/licensing/shared/FileUploadSlot'
import { PROCESSING_METHODS, PRODUCT_TYPES } from '@/config/constants'
import type { ProcessingSpecific } from '@/types/license'

const defaults: ProcessingSpecific = {
  processingMethods: [],
  dailyProcessingCapacity: 0,
  productTypes: [],
}

export function StepProcessingDetails() {
  const { typeSpecificFields, setTypeSpecificFields } = useApplicationWizardStore()
  const data: ProcessingSpecific = typeSpecificFields?.category === 'PROCESSING_EXTRACTION' ? typeSpecificFields.data : defaults
  const update = (updates: Partial<ProcessingSpecific>) => {
    setTypeSpecificFields({ category: 'PROCESSING_EXTRACTION', data: { ...data, ...updates } })
  }

  const toggleItem = (list: string[], item: string) =>
    list.includes(item) ? list.filter((i) => i !== item) : [...list, item]

  const usesChemicals = data.processingMethods.some((m) => ['CO2 Extraction', 'Ethanol Extraction', 'Hydrocarbon Extraction'].includes(m))

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label className="text-sm">Processing Methods <span className="text-red-400">*</span></Label>
        <div className="flex flex-wrap gap-2">
          {PROCESSING_METHODS.map((method) => {
            const selected = data.processingMethods.includes(method)
            return (
              <button key={method} type="button" onClick={() => update({ processingMethods: toggleItem(data.processingMethods, method) })}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${selected ? 'border-green-500 bg-green-500/10 text-green-500' : 'border-white/10 text-muted-foreground hover:border-white/20'}`}>
                {method}
              </button>
            )
          })}
        </div>
      </div>

      {usesChemicals && (
        <div className="space-y-1.5">
          <Label className="text-sm">Solvents Used <span className="text-red-400">*</span></Label>
          <Textarea value={data.solventsUsed ?? ''} onChange={(e) => update({ solventsUsed: e.target.value })} placeholder="List all solvents to be used, with SDS references..." rows={2} />
        </div>
      )}

      <div className="space-y-1.5">
        <Label className="text-sm">Daily Processing Capacity (kg) <span className="text-red-400">*</span></Label>
        <Input type="number" min={0} value={data.dailyProcessingCapacity || ''} onChange={(e) => update({ dailyProcessingCapacity: parseFloat(e.target.value) || 0 })} placeholder="e.g. 25" />
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm">Product Types to be Produced <span className="text-red-400">*</span></Label>
        <div className="flex flex-wrap gap-2">
          {PRODUCT_TYPES.map((type) => {
            const selected = data.productTypes.includes(type)
            return (
              <button key={type} type="button" onClick={() => update({ productTypes: toggleItem(data.productTypes, type) })}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${selected ? 'border-green-500 bg-green-500/10 text-green-500' : 'border-white/10 text-muted-foreground hover:border-white/20'}`}>
                {type}
              </button>
            )
          })}
        </div>
      </div>

      <FileUploadSlot label="Laboratory Equipment List" acceptedFormats="PDF, XLSX" maxSizeMB={20} value={data.equipmentList ?? null} onChange={(doc) => update({ equipmentList: doc ?? undefined })} />

      <div className="space-y-1.5">
        <Label className="text-sm">Chemical Storage Specifications</Label>
        <Textarea value={data.chemicalStorageSpecs ?? ''} onChange={(e) => update({ chemicalStorageSpecs: e.target.value })} placeholder="Describe chemical storage facilities, ventilation, and safety measures..." rows={3} />
      </div>
    </div>
  )
}
