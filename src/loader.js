import {
  DB_RESOURCES, DB_MEMBERSHIPS, DB_BRANCHES,
  DB_EVENTS, DB_ACCOUNTS, DB_USERS,
  SET_LOADING_MSG, SET_RESOURCE, SET_PAGE,
  SET_MEMBERSHIPS, SET_BRANCHES, SET_EVENTS, SELECT_EVENT,
  SET_ACCOUNT, SET_USER, SELECT_USER, PAGE,
  sleep
} from './common'

/**
 * Create initial Vuex app state.
 * @param {object} config
 * @param {object} firebase
 */
const initialState = (config, firebase) => {
  return {
    firebase,
    site: {
      page: PAGE.LOADING,
      prev: [],
      selectedUser: {},
      selectedEvent: {},
      loadingMessage: config.messages.loadingApp,
      nodeEnv: process.env.NODE_ENV
    },
    resources: {},
    memberships: {},
    branches: {},
    events: {},
    accounts: {},
    users: [],
    me: {},
    PAGE
  }
}

/**
 * Load data and show sign in page.
 * @param {object} config
 * @param {Vuex.Store} store
 */
const showSignInPage = async (config, store) => {
  const db = store.state.firebase.firestore()
  // Start to load stored data.
  store.commit(SET_LOADING_MSG, config.messages.loadingData)
  // Load resources -- synchronous.
  let querySnapshot = await db.collection(DB_RESOURCES).get()
  store.commit(SET_RESOURCE, querySnapshot)
  // Show the sign in page.
  store.commit(SET_PAGE, PAGE.SIGN_IN)
}

/**
 * Load data and show main form page.
 * @param {object} config
 * @param {Vuex.Store} store
 */
const showMainFormPage = async (config, store) => {
  const db = store.state.firebase.firestore()
  // Wait and get the registered account data -- synchronous.
  const account = await getRegisteredAccount(config, store, db)
  // Start to load stored data and show the main form page.
  store.commit(SET_LOADING_MSG, config.messages.loadingData)
  // Load resources asynchronous with realtime updates.
  db.collection(DB_RESOURCES).onSnapshot(querySnapshot => {
    store.commit(SET_RESOURCE, querySnapshot)
    showMainForm(store)
  })
  // Get the list of membership sorts -- asynchronous with realtime updates.
  db.collection(DB_MEMBERSHIPS).onSnapshot(querySnapshot => {
    store.commit(SET_MEMBERSHIPS, querySnapshot)
    showMainForm(store)
  })
  // Get the list of branches -- asynchronous with realtime updates.
  db.collection(DB_BRANCHES).onSnapshot(querySnapshot => {
    store.commit(SET_BRANCHES, querySnapshot)
    showMainForm(store)
  })
  // Get the list of events -- asynchronous with realtime updates.
  db.collection(DB_EVENTS).onSnapshot(querySnapshot => {
    store.commit(SET_EVENTS, querySnapshot)
    store.commit(
      SELECT_EVENT,
      store.state.events.reduce(
        (ret, event) => event.status === 'active' ? event : ret, null
      )
    )
    showMainForm(store)
  })
  // If the account has admin privilege.
  if (account.data().admin) {
    // Get the list of all accounts -- asynchronous with realtime updates.
    db.collection(DB_ACCOUNTS).onSnapshot(querySnapshot => {
      querySnapshot.forEach(function (doc) {
        store.commit(SET_ACCOUNT, doc)
      })
      showMainForm(store)
    })
    // Get the list of all users -- asynchronous with realtime updates.
    db.collection(DB_USERS).onSnapshot(setUsers(store))

  // If the account doesn't have admin privilege.
  } else {
    // Get the account data of the account -- asynchronous with realtime updates.
    db.collection(DB_ACCOUNTS).doc(store.state.me.uid).onSnapshot(doc => {
      store.commit(SET_ACCOUNT, account)
      showMainForm(store)
    })
    // Get the user data of the account -- asynchronous with realtime updates.
    db.collection(DB_USERS)
    .where('uid', '==', store.state.me.uid).onSnapshot(setUsers(store))
  }
}

/**
 * Wait and get the registered account data -- synchronous.
 * @param {object} config
 * @param {object} db
 * @param {string} uid
 */
const getRegisteredAccount = async (config, store, db) => {
  while (true) {
    try {
      let account = await db.collection(DB_ACCOUNTS).doc(store.state.me.uid).get()
      if (account && account.exists) {
        console.log(account)
        return account
      } else {
        store.commit(SET_LOADING_MSG, config.messages.regAccount)
        sleep(500)
      }
    } catch (error) {
      console.log(error)
      return
    }
  }
}

/**
 * Set the list of users.
 * @param {Vuex.Store} store
 * @param {object} querySnapshot
 */
const setUsers = store => querySnapshot => {
  querySnapshot.forEach(function (doc) {
    store.commit(SET_USER, doc)
  })
  store.commit(SELECT_USER, store.state.me)
  showMainForm(store)
}

/**
 * Wait data loaded and show the main form page.
 * @param {Vuex.Store} store
 */
const showMainForm = (store) => {
  if (Object.keys(store.state.me).length &&
      Object.keys(store.state.resources).length &&
      Object.keys(store.state.memberships).length &&
      Object.keys(store.state.branches).length &&
      Object.keys(store.state.events).length &&
      Object.keys(store.state.accounts).length) {
    store.commit(SET_PAGE, PAGE.MAIN_FORM)
  }
}

export default {
  initialState,
  showSignInPage,
  showMainFormPage
}
