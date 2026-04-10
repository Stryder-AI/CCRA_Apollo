'use client'

import { useApplicationWizardStore } from '@/store/useApplicationWizardStore'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { DrugSpecific } from '@/types/license'

const defaults: DrugSpecific = {
  drapComplianceDetails: '',
  drugFormulation: '',
}

export function StepDrugDetails() {
  const { typeSpecificFields, setTypeSpecificFields } = useApplicationWizardStore()
  const data: DrugSpecific = typeSpecificFields?.category === 'CANNABIS_DRUG' ? typeSpecificFields.data : defaults
  const update = (updates: Partial<DrugSpecific>) => {
    setTypeSpecificFields({ category: 'CANNABIS_DRUG', data: { ...data, ...updates } })
  }

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 text-xs text-muted-foreground">
        <strong className="text-blue-500">Note:</strong> Cannabis Drug Licences require compliance with both CCRA and Drug Regulatory Authority of Pakistan (DRAP) regulations.
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm">DRAP Compliance Details <span className="text-red-400">*</span></Label>
        <Textarea value={data.drapComplianceDetails} onChange={(e) => update({ drapComplianceDetails: e.target.value })} placeholder="Describe DRAP registration status, existing drug manufacturing licences, and compliance with pharmaceutical regulations..." rows={4} />
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm">Drug Formulation Details <span className="text-red-400">*</span></Label>
        <Textarea value={data.drugFormulation} onChange={(e) => update({ drugFormulation: e.target.value })} placeholder="Describe the pharmaceutical cannabis products to be manufactured, active ingredients, dosage forms, and intended medical use..." rows={4} />
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm">Clinical Trial Data</Label>
        <Textarea value={data.clinicalTrialData ?? ''} onChange={(e) => update({ clinicalTrialData: e.target.value })} placeholder="Reference any clinical trial data supporting the drug formulation (if available)..." rows={3} />
      </div>
    </div>
  )
}
