'use client'

import Link from 'next/link'
import { PageTransition } from '@/design-system/page-transition'
import { PageHeader } from '@/design-system/page-header'
import { Button } from '@/components/ui/button'
import { LicenseFilters } from '@/components/licensing/LicenseFilters'
import { LicenseTable } from '@/components/licensing/LicenseTable'
import { LicenseDetailDrawer } from '@/components/licensing/LicenseDetailDrawer'
import { FeeScheduleCard } from '@/components/licensing/FeeScheduleCard'
import { Plus, FileCheck } from 'lucide-react'

export default function LicensingPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader title="License Management" subtitle="Review, approve, and manage all cannabis license applications" icon={FileCheck}>
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
