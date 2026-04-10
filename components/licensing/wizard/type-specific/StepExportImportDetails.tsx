'use client'

import { useApplicationWizardStore } from '@/store/useApplicationWizardStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { ExportImportSpecific } from '@/types/license'

const defaults: ExportImportSpecific = {
  direction: 'Export',
  destinationOrOriginCountry: '',
  productType: '',
  quantity: '',
  purpose: 'Medical',
  entityDetails: '',
  incbReference: '',
}

export function StepExportImportDetails() {
  const { typeSpecificFields, setTypeSpecificFields, tier } = useApplicationWizardStore()
  const data: ExportImportSpecific = typeSpecificFields?.category === 'EXPORT_IMPORT' ? typeSpecificFields.data : { ...defaults, direction: (tier === 'IMPORT' ? 'Import' : 'Export') as ExportImportSpecific['direction'] }
  const update = (updates: Partial<ExportImportSpecific>) => {
    setTypeSpecificFields({ category: 'EXPORT_IMPORT', data: { ...data, ...updates } })
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm">{data.direction === 'Export' ? 'Destination' : 'Origin'} Country <span className="text-red-400">*</span></Label>
          <Input value={data.destinationOrOriginCountry} onChange={(e) => update({ destinationOrOriginCountry: e.target.value })} placeholder="e.g. Germany, Canada" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm">Purpose <span className="text-red-400">*</span></Label>
          <select value={data.purpose} onChange={(e) => update({ purpose: e.target.value as ExportImportSpecific['purpose'] })} className="flex h-9 w-full rounded-md border border-white/10 bg-transparent px-3 py-1 text-sm">
            <option value="Medical" className="bg-background">Medical</option>
            <option value="Scientific" className="bg-background">Scientific</option>
            <option value="Industrial" className="bg-background">Industrial</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm">Product Type <span className="text-red-400">*</span></Label>
          <Input value={data.productType} onChange={(e) => update({ productType: e.target.value })} placeholder="e.g. CBD Oil, Dried Cannabis" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm">Quantity <span className="text-red-400">*</span></Label>
          <Input value={data.quantity} onChange={(e) => update({ quantity: e.target.value })} placeholder="e.g. 500 kg" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm">{data.direction === 'Export' ? 'Importing' : 'Exporting'} Entity Details <span className="text-red-400">*</span></Label>
        <Textarea value={data.entityDetails} onChange={(e) => update({ entityDetails: e.target.value })} placeholder="Name, address, and licence details of the counterpart entity..." rows={3} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm">Bilateral Agreement Reference</Label>
          <Input value={data.bilateralAgreementReference ?? ''} onChange={(e) => update({ bilateralAgreementReference: e.target.value })} placeholder="Reference number (if applicable)" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm">INCB Estimate/Assessment Reference <span className="text-red-400">*</span></Label>
          <Input value={data.incbReference} onChange={(e) => update({ incbReference: e.target.value })} placeholder="INCB reference number" />
        </div>
      </div>
    </div>
  )
}
