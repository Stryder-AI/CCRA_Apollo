'use client'

import { AuditEntry } from '@/data/mock-audit-trail'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { format, parseISO } from 'date-fns'
import { User, Globe, Clock, Monitor, Fingerprint, Link2 } from 'lucide-react'

const actionColors: Record<string, string> = {
  created: 'bg-emerald-500/10 text-emerald-500',
  approved: 'bg-emerald-500/10 text-emerald-500',
  updated: 'bg-blue-500/10 text-blue-500',
  viewed: 'bg-blue-500/10 text-blue-500',
  deleted: 'bg-red-500/10 text-red-500',
  rejected: 'bg-red-500/10 text-red-500',
  exported: 'bg-amber-500/10 text-amber-500',
  synced: 'bg-blue-500/10 text-blue-500',
  logged_in: 'bg-blue-500/10 text-blue-500',
  configured: 'bg-purple-500/10 text-purple-500',
}

const mockRelatedActions: Record<string, { action: string; user: string; timestamp: string }[]> = {
  default: [
    { action: 'Viewed by DG Imran Shah', user: 'DG Imran Shah', timestamp: '2 hours earlier' },
    { action: 'Updated by Licensing Officer Ayesha Malik', user: 'Licensing Officer Ayesha Malik', timestamp: '1 day earlier' },
    { action: 'Created by System (Automated)', user: 'System (Automated)', timestamp: '3 days earlier' },
  ],
}

const mockSessionIds: string[] = [
  'a3f8d2e1-7b4c-4e9a-b5d6-1c2e3f4a5b6c',
  'b7c9e4f2-8d5a-4f1b-c6e7-2d3f4a5b6c7d',
  'c1d2e3f4-9a6b-4c2d-d7f8-3e4a5b6c7d8e',
  'd4e5f6a7-0b8c-4d3e-e9a0-4f5b6c7d8e9f',
  'e8f9a0b1-1c2d-4e4f-f0b1-5a6c7d8e9f0a',
]

const mockBrowsers = ['Chrome 122', 'Firefox 124', 'Edge 122', 'Safari 17.3', 'Chrome 122 (Mobile)']
const mockDurations = ['1.2s', '2.3s', '0.8s', '3.1s', '1.7s', '0.5s', '4.2s']

interface AuditDetailModalProps {
  entry: AuditEntry | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuditDetailModal({ entry, open, onOpenChange }: AuditDetailModalProps) {
  if (!entry) return null

  const hashIndex = entry.id.charCodeAt(entry.id.length - 1) % 5
  const sessionId = mockSessionIds[hashIndex]
  const browser = mockBrowsers[hashIndex]
  const duration = mockDurations[hashIndex]
  const relatedActions = mockRelatedActions.default

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg glass">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Audit Entry Detail
            <span className={cn(
              'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium capitalize',
              actionColors[entry.action]
            )}>
              {entry.action.replace('_', ' ')}
            </span>
          </DialogTitle>
          <DialogDescription>
            {entry.target}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Timestamp */}
          <div className="flex items-start gap-3">
            <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Timestamp</p>
              <p className="text-sm font-medium">{format(parseISO(entry.timestamp), 'MMMM d, yyyy — HH:mm:ss')}</p>
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-start gap-3">
            <User className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">User</p>
              <p className="text-sm font-medium">{entry.user}</p>
              <p className="text-xs text-muted-foreground">{entry.userRole}</p>
            </div>
          </div>

          {/* IP Address */}
          <div className="flex items-start gap-3">
            <Globe className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">IP Address</p>
              <p className="text-sm font-mono">{entry.ipAddress}</p>
            </div>
          </div>

          {/* Target */}
          <div className="flex items-start gap-3">
            <Link2 className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Target</p>
              <p className="text-sm font-medium">{entry.target}</p>
              <p className="text-xs font-mono text-muted-foreground">{entry.targetId}</p>
            </div>
          </div>

          {/* Details */}
          <div className="rounded-lg bg-muted/30 p-3 border border-border/50">
            <p className="text-xs text-muted-foreground mb-1">Details</p>
            <p className="text-sm leading-relaxed">{entry.details}</p>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border/50">
            <div className="flex items-center gap-2">
              <Fingerprint className="h-3.5 w-3.5 text-muted-foreground" />
              <div>
                <p className="text-[10px] text-muted-foreground">Session ID</p>
                <p className="text-[10px] font-mono truncate max-w-[100px]" title={sessionId}>{sessionId.slice(0, 8)}...</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Monitor className="h-3.5 w-3.5 text-muted-foreground" />
              <div>
                <p className="text-[10px] text-muted-foreground">Browser</p>
                <p className="text-[10px] font-medium">{browser}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <div>
                <p className="text-[10px] text-muted-foreground">Duration</p>
                <p className="text-[10px] font-mono">{duration}</p>
              </div>
            </div>
          </div>

          {/* Related Actions */}
          <div className="pt-2 border-t border-border/50">
            <p className="text-xs font-medium text-muted-foreground mb-2">Related Actions</p>
            <div className="space-y-2">
              {relatedActions.map((related, i) => (
                <div key={i} className="flex items-center justify-between text-xs rounded-md bg-muted/20 px-3 py-2">
                  <span className="text-foreground">{related.action}</span>
                  <span className="text-muted-foreground">{related.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
