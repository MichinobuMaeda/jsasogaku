import 'es6-promise/auto'
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import config from './config'
import {DB, EMAIL_FOR_SIGN_IN, M, PAGE} from './constants'
import {sleep} from './common'
import store from './store'

// Configure the Vue app.
Vue.use(Vuetify)
Vue.config.productionTip = false

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
if (store.state.firebase.auth().isSignInWithEmailLink(window.location.href)) {
  // Do "sign in with email" and reload the app.
  Promise.resolve().then(() => confirmSignIn(store))

// If The URL is not the link of "sign in with email",
} else {
  // Get the auth info.
  store.state.firebase.auth().onAuthStateChanged(async function (auth) {
    // Set the account signed in.
    store.commit(M.SET_ME, auth)

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
  store.commit(M.SET_LOADING_MSG, config.messages.loadingData)
  let querySnapshot = await store.getters.collection(DB.RESOURCES).get()
  store.commit(M.SET_RESOURCE, querySnapshot)
  store.commit(M.SET_LOADING_MSG, store.state.resources.statusProcAuth)
  try {
    // Get the saved email address for auth.
    let email = window.localStorage.getItem(EMAIL_FOR_SIGN_IN)
    if (!email) {
      window.alert(store.state.resources.errorAuthEmailNotSaved)
    } else {
      // Validate the email address.
      await store.state.firebase.auth().signInWithEmailLink(
        email,
        window.location.href
      )
      // Delete the saved email address.
      window.localStorage.removeItem(EMAIL_FOR_SIGN_IN)
    }
  } catch (error) {
    store.commit(M.SET_LOADING_MSG, store.state.resources.errorAuthFailed)
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
  // Start to load stored data.
  store.commit(M.SET_LOADING_MSG, config.messages.loadingData)
  // Load resources -- synchronous.
  let querySnapshot = await store.getters.collection(DB.RESOURCES).get()
  store.commit(M.SET_RESOURCE, querySnapshot)
  // Show the sign in page.
  store.commit(M.SET_PAGE, PAGE.SIGN_IN)
}

/**
 * Load data and show main form page.
 * @param {object} config
 * @param {Vuex.Store} store
 */
const showMain = async (config, store) => {
  // Wait and get the registered account data -- synchronous.
  const account = await getRegisteredAccount(config, store)
  // Start to load stored data and show the main form page.
  store.commit(M.SET_LOADING_MSG, config.messages.loadingData)
  // Load resources asynchronous with realtime updates.
  getListAndWait(store, DB.RESOURCES, M.SET_RESOURCE)
  // Get the list of membership sorts -- asynchronous with realtime updates.
  getListAndWait(store, DB.MEMBERSHIPS, M.SET_MEMBERSHIPS)
  // Get the list of branches -- asynchronous with realtime updates.
  getListAndWait(store, DB.BRANCHES, M.SET_BRANCHES)
  // Get the list of events -- asynchronous with realtime updates.
  getListAndWait(store, DB.EVENTS, M.SET_EVENTS)
  // If the account has admin privilege.
  if (account.data().admin) {
    // Get the list of all accounts -- asynchronous with realtime updates.
    getListAndWait(store, DB.ACCOUNTS, M.SET_ACCOUNTS)
    // Get the list of all users -- asynchronous with realtime updates.
    store.state.site.wait[DB.USERS] = true
    store.getters.collection(DB.USERS).orderBy('branch', 'asc').orderBy('name', 'asc')
    .onSnapshot(querySnapshot => {
      store.commit(M.SET_USERS, querySnapshot)
      delete store.state.site.wait[DB.USERS]
      showMainPage(store)
    })

  // If the account doesn't have admin privilege.
  } else {
    // Get the account data of the account -- asynchronous with realtime updates.
    store.state.site.wait[DB.ACCOUNTS] = true
    store.getters.collection(DB.ACCOUNTS).doc(store.state.me.uid).onSnapshot(doc => {
      store.commit(M.SET_ACCOUNT, account)
      delete store.state.site.wait[DB.ACCOUNTS]
      showMainPage(store)
    })
    // Get the user data of the account -- asynchronous with realtime updates.
    store.state.site.wait[DB.USERS] = true
    store.getters.collection(DB.USERS)
    .where('uid', '==', store.state.me.uid).orderBy('branch', 'asc').orderBy('name', 'asc')
    .onSnapshot(querySnapshot => {
      store.commit(M.SET_USERS, querySnapshot)
      delete store.state.site.wait[DB.USERS]
      showMainPage(store)
    })
  }
}

/**
 * Wait and get the registered account data -- synchronous.
 * @param {object} config
 * @param {object} store
 */
const getRegisteredAccount = async (config, store) => {
  while (true) {
    try {
      let account = await store.getters.collection(DB.ACCOUNTS).doc(store.state.me.uid).get()
      if (account && account.exists) {
        return account
      }
    } catch (error) {
    }
    store.commit(M.SET_LOADING_MSG, config.messages.regAccount)
    sleep(500)
  }
}

/**
 * Get the list of given name -- asynchronous with realtime updates.
 * @param {object} store
 * @param {string} name
 */
const getListAndWait = (store, name, action) => {
  store.state.site.wait[name] = true
  store.getters.collection(name).onSnapshot(querySnapshot => {
    store.commit(action, querySnapshot)
    delete store.state.site.wait[name]
    showMainPage(store)
  })
}

/**
 * Wait data loaded and show the main form page.
 * @param {Vuex.Store} store
 */
const showMainPage = (store) => {
  if (Object.keys(store.state.site.wait).length === 0 &&
      store.state.site.page === PAGE.LOADING) {
    const isMyUserId = store.state.users.reduce(
      (ret, cur) => cur.uid === store.state.me.uid ? true : ret,
      false
    )
    store.commit(M.SET_PAGE, isMyUserId ? PAGE.USER_SHOW : PAGE.USER_EDIT)
  }
}
