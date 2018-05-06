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

Vue.use(Vuex)
Vue.use(Vuetify)
Vue.config.productionTip = false

const store = new Vuex.Store({
  state: {
    firebase,
    site: {
      page: 'loading',
      prev: [],
      selectedUser: {},
      selectedEvent: {},
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
    setPage (state, page) {
      if (page && state.site.page !== page) {
        let prev = (
          state.site.page === 'loading' ||
          (
            state.site.prev.length &&
            state.site.prev[state.site.prev.length - 1] !== state.site.page
          )
        ) ? state.site.prev
          : state.site.prev.concat(state.site.page)
        state.site = {
          ...state.site,
          prev,
          page
        }
      }
    },
    backPage (state) {
      let prev = state.site.prev.pop()
      state.site = {
        ...state.site,
        prev: [...state.site.prev],
        page: prev
      }
    },
    setLoadingMessage (state, msg) {
      state.site = {
        ...state.site,
        loadingMessage: msg
      }
    },
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
    selectEvent (state, event) {
      state.site = {
        ...state.site,
        selectedEvent: event
      }
    },
    setResources (state, querySnapshot) {
      state.resources = {}
      querySnapshot.forEach(function (doc) {
        state.resources[doc.id] = doc.data().text
      })
    },
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
    setAccounts (state, querySnapshot) {
      state.accounts = {}
      querySnapshot.forEach(function (doc) {
        state.accounts[doc.id] = {
          admin: doc.data().admin,
          email: doc.data().email,
          createdAt: doc.data().createdAt,
          updatedAt: doc.data().updatedAt
        }
      })
    },
    setAccount (state, doc) {
      state.accounts[doc.id] = {
        admin: doc.data().admin,
        email: doc.data().email,
        createdAt: doc.data().createdAt,
        updatedAt: doc.data().updatedAt
      }
    },
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
    setUsers (state, querySnapshot) {
      state.users = []
      querySnapshot.forEach(function (doc) {
        state.users.push(normalizeUserDoc(doc))
      })
    },
    setUser (state, doc) {
      state.users = state.users || []
      state.users = [
        normalizeUserDoc(doc),
        ...state.users.filter(user => user.uid !== doc.data().uid)
      ]
    },
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

// Vue AP を初期構築する。
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>',
  data: {}
})

// 認証用URLの場合、
if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
  // E-mail Link 認証を実行して元のURLに戻る。
  Promise.resolve().then(() => confirmSignIn())

// 認証用URLではない場合、
} else {
  // データを更新してページを表示する。
  Promise.resolve().then(() => showPage())
}

/**
 * Email Link 認証を実行して元のURLに戻る。
 */
const confirmSignIn = async () => {
  try {
    // 認証に利用したメールアドレスを取得する。
    let email = window.localStorage.getItem('emailForSignIn')
    if (!email) {
      window.alert('認証に利用したメールアドレスが取得できません。認証をやり直して下さい。')
    } else {
      // 認証に利用したメールアドレスと一致するかどうかを確認する。
      await firebase.auth().signInWithEmailLink(email, window.location.href)
      // 一致する場合、認証に利用したメールアドレスの情報を破棄する。
      window.localStorage.removeItem('emailForSignIn')
    }
  } catch (error) {
    window.alert(error)
  } finally {
    // 元のURLに戻る。
    window.location.href = '/'
  }
}

/**
 * データを更新してページを表示する。
 */
const showPage = async () => {
  // 認証情報を取得する。
  firebase.auth().onAuthStateChanged(async function (auth) {
    store.commit('setMe', auth)
    const db = firebase.firestore()

    // 認証情報無しの場合、
    if (!auth) {
      // データを取得して、 SignIn ページを表示する。
      db.collection('resources').onSnapshot(querySnapshot => {
        store.commit('setResources', querySnapshot)
        showSingIn(store)
      })

    // 認証情報有りの場合、
    } else {
      // アカウント情報を作成または更新する。
      const timestamp = new Date()
      let docRefAccount = db.collection('accounts').doc(store.state.me.uid)
      let account = await db.runTransaction(async transaction => {
        let doc = await transaction.get(docRefAccount)
        // 初回の認証の場合、アカウント情報を作成する。
        if (!doc.exists) {
          db.collection('accounts').doc(store.state.me.uid).set({
            admin: false,
            email: auth.email,
            createdAt: timestamp,
            updatedAt: timestamp
          })

        // ２回目以降の認証の場合、メールアドレスと認証日時を更新する。
        } else {
          transaction.update(docRefAccount, {
            admin: doc.data().admin,
            email: auth.email,
            createdAt: doc.data().createdAt,
            updatedAt: timestamp
          })
        }
        return doc
      })
      // データを取得して、 MainForm ページを表示する。
      db.collection('resources').onSnapshot(querySnapshot => {
        store.commit('setResources', querySnapshot)
        showMainForm(store)
      })
      db.collection('memberships').onSnapshot(querySnapshot => {
        store.commit('setMemberships', querySnapshot)
        showMainForm(store)
      })
      db.collection('branches').onSnapshot(querySnapshot => {
        store.commit('setBranches', querySnapshot)
        showMainForm(store)
      })
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
      if (account.data().admin) {
        db.collection('accounts').onSnapshot(querySnapshot => {
          store.commit('setAccounts', querySnapshot)
        })
        showMainForm(store)
      } else {
        store.commit('setAccount', account)
        showMainForm(store)
      }
      const setUsers = querySnapshot => {
        querySnapshot.forEach(function (doc) {
          store.commit('setUser', doc)
        })
        store.commit('selectUser', store.state.me)
        showMainForm(store)
      }
      if (account.data().admin) {
        db.collection('users').onSnapshot(setUsers)
      } else {
        db.collection('users')
        .where('uid', '==', store.state.me.uid).onSnapshot(setUsers)
      }
    }
  })
}

/**
 * 必要なデータが揃ったら SignIn ページを表示する。
 * @param store the Vuex store.
 */
const showSingIn = (store) => {
  if (Object.keys(store.state.resources).length) {
    store.commit('setPage', 'signIn')
  }
}

/**
 * 必要なデータが揃ったら MainForm ページを表示する。
 * @param store the Vuex store.
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
 * Firestore の user ドキュメントを AP 用に変換する。
 * @param doc the user object
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
 * key 順にソートする。
 * @param arr key を含むオブジェクトの配列
 */
function orderByKey (arr) {
  return arr.map((item, i) => item.key).sort().map(key => arr.reduce(
    (ret, cur) => cur.key === key ? cur : ret, null)
  )
}
