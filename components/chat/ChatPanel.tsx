'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useChatStore } from '@/store/useChatStore'
import { StryderBadge } from '@/components/ai/StryderBadge'

const suggestedQuestions = [
  'How many farms are in KP?',
  'Show me pending licenses',
  'Revenue this quarter?',
  'Recommend actions',
  'Which farms have violations?',
]

export function ChatPanel() {
  const { isOpen, messages, isTyping, sendMessage } = useChatStore()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    sendMessage(trimmed)
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className={cn(
        'fixed bottom-24 right-6 z-[9998] w-[400px] h-[560px]',
        'flex flex-col rounded-2xl overflow-hidden',
        'glass-heavy border border-border shadow-2xl',
        'animate-in slide-in-from-bottom-4 fade-in duration-300',
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
        <div className="flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground">STRYDER AI</h3>
          <p className="text-[11px] text-muted-foreground">Intelligence Assistant</p>
        </div>
        <StryderBadge size="sm" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'flex gap-2.5',
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row',
            )}
          >
            {/* Avatar */}
            <div
              className={cn(
                'flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center',
                msg.role === 'user'
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white',
              )}
            >
              {msg.role === 'user' ? (
                <User className="h-3.5 w-3.5" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
            </div>

            {/* Bubble */}
            <div
              className={cn(
                'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                msg.role === 'user'
                  ? 'bg-emerald-500 text-white rounded-br-md'
                  : 'glass border border-border rounded-bl-md text-foreground',
              )}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-2.5">
            <div className="flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div className="glass border border-border rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className={cn(
                'text-[11px] px-3 py-1.5 rounded-full border border-border',
                'glass hover:bg-emerald-500/10 hover:border-emerald-500/30',
                'text-muted-foreground hover:text-foreground transition-colors',
              )}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2 glass rounded-xl px-3 py-1.5 border border-border focus-within:border-emerald-500/50 transition-colors">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask STRYDER AI anything..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none py-1.5"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className={cn(
              'flex items-center justify-center h-8 w-8 rounded-lg transition-all',
              input.trim() && !isTyping
                ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                : 'text-muted-foreground',
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
