'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GlassCard } from '@/design-system/glass-card'
import { activities } from '@/data/mock-activities'
import { timeAgo } from '@/utils/format'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  MapPin,
  FileCheck,
  Shield,
  AlertTriangle,
  Calendar,
  RefreshCw,
  PauseCircle,
  Activity,
  ExternalLink,
} from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { ActivityItem } from '@/types/compliance'

const activityIcons: Record<string, { icon: typeof MapPin; color: string }> = {
  farm_registered: { icon: MapPin, color: 'text-ccra-green bg-ccra-green/10' },
  license_issued: { icon: FileCheck, color: 'text-ccra-gold bg-ccra-gold/10' },
  inspection_completed: { icon: Shield, color: 'text-ccra-teal bg-ccra-teal/10' },
  violation_detected: { icon: AlertTriangle, color: 'text-ccra-red bg-ccra-red/10' },
  license_renewed: { icon: RefreshCw, color: 'text-ccra-green bg-ccra-green/10' },
  farm_suspended: { icon: PauseCircle, color: 'text-ccra-amber bg-ccra-amber/10' },
  inspection_scheduled: { icon: Calendar, color: 'text-blue-500 bg-blue-500/10' },
  compliance_updated: { icon: Activity, color: 'text-ccra-teal bg-ccra-teal/10' },
}

const activityNavigation: Record<string, string> = {
  farm_registered: '/farms',
  license_issued: '/licensing',
  inspection_completed: '/compliance',
  violation_detected: '/compliance',
  license_renewed: '/licensing',
  farm_suspended: '/farms',
  inspection_scheduled: '/compliance',
  compliance_updated: '/compliance',
}

const activityCategoryLabel: Record<string, string> = {
  farm_registered: 'Farm Registry',
  license_issued: 'Licensing',
  inspection_completed: 'Compliance',
  violation_detected: 'Compliance',
  license_renewed: 'Licensing',
  farm_suspended: 'Farm Registry',
  inspection_scheduled: 'Compliance',
  compliance_updated: 'Compliance',
}

export function ActivityFeed() {
  const router = useRouter()
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null)

  return (
    <>
      <GlassCard padding="none">
        <div className="px-6 pt-6 pb-3">
          <h3 className="text-sm font-medium text-muted-foreground">Recent Activity</h3>
        </div>
        <ScrollArea className="h-[360px]">
          <div className="px-6 pb-6 space-y-1">
            {activities.map((activity) => {
              const { icon: Icon, color } = activityIcons[activity.type] || {
                icon: Activity,
                color: 'text-muted-foreground bg-muted',
              }

              return (
                <button
                  key={activity.id}
                  onClick={() => setSelectedActivity(activity)}
                  className="flex gap-3 w-full text-left rounded-lg p-2 -ml-2 hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                      color
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-tight">{activity.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {activity.description}
                    </p>
                    <p className="text-[11px] text-muted-foreground/70 mt-1">
                      {timeAgo(activity.timestamp)}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </ScrollArea>
      </GlassCard>

      {/* Activity Detail Modal */}
      <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
        <DialogContent>
          {selectedActivity && (() => {
            const { icon: Icon, color } = activityIcons[selectedActivity.type] || {
              icon: Activity,
              color: 'text-muted-foreground bg-muted',
            }
            const navHref = activityNavigation[selectedActivity.type]
            const category = activityCategoryLabel[selectedActivity.type] || 'System'

            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div>{selectedActivity.title}</div>
                      <div className="text-xs font-normal text-muted-foreground mt-0.5">
                        {timeAgo(selectedActivity.timestamp)}
                      </div>
                    </div>
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                  {/* Description */}
                  <div className="rounded-xl bg-accent/30 border border-border p-4">
                    <p className="text-sm text-foreground">{selectedActivity.description}</p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-[11px] text-muted-foreground">Category</p>
                      <p className="text-sm font-medium mt-0.5">{category}</p>
                    </div>
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-[11px] text-muted-foreground">Event Type</p>
                      <p className="text-sm font-medium mt-0.5 capitalize">
                        {selectedActivity.type.replace(/_/g, ' ')}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-[11px] text-muted-foreground">Timestamp</p>
                      <p className="text-sm font-medium mt-0.5 font-mono text-xs">
                        {new Date(selectedActivity.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-[11px] text-muted-foreground">Event ID</p>
                      <p className="text-sm font-medium mt-0.5 font-mono text-xs">
                        {selectedActivity.id.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {/* Navigate button */}
                  {navHref && (
                    <button
                      onClick={() => {
                        setSelectedActivity(null)
                        router.push(navHref)
                      }}
                      className="flex items-center gap-2 w-full justify-center rounded-lg bg-ccra-green/10 border border-ccra-green/20 px-4 py-2.5 text-sm font-medium text-ccra-green hover:bg-ccra-green/20 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View in {category}
                    </button>
                  )}
                </div>
              </>
            )
          })()}
        </DialogContent>
      </Dialog>
    </>
  )
}
