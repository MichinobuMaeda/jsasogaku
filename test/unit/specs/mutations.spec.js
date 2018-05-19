import mutations from '@/mutations'

// const createDoc = obj => {
//   let {key, ...doc} = obj
//   return {
//     id: key,
//     data: () => doc
//   }
// }

// const user0 = {
//   key: 'id0001',
//   uid: 'uid001',
//   name: 'User 0',
//   membership: 'm01',
//   branch: 'b01',
//   zip: '012-3456',
//   address: 'address 0',
//   tel: null,
//   fax: null,
//   cell: null,
//   email: 'aaa@bbb.ccc',
//   note: null,
//   events: null || {},
//   ver: 1,
//   createdAt: new Date('2018-01-01'),
//   updatedAt: new Date('2018-01-01')
// }

describe('orderByKey', () => {
  it('should sort by key.', () => {
    expect(
      mutations.orderByKey(null)
    ).toBeNull()
    expect(
      mutations.orderByKey([
        {key: '002', name: 'name02', val: 'val002'},
        {key: '001', name: 'name01', val: 'val001'}
      ])
    ).toEqual([
      {key: '001', name: 'name01', val: 'val001'},
      {key: '002', name: 'name02', val: 'val002'}
    ])
  })
})
