'use client'

import { useState, useCallback } from 'react'
import { ChevronDown, User, CheckCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FileUploadSlot } from './FileUploadSlot'
import { cn } from '@/lib/utils'
import type { PersonnelRecord, PersonnelRole, DocumentUpload } from '@/types/license'

interface PersonnelAccordionProps {
  roles: PersonnelRole[]
  values: PersonnelRecord[]
  onChange: (records: PersonnelRecord[]) => void
}

function createEmptyRecord(role: PersonnelRole): PersonnelRecord {
  return {
    role,
    name: '',
    cnic: '',
    phone: '',
    email: '',
    qualifications: '',
    backgroundCheckConsent: false,
  }
}

export function PersonnelAccordion({ roles, values, onChange }: PersonnelAccordionProps) {
  const [openRole, setOpenRole] = useState<PersonnelRole | null>(null)

  const getRecord = useCallback((role: PersonnelRole): PersonnelRecord => {
    return values.find((v) => v.role === role) ?? createEmptyRecord(role)
  }, [values])

  const updateRecord = useCallback((role: PersonnelRole, updates: Partial<PersonnelRecord>) => {
    const existing = values.find((v) => v.role === role)
    const record = existing
      ? { ...existing, ...updates }
      : { ...createEmptyRecord(role), ...updates }

    const next = existing
      ? values.map((v) => v.role === role ? record : v)
      : [...values, record]
    onChange(next)
  }, [values, onChange])

  const isComplete = useCallback((role: PersonnelRole): boolean => {
    const r = values.find((v) => v.role === role)
    return !!(r && r.name && r.cnic && r.backgroundCheckConsent)
  }, [values])

  return (
    <div className="space-y-2">
      {roles.map((role) => {
        const record = getRecord(role)
        const isOpen = openRole === role
        const complete = isComplete(role)

        return (
          <div
            key={role}
            className={cn(
              'rounded-lg border transition-colors',
              isOpen ? 'border-green-500/30 bg-green-500/[0.02]' : 'border-white/10'
            )}
          >
            <button
              type="button"
              onClick={() => setOpenRole(isOpen ? null : role)}
              className="flex w-full items-center justify-between p-3"
            >
              <div className="flex items-center gap-2">
                <User className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">{role}</span>
                {complete && <CheckCircle className="size-3.5 text-green-500" />}
              </div>
              <ChevronDown
                className={cn(
                  'size-4 text-muted-foreground transition-transform',
                  isOpen && 'rotate-180'
                )}
              />
            </button>

            {isOpen && (
              <div className="border-t border-white/10 p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm">Full Name <span className="text-red-400">*</span></Label>
                    <Input
                      value={record.name}
                      onChange={(e) => updateRecord(role, { name: e.target.value })}
                      placeholder="Full legal name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm">CNIC <span className="text-red-400">*</span></Label>
                    <Input
                      value={record.cnic}
                      onChange={(e) => updateRecord(role, { cnic: e.target.value })}
                      placeholder="XXXXX-XXXXXXX-X"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm">Phone</Label>
                    <Input
                      value={record.phone}
                      onChange={(e) => updateRecord(role, { phone: e.target.value })}
                      placeholder="+92 3XX XXXXXXX"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm">Email</Label>
                    <Input
                      type="email"
                      value={record.email}
                      onChange={(e) => updateRecord(role, { email: e.target.value })}
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm">Qualifications & Experience</Label>
                  <Textarea
                    value={record.qualifications}
                    onChange={(e) => updateRecord(role, { qualifications: e.target.value })}
                    placeholder="Relevant qualifications, certifications, and experience..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FileUploadSlot
                    label="Passport Photo"
                    acceptedFormats="JPG, PNG"
                    maxSizeMB={5}
                    value={record.photo ?? null}
                    onChange={(doc) => updateRecord(role, { photo: doc ?? undefined })}
                  />
                  <FileUploadSlot
                    label="Curriculum Vitae (CV)"
                    acceptedFormats="PDF"
                    maxSizeMB={10}
                    value={record.cv ?? null}
                    onChange={(doc) => updateRecord(role, { cv: doc ?? undefined })}
                  />
                </div>

                <div className="flex items-start gap-2 pt-2">
                  <input
                    type="checkbox"
                    id={`consent-${role}`}
                    checked={record.backgroundCheckConsent}
                    onChange={(e) => updateRecord(role, { backgroundCheckConsent: e.target.checked })}
                    className="mt-0.5 size-4 rounded border-white/20 accent-green-500"
                  />
                  <label htmlFor={`consent-${role}`} className="text-sm text-muted-foreground leading-snug">
                    I authorize CCRA to conduct background verification checks through ANF and provincial police authorities. <span className="text-red-400">*</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
