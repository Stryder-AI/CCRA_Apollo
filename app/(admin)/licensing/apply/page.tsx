'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { PageTransition } from '@/design-system/page-transition'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { WizardShell } from '@/components/licensing/wizard/WizardShell'
import { useApplicationWizardStore } from '@/store/useApplicationWizardStore'
import { useLicenseStore } from '@/store/useLicenseStore'
import { generateApplicationReference, generateLicenseNumber } from '@/utils/license-helpers'
import { ArrowLeft } from 'lucide-react'
import type { License } from '@/types/license'

export default function ApplyPage() {
  const router = useRouter()
  const addLicense = useLicenseStore((s) => s.addLicense)
  const wizardStore = useApplicationWizardStore()

  const handleSubmit = () => {
    const { category, tier, businessEntity, feeBreakdown } = wizardStore

    if (!category || !tier) return

    const newLicense: License = {
      id: crypto.randomUUID(),
      licenseNumber: generateLicenseNumber(),
      type: category,
      category,
      tier,
      applicantName: businessEntity.legalEntityName,
      companyName: businessEntity.legalEntityName,
      entityType: businessEntity.entityType,
      region: businessEntity.registeredAddress.district || businessEntity.registeredAddress.province || 'N/A',
      province: businessEntity.registeredAddress.province || 'N/A',
      status: 'SUBMITTED',
      applicationDate: new Date().toISOString().split('T')[0],
      feePaidPKR: feeBreakdown?.totalDueNow ?? 0,
      documents: [],
      applicationId: generateApplicationReference(),
      secpNumber: businessEntity.secpRegistrationNumber || undefined,
      ntn: businessEntity.ntn || undefined,
    }

    addLicense(newLicense)
    wizardStore.resetWizard()

    toast.success('Application Submitted Successfully', {
      description: `Reference: ${newLicense.applicationId ?? newLicense.licenseNumber}. Your application is now under review.`,
    })
    router.push('/licensing')
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader title="New License Application" description="Complete all steps to submit your CCRA cannabis license application">
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
