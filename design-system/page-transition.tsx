'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Small delay ensures the initial state is painted before transitioning
    const frame = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div
      className={cn(
        'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
        className
      )}
    >
      {children}
    </div>
  )
}
