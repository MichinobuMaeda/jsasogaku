// Database collections
export const DB = {
  COUNTERS: 'counters',
  RESOURCES: 'resources',
  MEMBERSHIPS: 'memberships',
  BRANCHES: 'branches',
  EVENTS: 'events',
  ACCOUNTS: 'accounts',
  USERS: 'users'
}

// Local storage keys
export const EMAIL_FOR_SIGN_IN = 'emailForSignIn'

// Mutations
export const M = {
  SET_PAGE: 'setPage',
  BACK_PAGE: 'backPage',
  SET_LOADING_MSG: 'setLoadingMessage',
  SELECT_USER: 'selectUser',
  SELECT_EVENT: 'selectEvent',
  SET_RESOURCE: 'setResources',
  SET_MEMBERSHIPS: 'setMemberships',
  SET_BRANCHES: 'setBranches',
  SET_EVENTS: 'setEvents',
  SET_USERS: 'setUsers',
  SET_ACCOUNT: 'setAccount',
  SET_ACCOUNTS: 'setAccounts',
  TOGGLE_ACCOUNT_IS_VALID: 'toggleAccountIdValid',
  TOGGLE_ACCOUNT_IS_ADMIN: 'toggleAccountIsAdmin',
  SET_ME: 'setMe'
}

// Getters
export const GETTERS = [
  'res',
  'branches',
  'branch',
  'memberships',
  'membership',
  'accounts',
  'users',
  'me',
  'activeUser',
  'activeEvent',
  'selectedUserEvent',
  'page',
  'collection',
  'COLOR',
  'summary',
  'costSummaryList',
  'lectureSummaryList'
]

// Regexps
export const REGEX = {
  EMAIL: /^(\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+|無し)$/,
  ZIP: /^[-0-9]+$/,
  TEL: /^([-0-9]+|無し)$/,
  INTEGER: /^-?[0-9]+$/
}

// Exceptions
export const EXCEPTION = {
  CONFLICT: {
    name: 'EXCEPTION_CONFLICT'
  },
  DELETED: {
    name: 'EXCEPTION_DELETED'
  }
}

// Pages
export const PAGE = {
  LOADING: 'Loading',
  SIGN_IN: 'SignIn',
  MAIN_FORM: 'MainForm',
  USER_EDIT: 'UserEdit',
  USER_SHOW: 'UserShow',
  SUMMARY: 'Summary',
  COLLECTION: 'Collection',
  USER: 'User',
  ACCOUNT: 'Account',
  EVENT: 'Event',
  MEMBERSHIP: 'Membership',
  BRANCH: 'Branch',
  RESOURCE: 'Resource',
  DEBUG: 'Debug'
}
