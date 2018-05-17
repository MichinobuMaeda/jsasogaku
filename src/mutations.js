import {PAGE} from './common'

/**
 * Do type-casting: a user doc of firestore to a plain object.
 * @param {object} doc the user object
 */
const normalizeUserDoc = (doc) => {
  return {
    id: doc.id,
    uid: doc.data().uid,
    name: doc.data().name,
    membership: doc.data().membership,
    branch: doc.data().branch,
    zip: doc.data().zip,
    address: doc.data().address,
    tel: doc.data().tel,
    fax: doc.data().fax,
    cell: doc.data().cell,
    email: doc.data().email,
    note: doc.data().note,
    events: doc.data().events || {},
    ver: doc.data().ver,
    createdAt: doc.data().createdAt,
    updatedAt: doc.data().updatedAt
  }
}

/**
 * Sort by key
 * @param {array} arr the array of objects with 'key' attribute.
 */
function orderByKey (arr) {
  return arr.map((item, i) => item.key).sort().map(key => arr.reduce(
    (ret, cur) => cur.key === key ? cur : ret, null)
  )
}

/**
 * Set the next page and save the history.
 * @param {object} state Vuex app state.
 * @param {object} page
 */
const setPage = (state, page) => {
  if (page && state.site.page !== page) {
    state.site = {
      ...state.site,
      prev: (
        state.site.page === PAGE.LOADING ||
        (
          state.site.prev.length &&
          state.site.prev[state.site.prev.length - 1] !== state.site.page
        )
      ) ? state.site.prev
        : state.site.prev.concat(state.site.page),
      page
    }
  }
}

/**
 * Back to the previous page.
 * @param {object} state Vuex app state.
 */
const backPage = state => {
  let prev = state.site.prev.pop()
  state.site = {
    ...state.site,
    prev: [...state.site.prev],
    page: prev
  }
}

/**
 * Set page loading messages.
 * @param {object} state Vuex app state.
 * @param {object} msg
 */
const setLoadingMessage = (state, msg) => {
  state.site = {
    ...state.site,
    loadingMessage: msg
  }
}

/**
 * Set the subjected user.
 * @param {object} state Vuex app state.
 * @param {object} user
 */
const selectUser = (state, user) => {
  state.site = {
    ...state.site,
    selectedUser: state.users.reduce(
      (ret, cur) => (user && cur.uid === user.uid)
        ? {
          ...cur,
          events: JSON.parse(JSON.stringify(cur.events))
        }
        : ret,
      {
        id: null,
        uid: user ? user.uid : null,
        name: '',
        membership: null,
        branch: null,
        zip: '',
        address: '',
        tel: '',
        fax: '',
        cell: '',
        email: user ? user.email : '',
        note: '',
        events: {},
        ver: 0,
        createdAt: null,
        updatedAt: null
      }
    )
  }
}

/**
 * Set the subjected event.
 * @param {object} state Vuex app state.
 * @param {object} event
 */
const selectEvent = (state, event) => {
  state.site = {
    ...state.site,
    selectedEvent: event
  }
}

/**
 * Set resources.
 * @param {object} state Vuex app state.
 * @param {object} querySnapshot
 */
const setResources = (state, querySnapshot) => {
  state.resources = {}
  querySnapshot.forEach(function (doc) {
    state.resources[doc.id] = doc.data().text
  })
}

/**
 * Set the list of membership types.
 * @param {object} state Vuex app state.
 * @param {object} querySnapshot
 */
const setMemberships = (state, querySnapshot) => {
  let arr = []
  querySnapshot.forEach(function (doc) {
    arr.push({
      key: doc.id,
      text: doc.data().name
    })
  })
  state.memberships = orderByKey(arr)
}

/**
 * Set the list of branches.
 * @param {object} state Vuex app state.
 * @param {object} querySnapshot
 */
const setBranches = (state, querySnapshot) => {
  let arr = []
  querySnapshot.forEach(function (doc) {
    arr.push({
      key: doc.id,
      text: doc.data().name
    })
  })
  state.branches = orderByKey(arr)
}

/**
 * Set the list fo events.
 * @param {object} state Vuex app state.
 * @param {object} querySnapshot
 */
const setEvents = (state, querySnapshot) => {
  let arr = []
  querySnapshot.forEach(function (doc) {
    arr.push({
      key: doc.id,
      name: doc.data().name,
      desc: doc.data().desc,
      status: doc.data().status,
      items: orderByKey(Object.keys(doc.data().items).sort().map(
        key => doc.data().items[key].list
          ? {
            key,
            ...doc.data().items[key],
            list: [...doc.data().items[key].list.map(obj => ({...obj}))]
          }
          : {
            key,
            ...doc.data().items[key]
          }
      ))
    })
  })
  state.events = orderByKey(arr)
}

/**
 * Set the list of users.
 * @param {object} state Vuex app state.
 * @param {object} doc
 */
const setUser = (state, doc) => {
  state.users = state.users || []
  state.users = [
    normalizeUserDoc(doc),
    ...state.users.filter(user => user.uid !== doc.data().uid)
  ]
}

/**
 * Set the list of accounts.
 * @param {object} state Vuex app state.
 * @param {object} doc
 */
const setAccount = (state, doc) => {
  state.accounts = state.accounts || []
  state.accounts[doc.id] = {
    admin: doc.data().admin,
    email: doc.data().email,
    createdAt: doc.data().createdAt,
    updatedAt: doc.data().updatedAt
  }
}

/**
 * Set the account signed in.
 * @param {object} state Vuex app state.
 * @param {object} account
 */
const setMe = (state, account) => {
  if (account) {
    state.me = {
      uid: account.uid,
      email: account.email
    }
  } else {
    state.me = {}
    state.memberships = {}
    state.branches = {}
    state.events = {}
    setPage(state, PAGE.LOADING)
  }
}

export default {
  setPage,
  backPage,
  setLoadingMessage,
  selectUser,
  selectEvent,
  setResources,
  setMemberships,
  setBranches,
  setEvents,
  setUser,
  setAccount,
  setMe
}
