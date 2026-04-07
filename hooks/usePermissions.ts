import { useMemo } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { ROLE_PERMISSIONS } from '@/config/roles'
import { RolePermissions } from '@/types/auth'

export function usePermissions(): RolePermissions {
  const role = useAuthStore((s) => s.user.role)
  return useMemo(() => ROLE_PERMISSIONS[role], [role])
}
