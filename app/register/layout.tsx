'use client'

import { Leaf } from 'lucide-react'

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="w-full border-b border-border/40">
        <div className="mx-auto max-w-4xl px-6 py-6 flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-600">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-lg font-bold tracking-tight text-foreground">
                Cannabis Control &amp; Regulatory Authority
              </h1>
              <p className="text-sm text-muted-foreground">
                Farm Registration Portal
              </p>
            </div>
          </div>
          <div className="w-full max-w-xs h-px bg-green-600/50" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full mx-auto max-w-4xl px-6 py-8 flex items-start justify-center">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border/40 py-4">
        <p className="text-center text-xs text-muted-foreground">
          Powered by TechGIS — Technology &amp; GIS Solutions
        </p>
      </footer>
    </div>
  )
}
