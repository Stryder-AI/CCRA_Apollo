'use client'

import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glow?: 'green' | 'gold' | 'teal' | 'red' | 'none'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  onClick?: () => void
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

const glowMap = {
  green: 'hover:shadow-[0_0_30px_rgba(34,197,94,0.25)]',
  gold: 'hover:shadow-[0_0_30px_rgba(234,179,8,0.25)]',
  teal: 'hover:shadow-[0_0_30px_rgba(20,184,166,0.25)]',
  red: 'hover:shadow-[0_0_30px_rgba(239,68,68,0.25)]',
  none: '',
}

export function GlassCard({
  children,
  className,
  hover = false,
  glow = 'none',
  padding = 'md',
  onClick,
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'glass rounded-2xl',
        paddingMap[padding],
        hover && 'glass-hover cursor-pointer',
        hover && glowMap[glow],
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}
