import {
  sleep, padDigits, createSparseList, orderByKey, getValue,
  getActiveUser, getActiveEvent, getFirestore
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

describe('getValue', () => {
  it('should return the boolean value from a boolean like string.', () => {
    expect(getValue('true')).toEqual(true)
    expect(getValue('false')).toEqual(false)
    expect(getValue('tRue')).toEqual(true)
    expect(getValue('faLse')).toEqual(false)
    expect(getValue('on')).toEqual(true)
    expect(getValue('off')).toEqual(false)
    expect(getValue('oN')).toEqual(true)
    expect(getValue('oFf')).toEqual(false)
    expect(getValue('yes')).toEqual(true)
    expect(getValue('no')).toEqual(false)
    expect(getValue('yEs')).toEqual(true)
    expect(getValue('nO')).toEqual(false)
    expect(getValue('t')).toEqual(true)
    expect(getValue('f')).toEqual(false)
    expect(getValue('T')).toEqual(true)
    expect(getValue('F')).toEqual(false)
    expect(getValue('y')).toEqual(true)
    expect(getValue('n')).toEqual(false)
    expect(getValue('Y')).toEqual(true)
    expect(getValue('N')).toEqual(false)
    expect(getValue('有')).toEqual(true)
    expect(getValue('無')).toEqual(false)
    expect(getValue('◯')).toEqual(true)
    expect(getValue('×')).toEqual(false)
  })
  it('should return the number value from a numeric string.', () => {
    expect(getValue('0')).toEqual(0)
    expect(getValue('1')).toEqual(1)
    expect(getValue('10')).toEqual(10)
    expect(getValue('-1')).toEqual(-1)
    expect(getValue('-10')).toEqual(-10)
    expect(getValue('1.0')).toEqual(1.0)
    expect(getValue('-1.0')).toEqual(-1.0)
    expect(getValue('1.')).toEqual(1.0)
    expect(getValue('-1.')).toEqual(-1.0)
    expect(getValue('0.1')).toEqual(0.1)
    expect(getValue('-0.1')).toEqual(-0.1)
    expect(getValue('.1')).toEqual(0.1)
    expect(getValue('-.1')).toEqual(-0.1)
  })
  it('should return the timestamp value of a ISO format string.', () => {
    expect(
      getValue('2017-12-31T13:58:59.123Z')
    ).toEqual(
      new Date('2017-12-31T13:58:59.123Z')
    )
    expect(
      getValue('2017-12-31T13:58:59Z')
    ).toEqual(
      new Date('2017-12-31T13:58:59.000Z')
    )
    expect(
      getValue('2017-12-31T13:58:59.123+09:00')
    ).toEqual(
      new Date('2017-12-31T04:58:59.123Z')
    )
    expect(
      getValue('2017-12-31T13:58:59.123-09:00')
    ).toEqual(
      new Date('2017-12-31T22:58:59.123Z')
    )
  })
  it('should ignore falsy value.', () => {
    expect(getValue(null)).toBeNull()
    expect(getValue(false)).toEqual(false)
    expect(getValue('')).toEqual('')
    expect(getValue(undefined)).toEqual(undefined)
  })
  it('should ignore unsupported format.', () => {
    expect(getValue('aaa')).toEqual('aaa')
    expect(getValue('2017-12-31T13:58:59+')).toEqual('2017-12-31T13:58:59+')
    expect(getValue(1)).toEqual(1)
  })
})
