'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Upload, CheckCircle2 } from 'lucide-react'

const REQUIRED_DOCUMENTS = [
  { id: 'cnic', label: 'CNIC Copy' },
  { id: 'land-title', label: 'Land Title Deed' },
  { id: 'agri-survey', label: 'Agricultural Survey' },
  { id: 'company-reg', label: 'Company Registration (if applicable)' },
]

export function StepDocuments() {
  const [uploaded, setUploaded] = useState<Record<string, boolean>>({})

  const toggleUpload = (id: string) => {
    setUploaded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Required Documents</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Upload the required documents to proceed with your application.
        </p>
      </div>

      <div className="space-y-3">
        {REQUIRED_DOCUMENTS.map((doc) => {
          const isUploaded = uploaded[doc.id]
          return (
            <div
              key={doc.id}
              className={cn(
                'flex items-center justify-between rounded-lg border px-4 py-3 transition-colors',
                isUploaded
                  ? 'border-green-500/30 bg-green-500/5'
                  : 'border-white/10'
              )}
            >
              <div className="flex items-center gap-3">
                {isUploaded ? (
                  <CheckCircle2 className="size-5 text-green-500" />
                ) : (
                  <Upload className="size-5 text-muted-foreground" />
                )}
                <span className={cn('text-sm', isUploaded && 'text-green-500 font-medium')}>
                  {doc.label}
                </span>
              </div>
              <Button
                variant={isUploaded ? 'outline' : 'default'}
                size="sm"
                onClick={() => toggleUpload(doc.id)}
              >
                {isUploaded ? 'Uploaded' : 'Upload'}
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
