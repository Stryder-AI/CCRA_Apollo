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
    <div className="min-h-screen relative">
      {/* Green gradient background */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        {/* Base white */}
        <div className="absolute inset-0 bg-[#f8fdf8]" />
        {/* Top-left green sweep */}
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[60%] rounded-full bg-gradient-to-br from-green-300/60 via-green-200/40 to-transparent blur-[80px]" />
        {/* Top-right green accent */}
        <div className="absolute -top-[10%] -right-[5%] w-[50%] h-[50%] rounded-full bg-gradient-to-bl from-green-300/50 via-lime-200/30 to-transparent blur-[100px]" />
        {/* Bottom-right flowing curve */}
        <div className="absolute -bottom-[15%] -right-[10%] w-[60%] h-[50%] rounded-full bg-gradient-to-tl from-green-300/50 via-lime-200/30 to-transparent blur-[90px]" />
        {/* Bottom-left subtle */}
        <div className="absolute -bottom-[10%] -left-[5%] w-[40%] h-[40%] rounded-full bg-gradient-to-tr from-green-200/30 via-emerald-100/20 to-transparent blur-[80px]" />
        {/* Center light glow */}
        <div className="absolute top-[30%] left-[30%] w-[50%] h-[40%] rounded-full bg-white/80 blur-[100px]" />
      </div>

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
