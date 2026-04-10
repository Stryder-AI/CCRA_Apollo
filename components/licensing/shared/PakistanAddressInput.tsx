'use client'

import { useCallback, useMemo } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { getProvinces, getDistricts, getTehsils } from '@/config/pakistan-locations'
import type { PakistanAddress } from '@/types/license'

interface PakistanAddressInputProps {
  value: PakistanAddress
  onChange: (address: PakistanAddress) => void
  includeGPS?: boolean
  errors?: Partial<Record<keyof PakistanAddress, string>>
}

export function PakistanAddressInput({
  value,
  onChange,
  includeGPS = false,
  errors,
}: PakistanAddressInputProps) {
  const provinces = useMemo(() => getProvinces(), [])
  const districts = useMemo(() => getDistricts(value.province), [value.province])
  const tehsils = useMemo(() => getTehsils(value.province, value.district), [value.province, value.district])

  const update = useCallback((field: keyof PakistanAddress, val: string | { lat: number; lng: number }) => {
    const next = { ...value, [field]: val }
    // Reset dependent fields on province change
    if (field === 'province') {
      next.district = ''
      next.tehsil = ''
    }
    if (field === 'district') {
      next.tehsil = ''
    }
    onChange(next)
  }, [value, onChange])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Province */}
        <div className="space-y-1.5">
          <Label className="text-sm">Province <span className="text-red-400">*</span></Label>
          <select
            value={value.province}
            onChange={(e) => update('province', e.target.value)}
            className="flex h-9 w-full rounded-md border border-white/10 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-500"
          >
            <option value="" className="bg-background">Select Province</option>
            {provinces.map((p) => (
              <option key={p} value={p} className="bg-background">{p}</option>
            ))}
          </select>
          {errors?.province && <p className="text-xs text-destructive">{errors.province}</p>}
        </div>

        {/* District */}
        <div className="space-y-1.5">
          <Label className="text-sm">District <span className="text-red-400">*</span></Label>
          <select
            value={value.district}
            onChange={(e) => update('district', e.target.value)}
            disabled={!value.province}
            className="flex h-9 w-full rounded-md border border-white/10 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-500 disabled:opacity-50"
          >
            <option value="" className="bg-background">Select District</option>
            {districts.map((d) => (
              <option key={d} value={d} className="bg-background">{d}</option>
            ))}
          </select>
          {errors?.district && <p className="text-xs text-destructive">{errors.district}</p>}
        </div>

        {/* Tehsil */}
        <div className="space-y-1.5">
          <Label className="text-sm">Tehsil <span className="text-red-400">*</span></Label>
          <select
            value={value.tehsil}
            onChange={(e) => update('tehsil', e.target.value)}
            disabled={!value.district}
            className="flex h-9 w-full rounded-md border border-white/10 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-500 disabled:opacity-50"
          >
            <option value="" className="bg-background">Select Tehsil</option>
            {tehsils.map((t) => (
              <option key={t} value={t} className="bg-background">{t}</option>
            ))}
          </select>
          {errors?.tehsil && <p className="text-xs text-destructive">{errors.tehsil}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* City */}
        <div className="space-y-1.5">
          <Label className="text-sm">City <span className="text-red-400">*</span></Label>
          <Input
            value={value.city}
            onChange={(e) => update('city', e.target.value)}
            placeholder="City / Town"
          />
          {errors?.city && <p className="text-xs text-destructive">{errors.city}</p>}
        </div>

        {/* Postal Code */}
        <div className="space-y-1.5">
          <Label className="text-sm">Postal Code <span className="text-red-400">*</span></Label>
          <Input
            value={value.postalCode}
            onChange={(e) => update('postalCode', e.target.value)}
            placeholder="e.g. 25000"
          />
          {errors?.postalCode && <p className="text-xs text-destructive">{errors.postalCode}</p>}
        </div>
      </div>

      {/* Street Address */}
      <div className="space-y-1.5">
        <Label className="text-sm">Street Address <span className="text-red-400">*</span></Label>
        <Input
          value={value.street}
          onChange={(e) => update('street', e.target.value)}
          placeholder="Full street address"
        />
        {errors?.street && <p className="text-xs text-destructive">{errors.street}</p>}
      </div>

      {/* GPS Coordinates */}
      {includeGPS && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm">Latitude</Label>
            <Input
              type="number"
              step="0.000001"
              value={value.gpsCoordinates?.lat ?? ''}
              onChange={(e) => update('gpsCoordinates', {
                lat: parseFloat(e.target.value) || 0,
                lng: value.gpsCoordinates?.lng ?? 0,
              })}
              placeholder="e.g. 34.0151"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Longitude</Label>
            <Input
              type="number"
              step="0.000001"
              value={value.gpsCoordinates?.lng ?? ''}
              onChange={(e) => update('gpsCoordinates', {
                lat: value.gpsCoordinates?.lat ?? 0,
                lng: parseFloat(e.target.value) || 0,
              })}
              placeholder="e.g. 71.5249"
            />
          </div>
        </div>
      )}
    </div>
  )
}
