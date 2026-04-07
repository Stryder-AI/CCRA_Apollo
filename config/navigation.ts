import { LayoutDashboard, Map, FileText, Shield, GitBranch, DollarSign, BarChart3, Building2, ClipboardList, Settings, Crown, UserCheck, FileBarChart, MessageSquare, Activity } from 'lucide-react'

export const NAV_ITEMS = [
  { label: 'Command Center', href: '/command-center', icon: Crown },
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Farm Registry', href: '/farms', icon: Map },
  { label: 'Licensing', href: '/licensing', icon: FileText },
  { label: 'Compliance', href: '/compliance', icon: Shield },
  { label: 'Inspections', href: '/inspections', icon: UserCheck },
  { label: 'Traceability', href: '/traceability', icon: GitBranch },
  { label: 'Revenue', href: '/revenue', icon: DollarSign },
  { label: 'Reports', href: '/reports', icon: FileBarChart },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Agencies', href: '/agencies', icon: Building2 },
  { label: 'Communications', href: '/communications', icon: MessageSquare },
  { label: 'System Health', href: '/system-health', icon: Activity },
  { label: 'Audit Trail', href: '/audit-trail', icon: ClipboardList },
  { label: 'Settings', href: '/settings', icon: Settings },
] as const
