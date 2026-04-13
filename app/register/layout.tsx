'use client'

import Link from 'next/link'
import { Leaf, ArrowLeft } from 'lucide-react'

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
                Public License Application Portal
              </p>
            </div>
          </div>
          <div className="w-full max-w-xs h-px bg-green-600/50" />
        </div>
      </header>

      {/* Back to Portal */}
      <div className="mx-auto max-w-5xl px-6 pt-4">
        <Link href="/public-portal" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Public Portal
        </Link>
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full mx-auto max-w-5xl px-6 py-6 flex items-start justify-center">
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
