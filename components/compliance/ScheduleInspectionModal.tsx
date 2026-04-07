'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useComplianceStore } from '@/store/useComplianceStore'
import { useFarmStore } from '@/store/useFarmStore'
import { cn } from '@/lib/utils'

const scheduleSchema = z.object({
  farmId: z.string().min(1, 'Please select a farm'),
  inspectorName: z.string().min(2, 'Inspector name is required'),
  scheduledDate: z.string().min(1, 'Date is required'),
  region: z.string(),
})

type ScheduleFormData = z.infer<typeof scheduleSchema>

interface ScheduleInspectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ScheduleInspectionModal({ open, onOpenChange }: ScheduleInspectionModalProps) {
  const farms = useFarmStore((s) => s.farms)
  const addInspection = useComplianceStore((s) => s.addInspection)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      farmId: '',
      inspectorName: '',
      scheduledDate: '',
      region: '',
    },
  })

  const selectedFarmId = watch('farmId')

  useEffect(() => {
    if (selectedFarmId) {
      const farm = farms.find((f) => f.id === selectedFarmId)
      if (farm) {
        setValue('region', farm.region)
      }
    } else {
      setValue('region', '')
    }
  }, [selectedFarmId, farms, setValue])

  function onSubmit(data: ScheduleFormData) {
    const farm = farms.find((f) => f.id === data.farmId)
    addInspection({
      id: `insp-${Date.now()}`,
      farmId: data.farmId,
      farmName: farm?.name ?? '',
      inspectorName: data.inspectorName,
      scheduledDate: data.scheduledDate,
      status: 'scheduled',
      region: data.region,
    })
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Inspection</DialogTitle>
          <DialogDescription>
            Schedule a new compliance inspection for a registered farm.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Farm Select */}
          <div className="space-y-1.5">
            <label htmlFor="farmId" className="text-xs font-medium text-muted-foreground">
              Farm
            </label>
            <select
              id="farmId"
              {...register('farmId')}
              className={cn(
                'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                errors.farmId && 'border-red-500'
              )}
            >
              <option value="">Select a farm...</option>
              {farms.map((farm) => (
                <option key={farm.id} value={farm.id}>
                  {farm.name}
                </option>
              ))}
            </select>
            {errors.farmId && (
              <p className="text-xs text-red-500">{errors.farmId.message}</p>
            )}
          </div>

          {/* Inspector Name */}
          <div className="space-y-1.5">
            <label htmlFor="inspectorName" className="text-xs font-medium text-muted-foreground">
              Inspector Name
            </label>
            <input
              id="inspectorName"
              type="text"
              placeholder="Enter inspector name"
              {...register('inspectorName')}
              className={cn(
                'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                errors.inspectorName && 'border-red-500'
              )}
            />
            {errors.inspectorName && (
              <p className="text-xs text-red-500">{errors.inspectorName.message}</p>
            )}
          </div>

          {/* Scheduled Date */}
          <div className="space-y-1.5">
            <label htmlFor="scheduledDate" className="text-xs font-medium text-muted-foreground">
              Scheduled Date
            </label>
            <input
              id="scheduledDate"
              type="date"
              {...register('scheduledDate')}
              className={cn(
                'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                errors.scheduledDate && 'border-red-500'
              )}
            />
            {errors.scheduledDate && (
              <p className="text-xs text-red-500">{errors.scheduledDate.message}</p>
            )}
          </div>

          {/* Region (auto-filled) */}
          <div className="space-y-1.5">
            <label htmlFor="region" className="text-xs font-medium text-muted-foreground">
              Region
            </label>
            <input
              id="region"
              type="text"
              readOnly
              {...register('region')}
              className="flex h-9 w-full rounded-md border border-input bg-muted/50 px-3 py-1 text-sm text-muted-foreground cursor-not-allowed"
              placeholder="Auto-filled from selected farm"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Schedule Inspection
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
