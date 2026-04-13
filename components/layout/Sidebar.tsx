'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'
import { NAV_ITEMS } from '@/config/navigation'
import { APP_NAME, ORGANIZATION_SHORT, POWERED_BY } from '@/config/constants'
import { ChevronLeft, Leaf } from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()
  const collapsed = useAppStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useAppStore((s) => s.toggleSidebar)

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-50 h-screen glass-heavy flex flex-col transition-all duration-300 ease-out',
        collapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 px-5 h-16 border-b border-[var(--glass-border-subtle)]',
        collapsed && 'justify-center px-0'
      )}>
        <div className="w-9 h-9 rounded-xl bg-ccra-green flex items-center justify-center shrink-0">
          <Leaf className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-semibold tracking-tight truncate">{ORGANIZATION_SHORT}</h1>
            <p className="text-[10px] text-muted-foreground truncate">{APP_NAME}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'nav-item flex items-center gap-3 px-3 py-2.5 text-sm font-medium',
                isActive && 'nav-active',
                !isActive && 'text-muted-foreground',
                collapsed && 'justify-center px-0'
              )}
            >
              <Icon className={cn('w-5 h-5 shrink-0', isActive && 'text-white')} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Branding Footer */}
      {!collapsed && (
        <div className="px-5 pb-2">
          <p className="text-[10px] text-muted-foreground/70 leading-tight">
            Product by TechGIS
          </p>
          <p className="text-[10px] font-medium leading-tight mt-0.5 bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
            Powered by {POWERED_BY}
          </p>
        </div>
      )}

      {/* Collapse Toggle */}
      <div className="px-3 py-4 border-t border-[var(--glass-border-subtle)]">
        <button
          onClick={toggleSidebar}
          className={cn(
            'nav-item flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground w-full',
            collapsed && 'justify-center px-0'
          )}
        >
          <ChevronLeft className={cn(
            'w-5 h-5 shrink-0 transition-transform duration-300',
            collapsed && 'rotate-180'
          )} />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  )
}
