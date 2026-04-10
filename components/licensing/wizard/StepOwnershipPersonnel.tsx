'use client'

import { useApplicationWizardStore } from '@/store/useApplicationWizardStore'
import { RepeatingFieldGroup, type FieldConfig } from '@/components/licensing/shared/RepeatingFieldGroup'
import { PersonnelAccordion } from '@/components/licensing/shared/PersonnelAccordion'
import { FileUploadSlot } from '@/components/licensing/shared/FileUploadSlot'
import { LICENSE_TYPE_CONFIGS } from '@/config/license-type-config'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import type { PersonnelRole, ShareholderRecord, UBORecord, DirectorRecord } from '@/types/license'

const shareholderFields: FieldConfig[] = [
  { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Legal name', required: true },
  { key: 'cnic', label: 'CNIC', type: 'text', placeholder: 'XXXXX-XXXXXXX-X', required: true },
  { key: 'percentageOwnership', label: 'Ownership %', type: 'number', placeholder: '0', required: true },
]

const uboFields: FieldConfig[] = [
  { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Legal name', required: true },
  { key: 'cnic', label: 'CNIC', type: 'text', placeholder: 'XXXXX-XXXXXXX-X', required: true },
  { key: 'nationality', label: 'Nationality', type: 'text', placeholder: 'Pakistani', required: true },
  { key: 'percentageOwnership', label: 'Ownership %', type: 'number', placeholder: '25', required: true },
]

const directorFields: FieldConfig[] = [
  { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Legal name', required: true },
  { key: 'cnic', label: 'CNIC', type: 'text', placeholder: 'XXXXX-XXXXXXX-X', required: true },
  { key: 'designation', label: 'Designation', type: 'text', placeholder: 'e.g. CEO, Director', required: true },
  { key: 'appointmentDate', label: 'Appointment Date', type: 'date', required: true },
]

export function StepOwnershipPersonnel() {
  const {
    category,
    businessEntity,
    ownershipControl,
    keyPersonnel,
    setOwnershipControl,
    setKeyPersonnel,
  } = useApplicationWizardStore()

  const config = category ? LICENSE_TYPE_CONFIGS[category] : null
  const requiredRoles: PersonnelRole[] = config?.requiredPersonnel ?? []
  const isCompany = businessEntity.entityType === 'Company'

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold">Ownership & Key Personnel</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Provide ownership structure and details of key personnel. Background checks will be conducted for all listed individuals.
        </p>
      </div>

      {/* Section A: Ownership */}
      <div className="space-y-6">
        <h3 className="text-sm font-semibold text-green-500 uppercase tracking-wider">A — Ownership & Control</h3>

        <RepeatingFieldGroup
          title="Shareholders / Partners"
          fields={shareholderFields}
          values={ownershipControl.shareholders as unknown as Record<string, string | number>[]}
          onChange={(vals) => setOwnershipControl({ shareholders: vals as unknown as ShareholderRecord[] })}
        />

        <RepeatingFieldGroup
          title="Ultimate Beneficial Owners (≥ 25% ownership)"
          fields={uboFields}
          values={ownershipControl.ultimateBeneficialOwners as unknown as Record<string, string | number>[]}
          onChange={(vals) => setOwnershipControl({ ultimateBeneficialOwners: vals as unknown as UBORecord[] })}
          minRows={0}
        />

        {isCompany && (
          <RepeatingFieldGroup
            title="Board of Directors"
            fields={directorFields}
            values={ownershipControl.boardOfDirectors as unknown as Record<string, string | number>[]}
            onChange={(vals) => setOwnershipControl({ boardOfDirectors: vals as unknown as DirectorRecord[] })}
          />
        )}

        <div className="max-w-md">
          <FileUploadSlot
            label="Organizational Chart"
            required
            acceptedFormats="PDF, JPG, PNG"
            maxSizeMB={10}
            value={ownershipControl.organizationalChart ?? null}
            onChange={(doc) => setOwnershipControl({ organizationalChart: doc ?? undefined })}
          />
        </div>

        <div className="space-y-3 rounded-lg border border-white/10 p-4">
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="pep-declaration"
              checked={ownershipControl.pepDeclaration}
              onChange={(e) => setOwnershipControl({ pepDeclaration: e.target.checked })}
              className="mt-0.5 size-4 rounded border-white/20 accent-green-500"
            />
            <label htmlFor="pep-declaration" className="text-sm text-muted-foreground leading-snug">
              I declare that one or more owners, directors, or key personnel are <strong>Politically Exposed Persons (PEP)</strong>.
            </label>
          </div>
          {ownershipControl.pepDeclaration && (
            <div className="space-y-1.5 pl-6">
              <Label className="text-sm">PEP Details <span className="text-red-400">*</span></Label>
              <Textarea
                value={ownershipControl.pepDetails ?? ''}
                onChange={(e) => setOwnershipControl({ pepDetails: e.target.value })}
                placeholder="Provide details of PEP status, positions held, and relationship to the applicant entity..."
                rows={3}
              />
            </div>
          )}
        </div>
      </div>

      {/* Section B: Key Personnel */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-green-500 uppercase tracking-wider">B — Key Personnel</h3>
          <p className="text-xs text-muted-foreground mt-1">
            The following {requiredRoles.length} roles are required for your licence type. Each person must consent to background verification.
          </p>
        </div>

        <PersonnelAccordion
          roles={requiredRoles}
          values={keyPersonnel}
          onChange={setKeyPersonnel}
        />
      </div>
    </div>
  )
}
