import { create } from 'zustand'
import { ChatMessage } from '@/types/chat'
import { nlqPairs } from '@/data/mock-nlq'

interface ChatState {
  isOpen: boolean
  messages: ChatMessage[]
  isTyping: boolean
  toggleChat: () => void
  setOpen: (open: boolean) => void
  sendMessage: (text: string) => void
  clearMessages: () => void
}

function findBestMatch(input: string) {
  const inputWords = input.toLowerCase().split(/\s+/).filter(w => w.length > 2)
  let bestMatch = null
  let bestScore = 0

  for (const pair of nlqPairs) {
    const score = pair.keywords.filter(k =>
      inputWords.some(w => w.includes(k) || k.includes(w))
    ).length
    if (score > bestScore) {
      bestScore = score
      bestMatch = pair
    }
  }

  return bestScore > 0 ? bestMatch : null
}

const welcomeMessage: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: 'Welcome to STRYDER AI — your intelligent assistant for the CCRA Intelligence Nexus. I can help you with farm data, licensing, compliance, revenue, traceability, and more. What would you like to know?',
  timestamp: new Date().toISOString(),
}

export const useChatStore = create<ChatState>((set, get) => ({
  isOpen: false,
  messages: [welcomeMessage],
  isTyping: false,
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  setOpen: (open) => set({ isOpen: open }),
  sendMessage: (text) => {
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    }

    set((state) => ({
      messages: [...state.messages, userMessage],
      isTyping: true,
    }))

    // Simulate AI thinking delay
    setTimeout(() => {
      const match = findBestMatch(text)
      const responseText = match
        ? match.answer
        : "I don't have specific data on that query yet. Try asking about farms, licenses, compliance, revenue, traceability, or inspections. You can also ask me for recommended actions or today's alerts."

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-response`,
        role: 'assistant',
        content: responseText,
        timestamp: new Date().toISOString(),
      }

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isTyping: false,
      }))
    }, 800 + Math.random() * 700)
  },
  clearMessages: () => set({ messages: [welcomeMessage] }),
}))
