import { create } from 'zustand'
import { Role, User } from '@/types/auth'

interface AuthState {
  user: User
  setRole: (role: Role) => void
}

const ROLE_TITLES: Record<Role, string> = {
  dg: 'Director General',
  director_ops: 'Director Operations',
  inspector: 'Field Inspector',
  analyst: 'Data Analyst',
  viewer: 'Viewer',
}

const DEFAULT_USER: User = {
  id: 'u001',
  name: 'Maj Gen (R) Zafarullah Khan',
  role: 'dg',
  email: 'dg@ccra.gov.pk',
  title: 'Director General',
}

export const useAuthStore = create<AuthState>((set) => ({
  user: DEFAULT_USER,
  setRole: (role) =>
    set((state) => ({
      user: {
        ...state.user,
        role,
        title: ROLE_TITLES[role],
      },
    })),
}))
