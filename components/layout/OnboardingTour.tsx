'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { StryderBadge } from '@/components/ai/StryderBadge'
import { cn } from '@/lib/utils'
import {
  Crown, LayoutDashboard, Map, FileText, Brain,
  MessageSquare, Shield, Sparkles, ArrowRight, X, CheckCircle
} from 'lucide-react'

const tourSteps = [
  {
    icon: Sparkles,
    title: 'Welcome to CCRA Intelligence Nexus',
    description: 'Pakistan\'s premier cannabis regulatory technology platform. This system empowers the Director General and CCRA leadership with real-time intelligence, AI-powered insights, and complete regulatory oversight.',
    highlight: 'Powered by STRYDER AI — your intelligent regulatory companion',
    color: 'text-ccra-green',
    bg: 'bg-ccra-green/10',
  },
  {
    icon: Crown,
    title: 'DG Command Center',
    description: 'Your executive command hub. See pending approvals, KPI scorecards, escalations, and AI-powered strategic forecasts — all in one place. Every item has one-click action buttons.',
    highlight: 'Navigate: Sidebar → Command Center',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: LayoutDashboard,
    title: 'Intelligence Dashboard',
    description: 'Real-time KPIs with sparkline trends, revenue charts, compliance summaries, and regional breakdowns. The AI briefing updates daily with key metrics and recommendations.',
    highlight: 'Click any stat card to drill into that module',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Map,
    title: 'GIS Farm Registry',
    description: 'Interactive Pakistan map showing all 25 licensed farms with polygon boundaries. Toggle risk heatmap to visualize compliance risk zones. Click any farm for detailed insights.',
    highlight: 'Try the Risk Heatmap toggle for compliance visualization',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Brain,
    title: 'STRYDER AI — Everywhere',
    description: 'AI-powered insights are embedded throughout every module. License applications get AI pre-screening. Compliance predictions flag at-risk farms. Revenue forecasts optimize collection. Every AI recommendation includes an action button.',
    highlight: 'Look for the STRYDER AI badge on any page',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    icon: MessageSquare,
    title: 'Ask STRYDER AI Anything',
    description: 'Click the floating green button (bottom-right) to open the AI chat. Ask questions in natural language: "How many farms in KP?", "Show compliance rate", "What are the pending licenses?"',
    highlight: 'Press Ctrl+K for quick search across all modules',
    color: 'text-ccra-teal',
    bg: 'bg-ccra-teal/10',
  },
]

export function OnboardingTour() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('ccra-tour-seen')
    if (!hasSeenTour) {
      const timer = setTimeout(() => setOpen(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleComplete = () => {
    localStorage.setItem('ccra-tour-seen', 'true')
    setOpen(false)
    setStep(0)
  }

  const handleSkip = () => {
    localStorage.setItem('ccra-tour-seen', 'true')
    setOpen(false)
    setStep(0)
  }

  const current = tourSteps[step]
  const Icon = current.icon

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleSkip() }}>
      <DialogContent showCloseButton className="max-w-lg p-0 overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-accent">
          <div
            className="h-full bg-gradient-to-r from-ccra-green to-emerald-400 transition-all duration-500"
            style={{ width: `${((step + 1) / tourSteps.length) * 100}%` }}
          />
        </div>

        <div className="p-6">
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {tourSteps.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all',
                    i === step ? 'bg-ccra-green w-6' : i < step ? 'bg-ccra-green' : 'bg-accent'
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">{step + 1} of {tourSteps.length}</span>
          </div>

          {/* Content */}
          <div className="text-center space-y-4">
            <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center mx-auto', current.bg)}>
              <Icon className={cn('w-8 h-8', current.color)} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{current.title}</h3>
              {step === 0 && <div className="flex justify-center mt-1"><StryderBadge /></div>}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{current.description}</p>
            <div className={cn('inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium', current.bg, current.color)}>
              <CheckCircle className="w-3 h-3" />
              {current.highlight}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <Button variant="ghost" size="sm" onClick={handleSkip} className="text-muted-foreground">
              Skip Tour
            </Button>
            <div className="flex gap-2">
              {step > 0 && (
                <Button variant="outline" size="sm" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              )}
              {step < tourSteps.length - 1 ? (
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-ccra-green to-emerald-600 text-white"
                  onClick={() => setStep(step + 1)}
                >
                  Next
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-ccra-green to-emerald-600 text-white"
                  onClick={handleComplete}
                >
                  Get Started
                  <Sparkles className="w-3.5 h-3.5 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
