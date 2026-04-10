// Province → District → Tehsil cascading location data for Pakistan
// Focus on KP and Balochistan (primary cannabis cultivation regions)

export interface TehsilData {
  name: string
}

export interface DistrictData {
  name: string
  tehsils: TehsilData[]
}

export interface ProvinceData {
  name: string
  code: string
  districts: DistrictData[]
}

export const PAKISTAN_PROVINCES: ProvinceData[] = [
  {
    name: 'Khyber Pakhtunkhwa',
    code: 'KP',
    districts: [
      {
        name: 'Khyber',
        tehsils: [
          { name: 'Tirah Valley' },
          { name: 'Landi Kotal' },
          { name: 'Bara' },
          { name: 'Jamrud' },
        ],
      },
      {
        name: 'Swat',
        tehsils: [
          { name: 'Mingora' },
          { name: 'Matta' },
          { name: 'Bahrain' },
          { name: 'Kabal' },
          { name: 'Babuzai' },
          { name: 'Khwazakhela' },
        ],
      },
      {
        name: 'Dir Lower',
        tehsils: [
          { name: 'Timergara' },
          { name: 'Balambat' },
          { name: 'Adenzai' },
          { name: 'Samarbagh' },
          { name: 'Talash' },
        ],
      },
      {
        name: 'Dir Upper',
        tehsils: [
          { name: 'Dir' },
          { name: 'Wari' },
          { name: 'Barawal' },
          { name: 'Sharingal' },
          { name: 'Ushirai' },
        ],
      },
      {
        name: 'Chitral',
        tehsils: [
          { name: 'Chitral' },
          { name: 'Drosh' },
          { name: 'Lotkoh' },
          { name: 'Mastuj' },
          { name: 'Torkhow' },
        ],
      },
      {
        name: 'Malakand',
        tehsils: [
          { name: 'Batkhela' },
          { name: 'Dargai' },
          { name: 'Thana' },
          { name: 'Sam Ranizai' },
        ],
      },
      {
        name: 'Buner',
        tehsils: [
          { name: 'Daggar' },
          { name: 'Gagra' },
          { name: 'Mandanr' },
          { name: 'Khudu Khel' },
          { name: 'Chamla' },
        ],
      },
      {
        name: 'Peshawar',
        tehsils: [
          { name: 'Peshawar City' },
          { name: 'Peshawar Saddar' },
          { name: 'Shah Alam' },
          { name: 'Mattani' },
        ],
      },
      {
        name: 'Mardan',
        tehsils: [
          { name: 'Mardan' },
          { name: 'Takht Bhai' },
          { name: 'Katlang' },
          { name: 'Shergarh' },
        ],
      },
      {
        name: 'Mansehra',
        tehsils: [
          { name: 'Mansehra' },
          { name: 'Balakot' },
          { name: 'Oghi' },
          { name: 'Baffa' },
        ],
      },
    ],
  },
  {
    name: 'Balochistan',
    code: 'BAL',
    districts: [
      {
        name: 'Quetta',
        tehsils: [
          { name: 'Quetta City' },
          { name: 'Quetta Saddar' },
          { name: 'Panjpai' },
        ],
      },
      {
        name: 'Zhob',
        tehsils: [
          { name: 'Zhob' },
          { name: 'Qamar Din Karez' },
          { name: 'Sambaza' },
        ],
      },
      {
        name: 'Chagai',
        tehsils: [
          { name: 'Chagai' },
          { name: 'Dalbandin' },
          { name: 'Nokkundi' },
          { name: 'Taftan' },
        ],
      },
      {
        name: 'Panjgur',
        tehsils: [
          { name: 'Panjgur' },
          { name: 'Gichk' },
          { name: 'Parom' },
        ],
      },
      {
        name: 'Khuzdar',
        tehsils: [
          { name: 'Khuzdar' },
          { name: 'Naal' },
          { name: 'Zehri' },
          { name: 'Wadh' },
        ],
      },
      {
        name: 'Kech',
        tehsils: [
          { name: 'Turbat' },
          { name: 'Buleda' },
          { name: 'Dasht' },
          { name: 'Tump' },
        ],
      },
      {
        name: 'Pishin',
        tehsils: [
          { name: 'Pishin' },
          { name: 'Barshore' },
          { name: 'Karezat' },
        ],
      },
    ],
  },
  {
    name: 'Punjab',
    code: 'PB',
    districts: [
      {
        name: 'Lahore',
        tehsils: [
          { name: 'Lahore City' },
          { name: 'Lahore Cantonment' },
          { name: 'Shalimar' },
          { name: 'Model Town' },
        ],
      },
      {
        name: 'Rawalpindi',
        tehsils: [
          { name: 'Rawalpindi' },
          { name: 'Taxila' },
          { name: 'Gujar Khan' },
          { name: 'Murree' },
        ],
      },
      {
        name: 'Faisalabad',
        tehsils: [
          { name: 'Faisalabad City' },
          { name: 'Faisalabad Saddar' },
          { name: 'Jaranwala' },
          { name: 'Tandlianwala' },
        ],
      },
      {
        name: 'Multan',
        tehsils: [
          { name: 'Multan City' },
          { name: 'Multan Saddar' },
          { name: 'Jalalpur Pirwala' },
          { name: 'Shujabad' },
        ],
      },
    ],
  },
  {
    name: 'Sindh',
    code: 'SD',
    districts: [
      {
        name: 'Karachi',
        tehsils: [
          { name: 'Karachi South' },
          { name: 'Karachi East' },
          { name: 'Karachi West' },
          { name: 'Karachi Central' },
          { name: 'Malir' },
        ],
      },
      {
        name: 'Hyderabad',
        tehsils: [
          { name: 'Hyderabad City' },
          { name: 'Hyderabad Rural' },
          { name: 'Latifabad' },
          { name: 'Qasimabad' },
        ],
      },
      {
        name: 'Sukkur',
        tehsils: [
          { name: 'Sukkur' },
          { name: 'Rohri' },
          { name: 'Salehpat' },
          { name: 'Pano Aqil' },
        ],
      },
    ],
  },
  {
    name: 'Islamabad Capital Territory',
    code: 'ICT',
    districts: [
      {
        name: 'Islamabad',
        tehsils: [
          { name: 'Islamabad' },
          { name: 'Sihala' },
          { name: 'Tarnol' },
          { name: 'Nilore' },
        ],
      },
    ],
  },
  {
    name: 'Gilgit-Baltistan',
    code: 'GB',
    districts: [
      {
        name: 'Gilgit',
        tehsils: [
          { name: 'Gilgit' },
          { name: 'Danyore' },
          { name: 'Juglot' },
        ],
      },
      {
        name: 'Hunza',
        tehsils: [
          { name: 'Karimabad' },
          { name: 'Aliabad' },
          { name: 'Gulmit' },
        ],
      },
    ],
  },
  {
    name: 'Azad Jammu & Kashmir',
    code: 'AJK',
    districts: [
      {
        name: 'Muzaffarabad',
        tehsils: [
          { name: 'Muzaffarabad' },
          { name: 'Patika' },
          { name: 'Athmuqam' },
        ],
      },
      {
        name: 'Mirpur',
        tehsils: [
          { name: 'Mirpur' },
          { name: 'Dadyal' },
          { name: 'Chakswari' },
        ],
      },
    ],
  },
]

// Helper functions
export function getProvinces(): string[] {
  return PAKISTAN_PROVINCES.map((p) => p.name)
}

export function getDistricts(province: string): string[] {
  const prov = PAKISTAN_PROVINCES.find((p) => p.name === province)
  return prov ? prov.districts.map((d) => d.name) : []
}

export function getTehsils(province: string, district: string): string[] {
  const prov = PAKISTAN_PROVINCES.find((p) => p.name === province)
  if (!prov) return []
  const dist = prov.districts.find((d) => d.name === district)
  return dist ? dist.tehsils.map((t) => t.name) : []
}
