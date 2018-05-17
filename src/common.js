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
export const SET_ME = 'setMe'

// Regexps
export const REGEX_EMAIL = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
export const REGEX_ZIP = /^[-0-9]+$/
export const REGEX_TEL = /^[-0-9]+$/

// Pages
export const PAGE = {
  LOADING: 'Loading',
  SIGN_IN: 'SignIn',
  MAIN_FORM: 'MainForm',
  RESOURCE: 'Resource',
  RAW_JSON: 'RawJson',
  DEBUG: 'Debug'
}

/**
 * Synchronous blocking sleep.
 * @param {number} time milliseconds.
 */
export const sleep = time => {
  return new Promise((resolve) => setTimeout(resolve, time))
}
