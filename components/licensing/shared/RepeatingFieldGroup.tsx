'use client'

import { useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2 } from 'lucide-react'

export interface FieldConfig {
  key: string
  label: string
  type: 'text' | 'number' | 'date'
  placeholder?: string
  required?: boolean
}

interface RepeatingFieldGroupProps {
  title: string
  fields: FieldConfig[]
  values: Record<string, string | number>[]
  onChange: (values: Record<string, string | number>[]) => void
  minRows?: number
  maxRows?: number
}

export function RepeatingFieldGroup({
  title,
  fields,
  values,
  onChange,
  minRows = 1,
  maxRows = 20,
}: RepeatingFieldGroupProps) {
  const handleAdd = useCallback(() => {
    if (values.length >= maxRows) return
    const empty: Record<string, string | number> = {}
    fields.forEach((f) => { empty[f.key] = f.type === 'number' ? 0 : '' })
    onChange([...values, empty])
  }, [values, fields, onChange, maxRows])

  const handleRemove = useCallback((index: number) => {
    if (values.length <= minRows) return
    onChange(values.filter((_, i) => i !== index))
  }, [values, onChange, minRows])

  const handleChange = useCallback((index: number, key: string, val: string | number) => {
    const next = [...values]
    next[index] = { ...next[index], [key]: val }
    onChange(next)
  }, [values, onChange])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">{title}</h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          disabled={values.length >= maxRows}
          className="h-7 text-xs gap-1"
        >
          <Plus className="size-3" /> Add
        </Button>
      </div>

      {values.map((row, idx) => (
        <div key={idx} className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-3">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {fields.map((field) => (
              <div key={field.key} className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  {field.label}
                  {field.required && <span className="text-red-400 ml-0.5">*</span>}
                </Label>
                <Input
                  type={field.type}
                  value={row[field.key] ?? ''}
                  onChange={(e) => handleChange(idx, field.key, field.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
                  placeholder={field.placeholder}
                  className="h-8 text-sm"
                />
              </div>
            ))}
          </div>
          {values.length > minRows && (
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="mt-5 rounded p-1.5 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="size-3.5 text-red-400" />
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
