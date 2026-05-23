'use client'

import { usePathname } from 'next/navigation'
import { ChatBubble } from './chat-bubble'

export function ChatBubbleWrapper() {
  const pathname = usePathname()
  // Hide on admin pages and live chat pages
  if (pathname.startsWith('/admin') || pathname.startsWith('/chat')) return null
  return <ChatBubble />
}
