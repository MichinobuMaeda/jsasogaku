// Database collections
export const DB_COUNTERS = 'counters'
export const DB_RESOURCES = 'resources'
export const DB_MEMBERSHIPS = 'memberships'
export const DB_BRANCHES = 'branches'
export const DB_EVENTS = 'events'
export const DB_ACCOUNTS = 'accounts'
export const DB_USERS = 'users'

// Local storage keys
export const EMAIL_FOR_SIGN_IN = 'emailForSignIn'

// Mutations
export const SET_PAGE = 'setPage'
export const BACK_PAGE = 'backPage'
export const SET_LOADING_MSG = 'setLoadingMessage'
export const SELECT_USER = 'selectUser'
export const SELECT_EVENT = 'selectEvent'
export const SET_RESOURCE = 'setResources'
export const SET_MEMBERSHIPS = 'setMemberships'
export const SET_BRANCHES = 'setBranches'
export const SET_EVENTS = 'setEvents'
export const SET_USER = 'setUser'
export const SET_ACCOUNT = 'setAccount'
export const TOGGLE_ACCOUNT_IS_VALID = 'toggleAccountIdValid'
export const TOGGLE_ACCOUNT_IS_ADMIN = 'toggleAccountIsAdmin'
export const SET_ME = 'setMe'

// Regexps
export const REGEX_EMAIL = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
export const REGEX_ZIP = /^[-0-9]+$/
export const REGEX_TEL = /^[-0-9]+$/
export const REGEX_INTEGER = /^-?[0-9]+$/

// Pages
export const PAGE = {
  LOADING: 'Loading',
  SIGN_IN: 'SignIn',
  MAIN_FORM: 'MainForm',
  SUMMARY: 'Summary',
  USER: 'User',
  ACCOUNT: 'Account',
  EVENT: 'Event',
  MEMBERSHIP: 'Membership',
  BRANCH: 'Branch',
  RESOURCE: 'Resource',
  DEBUG: 'Debug'
}

/**
 * Synchronous blocking sleep.
 * @param {number} time milliseconds.
 */
export const sleep = time => {
  return new Promise((resolve) => setTimeout(resolve, time))
}

/**
 * Formant a number with 0 padding.
 * @param {number} number
 * @param {number} digits
 */
export const padDigits = (number, digits) => {
  return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number
}

/**
 * Create the array has keys from minCount to maxCount with a prefix and a suffix,
 * and apply the original list values.
 * @param {array} list
 * @param {number} minCount >= 0
 * @param {number} maxCount > minCount
 * @param {string} prefix
 * @param {number} digits > 0
 * @param {string} suffix default: null
 */
export const createSparseList = (list, minCount, maxCount, prefix, digits, suffix = null) => {
  let ret = []
  for (let i = minCount; i <= maxCount; ++i) {
    let key = (prefix || '') + padDigits(i, digits) + (suffix || '')
    let item = list.reduce((ret, cur) => cur.key === key ? cur : ret, null)
    ret.push(item || {key})
  }
  return ret
}

/**
 * Sort by key.
 * @param {array} arr the array of objects with 'key' attribute.
 */
export const orderByKey = arr => {
  return arr
    ? arr.map((item, i) => item.key).sort().map(key => arr.reduce(
      (ret, cur) => cur.key === key ? cur : ret, null)
    )
    : null
}

/**
 * 文字列表記の値を、number, boolean, Date に変換する。
 * @param {string} str 文字列表記の値
 */
export const getValue = str => {
  try {
    if (!str) {
      return str
    } else if (str.match(/^(true|on|yes|t|y|有|◯)$/i)) {
      return true
    } else if (str.match(/^(false|off|no|f|n|無|×)$/i)) {
      return false
    } else if (str.match(/^-?\d+$/)) {
      return parseInt(str, 10)
    } else if (str.match(/^-?\d*.\d*$/) && str.match(/\d/)) {
      return parseFloat(str)
    } else if (str.match(/^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d/)) {
      return parseInt(str, 10)
    }
  } catch (error) {
    return str
  }
}

export const getActiveEvent = state => state.events.reduce(
  (ret, cur) => cur.key === state.site.activeEvent ? cur : ret, {})

export const getFirestore = firebase => {
  const firestore = firebase.firestore()
  firestore.settings({timestampsInSnapshots: true})
  return firestore
}
