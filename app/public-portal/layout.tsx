'use client'

import { Leaf, Globe, Shield, Phone, Mail, MapPin } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Home', href: '/public-portal' },
  { label: 'Track Application', href: '/public-portal#track' },
  { label: 'Verify Product', href: '/public-portal#verify' },
  { label: 'Licensed Operators', href: '/public-portal#operators' },
  { label: 'Fee Schedule', href: '/public-portal#fees' },
]

export default function PublicPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top green accent bar */}
      <div className="w-full h-1.5 bg-gradient-to-r from-green-800 via-green-600 to-emerald-500" />

      {/* Upper government bar */}
      <div className="w-full bg-green-900 text-green-100 text-xs py-1.5">
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-3 w-3" />
            <span>Government of Pakistan</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> +92-51-9XXX-XXX</span>
            <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> info@ccra.gov.pk</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="w-full bg-white border-b border-green-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* CCRA Crest */}
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-700 to-green-900 shadow-lg ring-2 ring-green-300/50">
              <Leaf className="h-7 w-7 text-white" />
              <div className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full bg-white flex items-center justify-center shadow">
                <Shield className="h-3 w-3 text-green-700" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-green-900">
                Cannabis Control &amp; Regulatory Authority
              </h1>
              <p className="text-sm text-green-700 font-medium">
                Government of Pakistan — Public Portal
              </p>
            </div>
          </div>

          {/* Coat of arms style accent */}
          <div className="hidden md:flex items-center gap-2 text-green-800">
            <div className="text-right text-xs leading-tight">
              <div className="font-semibold">Ittehad, Tanzeem, Yaqeen-e-Muhkam</div>
              <div className="text-green-600">Unity, Discipline, Conviction</div>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
              <span className="text-lg">&#9734;</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="w-full bg-green-800">
          <div className="mx-auto max-w-7xl px-6 flex items-center gap-0">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  'px-5 py-3 text-sm font-medium text-green-100 transition-colors',
                  'hover:bg-green-700 hover:text-white',
                  'border-r border-green-700/50 last:border-r-0'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full bg-green-900 text-green-100">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Contact</h3>
              <div className="space-y-2 text-sm text-green-300">
                <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> info@ccra.gov.pk</p>
                <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> +92-51-9XXX-XXX</p>
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Islamabad, Pakistan</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Quick Links</h3>
              <div className="space-y-2 text-sm text-green-300">
                <p><Link href="/public-portal" className="hover:text-white transition-colors">Home</Link></p>
                <p><Link href="/public-portal#track" className="hover:text-white transition-colors">Track Application</Link></p>
                <p><Link href="/public-portal#verify" className="hover:text-white transition-colors">Verify Product</Link></p>
                <p><Link href="/public-portal#operators" className="hover:text-white transition-colors">Licensed Operators</Link></p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Disclaimer</h3>
              <p className="text-sm text-green-300 leading-relaxed">
                This portal provides public information about cannabis regulation in Pakistan.
                All data is maintained by the CCRA and is subject to the regulatory framework
                established under applicable laws.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-green-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-2">
              <p className="text-xs text-green-400">
                &copy; 2026 Cannabis Control &amp; Regulatory Authority. All rights reserved.
              </p>
              <p className="text-xs text-green-500">
                Powered by TechGIS &mdash; Technology &amp; GIS Solutions
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
