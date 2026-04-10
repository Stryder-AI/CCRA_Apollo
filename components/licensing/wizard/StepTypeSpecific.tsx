'use client'

import { useApplicationWizardStore } from '@/store/useApplicationWizardStore'
import { StepCultivationDetails } from './type-specific/StepCultivationDetails'
import { StepProcessingDetails } from './type-specific/StepProcessingDetails'
import { StepTestingLabDetails } from './type-specific/StepTestingLabDetails'
import { StepDistributionDetails } from './type-specific/StepDistributionDetails'
import { StepRetailDetails } from './type-specific/StepRetailDetails'
import { StepResearchDetails } from './type-specific/StepResearchDetails'
import { StepExportImportDetails } from './type-specific/StepExportImportDetails'
import { StepHempDetails } from './type-specific/StepHempDetails'
import { StepDrugDetails } from './type-specific/StepDrugDetails'
import { getLicenseCategoryLabel } from '@/utils/license-helpers'

export function StepTypeSpecific() {
  const { category } = useApplicationWizardStore()

  if (!category) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Please select a licence type in Step 1 first.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Licence-Specific Details</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Provide the specific details required for your <strong>{getLicenseCategoryLabel(category)}</strong> application.
        </p>
      </div>

      {category === 'CULTIVATION' && <StepCultivationDetails />}
      {category === 'PROCESSING_EXTRACTION' && <StepProcessingDetails />}
      {category === 'TESTING_LABORATORY' && <StepTestingLabDetails />}
      {category === 'DISTRIBUTION_TRANSPORT' && <StepDistributionDetails />}
      {category === 'RETAIL_DISPENSARY' && <StepRetailDetails />}
      {category === 'RESEARCH' && <StepResearchDetails />}
      {category === 'EXPORT_IMPORT' && <StepExportImportDetails />}
      {category === 'INDUSTRIAL_HEMP' && <StepHempDetails />}
      {category === 'CANNABIS_DRUG' && <StepDrugDetails />}
    </div>
  )
}
