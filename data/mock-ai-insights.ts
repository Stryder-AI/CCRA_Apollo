export const aiInsights = {
  dashboard: [
    {
      title: 'Daily Intelligence Briefing',
      insight: 'Good morning, Director General. 3 license applications require immediate attention — 2 pending review, 1 under AI assessment. Farm compliance across KP dropped 2.1% this week due to seasonal transitions. Revenue is on track to exceed Q1 projections by 8.3%. Two farms in Tirah Valley and Malakand are flagged for inspection within 7 days. STRYDER AI recommends prioritizing the Quetta Premium Cultivars extraction license — high-value application with strong documentation.',
      severity: 'info' as const,
      confidence: 94,
    },
  ],
  farms: {
    default: {
      yieldPrediction: 'Based on current growth patterns, soil analysis, and regional climate data, estimated harvest yield is 13.2 tons — 5.6% above the regional average for this strain.',
      harvestWindow: 'Optimal harvest window: April 15-22, 2026. Delaying beyond April 25 risks 8% potency degradation due to expected rainfall.',
      pestRisk: 'Low pest risk (12%). Monitor for aphid activity in weeks 3-4 of current growth cycle. Neighboring farms report clean conditions.',
      soilHealth: 87,
    },
    suspended: {
      yieldPrediction: 'Cultivation suspended — no active yield projection available. Historical data shows this farm averaged 11.8 tons per cycle before suspension.',
      harvestWindow: 'N/A — Farm operations suspended pending compliance resolution.',
      pestRisk: 'Unable to assess — no active monitoring during suspension period.',
      soilHealth: 0,
    },
  },
  licensing: {
    pendingCount: 'STRYDER AI has completed first-pass review on 3 pending applications. 1 flagged for document incompleteness, 1 recommended for approval, 1 requires human judgment on land overlap with existing license.',
  },
  compliance: [
    { farmName: 'Tirah Gold Plantation', riskScore: 72, reason: 'Record-keeping violation history + 4 months since last inspection' },
    { farmName: 'Panjgur Valley Farm', riskScore: 65, reason: 'Late reporting pattern detected — 3 consecutive delayed submissions' },
    { farmName: 'Quetta Highland Farm', riskScore: 58, reason: 'Water usage trending upward — 22% above baseline this quarter' },
    { farmName: 'Swat Green Fields', riskScore: 54, reason: 'Safety protocol violation unresolved for 120+ days' },
    { farmName: 'Chagai Golden Fields', riskScore: 41, reason: 'Adjacent farm (Chagai Desert Bloom) had boundary issues — proximity risk' },
  ],
  traceability: {
    qualityPrediction: 'Based on growth conditions, processing timeline, and historical data from this farm, batch quality is projected at 92/100. THC levels expected within 17.5-19.2% range.',
    distributionWindow: 'Optimal distribution window: within 30 days of packaging completion. CBD potency degrades 0.3% per week after 45 days.',
    exportReadiness: 'This batch meets 8 of 9 international export requirements. Pending: final GMP packaging certification.',
  },
  revenue: {
    forecast: 'Q2 2026 revenue projected at PKR 92M based on current license pipeline and renewal schedule. 3 high-value manufacturing applications expected to convert, adding PKR 24M in fees. Penalty collection rate improving — up 4.2% from Q1.',
  },
  agencies: {
    syncHealth: 'All primary intelligence feeds operational. ANF data exchange running at 99.7% uptime. Balochistan Excise connection dropped 7 days ago — automated retry scheduled. ISI feed latency within acceptable range (< 2 hours). Recommend manual reconnection for BL-ET before next Board meeting.',
  },
}
