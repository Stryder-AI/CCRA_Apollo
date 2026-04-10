'use client'

import { useApplicationWizardStore } from '@/store/useApplicationWizardStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FileUploadSlot } from '@/components/licensing/shared/FileUploadSlot'
import { RESEARCH_TYPES } from '@/config/constants'
import type { ResearchSpecific } from '@/types/license'

const defaults: ResearchSpecific = {
  institutionName: '',
  principalInvestigator: '',
  piQualifications: '',
  researchObjectives: '',
  researchType: 'Agricultural',
  fundingSource: '',
  expectedStartDate: '',
  expectedEndDate: '',
  cannabisQuantityRequired: '',
}

export function StepResearchDetails() {
  const { typeSpecificFields, setTypeSpecificFields } = useApplicationWizardStore()
  const data: ResearchSpecific = typeSpecificFields?.category === 'RESEARCH' ? typeSpecificFields.data : defaults
  const update = (updates: Partial<ResearchSpecific>) => {
    setTypeSpecificFields({ category: 'RESEARCH', data: { ...data, ...updates } })
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label className="text-sm">Research Institution Name <span className="text-red-400">*</span></Label>
        <Input value={data.institutionName} onChange={(e) => update({ institutionName: e.target.value })} placeholder="University or research organization name" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm">Principal Investigator <span className="text-red-400">*</span></Label>
          <Input value={data.principalInvestigator} onChange={(e) => update({ principalInvestigator: e.target.value })} placeholder="Dr. Full Name" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm">PI Qualifications</Label>
          <Input value={data.piQualifications} onChange={(e) => update({ piQualifications: e.target.value })} placeholder="PhD, relevant certifications..." />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm">Type of Research <span className="text-red-400">*</span></Label>
        <select value={data.researchType} onChange={(e) => update({ researchType: e.target.value as ResearchSpecific['researchType'] })} className="flex h-9 w-full rounded-md border border-white/10 bg-transparent px-3 py-1 text-sm">
          {RESEARCH_TYPES.map((t) => <option key={t} value={t} className="bg-background">{t}</option>)}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm">Research Objectives <span className="text-red-400">*</span></Label>
        <Textarea value={data.researchObjectives} onChange={(e) => update({ researchObjectives: e.target.value })} placeholder="Detailed research objectives (minimum 500 words recommended)..." rows={5} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FileUploadSlot label="Research Protocol" required acceptedFormats="PDF" value={data.researchProtocol ?? null} onChange={(doc) => update({ researchProtocol: doc ?? undefined })} />
        <FileUploadSlot label="PI Curriculum Vitae" acceptedFormats="PDF" value={data.piCV ?? null} onChange={(doc) => update({ piCV: doc ?? undefined })} />
      </div>

      {data.researchType === 'Clinical Trial' && (
        <FileUploadSlot label="Institutional Ethics Approval" required acceptedFormats="PDF" value={data.ethicsApproval ?? null} onChange={(doc) => update({ ethicsApproval: doc ?? undefined })} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm">Funding Source <span className="text-red-400">*</span></Label>
          <Input value={data.fundingSource} onChange={(e) => update({ fundingSource: e.target.value })} placeholder="Source of research funding" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm">Cannabis Quantity Required <span className="text-red-400">*</span></Label>
          <Input value={data.cannabisQuantityRequired} onChange={(e) => update({ cannabisQuantityRequired: e.target.value })} placeholder="e.g. 5 kg over 2 years" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm">Expected Start Date <span className="text-red-400">*</span></Label>
          <Input type="date" value={data.expectedStartDate} onChange={(e) => update({ expectedStartDate: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm">Expected End Date <span className="text-red-400">*</span></Label>
          <Input type="date" value={data.expectedEndDate} onChange={(e) => update({ expectedEndDate: e.target.value })} />
        </div>
      </div>
    </div>
  )
}
