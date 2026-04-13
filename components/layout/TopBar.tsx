'use client'

import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useState, useEffect } from 'react'
import { Search, Sun, Moon, User, Clock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { NotificationDropdown } from '@/components/layout/NotificationDropdown'

export function TopBar() {
  const { theme, setTheme } = useTheme()
  const searchQuery = useAppStore((s) => s.searchQuery)
  const setSearchQuery = useAppStore((s) => s.setSearchQuery)
  const user = useAuthStore((s) => s.user)
  const collapsed = useAppStore((s) => s.sidebarCollapsed)

  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  const initials = user.name
    .split(' ')
    .filter((_, i, arr) => i === 0 || i === arr.length - 1)
    .map((n) => n[0])
    .join('')

  return (
    <header
      className={cn(
        'sticky top-0 z-40 h-16 glass-heavy border-b border-[var(--glass-border-subtle)] flex items-center gap-4 px-6 transition-all duration-300',
        collapsed ? 'ml-[72px]' : 'ml-[260px]'
      )}
    >
      {/* Search */}
      <div className="relative flex-1 max-w-md group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search farms, licenses, inspections..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-16 bg-accent/30 border-[var(--glass-border-subtle)] focus:border-ccra-green/50 focus:ring-ccra-green/20 focus:shadow-[0_0_20px_rgba(34,197,94,0.1)] focus:bg-white/60 transition-all duration-300"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 rounded-md border border-[var(--glass-border-subtle)] bg-accent/50 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      {/* Live Clock */}
      <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-xl bg-accent/50 border border-[var(--glass-border-subtle)]">
        <Clock className="w-3.5 h-3.5 text-ccra-green" />
        <div className="text-right">
          <p className="text-xs font-mono font-semibold leading-none">{formattedTime}</p>
          <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{formattedDate}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="relative rounded-xl hover:bg-ccra-green/10"
        >
          <Sun className="w-4.5 h-4.5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute w-4.5 h-4.5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Notifications */}
        <NotificationDropdown />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-ccra-green/10 transition-colors outline-none">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-ccra-green text-white text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-left hidden lg:block">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.title}</p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
