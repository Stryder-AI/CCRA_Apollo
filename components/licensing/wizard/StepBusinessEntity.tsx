'use client'

import { useApplicationWizardStore } from '@/store/useApplicationWizardStore'
import { PakistanAddressInput } from '@/components/licensing/shared/PakistanAddressInput'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ENTITY_TYPES } from '@/config/constants'
import { Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

export function StepBusinessEntity() {
  const { businessEntity, setBusinessEntity, validationErrors } = useApplicationWizardStore()

  const hasError = (field: string) => validationErrors.includes(field)

  const inputError = 'ring-2 ring-red-500/50 border-red-500'

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Business Entity Information</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Provide complete business registration details. All fields marked with <span className="text-red-400">*</span> are mandatory.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm">Legal Entity Name <span className="text-red-400">*</span></Label>
          <Input
            value={businessEntity.legalEntityName}
            onChange={(e) => setBusinessEntity({ legalEntityName: e.target.value })}
            placeholder="Registered legal name of entity"
            maxLength={200}
            className={cn(hasError('legalEntityName') && inputError)}
          />
          {hasError('legalEntityName') && <p className="text-xs text-red-400">This field is required</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm">Entity Type <span className="text-red-400">*</span></Label>
          <select
            value={businessEntity.entityType}
            onChange={(e) => setBusinessEntity({ entityType: e.target.value as typeof businessEntity.entityType })}
            className="flex h-9 w-full rounded-md border border-white/10 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-500"
          >
            {ENTITY_TYPES.map((t) => (
              <option key={t} value={t} className="bg-background">{t}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm">
            SECP Registration Number
            {businessEntity.entityType === 'Company' && <span className="text-red-400"> *</span>}
          </Label>
          <div className="relative">
            <Input
              value={businessEntity.secpRegistrationNumber}
              onChange={(e) => setBusinessEntity({ secpRegistrationNumber: e.target.value })}
              placeholder="e.g. 0123456"
              className={cn(hasError('secpRegistrationNumber') && inputError)}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-muted-foreground bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded">
              <Shield className="size-2.5" /> SECP Verified
            </div>
          </div>
          {hasError('secpRegistrationNumber') && <p className="text-xs text-red-400">This field is required</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm">NTN (National Tax Number) <span className="text-red-400">*</span></Label>
          <div className="relative">
            <Input
              value={businessEntity.ntn}
              onChange={(e) => setBusinessEntity({ ntn: e.target.value })}
              placeholder="e.g. 1234567-8"
              className={cn(hasError('ntn') && inputError)}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-muted-foreground bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded">
              <Shield className="size-2.5" /> FBR Verified
            </div>
          </div>
          {hasError('ntn') && <p className="text-xs text-red-400">This field is required</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm">Date of Incorporation / Registration <span className="text-red-400">*</span></Label>
          <Input
            type="date"
            value={businessEntity.dateOfIncorporation}
            onChange={(e) => setBusinessEntity({ dateOfIncorporation: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm">Business Phone <span className="text-red-400">*</span></Label>
          <Input
            value={businessEntity.businessPhone}
            onChange={(e) => setBusinessEntity({ businessPhone: e.target.value })}
            placeholder="+92 XXX XXXXXXX"
            className={cn(hasError('businessPhone') && inputError)}
          />
          {hasError('businessPhone') && <p className="text-xs text-red-400">This field is required</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm">Business Email <span className="text-red-400">*</span></Label>
          <Input
            type="email"
            value={businessEntity.businessEmail}
            onChange={(e) => setBusinessEntity({ businessEmail: e.target.value })}
            placeholder="contact@company.com"
            className={cn(hasError('businessEmail') && inputError)}
          />
          {hasError('businessEmail') && <p className="text-xs text-red-400">This field is required</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm">Website</Label>
          <Input
            type="url"
            value={businessEntity.website ?? ''}
            onChange={(e) => setBusinessEntity({ website: e.target.value })}
            placeholder="https://www.example.com"
          />
        </div>
      </div>

      {/* Registered Address */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Registered Office Address</h3>
        {(hasError('province') || hasError('district')) && (
          <p className="text-xs text-red-400">Province and District are required</p>
        )}
        <PakistanAddressInput
          value={businessEntity.registeredAddress}
          onChange={(address) => setBusinessEntity({ registeredAddress: address })}
          highlightErrors={validationErrors}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm">Nature of Business <span className="text-red-400">*</span></Label>
        <Textarea
          value={businessEntity.natureOfBusiness}
          onChange={(e) => setBusinessEntity({ natureOfBusiness: e.target.value })}
          placeholder="Describe primary business activities and objectives..."
          rows={3}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm">Existing Cannabis-Related Licences</Label>
        <Textarea
          value={businessEntity.existingLicenses ?? ''}
          onChange={(e) => setBusinessEntity({ existingLicenses: e.target.value })}
          placeholder="Details of any existing cannabis licences from any jurisdiction (if applicable)..."
          rows={2}
        />
      </div>
    </div>
  )
}
