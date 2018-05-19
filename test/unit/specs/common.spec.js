import {sleep} from '@/common'

describe('sleep', () => {
  it('should sleep for given milliseconds.', async () => {
    const ts1 = new Date().getTime()
    await sleep(500)
    expect(
      new Date().getTime()
    ).toBeGreaterThanOrEqual(
      ts1 + 500
    )
  })
})
