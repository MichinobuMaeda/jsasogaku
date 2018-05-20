import {
  sleep, padDigits, createSparseList, orderByKey
} from '@/common'

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

describe('padDigits', () => {
  it('should formant a number with 0 padding.', () => {
    expect(padDigits(0, 0)).toEqual('0')
    expect(padDigits(0, 1)).toEqual('0')
    expect(padDigits(0, 2)).toEqual('00')
    expect(padDigits(1, 0)).toEqual('1')
    expect(padDigits(1, 1)).toEqual('1')
    expect(padDigits(1, 2)).toEqual('01')
    expect(padDigits(12, 0)).toEqual('12')
    expect(padDigits(12, 1)).toEqual('12')
    expect(padDigits(12, 2)).toEqual('12')
    expect(padDigits(12, 3)).toEqual('012')
  })
})

describe('createSparseList', () => {
  it('should Create the array has keys' +
    ' from minCount to maxCount with a prefix and a suffix,' +
    ' and apply the original list values.', () => {
    expect(
      createSparseList([
        {key: 'a0b', text: 't0'},
        {key: 'a3b', text: 't3'}
      ], 0, 3, 'a', 1, 'b')
    ).toEqual([
      {key: 'a0b', text: 't0'},
      {key: 'a1b'},
      {key: 'a2b'},
      {key: 'a3b', text: 't3'}
    ])
    expect(
      createSparseList([
        {key: 'a0', text: 't0'},
        {key: 'a3', text: 't3'}
      ], 0, 3, 'a', 1)
    ).toEqual([
      {key: 'a0', text: 't0'},
      {key: 'a1'},
      {key: 'a2'},
      {key: 'a3', text: 't3'}
    ])
    expect(
      createSparseList([
        {key: '0b', text: 't0'},
        {key: '3b', text: 't3'},
        {key: '4b', text: 't4'}
      ], 0, 3, null, 1, 'b')
    ).toEqual([
      {key: '0b', text: 't0'},
      {key: '1b'},
      {key: '2b'},
      {key: '3b', text: 't3'}
    ])
  })
})

describe('orderByKey', () => {
  it('should sort by key.', () => {
    expect(
      orderByKey(null)
    ).toBeNull()
    expect(
      orderByKey([
        {key: '002', name: 'name02', val: 'val002'},
        {key: '001', name: 'name01', val: 'val001'}
      ])
    ).toEqual([
      {key: '001', name: 'name01', val: 'val001'},
      {key: '002', name: 'name02', val: 'val002'}
    ])
  })
})
