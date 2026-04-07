'use client'

import { MessageSquare, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useChatStore } from '@/store/useChatStore'

export function ChatButton() {
  const { isOpen, toggleChat } = useChatStore()

  return (
    <button
      onClick={toggleChat}
      className={cn(
        'fixed bottom-6 right-6 z-[9999] flex items-center justify-center',
        'h-14 w-14 rounded-full shadow-lg',
        'bg-gradient-to-br from-emerald-500 to-teal-600',
        'text-white transition-all duration-300',
        'hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:scale-105',
        'active:scale-95',
        isOpen && 'rotate-0',
      )}
      aria-label={isOpen ? 'Close STRYDER AI' : 'Open STRYDER AI'}
    >
      {isOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <>
          <MessageSquare className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 items-center justify-center">
              <span className="text-[8px] font-bold text-white">AI</span>
            </span>
          </span>
        </>
      )}
    </button>
  )
}
