export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  isTyping?: boolean
}

export interface QAPair {
  id: string
  keywords: string[]
  question: string
  answer: string
  module?: string
  followUp?: string[]
}
