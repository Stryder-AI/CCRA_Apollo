'use client'

import { useApplicationWizardStore } from '@/store/useApplicationWizardStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { STRAINS, IRRIGATION_TYPES } from '@/config/constants'
import type { CultivationSpecific } from '@/types/license'

const defaults: CultivationSpecific = {
  totalCultivationArea: 0,
  cultivationType: 'Outdoor',
  irrigationType: '',
  seedCloneSource: '',
  cannabisStrains: [],
  expectedAnnualHarvest: 0,
  dryingFacilityDescription: '',
}

export function StepCultivationDetails() {
  const { typeSpecificFields, setTypeSpecificFields, tier } = useApplicationWizardStore()
  const data: CultivationSpecific = typeSpecificFields?.category === 'CULTIVATION'
    ? typeSpecificFields.data
    : defaults

  const update = (updates: Partial<CultivationSpecific>) => {
    setTypeSpecificFields({ category: 'CULTIVATION', data: { ...data, ...updates } })
  }

  const isNursery = tier === 'NURSERY'

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm">Total Cultivation Area (acres) <span className="text-red-400">*</span></Label>
          <Input type="number" min={0} step={0.1} value={data.totalCultivationArea || ''} onChange={(e) => update({ totalCultivationArea: parseFloat(e.target.value) || 0 })} placeholder="e.g. 5" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm">Cultivation Type <span className="text-red-400">*</span></Label>
          <select value={data.cultivationType} onChange={(e) => update({ cultivationType: e.target.value as CultivationSpecific['cultivationType'] })} className="flex h-9 w-full rounded-md border border-white/10 bg-transparent px-3 py-1 text-sm">
            <option value="Indoor" className="bg-background">Indoor</option>
            <option value="Outdoor" className="bg-background">Outdoor</option>
            <option value="Greenhouse" className="bg-background">Greenhouse</option>
          </select>
        </div>
      </div>

      {data.cultivationType === 'Indoor' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm">Number of Growing Rooms/Zones</Label>
            <Input type="number" min={0} value={data.numberOfGrowingRooms || ''} onChange={(e) => update({ numberOfGrowingRooms: parseInt(e.target.value) || 0 })} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Plant Canopy Area (m²)</Label>
            <Input type="number" min={0} value={data.plantCanopyArea || ''} onChange={(e) => update({ plantCanopyArea: parseFloat(e.target.value) || 0 })} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm">Irrigation System Type <span className="text-red-400">*</span></Label>
          <select value={data.irrigationType} onChange={(e) => update({ irrigationType: e.target.value })} className="flex h-9 w-full rounded-md border border-white/10 bg-transparent px-3 py-1 text-sm">
            <option value="" className="bg-background">Select irrigation type</option>
            {IRRIGATION_TYPES.map((t) => <option key={t} value={t} className="bg-background">{t}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm">Expected Annual Harvest (kg) <span className="text-red-400">*</span></Label>
          <Input type="number" min={0} value={data.expectedAnnualHarvest || ''} onChange={(e) => update({ expectedAnnualHarvest: parseFloat(e.target.value) || 0 })} placeholder="e.g. 5000" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm">Seed / Clone Source <span className="text-red-400">*</span></Label>
        <Input value={data.seedCloneSource} onChange={(e) => update({ seedCloneSource: e.target.value })} placeholder="Source of seeds or clones with THC certification" />
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm">Cannabis Varieties / Strains <span className="text-red-400">*</span></Label>
        <div className="flex flex-wrap gap-2">
          {STRAINS.map((strain) => {
            const selected = data.cannabisStrains.includes(strain)
            return (
              <button key={strain} type="button" onClick={() => { update({ cannabisStrains: selected ? data.cannabisStrains.filter((s) => s !== strain) : [...data.cannabisStrains, strain] }) }}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${selected ? 'border-green-500 bg-green-500/10 text-green-500' : 'border-white/10 text-muted-foreground hover:border-white/20'}`}>
                {strain}
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm">Drying / Curing Facility Description <span className="text-red-400">*</span></Label>
        <Textarea value={data.dryingFacilityDescription} onChange={(e) => update({ dryingFacilityDescription: e.target.value })} placeholder="Describe drying and curing facilities, capacity, and methods..." rows={3} />
      </div>

      {isNursery && (
        <div className="space-y-1.5">
          <Label className="text-sm">Propagation Room Details <span className="text-red-400">*</span></Label>
          <Textarea value={data.propagationDetails ?? ''} onChange={(e) => update({ propagationDetails: e.target.value })} placeholder="Describe propagation facilities, seed storage, and seedling capacity..." rows={3} />
        </div>
      )}
    </div>
  )
}
