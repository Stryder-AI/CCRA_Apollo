// CNIC: 13 digits in format XXXXX-XXXXXXX-X
export const CNIC_REGEX = /^\d{5}-\d{7}-\d$/
export function isValidCNIC(value: string): boolean {
  return CNIC_REGEX.test(value)
}

// NTN: 7-digit number with optional hyphens
export const NTN_REGEX = /^\d{7}(-\d)?$/
export function isValidNTN(value: string): boolean {
  return NTN_REGEX.test(value)
}

// SECP Registration: alphanumeric, typically like 0012345
export const SECP_REGEX = /^[A-Z0-9]{4,15}$/i
export function isValidSECP(value: string): boolean {
  return SECP_REGEX.test(value)
}

// Pakistan phone: +92 or 03XX format
export const PK_PHONE_REGEX = /^(\+92|0)\d{10}$/
export function isValidPakistanPhone(value: string): boolean {
  return PK_PHONE_REGEX.test(value.replace(/[\s-]/g, ''))
}

// GPS within Pakistan bounds (approx)
export function isWithinPakistan(lat: number, lng: number): boolean {
  return lat >= 23.5 && lat <= 37.5 && lng >= 60.0 && lng <= 77.5
}

// File size validation
export function isValidFileSize(sizeBytes: number, maxMB: number): boolean {
  return sizeBytes <= maxMB * 1024 * 1024
}

// File type validation
export function isValidFileType(fileName: string, acceptedTypes: string[]): boolean {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? ''
  return acceptedTypes.some((t) => t.toLowerCase().replace('.', '') === ext)
}
