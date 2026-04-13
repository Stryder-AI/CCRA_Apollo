'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useApplicationWizardStore } from '@/store/useApplicationWizardStore'
import { generateApplicationReference } from '@/utils/license-helpers'
import { PublicWizardShell } from '@/components/register/PublicWizardShell'

export default function RegisterPage() {
  const router = useRouter()
  const wizardStore = useApplicationWizardStore()

  const handleSubmit = () => {
    const ref = generateApplicationReference()

    wizardStore.resetWizard()

    toast.success('Application Submitted Successfully', {
      description: `Reference: ${ref}. Your application is now under review.`,
    })
    router.push(`/public-portal`)
  }

  return <PublicWizardShell onSubmit={handleSubmit} />
}
