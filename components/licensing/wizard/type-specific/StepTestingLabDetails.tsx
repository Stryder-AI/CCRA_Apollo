'use client'

import { useApplicationWizardStore } from '@/store/useApplicationWizardStore'
import { Label } from '@/components/ui/label'
import { FileUploadSlot } from '@/components/licensing/shared/FileUploadSlot'
import { TESTING_CAPABILITIES } from '@/config/constants'
import type { TestingLabSpecific } from '@/types/license'

const defaults: TestingLabSpecific = {
  testingCapabilities: [],
  isoAccreditationStatus: 'Not Started',
}

export function StepTestingLabDetails() {
  const { typeSpecificFields, setTypeSpecificFields } = useApplicationWizardStore()
  const data: TestingLabSpecific = typeSpecificFields?.category === 'TESTING_LABORATORY' ? typeSpecificFields.data : defaults
  const update = (updates: Partial<TestingLabSpecific>) => {
    setTypeSpecificFields({ category: 'TESTING_LABORATORY', data: { ...data, ...updates } })
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label className="text-sm">Testing Capabilities <span className="text-red-400">*</span></Label>
        <div className="flex flex-wrap gap-2">
          {TESTING_CAPABILITIES.map((cap) => {
            const selected = data.testingCapabilities.includes(cap)
            return (
              <button key={cap} type="button" onClick={() => update({ testingCapabilities: selected ? data.testingCapabilities.filter((c) => c !== cap) : [...data.testingCapabilities, cap] })}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${selected ? 'border-green-500 bg-green-500/10 text-green-500' : 'border-white/10 text-muted-foreground hover:border-white/20'}`}>
                {cap}
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm">ISO/IEC 17025 Accreditation Status <span className="text-red-400">*</span></Label>
        <select value={data.isoAccreditationStatus} onChange={(e) => update({ isoAccreditationStatus: e.target.value as TestingLabSpecific['isoAccreditationStatus'] })} className="flex h-9 w-full rounded-md border border-white/10 bg-transparent px-3 py-1 text-sm">
          <option value="Not Started" className="bg-background">Not Started</option>
          <option value="In Progress" className="bg-background">In Progress</option>
          <option value="Accredited" className="bg-background">Accredited</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FileUploadSlot label="ISO 17025 Accreditation Document" acceptedFormats="PDF" value={data.isoAccreditationDoc ?? null} onChange={(doc) => update({ isoAccreditationDoc: doc ?? undefined })} />
        <FileUploadSlot label="Equipment Inventory" acceptedFormats="PDF, XLSX" value={data.equipmentInventory ?? null} onChange={(doc) => update({ equipmentInventory: doc ?? undefined })} />
        <FileUploadSlot label="Testing Methods Documentation" acceptedFormats="PDF" value={data.testingMethods ?? null} onChange={(doc) => update({ testingMethods: doc ?? undefined })} />
        <FileUploadSlot label="Quality Control Procedures" acceptedFormats="PDF" value={data.qcProcedures ?? null} onChange={(doc) => update({ qcProcedures: doc ?? undefined })} />
        <FileUploadSlot label="Proficiency Testing Records" acceptedFormats="PDF" value={data.proficiencyRecords ?? null} onChange={(doc) => update({ proficiencyRecords: doc ?? undefined })} />
        <FileUploadSlot label="Head of Laboratory CV" acceptedFormats="PDF" value={data.headOfLabCV ?? null} onChange={(doc) => update({ headOfLabCV: doc ?? undefined })} />
        <FileUploadSlot label="Lab Director Qualifications" acceptedFormats="PDF" value={data.labDirectorQualifications ?? null} onChange={(doc) => update({ labDirectorQualifications: doc ?? undefined })} />
      </div>
    </div>
  )
}
