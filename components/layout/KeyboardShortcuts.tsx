'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

const shortcuts = [
  { category: 'Navigation', items: [
    { keys: ['Ctrl', 'K'], description: 'Open Command Palette' },
    { keys: ['?'], description: 'Show Keyboard Shortcuts' },
    { keys: ['G', 'D'], description: 'Go to Dashboard' },
    { keys: ['G', 'F'], description: 'Go to Farm Registry' },
    { keys: ['G', 'L'], description: 'Go to Licensing' },
    { keys: ['G', 'C'], description: 'Go to Compliance' },
  ]},
  { category: 'Actions', items: [
    { keys: ['N'], description: 'Open Notifications' },
    { keys: ['S'], description: 'Toggle STRYDER AI Chat' },
    { keys: ['Esc'], description: 'Close Dialog / Panel' },
  ]},
  { category: 'Data', items: [
    { keys: ['Ctrl', 'E'], description: 'Export Current View' },
    { keys: ['Ctrl', 'P'], description: 'Print / Generate PDF' },
    { keys: ['F'], description: 'Focus Search / Filter' },
  ]},
]

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement) && !(e.target instanceof HTMLSelectElement)) {
        e.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent showCloseButton className="max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {shortcuts.map((group) => (
            <div key={group.category}>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{group.category}</h4>
              <div className="space-y-1.5">
                {group.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-accent/30 transition-colors">
                    <span className="text-sm">{item.description}</span>
                    <div className="flex items-center gap-1">
                      {item.keys.map((key, j) => (
                        <span key={j}>
                          {j > 0 && <span className="text-xs text-muted-foreground mx-0.5">+</span>}
                          <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-md bg-accent border border-border text-[11px] font-mono font-medium">
                            {key}
                          </kbd>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <p className="text-[10px] text-muted-foreground text-center pt-2 border-t border-border">
            Press <kbd className="px-1 py-0.5 rounded bg-accent border border-border text-[10px] font-mono">?</kbd> to toggle this guide
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
