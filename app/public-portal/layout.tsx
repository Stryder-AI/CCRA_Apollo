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
    <div className="min-h-screen flex flex-col bg-[#061a06] text-white relative">
      {/* Animated gradient blur spots */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-green-600/15 blur-[120px] animate-pulse" />
        <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] rounded-full bg-emerald-500/10 blur-[100px] animate-pulse [animation-delay:2s]" />
        <div className="absolute bottom-[-10%] left-[30%] w-[600px] h-[600px] rounded-full bg-teal-600/10 blur-[140px] animate-pulse [animation-delay:4s]" />
        <div className="absolute top-[20%] left-[50%] w-[350px] h-[350px] rounded-full bg-green-500/8 blur-[110px] animate-pulse [animation-delay:3s]" />
      </div>

      {/* Top government bar */}
      <div className="w-full bg-white/5 backdrop-blur-md border-b border-white/5 text-green-200 text-xs py-1.5 relative z-10">
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-3 w-3 text-green-400" />
            <span className="text-green-300/80">Government of Pakistan</span>
          </div>
          <div className="flex items-center gap-4 text-green-300/80">
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3 text-green-400/70" /> +92-51-9XXX-XXX
            </span>
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3 text-green-400/70" /> info@ccra.gov.pk
            </span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="w-full bg-white/5 backdrop-blur-xl border-b border-white/10 relative z-10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* CCRA Crest with glowing green ring */}
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-600 to-emerald-800 shadow-lg shadow-green-500/20 ring-2 ring-green-400/50">
              <div className="absolute inset-0 rounded-full ring-2 ring-green-400/30 animate-ping opacity-30" />
              <div className="absolute inset-[-3px] rounded-full ring-1 ring-green-400/20 blur-[2px]" />
              <Leaf className="h-7 w-7 text-white drop-shadow-lg" />
              <div className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/20">
                <Shield className="h-3 w-3 text-green-400" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                Cannabis Control &amp; Regulatory Authority
              </h1>
              <p className="text-sm text-green-400 font-medium">
                Government of Pakistan — Public Portal
              </p>
            </div>
          </div>

          {/* Coat of arms style accent */}
          <div className="hidden md:flex items-center gap-3 text-green-200">
            <div className="text-right text-xs leading-tight">
              <div className="font-semibold text-green-100">Ittehad, Tanzeem, Yaqeen-e-Muhkam</div>
              <div className="text-green-400/70">Unity, Discipline, Conviction</div>
            </div>
            <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-inner">
              <span className="text-lg text-green-400">&#9734;</span>
            </div>
          </div>
        </div>

        {/* Navigation bar */}
        <nav className="w-full bg-white/5 backdrop-blur-lg border-t border-white/5">
          <div className="mx-auto max-w-7xl px-6 flex items-center gap-0">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  'px-5 py-3 text-sm font-medium text-green-200/80 transition-all duration-200',
                  'hover:bg-white/10 hover:text-white hover:shadow-[inset_0_-2px_0_0_rgba(74,222,128,0.5)]',
                  'border-r border-white/5 last:border-r-0'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* Main content - transparent so gradient spots show through */}
      <main className="flex-1 w-full relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full bg-white/5 backdrop-blur-xl border-t border-white/10 relative z-10">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-bold text-green-100 mb-3 uppercase tracking-wider">Contact</h3>
              <div className="space-y-2 text-sm text-green-400/80">
                <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-green-400/60" /> info@ccra.gov.pk</p>
                <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-green-400/60" /> +92-51-9XXX-XXX</p>
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-green-400/60" /> Islamabad, Pakistan</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-green-100 mb-3 uppercase tracking-wider">Quick Links</h3>
              <div className="space-y-2 text-sm text-green-400/80">
                <p><Link href="/public-portal" className="hover:text-white transition-colors duration-200">Home</Link></p>
                <p><Link href="/public-portal#track" className="hover:text-white transition-colors duration-200">Track Application</Link></p>
                <p><Link href="/public-portal#verify" className="hover:text-white transition-colors duration-200">Verify Product</Link></p>
                <p><Link href="/public-portal#operators" className="hover:text-white transition-colors duration-200">Licensed Operators</Link></p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-green-100 mb-3 uppercase tracking-wider">Disclaimer</h3>
              <p className="text-sm text-green-400/80 leading-relaxed">
                This portal provides public information about cannabis regulation in Pakistan.
                All data is maintained by the CCRA and is subject to the regulatory framework
                established under applicable laws.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-2">
              <p className="text-xs text-green-400/70">
                &copy; 2026 Cannabis Control &amp; Regulatory Authority. All rights reserved.
              </p>
              <div className="flex items-center gap-3 text-xs text-green-400/50">
                <span>Powered by <span className="text-green-300/70 font-medium">STRYDE</span></span>
                <span className="text-white/20">|</span>
                <span>Product by <span className="text-green-300/70 font-medium">TechGIS</span></span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
