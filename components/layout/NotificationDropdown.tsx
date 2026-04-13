'use client'

import { useState } from 'react'
import { Bell, AlertTriangle, Info, CheckCircle, CheckCheck } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useLicenseStore } from '@/store/useLicenseStore'
import { getLicenseCategoryLabel } from '@/utils/license-helpers'

interface Notification {
  id: string
  type: 'warning' | 'danger' | 'info' | 'success'
  title: string
  message: string
  timestamp: string
  timeAgo: string
  read: boolean
}

const initialNotifications: Notification[] = [
  {
    id: 'n001',
    type: 'success',
    title: 'License Approved',
    message: 'Cultivation license for Quetta Highland Farm has been approved.',
    timestamp: '2026-03-17T09:30:00Z',
    timeAgo: '5m ago',
    read: false,
  },
  {
    id: 'n002',
    type: 'info',
    title: 'Inspection Scheduled',
    message: 'Annual compliance inspection for Tirah Valley Estate set for March 25.',
    timestamp: '2026-03-17T08:00:00Z',
    timeAgo: '2h ago',
    read: false,
  },
  {
    id: 'n003',
    type: 'danger',
    title: 'Violation Detected',
    message: 'THC content exceeded permissible limit at Dir Cannabis Co-op. Immediate review required.',
    timestamp: '2026-03-17T06:15:00Z',
    timeAgo: '4h ago',
    read: false,
  },
  {
    id: 'n004',
    type: 'warning',
    title: '[STRYDE] Anomaly Alert',
    message: 'Unusual water consumption spike detected at Tirah Valley Estate — 34% above baseline.',
    timestamp: '2026-03-16T14:00:00Z',
    timeAgo: '20h ago',
    read: false,
  },
  {
    id: 'n005',
    type: 'success',
    title: 'Farm Registered',
    message: 'Balochistan Green Acres has been successfully registered in the system.',
    timestamp: '2026-03-16T11:00:00Z',
    timeAgo: '23h ago',
    read: false,
  },
  {
    id: 'n006',
    type: 'warning',
    title: 'Compliance Deadline Approaching',
    message: '3 farms are approaching their quarterly compliance reporting deadline on March 31.',
    timestamp: '2026-03-16T09:00:00Z',
    timeAgo: '1d ago',
    read: true,
  },
  {
    id: 'n007',
    type: 'success',
    title: 'Revenue Milestone Reached',
    message: 'Quarterly license revenue has surpassed PKR 50M target — 112% of goal achieved.',
    timestamp: '2026-03-15T16:00:00Z',
    timeAgo: '2d ago',
    read: true,
  },
  {
    id: 'n008',
    type: 'info',
    title: 'System Update',
    message: 'CCRA Nexus v0.1.4 deployed — improved AI predictions and new compliance dashboards.',
    timestamp: '2026-03-15T06:00:00Z',
    timeAgo: '2d ago',
    read: true,
  },
  {
    id: 'n009',
    type: 'warning',
    title: '[STRYDE] Compliance Prediction',
    message: '3 farms predicted to miss next compliance deadline based on historical reporting patterns.',
    timestamp: '2026-03-14T10:00:00Z',
    timeAgo: '3d ago',
    read: true,
  },
  {
    id: 'n010',
    type: 'info',
    title: 'Inspector Assigned',
    message: 'Inspector Kareem Shah assigned to 4 upcoming inspections in Khyber Pakhtunkhwa region.',
    timestamp: '2026-03-13T12:00:00Z',
    timeAgo: '4d ago',
    read: true,
  },
]

function NotificationIcon({ type }: { type: Notification['type'] }) {
  switch (type) {
    case 'danger':
    case 'warning':
      return (
        <AlertTriangle
          className={`w-4 h-4 shrink-0 ${
            type === 'danger' ? 'text-red-500' : 'text-amber-500'
          }`}
        />
      )
    case 'success':
      return <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
    case 'info':
    default:
      return <Info className="w-4 h-4 shrink-0 text-blue-500" />
  }
}

export function NotificationDropdown() {
  const licenses = useLicenseStore((s) => s.licenses)

  // Generate dynamic notifications for newly submitted applications
  const submittedNotifications: Notification[] = licenses
    .filter((l) => l.status === 'SUBMITTED')
    .map((license, idx) => ({
      id: `dynamic-submitted-${license.id}`,
      type: 'info' as const,
      title: 'New Application Received',
      message: `${license.applicantName} submitted a ${getLicenseCategoryLabel(license.category)} application`,
      timestamp: license.applicationDate || new Date().toISOString(),
      timeAgo: license.applicationDate
        ? `${Math.max(1, Math.floor((Date.now() - new Date(license.applicationDate).getTime()) / (1000 * 60 * 60 * 24)))}d ago`
        : 'Just now',
      read: false,
    }))

  const [notifications, setNotifications] = useState(initialNotifications)

  // Merge dynamic notifications with static ones (dynamic first)
  const allNotifications = [...submittedNotifications, ...notifications]

  const unreadCount = allNotifications.filter((n) => !n.read).length

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="relative inline-flex items-center justify-center rounded-xl h-9 w-9 hover:bg-ccra-green/10 transition-colors cursor-pointer"
      >
        <Bell className={cn('w-4.5 h-4.5', unreadCount > 0 && 'animate-[bell-shake_2s_ease-in-out_infinite]')} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-ccra-red text-[10px] font-bold text-white flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[380px] p-0 glass-heavy rounded-xl border border-[var(--glass-border-subtle)] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--glass-border-subtle)]">
          <h3 className="text-sm font-semibold">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 text-xs font-medium text-muted-foreground">
                ({unreadCount} unread)
              </span>
            )}
          </h3>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1 text-xs text-ccra-green hover:text-ccra-green/80 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all as read
            </button>
          )}
        </div>

        {/* Notification List */}
        <div className="max-h-[400px] overflow-y-auto">
          {allNotifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => markAsRead(notification.id)}
              className={`w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-ccra-green/5 transition-colors border-b border-[var(--glass-border-subtle)] last:border-b-0 ${
                !notification.read ? 'bg-ccra-green/[0.03]' : ''
              }`}
            >
              {/* Unread Indicator */}
              <div className="flex items-center pt-1">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    notification.read
                      ? 'bg-transparent'
                      : 'bg-emerald-500'
                  }`}
                />
              </div>

              {/* Icon */}
              <div className="pt-0.5">
                <NotificationIcon type={notification.type} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-tight truncate">
                  {notification.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {notification.message}
                </p>
                <p className="text-[11px] text-muted-foreground/60 mt-1">
                  {notification.timeAgo}
                </p>
              </div>
            </button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
