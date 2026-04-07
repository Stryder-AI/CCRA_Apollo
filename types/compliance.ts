export type InspectionStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled'

export type SeverityLevel = 'Minor' | 'Major' | 'Critical'

export type ViolationStatus = 'open' | 'resolved' | 'under-appeal'

export interface Inspection {
  id: string
  farmId: string
  farmName: string
  inspectorName: string
  scheduledDate: string
  completedDate?: string
  status: InspectionStatus
  complianceScore?: number
  findings?: string
  region: string
}

export interface Violation {
  id: string
  farmId: string
  farmName: string
  licenseNumber: string
  inspectionId?: string
  type: string
  severity: SeverityLevel
  description: string
  detectedDate: string
  resolvedDate?: string
  status: ViolationStatus
  penaltyPKR?: number
}

export interface ActivityItem {
  id: string
  type: 'farm_registered' | 'license_issued' | 'inspection_completed' | 'violation_detected' | 'license_renewed' | 'farm_suspended' | 'inspection_scheduled' | 'compliance_updated'
  title: string
  description: string
  timestamp: string
  icon?: string
}

export interface Alert {
  id: string
  type: 'warning' | 'danger' | 'info'
  title: string
  message: string
  timestamp: string
  read: boolean
}
