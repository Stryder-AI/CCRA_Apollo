'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DocumentUpload } from '@/types/license'

interface FileUploadSlotProps {
  label: string
  required?: boolean
  acceptedFormats?: string
  maxSizeMB?: number
  value?: DocumentUpload | null
  onChange: (doc: DocumentUpload | null) => void
  className?: string
}

export function FileUploadSlot({
  label,
  required = false,
  acceptedFormats = 'PDF',
  maxSizeMB = 50,
  value,
  onChange,
  className,
}: FileUploadSlotProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const simulateUpload = useCallback((file: File) => {
    setIsUploading(true)
    setProgress(0)

    const steps = [20, 45, 70, 90, 100]
    let i = 0
    const interval = setInterval(() => {
      if (i < steps.length) {
        setProgress(steps[i])
        i++
      } else {
        clearInterval(interval)
        setIsUploading(false)
        const doc: DocumentUpload = {
          id: `doc-${Date.now()}`,
          fileName: file.name,
          fileType: file.type || file.name.split('.').pop() || 'unknown',
          fileSize: file.size,
          uploadDate: new Date().toISOString(),
          status: 'pending',
          category: label,
        }
        onChange(doc)
      }
    }, 200)
  }, [label, onChange])

  const handleFile = useCallback((file: File) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File exceeds ${maxSizeMB}MB limit`)
      return
    }
    simulateUpload(file)
  }, [maxSizeMB, simulateUpload])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    if (inputRef.current) inputRef.current.value = ''
  }, [handleFile])

  const handleRemove = useCallback(() => {
    onChange(null)
  }, [onChange])

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1048576).toFixed(1)} MB`
  }

  if (value) {
    return (
      <div className={cn('rounded-lg border border-white/10 bg-white/5 p-3', className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
              <File className="size-4 text-green-500" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{value.fileName}</p>
              <p className="text-xs text-muted-foreground">
                {formatSize(value.fileSize)} &middot; {acceptedFormats}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <CheckCircle className="size-4 text-green-500" />
            <button
              type="button"
              onClick={handleRemove}
              className="rounded p-1 hover:bg-white/10 transition-colors"
            >
              <X className="size-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-medium">{label}</span>
        {required && <span className="text-xs text-red-400">*</span>}
        {!required && <span className="text-xs text-muted-foreground">(optional)</span>}
      </div>
      <div
        role="button"
        tabIndex={0}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter') inputRef.current?.click() }}
        className={cn(
          'relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 transition-all cursor-pointer',
          isDragging
            ? 'border-green-500 bg-green-500/5'
            : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
        )}
      >
        {isUploading ? (
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Uploading...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-green-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <Upload className="size-5 text-muted-foreground" />
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Drag & drop or <span className="text-green-500 font-medium">browse</span>
              </p>
              <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                {acceptedFormats} &middot; Max {maxSizeMB}MB
              </p>
            </div>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>
    </div>
  )
}
