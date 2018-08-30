import {setMe} from '@/store/mutations'

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

describe('setMe', () => {
  it('should set the account signed in.', () => {
    {
      let state = {}
      setMe(state, null)
      expect(state).toEqual({
        me: {}
      })
    }
    {
      let state = {}
      setMe(state, {
        uid: 'uid001',
        email: 'aaa@bbb.ccc',
        other: 'dummy'
      })
      expect(state).toEqual({
        me: {
          uid: 'uid001',
          email: 'aaa@bbb.ccc'
        }
      })
    }
    {
      let state = {}
      setMe(state, {
        email: 'aaa@bbb.ccc'
      })
      expect(state).toEqual({
        me: {}
      })
    }
    {
      let state = {}
      setMe(state, {
        uid: 'uid001'
      })
      expect(state).toEqual({
        me: {
          uid: 'uid001',
          email: ''
        }
      })
    }
  })
})
