'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { PageTransition } from '@/design-system/page-transition'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { WizardShell } from '@/components/licensing/wizard/WizardShell'
import type { WizardFormData } from '@/components/licensing/wizard/WizardShell'
import { useLicenseStore } from '@/store/useLicenseStore'
import { FEE_SCHEDULE } from '@/config/constants'
import { ArrowLeft } from 'lucide-react'
import type { License } from '@/types/license'

export default function ApplyPage() {
  const router = useRouter()
  const addLicense = useLicenseStore((s) => s.addLicense)

  const handleSubmit = (data: WizardFormData) => {
    const fee = FEE_SCHEDULE.find((f) => f.type === data.licenseType)

    const newLicense: License = {
      id: crypto.randomUUID(),
      licenseNumber: `CCRA-${Date.now().toString(36).toUpperCase()}`,
      type: data.licenseType,
      applicantName: data.fullName,
      companyName: data.companyName,
      region: data.region,
      status: 'pending',
      applicationDate: new Date().toISOString().split('T')[0],
      feePaidPKR: fee?.application ?? 0,
      documents: [],
    }

    addLicense(newLicense)
    toast.success('Application submitted successfully', {
      description: `License ${newLicense.licenseNumber} has been created and is pending review.`,
    })
    router.push('/licensing')
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader title="New License Application" description="Complete all steps to submit your application">
          <Link href="/licensing">
            <Button variant="outline">
              <ArrowLeft className="size-4 mr-1" />
              Back to Licenses
            </Button>
          </Link>
        </PageHeader>

        <WizardShell onSubmit={handleSubmit} />
      </div>
    </PageTransition>
  )
}
