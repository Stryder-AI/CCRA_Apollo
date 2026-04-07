'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { GlassCard } from '@/design-system/glass-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { REGIONS, STRAINS } from '@/config/constants'
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Upload,
  Check,
  MapPin,
  User,
  Tractor,
  FileText,
  ClipboardCheck,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Dynamic map import (SSR disabled)                                  */
/* ------------------------------------------------------------------ */
const LocationPicker = dynamic(
  () => import('./LocationPicker'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] rounded-xl animate-shimmer bg-muted" />
    ),
  }
)

/* ------------------------------------------------------------------ */
/*  Zod schemas                                                        */
/* ------------------------------------------------------------------ */
const personalSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  fatherName: z.string().min(1, "Father's name is required"),
  cnic: z
    .string()
    .regex(/^\d{2}-\d{7}-\d$/, 'CNIC must be in format XX-XXXXXXX-X'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email').or(z.literal('')).optional(),
})

const farmSchema = z.object({
  farmName: z.string().min(1, 'Farm name is required'),
  strain: z.string().min(1, 'Please select a strain'),
  area: z.coerce.number().positive('Area must be greater than 0') as unknown as z.ZodNumber,
  region: z.string().min(1, 'Please select a region'),
})

const fullSchema = personalSchema.merge(farmSchema)

type FormData = z.infer<typeof fullSchema>

/* ------------------------------------------------------------------ */
/*  Step config                                                        */
/* ------------------------------------------------------------------ */
const STEPS = [
  { label: 'Personal Info', icon: User },
  { label: 'Farm Details', icon: Tractor },
  { label: 'Location', icon: MapPin },
  { label: 'Documents', icon: FileText },
  { label: 'Review', icon: ClipboardCheck },
] as const

