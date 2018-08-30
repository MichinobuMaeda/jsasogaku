import Firebase from 'firebase'
import 'firebase/firestore'
import config from '../config'
import {PAGE} from '../constants'

const firebase = Firebase.initializeApp(config[process.env.NODE_ENV].firebase)
const db = firebase.firestore()
db.settings({timestampsInSnapshots: true})

export default {
  firebase,
  db,
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
  me: {}
}
