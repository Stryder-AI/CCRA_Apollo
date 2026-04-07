'use client'

import Link from 'next/link'
import { PageTransition } from '@/design-system/page-transition'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { LicenseFilters } from '@/components/licensing/LicenseFilters'
import { LicenseTable } from '@/components/licensing/LicenseTable'
import { LicenseDetailDrawer } from '@/components/licensing/LicenseDetailDrawer'
import { FeeScheduleCard } from '@/components/licensing/FeeScheduleCard'
import { Plus } from 'lucide-react'

export default function LicensingPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader title="Licensing Portal" description="Manage cannabis licenses and applications">
          <Link href="/licensing/apply">
            <Button>
              <Plus className="size-4 mr-1" />
              New Application
            </Button>
          </Link>
        </PageHeader>

        <LicenseFilters />
        <LicenseTable />
        <FeeScheduleCard />
        <LicenseDetailDrawer />
      </div>
    </PageTransition>
  )
}
