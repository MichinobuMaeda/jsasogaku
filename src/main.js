import 'es6-promise/auto'
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import config from './config'
import Firebase from 'firebase'
import 'firebase/firestore'
import {
  DB_RESOURCES, DB_MEMBERSHIPS, DB_BRANCHES,
  DB_EVENTS, DB_ACCOUNTS, DB_USERS, EMAIL_FOR_SIGN_IN,
  SET_LOADING_MSG, SET_ME, SET_RESOURCE, SET_PAGE,
  SET_MEMBERSHIPS, SET_BRANCHES, SET_EVENTS,
  SELECT_EVENT, SET_ACCOUNT, SET_ACCOUNTS, SET_USERS, PAGE,
  sleep, getFirestore, getMyUserId
} from './common'
import mutations from './mutations'

// Configure the Firebase client.
const firebase = Firebase.initializeApp(config[process.env.NODE_ENV].firebase)

// Configure the Vue app.
Vue.use(Vuex)
Vue.use(Vuetify)
Vue.config.productionTip = false

// Configure the Vuex store.
const store = new Vuex.Store({
  state: {
    firebase,
    site: {
      page: PAGE.LOADING,
      prev: [],
      activeEvent: null,
      activeUser: null,
      wait: {},
      loadingMessage: config.messages.loadingApp
    },
    resources: {},
    memberships: [],
    branches: [],
    events: [],
    accounts: {},
    users: [],
    me: {},
    PAGE
  },
  mutations
})

// Initialize the Vue app.
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>',
  data: {}
})

// If The URL is the link of "sign in with email",
if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
  // Do "sign in with email" and reload the app.
  Promise.resolve().then(() => confirmSignIn(store))

// If The URL is not the link of "sign in with email",
} else {
  // Get the auth info.
  firebase.auth().onAuthStateChanged(async function (auth) {
    // Set the account signed in.
    store.commit(SET_ME, auth)

    // If no auth info,
    if (!auth) {
      // Load data and show sign in page.
      Promise.resolve().then(() => showSignIn(config, store))

    // If auth info,
    } else {
      // Load data and show main form page.
      Promise.resolve().then(() => showMain(config, store))
    }
  })
}

/**
 * Do "sign in with email" and return to the app.
 */
const confirmSignIn = async (store) => {
  const db = getFirestore(store.state.firebase)
  store.commit(SET_LOADING_MSG, config.messages.loadingData)
  let querySnapshot = await db.collection(DB_RESOURCES).get()
  store.commit(SET_RESOURCE, querySnapshot)
  store.commit(SET_LOADING_MSG, store.state.resources.statusProcAuth)
  try {
    // Get the saved email address for auth.
    let email = window.localStorage.getItem(EMAIL_FOR_SIGN_IN)
    if (!email) {
      window.alert(store.state.resources.errorAuthEmailNotSaved)
    } else {
      // Validate the email address.
      await firebase.auth().signInWithEmailLink(email, window.location.href)
      // Delete the saved email address.
      window.localStorage.removeItem(EMAIL_FOR_SIGN_IN)
    }
  } catch (error) {
    store.commit(SET_LOADING_MSG, store.state.resources.errorAuthFailed)
    window.alert(error)
  } finally {
    // Reload the app.
    window.location.href = '/'
  }
}

/**
 * Load data and show sign in page.
 * @param {object} config
 * @param {Vuex.Store} store
 */
const showSignIn = async (config, store) => {
  const db = getFirestore(store.state.firebase)
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
const showMain = async (config, store) => {
  const db = getFirestore(store.state.firebase)
  // Wait and get the registered account data -- synchronous.
  const account = await getRegisteredAccount(config, store, db)
  // Start to load stored data and show the main form page.
  store.commit(SET_LOADING_MSG, config.messages.loadingData)
  // Load resources asynchronous with realtime updates.
  store.state.site.wait[DB_RESOURCES] = true
  db.collection(DB_RESOURCES).onSnapshot(querySnapshot => {
    store.commit(SET_RESOURCE, querySnapshot)
    delete store.state.site.wait[DB_RESOURCES]
    showMainPage(store)
  })
  // Get the list of membership sorts -- asynchronous with realtime updates.
  store.state.site.wait[DB_MEMBERSHIPS] = true
  db.collection(DB_MEMBERSHIPS).onSnapshot(querySnapshot => {
    store.commit(SET_MEMBERSHIPS, querySnapshot)
    delete store.state.site.wait[DB_MEMBERSHIPS]
    showMainPage(store)
  })
  // Get the list of branches -- asynchronous with realtime updates.
  store.state.site.wait[DB_BRANCHES] = true
  db.collection(DB_BRANCHES).onSnapshot(querySnapshot => {
    store.commit(SET_BRANCHES, querySnapshot)
    delete store.state.site.wait[DB_BRANCHES]
    showMainPage(store)
  })
  // Get the list of events -- asynchronous with realtime updates.
  store.state.site.wait[DB_EVENTS] = true
  db.collection(DB_EVENTS).onSnapshot(querySnapshot => {
    store.commit(SET_EVENTS, querySnapshot)
    store.commit(
      SELECT_EVENT,
      store.state.events.reduce(
        (ret, event) => event.status === 'active' ? event.key : ret, null
      )
    )
    delete store.state.site.wait[DB_EVENTS]
    showMainPage(store)
  })
  // If the account has admin privilege.
  if (account.data().admin) {
    // Get the list of all accounts -- asynchronous with realtime updates.
    store.state.site.wait[DB_ACCOUNTS] = true
    db.collection(DB_ACCOUNTS).onSnapshot(querySnapshot => {
      store.commit(SET_ACCOUNTS, querySnapshot)
      delete store.state.site.wait[DB_ACCOUNTS]
      showMainPage(store)
    })
    // Get the list of all users -- asynchronous with realtime updates.
    store.state.site.wait[DB_USERS] = true
    db.collection(DB_USERS).orderBy('branch', 'asc').orderBy('name', 'asc')
    .onSnapshot(querySnapshot => {
      store.commit(SET_USERS, querySnapshot)
      delete store.state.site.wait[DB_USERS]
      showMainPage(store)
    })

  // If the account doesn't have admin privilege.
  } else {
    // Get the account data of the account -- asynchronous with realtime updates.
    store.state.site.wait[DB_ACCOUNTS] = true
    db.collection(DB_ACCOUNTS).doc(store.state.me.uid).onSnapshot(doc => {
      store.commit(SET_ACCOUNT, account)
      delete store.state.site.wait[DB_ACCOUNTS]
      showMainPage(store)
    })
    // Get the user data of the account -- asynchronous with realtime updates.
    store.state.site.wait[DB_USERS] = true
    db.collection(DB_USERS)
    .where('uid', '==', store.state.me.uid).orderBy('branch', 'asc').orderBy('name', 'asc')
    .onSnapshot(querySnapshot => {
      store.commit(SET_USERS, querySnapshot)
      delete store.state.site.wait[DB_USERS]
      showMainPage(store)
    })
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
        return account
      }
    } catch (error) {
    }
    store.commit(SET_LOADING_MSG, config.messages.regAccount)
    sleep(500)
  }
}

/**
 * Wait data loaded and show the main form page.
 * @param {Vuex.Store} store
 */
const showMainPage = (store) => {
  if (Object.keys(store.state.site.wait).length === 0 &&
      store.state.site.page === PAGE.LOADING) {
    if (!getMyUserId(store.state)) {
      store.commit(SET_PAGE, PAGE.USER_EDIT)
    } else {
      store.commit(SET_PAGE, PAGE.USER_SHOW)
    }
  }
}
