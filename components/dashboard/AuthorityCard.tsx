'use client'

import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/useAuthStore'
import { GlassCard } from '@/design-system/glass-card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MapPin, FileText, Shield, Activity } from 'lucide-react'
import Link from 'next/link'

export function AuthorityCard() {
  const user = useAuthStore((s) => s.user)
  const initials = user.name.split(' ').filter((_, i, arr) => i === 0 || i === arr.length - 1).map((n) => n[0]).join('')

  const quickActions = [
    { icon: MapPin, label: 'Farms', href: '/farms', color: 'text-ccra-green' },
    { icon: FileText, label: 'Licenses', href: '/licensing', color: 'text-ccra-gold' },
    { icon: Shield, label: 'Compliance', href: '/compliance', color: 'text-ccra-teal' },
    { icon: Activity, label: 'Reports', href: '/settings', color: 'text-muted-foreground' },
  ]

  return (
    <GlassCard className="space-y-5">
      <div className="flex items-center gap-4">
        <Avatar className="w-14 h-14">
          <AvatarFallback className="bg-ccra-green text-white text-lg font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{user.name}</h3>
          <p className="text-sm text-muted-foreground">{user.title}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-ccra-green animate-pulse" />
            <span className="text-xs text-ccra-green font-medium">Online</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-accent transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <action.icon className={cn('w-5 h-5', action.color)} />
            </div>
            <span className="text-[11px] font-medium text-muted-foreground">{action.label}</span>
          </Link>
        ))}
      </div>
    </GlassCard>
  )
}
