'use client'

import { usePermissions } from '@/hooks/usePermissions'
import { RolePermissions } from '@/types/auth'

interface PermissionGateProps {
  permission: keyof RolePermissions
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function PermissionGate({ permission, children, fallback = null }: PermissionGateProps) {
  const permissions = usePermissions()

  if (!permissions[permission]) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
