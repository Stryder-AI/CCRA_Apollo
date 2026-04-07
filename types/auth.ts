export type Role = 'dg' | 'director_ops' | 'inspector' | 'analyst' | 'viewer'

export interface User {
  id: string
  name: string
  role: Role
  email: string
  title: string
}

export interface RolePermissions {
  canViewDashboard: boolean
  canManageFarms: boolean
  canAddFarms: boolean
  canDeleteFarms: boolean
  canManageLicenses: boolean
  canApproveLicenses: boolean
  canManageInspections: boolean
  canScheduleInspections: boolean
  canViewReports: boolean
  canExportData: boolean
  canManageUsers: boolean
  canManageSettings: boolean
  canChangeStatus: boolean
}
