import { afterEach, describe, expect, it, vi } from 'vitest'
import priceFixtures from '../data/prices.json'
import { getPrices } from '../data/api'

afterEach(() => {
  vi.useRealTimers()
})

describe('mock price data', () => {
  it('contains 24 ordered hourly prices for each day', () => {
    for (const day of ['today', 'tomorrow'] as const) {
      const points = priceFixtures[day].points

      expect(points).toHaveLength(24)
      expect(points.map(({ hour }) => hour)).toEqual(
        Array.from({ length: 24 }, (_, hour) => hour),
      )
      expect(points.every(({ price }) => Number.isFinite(price))).toBe(true)
    }

    expect(
      priceFixtures.tomorrow.points.some(({ price }) => price < 0),
    ).toBe(true)
  })
})

describe('getPrices', () => {
  it('returns today after the simulated loading delay', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 10, 26, 13))

    const request = getPrices('today')
    let completed = false
    void request.then(() => {
      completed = true
    })

    await vi.advanceTimersByTimeAsync(799)
    expect(completed).toBe(false)

    await vi.advanceTimersByTimeAsync(1)
    await expect(request).resolves.toEqual(priceFixtures.today)
  })

  it('returns null for tomorrow before 14:00', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 10, 26, 13))

    const request = getPrices('tomorrow')
    await vi.advanceTimersByTimeAsync(800)

    await expect(request).resolves.toBeNull()
  })

  it('returns tomorrow from 14:00 onward', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 10, 26, 14))

    const request = getPrices('tomorrow')
    await vi.advanceTimersByTimeAsync(800)

    await expect(request).resolves.toEqual(priceFixtures.tomorrow)
  })
})
