import priceFixtures from './prices.json'
import type { DayPrices } from '../types'

export async function getPrices(
  day: 'today' | 'tomorrow',
): Promise<DayPrices | null> {
  await new Promise<void>((resolve) => setTimeout(resolve, 800))

  if (day === 'tomorrow' && new Date().getHours() < 14) {
    return null
  }

  return priceFixtures[day]
}
