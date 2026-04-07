'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { Download, FileSpreadsheet, FileText, Info, Moon, Bell, User, Shield } from 'lucide-react'

import { PageTransition } from '@/design-system/page-transition'
import { PageHeader } from '@/components/layout/PageHeader'
import { GlassCard } from '@/design-system/glass-card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { PermissionGate } from '@/components/auth/PermissionGate'
import { useAuthStore } from '@/store/useAuthStore'
import { ROLE_LABELS } from '@/config/roles'
import { APP_NAME, APP_VERSION, BUILT_BY, ORGANIZATION } from '@/config/constants'
import { farms } from '@/data/mock-farms'
import { Role } from '@/types/auth'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const user = useAuthStore((s) => s.user)
  const setRole = useAuthStore((s) => s.setRole)

  // Notification toggles (mock local state)
  const [emailNotif, setEmailNotif] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(false)
  const [inspectionReminders, setInspectionReminders] = useState(true)
  const [violationAlerts, setViolationAlerts] = useState(true)

  // Export loading states
  const [exportingCSV, setExportingCSV] = useState(false)
  const [exportingExcel, setExportingExcel] = useState(false)
  const [exportingPDF, setExportingPDF] = useState(false)

  const handleExportCSV = async () => {
    setExportingCSV(true)
    // Brief delay for UX feedback
    await new Promise((r) => setTimeout(r, 500))

    const headers = ['Name', 'Owner', 'License', 'Region', 'Province', 'Status', 'Size (ha)', 'Strain', 'Compliance Score']
    const rows = farms.map((f) => [
      f.name,
      f.ownerName,
      f.licenseNumber,
      f.region,
      f.province,
      f.status,
      f.sizeHectares,
      f.strain,
      f.complianceScore ?? 'N/A',
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.map((v) => `"${v}"`).join(','))].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'ccra-farms-export.csv'
    link.click()
    URL.revokeObjectURL(url)

    setExportingCSV(false)
  }

  const handleExportExcel = async () => {
    setExportingExcel(true)

    const XLSX = await import('xlsx')

    const data = farms.map((f) => ({
      Name: f.name,
      Owner: f.ownerName,
      License: f.licenseNumber,
      Region: f.region,
      Province: f.province,
      Status: f.status,
      'Size (ha)': f.sizeHectares,
      Strain: f.strain,
      'Compliance Score': f.complianceScore ?? 'N/A',
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Farms')
    XLSX.writeFile(wb, 'ccra-farms-export.xlsx')

    setExportingExcel(false)
  }

  const handleExportPDF = async () => {
    setExportingPDF(true)

    const { default: jsPDF } = await import('jspdf')
    const autoTable = (await import('jspdf-autotable')).default

    const doc = new jsPDF({ orientation: 'landscape' })
    doc.setFontSize(16)
    doc.text('CCRA Farms Report', 14, 20)
    doc.setFontSize(10)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28)

    autoTable(doc, {
      startY: 35,
      head: [['Name', 'Owner', 'License', 'Region', 'Province', 'Status', 'Size (ha)', 'Strain', 'Score']],
      body: farms.map((f) => [
        f.name,
        f.ownerName,
        f.licenseNumber,
        f.region,
        f.province,
        f.status,
        f.sizeHectares,
        f.strain,
        f.complianceScore ?? 'N/A',
      ]),
      styles: { fontSize: 7 },
      headStyles: { fillColor: [34, 197, 94] },
    })

    doc.save('ccra-farms-export.pdf')
    setExportingPDF(false)
  }

  return (
    <PageTransition>
      <PageHeader title="Settings" description="Manage your preferences and application settings" />

      <div className="space-y-6 max-w-3xl">
        {/* ─── Appearance ─── */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <Moon className="size-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Appearance</h2>
          </div>
          <Separator className="mb-4" />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Toggle between light and dark theme for the interface
              </p>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          </div>
        </GlassCard>

        {/* ─── User Profile ─── */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <User className="size-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">User Profile</h2>
          </div>
          <Separator className="mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Name</p>
              <p className="text-sm font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Email</p>
              <p className="text-sm font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Title</p>
              <p className="text-sm font-medium">{user.title}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Role</p>
              <p className="text-sm font-medium">{ROLE_LABELS[user.role]}</p>
            </div>
          </div>
        </GlassCard>

        {/* ─── Role Switcher (DG only) ─── */}
        <PermissionGate permission="canManageSettings">
          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="size-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Demo Role Switcher</h2>
            </div>
            <Separator className="mb-4" />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="role-switcher">Active Role</Label>
                <p className="text-sm text-muted-foreground">
                  Switch roles to preview different permission levels
                </p>
              </div>
              <select
                id="role-switcher"
                value={user.role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              >
                {(Object.entries(ROLE_LABELS) as [Role, string][]).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </GlassCard>
        </PermissionGate>

        {/* ─── Notifications ─── */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <Bell className="size-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          <Separator className="mb-4" />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notif">Email Notifications</Label>
              <Switch
                id="email-notif"
                checked={emailNotif}
                onCheckedChange={setEmailNotif}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-alerts">SMS Alerts</Label>
              <Switch
                id="sms-alerts"
                checked={smsAlerts}
                onCheckedChange={setSmsAlerts}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="inspection-reminders">Inspection Reminders</Label>
              <Switch
                id="inspection-reminders"
                checked={inspectionReminders}
                onCheckedChange={setInspectionReminders}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="violation-alerts">Violation Alerts</Label>
              <Switch
                id="violation-alerts"
                checked={violationAlerts}
                onCheckedChange={setViolationAlerts}
              />
            </div>
          </div>
        </GlassCard>

        {/* ─── Data Export ─── */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <Download className="size-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Data Export</h2>
          </div>
          <Separator className="mb-4" />
          <p className="text-sm text-muted-foreground mb-4">
            Export farm registry data in your preferred format
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExportCSV}
              disabled={exportingCSV}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
            >
              <FileText className="size-4" />
              {exportingCSV ? 'Exporting...' : 'Export CSV'}
            </button>
            <button
              onClick={handleExportExcel}
              disabled={exportingExcel}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
            >
              <FileSpreadsheet className="size-4" />
              {exportingExcel ? 'Exporting...' : 'Export Excel'}
            </button>
            <button
              onClick={handleExportPDF}
              disabled={exportingPDF}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
            >
              <FileText className="size-4" />
              {exportingPDF ? 'Exporting...' : 'Export PDF'}
            </button>
          </div>
        </GlassCard>

        {/* ─── System Info ─── */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <Info className="size-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">System Information</h2>
          </div>
          <Separator className="mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Application</p>
              <p className="text-sm font-medium">{APP_NAME}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Version</p>
              <p className="text-sm font-medium">v{APP_VERSION}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Organization</p>
              <p className="text-sm font-medium">{ORGANIZATION}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Built By</p>
              <p className="text-sm font-medium">{BUILT_BY}</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </PageTransition>
  )
}
