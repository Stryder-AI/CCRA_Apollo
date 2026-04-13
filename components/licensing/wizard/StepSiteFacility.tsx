'use client'

import { useApplicationWizardStore } from '@/store/useApplicationWizardStore'
import { PakistanAddressInput } from '@/components/licensing/shared/PakistanAddressInput'
import { FileUploadSlot } from '@/components/licensing/shared/FileUploadSlot'
import { SITE_FACILITY_DOCUMENTS } from '@/config/constants'
import { LICENSE_TYPE_CONFIGS } from '@/config/license-type-config'
import type { LicenseCategory, DocumentUpload } from '@/types/license'

export function StepSiteFacility() {
  const { category, siteFacility, setSiteFacility, validationErrors } = useApplicationWizardStore()

  const config = category ? LICENSE_TYPE_CONFIGS[category] : null

  if (config?.skipSiteFacility) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Site & Facility Details</h2>
        <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
          <p className="text-sm text-muted-foreground">
            Research licences have simplified site requirements. Please provide the research facility address below.
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Facility Address</h3>
          <PakistanAddressInput
            value={siteFacility.siteAddress}
            onChange={(address) => setSiteFacility({ siteAddress: address })}
            includeGPS
            highlightErrors={validationErrors}
          />
        </div>
      </div>
    )
  }

  // Filter documents applicable to this license type
  const applicableDocs = SITE_FACILITY_DOCUMENTS.filter((doc) => {
    if (!config) return true
    if (!config.siteFacilityDocKeys.includes(doc.key)) return false
    if ('applicableTo' in doc && doc.applicableTo) {
      return (doc.applicableTo as LicenseCategory[]).includes(category!)
    }
    return true
  })

  // Count uploaded docs
  const uploadedCount = applicableDocs.filter((doc) => {
    const val = siteFacility[doc.key as keyof typeof siteFacility]
    return val && typeof val === 'object' && 'fileName' in val
  }).length
  const requiredCount = applicableDocs.filter((d) => d.required).length
  const pct = requiredCount > 0 ? Math.round((uploadedCount / requiredCount) * 100) : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Site & Facility Details</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Provide the facility address and upload all required site documentation.
        </p>
      </div>

      {/* Site Address */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Facility / Site Address</h3>
        <PakistanAddressInput
          value={siteFacility.siteAddress}
          onChange={(address) => setSiteFacility({ siteAddress: address })}
          includeGPS
        />
      </div>

      {/* Document Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Site Documents</h3>
          <span className="text-xs text-muted-foreground">
            {uploadedCount} / {requiredCount} required documents uploaded ({pct}%)
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-green-500 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Document Upload Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {applicableDocs.map((doc) => {
          const currentValue = siteFacility[doc.key as keyof typeof siteFacility] as DocumentUpload | undefined
          return (
            <FileUploadSlot
              key={doc.key}
              label={doc.label}
              required={doc.required}
              acceptedFormats={doc.format}
              maxSizeMB={doc.key === 'site_video_tour' ? 500 : 50}
              value={currentValue ?? null}
              onChange={(upload) => {
                setSiteFacility({ [doc.key]: upload ?? undefined } as Record<string, DocumentUpload | undefined>)
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
