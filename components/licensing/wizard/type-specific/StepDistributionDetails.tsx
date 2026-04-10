'use client'

import { useApplicationWizardStore } from '@/store/useApplicationWizardStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RepeatingFieldGroup, type FieldConfig } from '@/components/licensing/shared/RepeatingFieldGroup'
import type { DistributionSpecific } from '@/types/license'

const vehicleFields: FieldConfig[] = [
  { key: 'vehicleType', label: 'Vehicle Type', type: 'text', placeholder: 'e.g. Refrigerated Van', required: true },
  { key: 'registrationNumber', label: 'Registration #', type: 'text', placeholder: 'e.g. ABC-1234', required: true },
  { key: 'gpsTrackingId', label: 'GPS Tracking ID', type: 'text', placeholder: 'Tracking device ID', required: true },
]

const driverFieldsConfig: FieldConfig[] = [
  { key: 'name', label: 'Driver Name', type: 'text', placeholder: 'Full name', required: true },
  { key: 'cnic', label: 'CNIC', type: 'text', placeholder: 'XXXXX-XXXXXXX-X', required: true },
  { key: 'driverLicenseNumber', label: 'Driving Licence #', type: 'text', placeholder: 'Licence number', required: true },
]

const defaults: DistributionSpecific = {
  vehicleFleet: [{ vehicleType: '', registrationNumber: '', gpsTrackingId: '' }],
  transportRoutes: '',
  insuranceCoverage: '',
  driverDetails: [{ name: '', cnic: '', driverLicenseNumber: '' }],
}

export function StepDistributionDetails() {
  const { typeSpecificFields, setTypeSpecificFields } = useApplicationWizardStore()
  const data: DistributionSpecific = typeSpecificFields?.category === 'DISTRIBUTION_TRANSPORT' ? typeSpecificFields.data : defaults
  const update = (updates: Partial<DistributionSpecific>) => {
    setTypeSpecificFields({ category: 'DISTRIBUTION_TRANSPORT', data: { ...data, ...updates } })
  }

  return (
    <div className="space-y-5">
      <RepeatingFieldGroup title="Vehicle Fleet" fields={vehicleFields}
        values={data.vehicleFleet as unknown as Record<string, string | number>[]}
        onChange={(vals) => update({ vehicleFleet: vals as unknown as DistributionSpecific['vehicleFleet'] })} />

      <div className="space-y-1.5">
        <Label className="text-sm">Transport Routes <span className="text-red-400">*</span></Label>
        <Textarea value={data.transportRoutes} onChange={(e) => update({ transportRoutes: e.target.value })} placeholder="Describe primary transport routes, pickup/delivery locations..." rows={3} />
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm">Temporary Storage Facility Address</Label>
        <Input value={data.temporaryStorageAddress ?? ''} onChange={(e) => update({ temporaryStorageAddress: e.target.value })} placeholder="Address of temporary storage (if applicable)" />
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm">Insurance Coverage Details <span className="text-red-400">*</span></Label>
        <Textarea value={data.insuranceCoverage} onChange={(e) => update({ insuranceCoverage: e.target.value })} placeholder="Insurance provider, policy number, coverage details..." rows={2} />
      </div>

      <RepeatingFieldGroup title="Driver Details" fields={driverFieldsConfig}
        values={data.driverDetails as unknown as Record<string, string | number>[]}
        onChange={(vals) => update({ driverDetails: vals as unknown as DistributionSpecific['driverDetails'] })} />
    </div>
  )
}
