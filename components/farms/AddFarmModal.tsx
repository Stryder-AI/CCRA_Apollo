'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useFarmStore } from '@/store/useFarmStore'
import { REGIONS, STRAINS } from '@/config/constants'
import { Farm } from '@/types/farm'
import { generateFarmBoundary } from '@/utils/generate-boundaries'

const addFarmSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  ownerName: z.string().min(3, 'Owner name is required'),
  region: z.string().min(1, 'Region is required'),
  strain: z.string().min(1, 'Strain is required'),
  sizeHectares: z.coerce.number().min(1, 'Size must be at least 1 hectare'),
  lat: z.coerce.number().min(-90).max(90, 'Invalid latitude'),
  lng: z.coerce.number().min(-180).max(180, 'Invalid longitude'),
})

type AddFarmForm = z.output<typeof addFarmSchema>

interface AddFarmModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddFarmModal({ open, onOpenChange }: AddFarmModalProps) {
  const addFarm = useFarmStore((s) => s.addFarm)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddFarmForm>({
    resolver: zodResolver(addFarmSchema) as any,
    defaultValues: {
      name: '',
      ownerName: '',
      region: '',
      strain: '',
      sizeHectares: 0,
      lat: 0,
      lng: 0,
    },
  })

  const regionValue = watch('region')
  const strainValue = watch('strain')

  function onSubmit(data: AddFarmForm) {
    const coords: [number, number] = [data.lat, data.lng]
    const province = [
      'Tirah Valley',
      'Swat',
      'Dir',
      'Chitral',
      'Malakand',
      'Buner',
    ].includes(data.region)
      ? 'KP'
      : 'Balochistan'

    const newFarm: Farm = {
      id: `f${Date.now()}`,
      name: data.name,
      ownerName: data.ownerName,
      licenseNumber: `CCRA-${province === 'KP' ? 'KP' : 'BL'}-${Date.now().toString().slice(-4)}`,
      region: data.region,
      province,
      coordinates: coords,
      boundaryCoords: generateFarmBoundary(coords, data.sizeHectares),
      sizeHectares: data.sizeHectares,
      strain: data.strain,
      status: 'pending',
      registeredDate: new Date().toISOString().split('T')[0],
    }

    addFarm(newFarm)
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset()
        onOpenChange(o)
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Register New Farm</DialogTitle>
          <DialogDescription>
            Add a new farm to the registry. It will be created with Pending
            status.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="farm-name">Farm Name</Label>
            <Input
              id="farm-name"
              placeholder="e.g. Tirah Valley Estate"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Owner */}
          <div className="space-y-1.5">
            <Label htmlFor="farm-owner">Owner Name</Label>
            <Input
              id="farm-owner"
              placeholder="e.g. Khan Muhammad"
              {...register('ownerName')}
            />
            {errors.ownerName && (
              <p className="text-xs text-destructive">
                {errors.ownerName.message}
              </p>
            )}
          </div>

          {/* Region & Strain row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Region</Label>
              <Select
                value={regionValue}
                onValueChange={(val) =>
                  setValue('region', val ?? '', { shouldValidate: true })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.region && (
                <p className="text-xs text-destructive">
                  {errors.region.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Strain</Label>
              <Select
                value={strainValue}
                onValueChange={(val) =>
                  setValue('strain', val ?? '', { shouldValidate: true })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select strain" />
                </SelectTrigger>
                <SelectContent>
                  {STRAINS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.strain && (
                <p className="text-xs text-destructive">
                  {errors.strain.message}
                </p>
              )}
            </div>
          </div>

          {/* Size */}
          <div className="space-y-1.5">
            <Label htmlFor="farm-size">Size (hectares)</Label>
            <Input
              id="farm-size"
              type="number"
              placeholder="e.g. 45"
              {...register('sizeHectares')}
            />
            {errors.sizeHectares && (
              <p className="text-xs text-destructive">
                {errors.sizeHectares.message}
              </p>
            )}
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="farm-lat">Latitude</Label>
              <Input
                id="farm-lat"
                type="number"
                step="any"
                placeholder="e.g. 33.8"
                {...register('lat')}
              />
              {errors.lat && (
                <p className="text-xs text-destructive">
                  {errors.lat.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="farm-lng">Longitude</Label>
              <Input
                id="farm-lng"
                type="number"
                step="any"
                placeholder="e.g. 70.5"
                {...register('lng')}
              />
              {errors.lng && (
                <p className="text-xs text-destructive">
                  {errors.lng.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset()
                onOpenChange(false)
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Register Farm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
