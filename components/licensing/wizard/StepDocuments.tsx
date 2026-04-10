'use client'

import { useApplicationWizardStore } from '@/store/useApplicationWizardStore'
import { FileUploadSlot } from '@/components/licensing/shared/FileUploadSlot'
import { COMMON_DOCUMENTS } from '@/config/constants'

export function StepDocuments() {
  const { commonDocuments, setCommonDocument } = useApplicationWizardStore()

  const uploadedCount = COMMON_DOCUMENTS.filter((doc) => commonDocuments[doc.key]).length
  const totalRequired = COMMON_DOCUMENTS.filter((d) => d.required).length
  const pct = totalRequired > 0 ? Math.round((uploadedCount / totalRequired) * 100) : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Common Documents</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Upload the following business and financial documents required for all licence types. Documents must be in PDF format unless otherwise specified.
        </p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Completion</span>
          <span className="text-xs text-muted-foreground">
            {uploadedCount} / {totalRequired} documents ({pct}%)
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
        {COMMON_DOCUMENTS.map((doc) => (
          <FileUploadSlot
            key={doc.key}
            label={doc.label}
            required={doc.required}
            acceptedFormats={doc.format}
            maxSizeMB={50}
            value={commonDocuments[doc.key] ?? null}
            onChange={(upload) => setCommonDocument(doc.key, upload)}
          />
        ))}
      </div>

      <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
        <p className="text-xs text-muted-foreground">
          <strong className="text-amber-500">Note:</strong> Documents must be legible, current, and certified copies where applicable.
          Financial statements must be audited. Tax returns must be filed with FBR. Maximum file size: 50MB per document, 500MB total.
        </p>
      </div>
    </div>
  )
}
