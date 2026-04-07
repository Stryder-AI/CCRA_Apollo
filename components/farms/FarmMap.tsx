'use client'

import dynamic from 'next/dynamic'

const FarmMapInner = dynamic(
  () => import('./FarmMapInner').then((mod) => ({ default: mod.FarmMapInner })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] rounded-2xl animate-shimmer bg-muted" />
    ),
  }
)

export function FarmMap() {
  return <FarmMapInner />
}
