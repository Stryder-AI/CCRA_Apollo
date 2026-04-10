'use client'

import { useApplicationWizardStore } from '@/store/useApplicationWizardStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { PakistanAddressInput } from '@/components/licensing/shared/PakistanAddressInput'
import { FileUploadSlot } from '@/components/licensing/shared/FileUploadSlot'
import type { RetailSpecific, PakistanAddress } from '@/types/license'

const emptyAddress: PakistanAddress = { province: '', district: '', tehsil: '', city: '', street: '', postalCode: '' }

const defaults: RetailSpecific = {
  storeAddress: { ...emptyAddress },
  operatingHours: '',
  medicalPractitionerName: '',
  medicalPractitionerPMDC: '',
  medicalPractitionerSpecialization: '',
  prescriptionVerificationSystem: '',
  posSystem: '',
  ageVerificationProcedure: '',
  inventoryManagementSystem: '',
}

export function StepRetailDetails() {
  const { typeSpecificFields, setTypeSpecificFields } = useApplicationWizardStore()
  const data: RetailSpecific = typeSpecificFields?.category === 'RETAIL_DISPENSARY' ? typeSpecificFields.data : defaults
  const update = (updates: Partial<RetailSpecific>) => {
    setTypeSpecificFields({ category: 'RETAIL_DISPENSARY', data: { ...data, ...updates } })
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Store Location</h3>
        <PakistanAddressInput value={data.storeAddress} onChange={(address) => update({ storeAddress: address })} />
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm">Operating Hours <span className="text-red-400">*</span></Label>
        <Input value={data.operatingHours} onChange={(e) => update({ operatingHours: e.target.value })} placeholder="e.g. Mon-Sat 9:00 AM - 6:00 PM" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm">Medical Practitioner Name <span className="text-red-400">*</span></Label>
          <Input value={data.medicalPractitionerName} onChange={(e) => update({ medicalPractitionerName: e.target.value })} placeholder="Dr. Full Name" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm">PMDC Registration # <span className="text-red-400">*</span></Label>
          <Input value={data.medicalPractitionerPMDC} onChange={(e) => update({ medicalPractitionerPMDC: e.target.value })} placeholder="PMDC-XXXXX" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm">Specialization <span className="text-red-400">*</span></Label>
          <Input value={data.medicalPractitionerSpecialization} onChange={(e) => update({ medicalPractitionerSpecialization: e.target.value })} placeholder="e.g. Pain Management" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm">Prescription Verification System <span className="text-red-400">*</span></Label>
        <Textarea value={data.prescriptionVerificationSystem} onChange={(e) => update({ prescriptionVerificationSystem: e.target.value })} placeholder="Describe how prescriptions are verified..." rows={2} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm">Point-of-Sale System <span className="text-red-400">*</span></Label>
          <Input value={data.posSystem} onChange={(e) => update({ posSystem: e.target.value })} placeholder="POS system description" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm">Inventory Management System <span className="text-red-400">*</span></Label>
          <Input value={data.inventoryManagementSystem} onChange={(e) => update({ inventoryManagementSystem: e.target.value })} placeholder="Inventory system description" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm">Age Verification Procedure <span className="text-red-400">*</span></Label>
        <Textarea value={data.ageVerificationProcedure} onChange={(e) => update({ ageVerificationProcedure: e.target.value })} placeholder="Describe age verification process..." rows={2} />
      </div>

      <FileUploadSlot label="Patient Data Protection Plan" acceptedFormats="PDF" value={data.patientDataProtectionPlan ?? null} onChange={(doc) => update({ patientDataProtectionPlan: doc ?? undefined })} />
    </div>
  )
}
