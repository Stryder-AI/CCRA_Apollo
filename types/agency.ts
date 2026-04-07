export interface Agency {
  id: string
  name: string
  abbreviation: string
  type: 'intelligence' | 'enforcement' | 'regulatory' | 'provincial' | 'research'
  status: 'connected' | 'pending' | 'offline'
  lastSync: string
  dataShared: number
  dataReceived: number
  accessLevel: 'full' | 'limited' | 'read-only'
  contactPerson?: string
  encryptionLevel: string
}

export interface DataExchangeLog {
  id: string
  agencyId: string
  agencyName: string
  direction: 'inbound' | 'outbound'
  dataType: string
  timestamp: string
  recordCount: number
  status: 'success' | 'failed' | 'pending'
  encryptionVerified: boolean
}
