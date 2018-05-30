import {PAGE, orderByKey} from './common'

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
 * @param {object} key
 */
const selectUser = (state, key) => {
  state.site = {
    ...state.site,
    activeUser: key
  }
}

/**
 * Set the subjected event.
 * @param {object} state Vuex app state.
 * @param {object} key
 */
const selectEvent = (state, key) => {
  state.site = {
    ...state.site,
    activeEvent: key
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
      ...doc.data()
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
      ...doc.data()
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
  state.events = orderByKey(arr).reverse()
}

/**
 * Set the list of users.
 * @param {object} state Vuex app state.
 * @param {object} doc
 */
const setUser = (state, doc) => {
  state.users = state.users || []
  let user = {
    key: doc.id,
    ...doc.data()
  }
  user.events = user.events || {}
  state.users = [
    user,
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
    valid: doc.data().valid,
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
  if (account && account.uid) {
    state.me = {
      uid: account.uid,
      email: account.email || ''
    }
  } else {
    state.me = {}
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