const REQUIRED_DOCS = [
  'CNIC Copy',
  'Land Title Deed / Ownership Proof',
  'Agricultural Land Survey Report',
  'Passport Size Photograph',
] as const

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
export function RegistrationWizard() {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [refNumber, setRefNumber] = useState('')
  const [lat, setLat] = useState<number | null>(null)
  const [lng, setLng] = useState<number | null>(null)
  const [polygonCoords, setPolygonCoords] = useState<[number, number][]>([])
  const [polygonComplete, setPolygonComplete] = useState(false)
  const [uploadedDocs, setUploadedDocs] = useState<Record<number, boolean>>({})

  const {
    register,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(fullSchema),
    mode: 'onTouched',
    defaultValues: {
      fullName: '',
      fatherName: '',
      cnic: '',
      phone: '',
      email: '',
      farmName: '',
      strain: '',
      area: undefined as any,
      region: '',
    },
  })

  /* Step validation before advancing */
  const validateStep = useCallback(async () => {
    if (step === 0) {
      return trigger(['fullName', 'fatherName', 'cnic', 'phone', 'email'])
    }
    if (step === 1) {
      return trigger(['farmName', 'strain', 'area', 'region'])
    }
    return true
  }, [step, trigger])

  const next = useCallback(async () => {
    const valid = await validateStep()
    if (valid) setStep((s) => Math.min(s + 1, 4))
  }, [validateStep])

  const prev = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0))
  }, [])

  const handleLocationChange = useCallback((newLat: number, newLng: number) => {
    setLat(newLat)
    setLng(newLng)
  }, [])

  const toggleDoc = useCallback((idx: number) => {
    setUploadedDocs((prev) => ({ ...prev, [idx]: !prev[idx] }))
  }, [])

  const handleSubmit = useCallback(() => {
    const rand = Math.floor(1000 + Math.random() * 9000)
    setRefNumber(`CCRA-REG-2026-${rand}`)
    setSubmitted(true)
  }, [])

  /* ---------------------------------------------------------------- */
  /*  Confirmation screen                                              */
  /* ---------------------------------------------------------------- */
  if (submitted) {
    return (
      <GlassCard className="w-full max-w-2xl" padding="lg">
        <div className="flex flex-col items-center gap-6 py-8">
          {/* Animated checkmark */}
          <div className="relative flex items-center justify-center">
            <svg
              className="h-24 w-24"
              viewBox="0 0 96 96"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="48"
                cy="48"
                r="44"
                stroke="#22c55e"
                strokeWidth="4"
                fill="rgba(34, 197, 94, 0.1)"
                className="animate-[scale-in_0.4s_ease-out]"
              />
              <path
                d="M28 50 L42 64 L68 34"
                stroke="#22c55e"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                className="animate-[draw-check_0.5s_0.3s_ease-out_both]"
                style={{
                  strokeDasharray: 80,
                  strokeDashoffset: 80,
                  animation: 'draw-check 0.5s 0.3s ease-out forwards',
                }}
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-foreground">
            Registration Submitted Successfully
          </h2>

          <div className="rounded-xl bg-green-600/10 border border-green-600/20 px-6 py-3">
            <p className="text-sm text-muted-foreground">Reference Number</p>
            <p className="text-xl font-mono font-bold text-green-600">
              {refNumber}
            </p>
          </div>

          <p className="text-center text-sm text-muted-foreground max-w-md">
            Your application has been received and will be reviewed within 14
            business days.
          </p>

          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Go to CCRA Portal
          </a>
        </div>

        {/* Keyframe for the checkmark animation */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes draw-check {
            to { stroke-dashoffset: 0; }
          }
          @keyframes scale-in {
            from { transform: scale(0); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        ` }} />
      </GlassCard>
    )
  }

  /* ---------------------------------------------------------------- */
  /*  Step indicator                                                   */
  /* ---------------------------------------------------------------- */
  const values = getValues()

  return (
    <GlassCard className="w-full max-w-2xl" padding="lg">
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((s, i) => {
          const Icon = s.icon
          const isActive = i === step
          const isComplete = i < step
          return (
            <div key={s.label} className="flex flex-col items-center gap-1.5 flex-1">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                  isComplete
                    ? 'border-green-600 bg-green-600 text-white'
                    : isActive
                    ? 'border-green-600 bg-green-600/10 text-green-600'
                    : 'border-border bg-muted text-muted-foreground'
                }`}
              >
                {isComplete ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              <span
                className={`text-[10px] font-medium text-center ${
                  isActive || isComplete
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {s.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Divider */}
      <div className="h-px bg-border mb-6" />

      {/* Step content */}
      <div className="min-h-[320px]">
        {step === 0 && (
          <StepPersonal register={register} errors={errors} />
        )}
        {step === 1 && (
          <StepFarm register={register} errors={errors} />
        )}
        {step === 2 && (
          <StepLocation
            lat={lat}
            lng={lng}
            onLocationChange={handleLocationChange}
            polygonCoords={polygonCoords}
            onPolygonChange={setPolygonCoords}
            polygonComplete={polygonComplete}
            onPolygonComplete={setPolygonComplete}
          />
        )}
        {step === 3 && (
          <StepDocuments
            uploadedDocs={uploadedDocs}
            toggleDoc={toggleDoc}
          />
        )}
        {step === 4 && (
          <StepReview values={values} lat={lat} lng={lng} uploadedDocs={uploadedDocs} polygonCoords={polygonCoords} polygonComplete={polygonComplete} />
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-4 border-t border-border">
        <Button
          variant="outline"
          onClick={prev}
          disabled={step === 0}
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>

        {step < 4 ? (
          <Button onClick={next}>
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit}>
            <CheckCircle2 className="h-4 w-4" />
            Submit Registration
          </Button>
        )}
      </div>
    </GlassCard>
  )
}

/* ================================================================== */
/*  Step sub-components                                                */
/* ================================================================== */

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-xs text-destructive mt-1">{message}</p>
}

/* -- Step 1: Personal ------------------------------------------------ */
function StepPersonal({
  register,
  errors,
}: {
  register: any
  errors: any
}) {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Personal Information
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName">Full Name *</Label>
          <Input id="fullName" placeholder="Muhammad Ali" {...register('fullName')} />
          <FieldError message={errors.fullName?.message} />
        </div>
        <div>
          <Label htmlFor="fatherName">Father&apos;s Name *</Label>
          <Input id="fatherName" placeholder="Ahmad Khan" {...register('fatherName')} />
          <FieldError message={errors.fatherName?.message} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cnic">CNIC *</Label>
          <Input
            id="cnic"
            placeholder="42101-1234567-1"
            {...register('cnic')}
          />
          <FieldError message={errors.cnic?.message} />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            placeholder="+92 300 1234567"
            {...register('phone')}
          />
          <FieldError message={errors.phone?.message} />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email (optional)</Label>
        <Input
          id="email"
          type="email"
          placeholder="ali@example.com"
          {...register('email')}
        />
        <FieldError message={errors.email?.message} />
      </div>
    </div>
  )
}

/* -- Step 2: Farm ---------------------------------------------------- */
function StepFarm({
  register,
  errors,
}: {
  register: any
  errors: any
}) {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Farm Details
      </h3>

      <div>
        <Label htmlFor="farmName">Farm Name *</Label>
        <Input id="farmName" placeholder="Green Valley Farm" {...register('farmName')} />
        <FieldError message={errors.farmName?.message} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="strain">Proposed Strain *</Label>
          <select
            id="strain"
            {...register('strain')}
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">Select strain...</option>
            {STRAINS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <FieldError message={errors.strain?.message} />
        </div>
        <div>
          <Label htmlFor="area">Proposed Area (Hectares) *</Label>
          <Input
            id="area"
            type="number"
            step="0.1"
            placeholder="5.0"
            {...register('area')}
          />
          <FieldError message={errors.area?.message} />
        </div>
      </div>

      <div>
        <Label htmlFor="region">Region *</Label>
        <select
          id="region"
          {...register('region')}
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="">Select region...</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <FieldError message={errors.region?.message} />
      </div>
    </div>
  )
}

/* -- Step 3: Location ------------------------------------------------ */
function StepLocation({
  lat,
  lng,
  onLocationChange,
  polygonCoords,
  onPolygonChange,
  polygonComplete,
  onPolygonComplete,
}: {
  lat: number | null
  lng: number | null
  onLocationChange: (lat: number, lng: number) => void
  polygonCoords: [number, number][]
  onPolygonChange: (coords: [number, number][]) => void
  polygonComplete: boolean
  onPolygonComplete: (complete: boolean) => void
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Farm Location</h3>
      <p className="text-sm text-muted-foreground flex items-center gap-2">
        <MapPin className="h-4 w-4 text-green-600" />
        Mark your farm location or draw the farm boundary
      </p>

      <LocationPicker
        lat={lat}
        lng={lng}
        onLocationChange={onLocationChange}
        polygonCoords={polygonCoords}
        onPolygonChange={onPolygonChange}
        polygonComplete={polygonComplete}
        onPolygonComplete={onPolygonComplete}
      />

      {lat !== null && lng !== null && (
        <div className="flex items-center gap-4 rounded-lg bg-green-600/10 border border-green-600/20 px-4 py-2 text-sm">
          <span className="font-medium text-foreground">
            {polygonComplete ? 'Centroid:' : 'Coordinates:'}
          </span>
          <span className="font-mono text-muted-foreground">
            {lat.toFixed(6)}, {lng.toFixed(6)}
          </span>
          {polygonComplete && (
            <span className="text-green-600 text-xs font-medium ml-auto">
              Boundary: {polygonCoords.length} vertices
            </span>
          )}
        </div>
      )}
    </div>
  )
}

/* -- Step 4: Documents ----------------------------------------------- */
function StepDocuments({
  uploadedDocs,
  toggleDoc,
}: {
  uploadedDocs: Record<number, boolean>
  toggleDoc: (idx: number) => void
}) {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Required Documents
      </h3>
      <p className="text-sm text-muted-foreground">
        Please upload the following documents to proceed with your registration.
      </p>

      <div className="space-y-3">
        {REQUIRED_DOCS.map((doc, idx) => {
          const uploaded = !!uploadedDocs[idx]
          return (
            <div
              key={doc}
              className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{doc}</span>
              </div>
              <Button
                variant={uploaded ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleDoc(idx)}
                className={uploaded ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                {uploaded ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Uploaded
                  </>
                ) : (
                  <>
                    <Upload className="h-3.5 w-3.5" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* -- Step 5: Review -------------------------------------------------- */
function StepReview({
  values,
  lat,
  lng,
  uploadedDocs,
  polygonCoords,
  polygonComplete,
}: {
  values: FormData
  lat: number | null
  lng: number | null
  uploadedDocs: Record<number, boolean>
  polygonCoords: [number, number][]
  polygonComplete: boolean
}) {
  const locationFields: { label: string; value: string }[] = [
    {
      label: polygonComplete ? 'Centroid' : 'Coordinates',
      value:
        lat !== null && lng !== null
          ? `${lat.toFixed(6)}, ${lng.toFixed(6)}`
          : 'Not selected',
    },
  ]
  if (polygonComplete) {
    locationFields.push({
      label: 'Farm Boundary',
      value: `${polygonCoords.length} vertices defined`,
    })
  }

  const sections = [
    {
      title: 'Personal Information',
      fields: [
        { label: 'Full Name', value: values.fullName },
        { label: "Father's Name", value: values.fatherName },
        { label: 'CNIC', value: values.cnic },
        { label: 'Phone', value: values.phone },
        { label: 'Email', value: values.email || 'N/A' },
      ],
    },
    {
      title: 'Farm Details',
      fields: [
        { label: 'Farm Name', value: values.farmName },
        { label: 'Proposed Strain', value: values.strain },
        { label: 'Proposed Area', value: values.area ? `${values.area} Hectares` : '' },
        { label: 'Region', value: values.region },
      ],
    },
    {
      title: 'Farm Location',
      fields: locationFields,
    },
    {
      title: 'Documents',
      fields: REQUIRED_DOCS.map((doc, idx) => ({
        label: doc,
        value: uploadedDocs[idx] ? 'Uploaded' : 'Not uploaded',
      })),
    },
  ]

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">
        Review Your Application
      </h3>

      {sections.map((section) => (
        <div key={section.title}>
          <h4 className="text-sm font-semibold text-green-600 mb-2">
            {section.title}
          </h4>
          <div className="rounded-lg border border-border overflow-hidden">
            {section.fields.map((field, i) => (
              <div
                key={field.label}
                className={`flex items-center justify-between px-4 py-2.5 text-sm ${
                  i > 0 ? 'border-t border-border' : ''
                }`}
              >
                <span className="text-muted-foreground">{field.label}</span>
                <span className="font-medium text-foreground text-right">
                  {field.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
