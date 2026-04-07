'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { GlassCard } from '@/design-system/glass-card'
import { AiInsightCard } from '@/components/ai/AiInsightCard'
import { StryderBadge } from '@/components/ai/StryderBadge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { communications, messageTemplates, type Communication, type MessageTemplate } from '@/data/mock-communications'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  Megaphone, Bell, Clock, Award, Send, Eye, Users, Mail,
  FileText, Copy, ChevronRight, CheckCircle, AlertTriangle,
  Smartphone, TrendingUp, BarChart3, MessageSquare
} from 'lucide-react'

const typeConfig = {
  announcement: { icon: Megaphone, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Announcement' },
  notice: { icon: Bell, color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'Notice' },
  reminder: { icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10', label: 'Reminder' },
  congratulations: { icon: Award, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Congratulations' },
}

const priorityConfig = {
  urgent: { color: 'bg-red-500/10 text-red-500 border-red-500/30', label: 'Urgent' },
  normal: { color: 'bg-blue-500/10 text-blue-500 border-blue-500/30', label: 'Normal' },
  low: { color: 'bg-gray-500/10 text-muted-foreground border-gray-500/30', label: 'Low' },
}

const recipientLabels: Record<string, string> = {
  'all-farmers': 'All Farmers',
  'region-kp': 'KP Region',
  'region-balochistan': 'Balochistan Region',
  individual: 'Individual',
}

export default function CommunicationsPage() {
  const [selectedComm, setSelectedComm] = useState<Communication | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [composeOpen, setComposeOpen] = useState(false)

  const totalSent = communications.filter((c) => c.status === 'sent').length
  const avgDelivery = Math.round(communications.filter((c) => c.status === 'sent').reduce((s, c) => s + c.deliveryRate, 0) / totalSent)
  const avgRead = Math.round(communications.filter((c) => c.status === 'sent').reduce((s, c) => s + c.readRate, 0) / totalSent)

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <PageHeader
        title="Communications Center"
        description="Broadcast announcements, notices, and policy updates to registered farmers"
      >
        <Button
          className="bg-gradient-to-r from-ccra-green to-emerald-600 text-white"
          onClick={() => setComposeOpen(true)}
        >
          <Send className="w-4 h-4 mr-2" />
          New Broadcast
        </Button>
      </PageHeader>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        <GlassCard padding="sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Send className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Sent</p>
              <p className="text-xl font-semibold">{totalSent}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard padding="sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg Delivery Rate</p>
              <p className="text-xl font-semibold">{avgDelivery}%</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard padding="sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Eye className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg Read Rate</p>
              <p className="text-xl font-semibold">{avgRead}%</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard padding="sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Recipients</p>
              <p className="text-xl font-semibold">25</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <Tabs defaultValue="history">
        <TabsList>
          <TabsTrigger value="history">Communication Log</TabsTrigger>
          <TabsTrigger value="templates">Message Templates</TabsTrigger>
          <TabsTrigger value="inbox-preview">Farmer Inbox Preview</TabsTrigger>
        </TabsList>

        {/* Communication Log */}
        <TabsContent value="history" className="space-y-4 mt-4">
          <GlassCard padding="none">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="p-4 font-medium text-muted-foreground">Type</th>
                    <th className="p-4 font-medium text-muted-foreground">Title</th>
                    <th className="p-4 font-medium text-muted-foreground">Recipients</th>
                    <th className="p-4 font-medium text-muted-foreground">Sent By</th>
                    <th className="p-4 font-medium text-muted-foreground">Date</th>
                    <th className="p-4 font-medium text-muted-foreground">Delivery</th>
                    <th className="p-4 font-medium text-muted-foreground">Read</th>
                    <th className="p-4 font-medium text-muted-foreground">Priority</th>
                    <th className="p-4 font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {communications.map((comm) => {
                    const cfg = typeConfig[comm.type]
                    const Icon = cfg.icon
                    const pri = priorityConfig[comm.priority]
                    return (
                      <tr
                        key={comm.id}
                        onClick={() => { setSelectedComm(comm); setPreviewOpen(true) }}
                        className="border-b border-border/50 hover:bg-accent/30 cursor-pointer transition-colors"
                      >
                        <td className="p-4">
                          <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium', cfg.bg, cfg.color)}>
                            <Icon className="w-3 h-3" />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="p-4 font-medium max-w-[250px] truncate">{comm.title}</td>
                        <td className="p-4">
                          <span className="text-xs">{recipientLabels[comm.recipients]} ({comm.recipientCount})</span>
                        </td>
                        <td className="p-4 text-muted-foreground">{comm.sentBy}</td>
                        <td className="p-4 text-muted-foreground">{comm.sentDate}</td>
                        <td className="p-4">
                          {comm.status === 'sent' ? (
                            <span className={cn('font-medium', comm.deliveryRate >= 95 ? 'text-emerald-500' : 'text-amber-500')}>
                              {comm.deliveryRate}%
                            </span>
                          ) : '—'}
                        </td>
                        <td className="p-4">
                          {comm.status === 'sent' ? (
                            <span className={cn('font-medium', comm.readRate >= 80 ? 'text-emerald-500' : comm.readRate >= 60 ? 'text-amber-500' : 'text-red-500')}>
                              {comm.readRate}%
                            </span>
                          ) : '—'}
                        </td>
                        <td className="p-4">
                          <span className={cn('inline-flex rounded-full px-2 py-0.5 text-xs font-medium border', pri.color)}>
                            {pri.label}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={cn(
                            'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                            comm.status === 'sent' && 'bg-emerald-500/10 text-emerald-500',
                            comm.status === 'draft' && 'bg-gray-500/10 text-muted-foreground',
                            comm.status === 'scheduled' && 'bg-blue-500/10 text-blue-500',
                          )}>
                            {comm.status}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </TabsContent>

        {/* Message Templates */}
        <TabsContent value="templates" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            {messageTemplates.map((tpl) => (
              <GlassCard
                key={tpl.id}
                hover
                glow="green"
                onClick={() => setSelectedTemplate(tpl)}
                className="cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-ccra-green/10 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-ccra-green" />
                    </div>
                    <div>
                      <h4 className="font-medium">{tpl.name}</h4>
                      <span className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium bg-accent text-muted-foreground mt-1">
                        {tpl.category}
                      </span>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{tpl.subject}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                  <span className="text-[10px] text-muted-foreground">{tpl.variables.length} variables</span>
                  <span className="text-border">·</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs text-ccra-green"
                    onClick={(e) => {
                      e.stopPropagation()
                      toast.success('Template copied to composer')
                    }}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Use Template
                  </Button>
                </div>
              </GlassCard>
            ))}
          </div>
        </TabsContent>

        {/* Farmer Inbox Preview */}
        <TabsContent value="inbox-preview" className="mt-4">
          <div className="flex justify-center">
            <div className="w-[380px] rounded-[2rem] border-4 border-foreground/20 bg-background overflow-hidden shadow-2xl">
              {/* Phone notch */}
              <div className="h-8 bg-foreground/10 flex items-center justify-center">
                <div className="w-20 h-4 rounded-full bg-foreground/20" />
              </div>
              {/* Phone header */}
              <div className="bg-ccra-green px-4 py-3 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    <span className="font-semibold text-sm">CCRA Notifications</span>
                  </div>
                  <span className="text-xs opacity-80">3 new</span>
                </div>
              </div>
              {/* Notification list */}
              <div className="divide-y divide-border max-h-[480px] overflow-y-auto">
                {communications.filter((c) => c.status === 'sent').slice(0, 5).map((comm) => {
                  const cfg = typeConfig[comm.type]
                  const Icon = cfg.icon
                  return (
                    <div key={comm.id} className="p-3 hover:bg-accent/30 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0', cfg.bg)}>
                          <Icon className={cn('w-4 h-4', cfg.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h5 className="text-xs font-semibold truncate pr-2">{comm.title}</h5>
                            {comm.priority === 'urgent' && (
                              <span className="text-[9px] bg-red-500/10 text-red-500 rounded-full px-1.5 py-0.5 shrink-0">!</span>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{comm.body}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-muted-foreground">{comm.sentDate}</span>
                            <span className="text-[10px] text-muted-foreground">· {comm.sentBy}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              {/* Phone footer */}
              <div className="h-6 bg-foreground/5 flex items-center justify-center">
                <div className="w-24 h-1 rounded-full bg-foreground/20" />
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Preview of how farmers see CCRA notifications on their mobile devices
          </p>
        </TabsContent>
      </Tabs>

      {/* AI Insight */}
      <AiInsightCard
        title="Communication Effectiveness Analysis"
        insight="Communication engagement is strong at 78% average read rate. Urgent notices achieve 100% read rate, while general announcements average 65%. Recommendation: Send the upcoming water usage reminder as 'urgent' priority to improve compliance — 4 farms missed last month's deadline. Also consider a targeted congratulations message to top 3 compliance farms to reinforce positive behavior."
        severity="info"
        confidence={91}
      />

      {/* Communication Detail Dialog */}
      <Dialog open={previewOpen && !!selectedComm} onOpenChange={setPreviewOpen}>
        <DialogContent showCloseButton className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedComm?.title}</DialogTitle>
          </DialogHeader>
          {selectedComm && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', typeConfig[selectedComm.type].bg, typeConfig[selectedComm.type].color)}>
                  {typeConfig[selectedComm.type].label}
                </span>
                <span className={cn('inline-flex rounded-full px-2 py-0.5 text-xs font-medium border', priorityConfig[selectedComm.priority].color)}>
                  {priorityConfig[selectedComm.priority].label}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Recipients:</span> <span className="font-medium">{recipientLabels[selectedComm.recipients]} ({selectedComm.recipientCount})</span></div>
                <div><span className="text-muted-foreground">Sent By:</span> <span className="font-medium">{selectedComm.sentBy}</span></div>
                <div><span className="text-muted-foreground">Date:</span> <span className="font-medium">{selectedComm.sentDate}</span></div>
                <div><span className="text-muted-foreground">Status:</span> <span className="font-medium capitalize">{selectedComm.status}</span></div>
              </div>
              <div className="p-4 rounded-xl bg-accent/30 text-sm leading-relaxed whitespace-pre-line">
                {selectedComm.body}
              </div>
              {selectedComm.status === 'sent' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center">
                    <p className="text-2xl font-bold text-emerald-500">{selectedComm.deliveryRate}%</p>
                    <p className="text-xs text-muted-foreground">Delivery Rate</p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 text-center">
                    <p className="text-2xl font-bold text-blue-500">{selectedComm.readRate}%</p>
                    <p className="text-xs text-muted-foreground">Read Rate</p>
                  </div>
                </div>
              )}
              {selectedComm.readRate < 70 && selectedComm.status === 'sent' && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-amber-500">Low Read Rate Detected</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Consider re-sending as urgent or via SMS to unread recipients.</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 h-7 text-xs border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
                      onClick={() => toast.success('Re-sending to unread recipients via SMS')}
                    >
                      <Send className="w-3 h-3 mr-1" />
                      Resend via SMS
                    </Button>
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.success('Communication forwarded to Board')}
                >
                  Forward to Board
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.success('Exported to PDF')}
                >
                  Export PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Template Detail Dialog */}
      <Dialog open={!!selectedTemplate} onOpenChange={(open) => !open && setSelectedTemplate(null)}>
        <DialogContent showCloseButton className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name}</DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-ccra-green/10 text-ccra-green">
                {selectedTemplate.category}
              </span>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Subject Line:</p>
                <p className="text-sm font-medium p-2 rounded-lg bg-accent/30">{selectedTemplate.subject}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Message Body:</p>
                <div className="text-sm p-3 rounded-xl bg-accent/30 whitespace-pre-line leading-relaxed max-h-[300px] overflow-y-auto">
                  {selectedTemplate.body}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Variables ({selectedTemplate.variables.length}):</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTemplate.variables.map((v) => (
                    <span key={v} className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-mono bg-purple-500/10 text-purple-500">
                      {`{{${v}}}`}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  className="bg-gradient-to-r from-ccra-green to-emerald-600 text-white"
                  onClick={() => { setSelectedTemplate(null); setComposeOpen(true); toast.success('Template loaded into composer') }}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Use This Template
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast.success('Template duplicated')}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Compose Dialog */}
      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogContent showCloseButton className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Broadcast</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground">Recipients</label>
              <select className="w-full mt-1 p-2 rounded-lg bg-accent/30 border border-border text-sm">
                <option>All Farmers (25)</option>
                <option>KP Region (15)</option>
                <option>Balochistan Region (10)</option>
                <option>Individual</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Subject</label>
              <input className="w-full mt-1 p-2 rounded-lg bg-accent/30 border border-border text-sm" placeholder="Enter subject line..." />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Priority</label>
              <select className="w-full mt-1 p-2 rounded-lg bg-accent/30 border border-border text-sm">
                <option>Normal</option>
                <option>Urgent</option>
                <option>Low</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Message</label>
              <textarea className="w-full mt-1 p-2 rounded-lg bg-accent/30 border border-border text-sm h-32 resize-none" placeholder="Compose your message..." />
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <StryderBadge />
              <p className="text-xs text-muted-foreground">AI will review your message for clarity and regulatory compliance before sending.</p>
            </div>
            <div className="flex gap-2">
              <Button
                className="bg-gradient-to-r from-ccra-green to-emerald-600 text-white flex-1"
                onClick={() => { setComposeOpen(false); toast.success('Broadcast sent to all recipients') }}
              >
                <Send className="w-4 h-4 mr-2" />
                Send Now
              </Button>
              <Button variant="outline" onClick={() => { setComposeOpen(false); toast.success('Saved as draft') }}>
                Save Draft
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
