'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Map, FileText } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { NAV_ITEMS } from '@/config/navigation'
import { farms } from '@/data/mock-farms'
import { cn } from '@/lib/utils'

interface SearchResult {
  id: string
  label: string
  href: string
  icon: React.ElementType
  category: 'Navigation' | 'Farm' | 'License'
  subtitle?: string
}

function buildResults(query: string): SearchResult[] {
  const q = query.toLowerCase().trim()
  if (!q) return []

  const results: SearchResult[] = []

  // Navigation items
  for (const item of NAV_ITEMS) {
    if (item.label.toLowerCase().includes(q) || item.href.toLowerCase().includes(q)) {
      results.push({
        id: `nav-${item.href}`,
        label: item.label,
        href: item.href,
        icon: item.icon,
        category: 'Navigation',
      })
    }
  }

  // Farm names
  for (const farm of farms) {
    if (
      farm.name.toLowerCase().includes(q) ||
      farm.region.toLowerCase().includes(q) ||
      farm.ownerName.toLowerCase().includes(q)
    ) {
      results.push({
        id: `farm-${farm.id}`,
        label: farm.name,
        href: `/farms/${farm.id}`,
        icon: Map,
        category: 'Farm',
        subtitle: `${farm.region}, ${farm.province} — ${farm.ownerName}`,
      })
    }

    // License number search
    if (farm.licenseNumber.toLowerCase().includes(q)) {
      results.push({
        id: `license-${farm.id}`,
        label: farm.licenseNumber,
        href: `/farms/${farm.id}`,
        icon: FileText,
        category: 'License',
        subtitle: `${farm.name} — ${farm.ownerName}`,
      })
    }
  }

  return results.slice(0, 20)
}

const CATEGORY_COLORS: Record<string, string> = {
  Navigation: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Farm: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  License: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const results = buildResults(query)

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  // Ctrl+K / Cmd+K global shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(0)
      // Small delay to let the dialog render
      const t = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(t)
    }
  }, [open])

  const navigate = useCallback(
    (href: string) => {
      setOpen(false)
      router.push(href)
    },
    [router]
  )

  // Keyboard navigation inside the palette
  function handleInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
      scrollToActive(activeIndex + 1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
      scrollToActive(activeIndex - 1)
    } else if (e.key === 'Enter' && results[activeIndex]) {
      e.preventDefault()
      navigate(results[activeIndex].href)
    }
  }

  function scrollToActive(index: number) {
    const container = listRef.current
    if (!container) return
    const item = container.children[index] as HTMLElement | undefined
    item?.scrollIntoView({ block: 'nearest' })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-lg max-w-[calc(100%-2rem)] top-[30%] gap-0 p-0 overflow-hidden border border-white/10 bg-background/80 backdrop-blur-xl shadow-2xl shadow-black/40"
      >
        {/* Accessible title (visually hidden) */}
        <DialogTitle className="sr-only">Command Palette</DialogTitle>

        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Type to search..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          className="max-h-[320px] overflow-y-auto overscroll-contain p-2"
        >
          {query && results.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No results found for &ldquo;{query}&rdquo;
            </div>
          )}

          {!query && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              Search navigation, farms, and licenses...
            </div>
          )}

          {results.map((result, index) => {
            const Icon = result.icon
            return (
              <button
                key={result.id}
                onClick={() => navigate(result.href)}
                onMouseEnter={() => setActiveIndex(index)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                  index === activeIndex
                    ? 'bg-white/10 text-foreground'
                    : 'text-muted-foreground hover:bg-white/5'
                )}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/5 border border-white/10">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate font-medium">{result.label}</div>
                  {result.subtitle && (
                    <div className="truncate text-xs text-muted-foreground">
                      {result.subtitle}
                    </div>
                  )}
                </div>
                <span
                  className={cn(
                    'shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium',
                    CATEGORY_COLORS[result.category]
                  )}
                >
                  {result.category}
                </span>
              </button>
            )
          })}
        </div>

        {/* Footer hints */}
        <div className="flex items-center gap-4 border-t border-white/10 px-4 py-2 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-white/10 bg-white/5 px-1">↑↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-white/10 bg-white/5 px-1">↵</kbd>
            select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-white/10 bg-white/5 px-1">esc</kbd>
            close
          </span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
