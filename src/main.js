import 'es6-promise/auto'
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import config from './config'
import Firebase from 'firebase'
import 'firebase/firestore'

const firebase = Firebase.initializeApp(config.firebase)

// Configure the Vue app.
Vue.use(Vuex)
Vue.use(Vuetify)
Vue.config.productionTip = false

// Configure the Vuex store.
const store = new Vuex.Store({
  // The initial data
  state: {
    firebase,
    site: {
      page: 'loading',
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
    me: {}
  },
  mutations: {
    // Set the next page and save the history.
    setPage (state, page) {
      if (page && state.site.page !== page) {
        state.site = {
          ...state.site,
          prev: (
            state.site.page === 'loading' ||
            state.site.page === 'rawJson' ||
            (
              state.site.prev.length &&
              state.site.prev[state.site.prev.length - 1] !== state.site.page
            )
          ) ? state.site.prev
            : state.site.prev.concat(state.site.page),
          page
        }
      }
    },
    // Back to the previous page.
    backPage (state) {
      let prev = state.site.prev.pop()
      state.site = {
        ...state.site,
        prev: [...state.site.prev],
        page: prev
      }
    },
    // Set page loading messages.
    setLoadingMessage (state, msg) {
      state.site = {
        ...state.site,
        loadingMessage: msg
      }
    },
    // Set the subjected user.
    selectUser (state, user) {
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
    },
    // Set the subjected event.
    selectEvent (state, event) {
      state.site = {
        ...state.site,
        selectedEvent: event
      }
    },
    // Set resources.
    setResources (state, querySnapshot) {
      state.resources = {}
      querySnapshot.forEach(function (doc) {
        state.resources[doc.id] = doc.data().text
      })
    },
    // Set the list of membership types.
    setMemberships (state, querySnapshot) {
      let arr = []
      querySnapshot.forEach(function (doc) {
        arr.push({
          key: doc.id,
          text: doc.data().name
        })
      })
      state.memberships = orderByKey(arr)
    },
    // Set the list of branches.
    setBranches (state, querySnapshot) {
      let arr = []
      querySnapshot.forEach(function (doc) {
        arr.push({
          key: doc.id,
          text: doc.data().name
        })
      })
      state.branches = orderByKey(arr)
    },
    // Set the list fo events.
    setEvents (state, querySnapshot) {
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
    },
    // Set the list of users.
    setUser (state, doc) {
      state.users = state.users || []
      state.users = [
        normalizeUserDoc(doc),
        ...state.users.filter(user => user.uid !== doc.data().uid)
      ]
    },
    // Set the list of accounts.
    setAccount (state, doc) {
      state.accounts = state.accounts || []
      state.accounts[doc.id] = {
        admin: doc.data().admin,
        email: doc.data().email,
        createdAt: doc.data().createdAt,
        updatedAt: doc.data().updatedAt
      }
    },
    // Set the account signed in.
    setMe (state, account) {
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
        store.commit('setPage', 'loading')
      }
    }
  }
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
  Promise.resolve().then(() => confirmSignIn())

// If The URL is not the link of "sign in with email",
} else {
  // Get the auth info.
  firebase.auth().onAuthStateChanged(async function (auth) {
    // Set the account signed in.
    store.commit('setMe', auth)

    // If no auth info,
    if (!auth) {
      // Load data and show sign in page.
      Promise.resolve().then(() => showSignInPage())

    // If auth info,
    } else {
      // Load data and show main form page.
      Promise.resolve().then(() => showMainFormPage())
    }
  })
}

/**
 * Do "sign in with email" and return to the app.
 */
const confirmSignIn = async () => {
  const db = firebase.firestore()
  store.commit('setLoadingMessage', config.messages.loadingData)
  let querySnapshot = await db.collection('resources').get()
  store.commit('setResources', querySnapshot)
  store.commit('setLoadingMessage', store.state.resources.statusProcAuth)
  try {
    // Get the saved email address for auth.
    let email = window.localStorage.getItem('emailForSignIn')
    if (!email) {
      window.alert(store.state.resources.errorAuthEmailNotSaved)
    } else {
      // Validate the email address.
      await firebase.auth().signInWithEmailLink(email, window.location.href)
      // Delete the saved email address.
      window.localStorage.removeItem('emailForSignIn')
    }
  } catch (error) {
    store.commit('setLoadingMessage', store.state.resources.errorAuthFailed)
    window.alert(error)
  } finally {
    // Return to the app.
    window.location.href = '/'
  }
}

/**
 * Load data and show sign in page.
 */
const showSignInPage = async () => {
  const db = firebase.firestore()
  // Start to load stored data synchronous.
  store.commit('setLoadingMessage', config.messages.loadingData)
  // Load resources synchronous.
  let querySnapshot = await db.collection('resources').get()
  store.commit('setResources', querySnapshot)
  // Show the sign in page.
  store.commit('setPage', 'signIn')
}

/**
 * Load data and show main form page.
 */
const showMainFormPage = async () => {
  const db = firebase.firestore()
  // Wait and get the registered account data synchronous.
  const account = await getRegisteredAccount(db, store.state.me.uid)
  // Start to load stored data and show the main form page.
  store.commit('setLoadingMessage', config.messages.loadingData)
  // Load resources asynchronous with realtime updates.
  db.collection('resources').onSnapshot(querySnapshot => {
    store.commit('setResources', querySnapshot)
    showMainForm(store)
  })
  // Get the list of membership types asynchronous with realtime updates.
  db.collection('memberships').onSnapshot(querySnapshot => {
    store.commit('setMemberships', querySnapshot)
    showMainForm(store)
  })
  // Get the list of branches asynchronous with realtime updates.
  db.collection('branches').onSnapshot(querySnapshot => {
    store.commit('setBranches', querySnapshot)
    showMainForm(store)
  })
  // Get the list of events asynchronous with realtime updates.
  db.collection('events').onSnapshot(querySnapshot => {
    store.commit('setEvents', querySnapshot)
    store.commit(
      'selectEvent',
      store.state.events.reduce(
        (ret, event) => event.status === 'active' ? event : ret, null
      )
    )
    showMainForm(store)
  })
  // If the account has admin privilege.
  if (account.data().admin) {
    // Get the list of all accounts asynchronous with realtime updates.
    db.collection('accounts').onSnapshot(querySnapshot => {
      querySnapshot.forEach(function (doc) {
        store.commit('setAccount', doc)
      })
      showMainForm(store)
    })
    // Get the list of all users asynchronous with realtime updates.
    db.collection('users').onSnapshot(setUsers)

  // If the account doesn't have admin privilege.
  } else {
    // Get the account data of the account asynchronous with realtime updates.
    db.collection('accounts').doc(store.state.me.uid).onSnapshot(doc => {
      store.commit('setAccount', account)
      showMainForm(store)
    })
    // Get the user data of the account, asynchronous with realtime updates.
    db.collection('users')
    .where('uid', '==', store.state.me.uid).onSnapshot(setUsers)
  }
}

/**
 * Synchronous blocking sleep.
 * @param {number} time
 */
const sleep = time => {
  return new Promise((resolve) => setTimeout(resolve, time))
}

/**
 * Wait and get the registered account data synchronous.
 * @param {object} db
 * @param {string} uid
 */
const getRegisteredAccount = async (db, uid) => {
  while (true) {
    try {
      let account = await db.collection('accounts').doc(store.state.me.uid).get()
      if (account && account.exists) {
        console.log(account)
        return account
      } else {
        store.commit('setLoadingMessage', config.messages.regAccount)
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
 * @param {object} querySnapshot
 */
const setUsers = querySnapshot => {
  querySnapshot.forEach(function (doc) {
    store.commit('setUser', doc)
  })
  store.commit('selectUser', store.state.me)
  showMainForm(store)
}

/**
 * Wait data loaded and show the main form page.
 * @param {object} store the Vuex store.
 */
const showMainForm = (store) => {
  if (Object.keys(store.state.me).length &&
      Object.keys(store.state.resources).length &&
      Object.keys(store.state.memberships).length &&
      Object.keys(store.state.branches).length &&
      Object.keys(store.state.events).length &&
      Object.keys(store.state.accounts).length) {
    store.commit('setPage', 'mainForm')
  }
}

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
