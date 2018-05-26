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
  DB_RESOURCES, EMAIL_FOR_SIGN_IN,
  SET_LOADING_MSG, SET_ME, SET_RESOURCE, SET_PAGE, PAGE
} from './common'
import loader from './loader'
import mutations from './mutations'

const firebase = Firebase.initializeApp(config[process.env.NODE_ENV].firebase)

// Configure the Vue app.
Vue.use(Vuex)
Vue.use(Vuetify)
Vue.config.productionTip = false

// Configure the Vuex store.
const store = new Vuex.Store({
  state: loader.initialState(config, firebase),
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
  // Do "sign in with email" and return to the app.
  Promise.resolve().then(() => confirmSignIn(store))

// If The URL is not the link of "sign in with email",
} else {
  // Get the auth info.
  firebase.auth().onAuthStateChanged(async function (auth) {
    // Set the account signed in.

    // If no auth info,
    if (!auth) {
      store.state.memberships = []
      store.state.branches = []
      store.state.events = []
      store.state.accounts = {}
      store.state.users = []
      store.commit(SET_ME, auth)
      store.commit(SET_PAGE, PAGE.LOADING)

      // Load data and show sign in page.
      Promise.resolve().then(() => loader.showSignInPage(config, store))

    // If auth info,
    } else {
      store.commit(SET_ME, auth)

      // Load data and show main form page.
      Promise.resolve().then(() => loader.showMainFormPage(config, store))
    }
  })
}

/**
 * Do "sign in with email" and return to the app.
 */
const confirmSignIn = async (store) => {
  const db = store.state.firebase.firestore()
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
    // Return to the app.
    window.location.href = '/'
  }
}
