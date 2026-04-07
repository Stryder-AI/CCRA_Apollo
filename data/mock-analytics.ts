export const yieldByRegion = [
  { region: 'Tirah Valley', yield: 32.9, farms: 3, avgPerFarm: 10.97 },
  { region: 'Swat', yield: 13.7, farms: 2, avgPerFarm: 6.85 },
  { region: 'Dir', yield: 28.1, farms: 2, avgPerFarm: 14.05 },
  { region: 'Chitral', yield: 10.8, farms: 1, avgPerFarm: 10.8 },
  { region: 'Malakand', yield: 11.3, farms: 1, avgPerFarm: 11.3 },
  { region: 'Buner', yield: 17.1, farms: 2, avgPerFarm: 8.55 },
  { region: 'Zhob', yield: 13.5, farms: 1, avgPerFarm: 13.5 },
  { region: 'Quetta', yield: 14.8, farms: 1, avgPerFarm: 14.8 },
  { region: 'Chagai', yield: 44.5, farms: 2, avgPerFarm: 22.25 },
  { region: 'Panjgur', yield: 10.8, farms: 1, avgPerFarm: 10.8 },
  { region: 'Khuzdar', yield: 15.2, farms: 1, avgPerFarm: 15.2 },
]

export const strainPerformance = [
  { strain: 'Pakistani Landrace', avgYield: 12.1, avgCompliance: 88, farms: 5 },
  { strain: 'Hindu Kush', avgYield: 13.2, avgCompliance: 92, farms: 3 },
  { strain: 'Balochi Gold', avgYield: 17.4, avgCompliance: 77, farms: 4 },
  { strain: 'Industrial Hemp (CBD)', avgYield: 15.1, avgCompliance: 94, farms: 3 },
  { strain: 'Medicinal Grade A', avgYield: 4.9, avgCompliance: 96, farms: 2 },
  { strain: 'Swat Valley Kush', avgYield: 7.9, avgCompliance: 91, farms: 2 },
  { strain: 'Chitral Purple', avgYield: 10.8, avgCompliance: 91, farms: 1 },
  { strain: 'Tirah Valley Green', avgYield: 14.9, avgCompliance: 88, farms: 2 },
  { strain: 'Malakand Express', avgYield: 0, avgCompliance: 0, farms: 1 },
  { strain: 'Peshawar Purple', avgYield: 0, avgCompliance: 0, farms: 1 },
]

export const climateCorrelation = [
  { rainfall: 250, yield: 8.2, region: 'Chagai' },
  { rainfall: 320, yield: 10.8, region: 'Panjgur' },
  { rainfall: 400, yield: 13.5, region: 'Zhob' },
  { rainfall: 450, yield: 14.8, region: 'Quetta' },
  { rainfall: 520, yield: 15.2, region: 'Khuzdar' },
  { rainfall: 680, yield: 12.5, region: 'Tirah Valley' },
  { rainfall: 750, yield: 11.3, region: 'Malakand' },
  { rainfall: 820, yield: 17.1, region: 'Buner' },
  { rainfall: 900, yield: 14.05, region: 'Dir' },
  { rainfall: 980, yield: 6.85, region: 'Swat' },
  { rainfall: 650, yield: 10.8, region: 'Chitral' },
]

export const complianceDistribution = [
  { range: '0-20', count: 0 },
  { range: '21-40', count: 1 },
  { range: '41-60', count: 2 },
  { range: '61-80', count: 0 },
  { range: '81-90', count: 6 },
  { range: '91-95', count: 5 },
  { range: '96-100', count: 3 },
]

export const monthlyRegistrations = [
  { month: 'Apr 25', registrations: 2 },
  { month: 'May 25', registrations: 3 },
  { month: 'Jun 25', registrations: 4 },
  { month: 'Jul 25', registrations: 5 },
  { month: 'Aug 25', registrations: 3 },
  { month: 'Sep 25', registrations: 2 },
  { month: 'Oct 25', registrations: 2 },
  { month: 'Nov 25', registrations: 1 },
  { month: 'Dec 25', registrations: 0 },
  { month: 'Jan 26', registrations: 2 },
  { month: 'Feb 26', registrations: 2 },
  { month: 'Mar 26', registrations: 1 },
]

export const regionalComparison = {
  kp: { farms: 15, totalYield: 113.9, avgCompliance: 82.7, revenue: 165000000, activeLicenses: 10 },
  balochistan: { farms: 10, totalYield: 98.8, avgCompliance: 83.4, revenue: 105000000, activeLicenses: 6 },
}
