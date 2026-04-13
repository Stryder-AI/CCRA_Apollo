'use client'

import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glow?: 'green' | 'gold' | 'teal' | 'red' | 'none'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  gradientBorder?: boolean
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
  gradientBorder = false,
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
        gradientBorder && 'relative overflow-hidden',
        className
      )}
    >
      {gradientBorder && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-green-500 via-emerald-400 to-teal-500 animate-gradient-x rounded-t-2xl" />
      )}
      {children}
    </div>
  )
}
