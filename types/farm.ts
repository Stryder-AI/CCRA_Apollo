export type FarmStatus = 'active' | 'pending' | 'suspended' | 'revoked'

export interface Farm {
  id: string
  name: string
  ownerName: string
  licenseNumber: string
  region: string
  province: string
  coordinates: [number, number]
  boundaryCoords?: [number, number][]
  sizeHectares: number
  strain: string
  status: FarmStatus
  registeredDate: string
  lastInspection?: string
  complianceScore?: number
  yieldEstimateTons?: number
  notes?: string
}

export interface FarmFilters {
  search: string
  region: string
  status: string
  strain: string
}
