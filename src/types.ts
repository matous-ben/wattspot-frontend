export type Level = 'negative' | 'cheap' | 'mid' | 'expensive'

export type PricePoint = {
  hour: number
  price: number
}

export type DayPrices = {
  date: string
  points: PricePoint[]
}

export type PvPoint = {
  hour: number
  kw: number
}

export type Appliance = {
  id: string
  name: string
  powerKw: number
  durationH: number
  enabled: boolean
  icon: 'washing-machine' | 'plug' | 'zap'
}

export type User = {
  email: string
  hasPv: boolean
  postalCode: string
  pv?: {
    kwp: number
    orientation: 'south' | 'east-west' | 'south-east'
    tiltDeg: number
  }
}

export type Recommendation = {
  applianceId: string
  startHour: number
  endHour: number
  avgPrice: number
  nowPrice: number
  savingKc: number
  pvCoverPct?: number
}
