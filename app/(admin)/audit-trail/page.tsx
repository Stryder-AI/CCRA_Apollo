'use client'

import { useState, useMemo } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { GlassCard } from '@/design-system/glass-card'
import { AiInsightCard } from '@/components/ai/AiInsightCard'
import { AuditDetailModal } from '@/components/audit/AuditDetailModal'
import { auditTrail, AuditEntry } from '@/data/mock-audit-trail'
import { timeAgo } from '@/utils/format'
import { cn } from '@/lib/utils'
import { Filter, Search, Calendar } from 'lucide-react'

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'farm', label: 'Farm' },
  { value: 'license', label: 'License' },
  { value: 'compliance', label: 'Compliance' },
  { value: 'system', label: 'System' },
  { value: 'user', label: 'User' },
  { value: 'traceability', label: 'Traceability' },
  { value: 'revenue', label: 'Revenue' },
]

const actionOptions = [
  { value: 'all', label: 'All Actions' },
  { value: 'created', label: 'Created' },
  { value: 'updated', label: 'Updated' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'deleted', label: 'Deleted' },
  { value: 'viewed', label: 'Viewed' },
  { value: 'exported', label: 'Exported' },
  { value: 'synced', label: 'Synced' },
  { value: 'logged_in', label: 'Logged In' },
  { value: 'configured', label: 'Configured' },
]

const userOptions = [
  { value: 'all', label: 'All Users' },
  { value: 'DG Imran Shah', label: 'DG Imran Shah' },
  { value: 'Inspector Kareem Shah', label: 'Inspector Kareem Shah' },
  { value: 'Licensing Officer Ayesha Malik', label: 'Ayesha Malik' },
  { value: 'System (Automated)', label: 'System (Automated)' },
  { value: 'STRYDER AI', label: 'STRYDER AI' },
]

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

const categoryColors: Record<string, string> = {
  farm: 'bg-emerald-500/10 text-emerald-500',
  license: 'bg-blue-500/10 text-blue-500',
  compliance: 'bg-amber-500/10 text-amber-500',
  system: 'bg-slate-500/10 text-slate-400',
  user: 'bg-purple-500/10 text-purple-500',
  traceability: 'bg-teal-500/10 text-teal-500',
  revenue: 'bg-ccra-gold/10 text-ccra-gold',
}

const roleColors: Record<string, string> = {
  'Director General': 'bg-ccra-gold/10 text-ccra-gold',
  'Field Inspector': 'bg-blue-500/10 text-blue-500',
  'Licensing Officer': 'bg-emerald-500/10 text-emerald-500',
  'Automated System': 'bg-purple-500/10 text-purple-500',
  'System Process': 'bg-slate-500/10 text-slate-400',
}

export default function AuditTrailPage() {
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [actionFilter, setActionFilter] = useState('all')
  const [userFilter, setUserFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const filteredEntries = useMemo(() => {
    return auditTrail.filter((entry) => {
      if (categoryFilter !== 'all' && entry.category !== categoryFilter) return false
      if (actionFilter !== 'all' && entry.action !== actionFilter) return false
      if (userFilter !== 'all' && entry.user !== userFilter) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return (
          entry.target.toLowerCase().includes(q) ||
          entry.details.toLowerCase().includes(q) ||
          entry.targetId.toLowerCase().includes(q) ||
          entry.user.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [categoryFilter, actionFilter, userFilter, searchQuery])

  const handleRowClick = (entry: AuditEntry) => {
    setSelectedEntry(entry)
    setModalOpen(true)
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <PageHeader
        title="Audit Trail"
        description="System-wide activity log with user attribution and accountability tracking"
      />

      {/* Filter Bar */}
      <GlassCard>
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search targets, details, IDs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-background/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-9 px-3 rounded-lg bg-background/50 border border-border/50 text-sm focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
            >
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Action Filter */}
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="h-9 px-3 rounded-lg bg-background/50 border border-border/50 text-sm focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
          >
            {actionOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* User Filter */}
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="h-9 px-3 rounded-lg bg-background/50 border border-border/50 text-sm focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
          >
            {userOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Date Range Display */}
          <div className="flex items-center gap-2 h-9 px-3 rounded-lg bg-background/50 border border-border/50 text-sm text-muted-foreground shrink-0">
            <Calendar className="h-4 w-4" />
            <span>Mar 10 – Mar 17, 2026</span>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
          <span className="text-xs text-muted-foreground">
            Showing {filteredEntries.length} of {auditTrail.length} entries
          </span>
          {(categoryFilter !== 'all' || actionFilter !== 'all' || userFilter !== 'all' || searchQuery) && (
            <button
              onClick={() => { setCategoryFilter('all'); setActionFilter('all'); setUserFilter('all'); setSearchQuery('') }}
              className="text-xs text-blue-500 hover:text-blue-400 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      </GlassCard>

      {/* Audit Table */}
      <GlassCard padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-6 py-3 font-medium text-muted-foreground whitespace-nowrap">Timestamp</th>
                <th className="px-6 py-3 font-medium text-muted-foreground">User</th>
                <th className="px-6 py-3 font-medium text-muted-foreground text-center">Action</th>
                <th className="px-6 py-3 font-medium text-muted-foreground text-center">Category</th>
                <th className="px-6 py-3 font-medium text-muted-foreground">Target</th>
                <th className="px-6 py-3 font-medium text-muted-foreground">Details</th>
                <th className="px-6 py-3 font-medium text-muted-foreground text-right">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => (
                <tr
                  key={entry.id}
                  onClick={() => handleRowClick(entry)}
                  className="border-b border-border/50 hover:bg-accent/30 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {timeAgo(entry.timestamp)}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium whitespace-nowrap">{entry.user}</span>
                      <span className={cn(
                        'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium w-fit',
                        roleColors[entry.userRole] || 'bg-slate-500/10 text-slate-400'
                      )}>
                        {entry.userRole}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span className={cn(
                      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                      actionColors[entry.action]
                    )}>
                      {entry.action.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span className={cn(
                      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                      categoryColors[entry.category]
                    )}>
                      {entry.category}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="max-w-[200px]">
                      <p className="text-sm font-medium truncate">{entry.target}</p>
                      <p className="text-[10px] font-mono text-muted-foreground">{entry.targetId}</p>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <p className="text-xs text-muted-foreground max-w-[250px] truncate">{entry.details}</p>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <span className="text-xs font-mono text-muted-foreground">{entry.ipAddress}</span>
                  </td>
                </tr>
              ))}
              {filteredEntries.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    No audit entries match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* AI Insight */}
      <AiInsightCard
        title="System Integrity Analysis"
        insight="Audit trail analysis shows healthy access patterns across all user roles. DG Imran Shah accessed the system 9 times this week — consistent with typical usage. Inspector Kareem Shah logged in from a new IP (10.0.5.101) on March 11, verified as mobile field app from Tirah Valley. STRYDER AI automated 6 system actions including risk assessments and anomaly detection. One notable finding: Dir Cannabis Co-op license renewal was rejected — recommend follow-up on the 3 outstanding violations before suspension review concludes. All data exports were encrypted and digitally signed. No unauthorized access attempts detected."
        severity="info"
        confidence={97}
      />

      {/* Detail Modal */}
      <AuditDetailModal
        entry={selectedEntry}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  )
}
