'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { CommandPalette } from '@/components/layout/CommandPalette'
import { KeyboardShortcuts } from '@/components/layout/KeyboardShortcuts'
import { OnboardingTour } from '@/components/layout/OnboardingTour'
import { ChatButton } from '@/components/chat/ChatButton'
import { ChatPanel } from '@/components/chat/ChatPanel'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const collapsed = useAppStore((s) => s.sidebarCollapsed)

  return (
    <div className="min-h-screen">
      <Sidebar />
      <TopBar />
      <main
        className={cn(
          'pt-4 px-6 pb-8 transition-all duration-300',
          collapsed ? 'ml-[72px]' : 'ml-[260px]'
        )}
      >
        {children}
      </main>
      <CommandPalette />
      <KeyboardShortcuts />
      <OnboardingTour />
      <ChatButton />
      <ChatPanel />
    </div>
  )
}
