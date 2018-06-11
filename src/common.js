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
export const SET_USERS = 'setUsers'
export const SET_ACCOUNT = 'setAccount'
export const SET_ACCOUNTS = 'setAccounts'
export const TOGGLE_ACCOUNT_IS_VALID = 'toggleAccountIdValid'
export const TOGGLE_ACCOUNT_IS_ADMIN = 'toggleAccountIsAdmin'
export const SET_ME = 'setMe'

// Regexps
export const REGEX_EMAIL = /^(\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+|無し)$/
export const REGEX_ZIP = /^[-0-9]+$/
export const REGEX_TEL = /^([-0-9]+|無し)$/
export const REGEX_INTEGER = /^-?[0-9]+$/

// Exceptions
export const EXCEPTION_CONFLICT = {
  name: 'EXCEPTION_CONFLICT'
}
export const EXCEPTION_DELETED = {
  name: 'EXCEPTION_DELETED'
}

// Pages
export const PAGE = {
  LOADING: 'Loading',
  SIGN_IN: 'SignIn',
  MAIN_FORM: 'MainForm',
  USER_EDIT: 'UserEdit',
  USER_SHOW: 'UserShow',
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
    } else if (str.match(/^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(.\d+)?(Z|[-+][\d:]+)$/)) {
      return new Date(str)
    } else {
      return str
    }
  } catch (error) {
    return str
  }
}

export const getActiveUser = state => state.users.reduce(
  (ret, cur) => cur.key === state.site.activeUser ? cur : ret, null)

export const getActiveEvent = state => state.events.reduce(
  (ret, cur) => cur.key === state.site.activeEvent ? cur : ret, null)

export const getFirestore = firebase => {
  const firestore = firebase.firestore()
  firestore.settings({timestampsInSnapshots: true})
  return firestore
}

export const getUserForEdit = state => {
  const isAdmin = state.accounts[state.me.uid] &&
    state.accounts[state.me.uid].admin
  const isMyProfile = state.users.filter(user => user.uid === state.me.uid).length > 0
  return state.users.reduce(
    (ret, cur) => cur.key === state.site.activeUser
      ? {
        ...cur,
        // events: JSON.parse(JSON.stringify(cur.events))
        events: cur.events
          ? Object.keys(cur.events).reduce(
            (ret2, cur2) => ({
              ...ret2,
              [cur2]: {
                ...cur.events[cur2],
                entry: cur.events[cur2].summary || cur.events[cur2].summary === undefined ? 1 : 0,
                items: cur.events[cur2].summary
                  ? cur.events[cur2].summary.items.reduce(
                    (ret3, cur3) => ({...ret3, [cur3.key]: cur3.value}),
                    {}
                  )
                  : state.site.activeEvent
                    ? getActiveEvent(state).items.reduce(
                      (ret4, cur4) => ({...ret4, [cur4.key]: cur4.default}),
                      {}
                    )
                    : {}
              }
            }),
            {}
          )
          : {}
      }
      : ret,
    {
      key: null,
      uid: isAdmin && isMyProfile ? null : state.me.uid,
      name: '',
      membership: null,
      branch: null,
      zip: '',
      pref: '',
      city: '',
      street: '',
      bldg: '',
      tel: '',
      fax: '',
      email: isAdmin && isMyProfile ? '' : state.me.email,
      note: '',
      events: {},
      ver: 0,
      createdAt: null,
      updatedAt: null
    }
  )
}

export const getSummary = (state, user) => {
  let ret = {items: [], total: 0}
  if (!state.site.activeEvent) { return ret }
  let event = state.events.reduce(
    (ret, cur) => cur.key === state.site.activeEvent ? cur : ret,
    {}
  )
  if (!event) { return ret }
  let entry = user.events[state.site.activeEvent]
  if (!entry) { return ret }
  if (!entry.number) { return ret }
  if (!entry.entry) { return ret }
  const categories = ['GA', 'lecture', 'excursion']
  categories.forEach(section => {
    ret.items = [
      ...ret.items,
      ...event.items.filter(item => item.category === section && entry.items[item.key])
        .map(item => {
          let cost = getValue(
            entry.items[item.key]
              ? Array.isArray(item.list)
                ? item.list[entry.items[item.key] - 1][user.membership] || 0
                : (item[user.membership] || 0)
              : 0
          )
          ret.total += cost
          return {
            key: item.key,
            value: entry.items[item.key],
            cost
          }
        }
      )
    ]
  })
  return ret
}

// Recalc the sum.
export const updateUserSummary = (state, user) => {
  const timestamp = new Date()
  return user.events[state.site.activeEvent]
    ? {
      ...user,
      events: {
        ...user.events,
        [state.site.activeEvent]: {
          number: user.events[state.site.activeEvent].number,
          summary: (user.events[state.site.activeEvent].entry
            ? getSummary(state, user)
            : null),
          createdAt: user.events[state.site.activeEvent].createdAt || timestamp,
          updatedAt: timestamp
        }
      }
    }
    : user
}

export const getSummaryTable = state => {
  let activeEvent = state.events.reduce(
    (cur, ret) => cur.key === state.site.activeEvent ? cur : ret,
    {}
  )
  const categoryNames = {
    GA: '',
    lecture: state.resources.titleLectureEntry,
    excursion: state.resources.titleExcursion
  }
  return state.users.reduce(
    (ret, cur) => cur.key === state.site.activeUser
      ? cur.events[activeEvent.key]
        ? cur.events[activeEvent.key].summary
          ? {
            total: cur.events[activeEvent.key].summary.total,
            items: cur.events[activeEvent.key].summary.items
              .map(item => {
                let ref = activeEvent.items.reduce(
                  (ret, cur) => cur.key === item.key ? cur : ret,
                  {}
                )
                return {
                  ...item,
                  name: ref.name,
                  categoryName: categoryNames[ref.category],
                  selection: ref.list
                    ? ref.list[item.value - 1].name
                    : null
                }
              })
          }
          : null
        : ret
      : ret
    , null
  )
}

export const getMyUserId = state => state.users.reduce(
  (ret, cur) => cur.uid === state.me.uid ? cur.key : ret,
  null
)

export const getCostSummary = state => {
  const items = getActiveEvent(state).items
    .filter(item => state.memberships.map(m => m.key)
      .reduce(
        (ret, cur) => ret + (item.list ? item.list.reduce(
          (ret2, cur2) => ret2 + (cur2[cur] || 0),
          0
        ) : (item[cur] || 0)),
        0
      )
    )
    .map(item => item.key)
  const getItem = (summary, item) => summary.items.reduce(
      (ret, cur) => cur.key === item ? cur : ret,
      null
    )
  const list = state.users
    .filter(user => user.events &&
      user.events[state.site.activeEvent] &&
      user.events[state.site.activeEvent].summary)
    .map(user => ({
      ...user,
      items: items.reduce(
        (ret, cur) => getItem(user.events[state.site.activeEvent].summary, cur)
          ? {...ret, [cur]: getItem(user.events[state.site.activeEvent].summary, cur).cost}
          : ret,
        {}
      ),
      total: user.events[state.site.activeEvent].summary.total
    }))
  const summary = list.reduce(
    (ret, cur) => {
      Object.keys(cur.items).forEach(key => {
        ret[key] += (cur.items[key] || 0)
      })
      return ret
    },
    items.reduce((ret, cur) => ({...ret, [cur]: 0}), {})
  )
  return {
    items,
    list,
    summary
  }
}

export const getLectureSummary = state => {
  const items = getActiveEvent(state).items
    .filter(item => item.category === 'lecture')
    .map(item => item.key)
  const list = state.users
    .filter(user => user.events &&
      user.events[state.site.activeEvent] &&
      user.events[state.site.activeEvent].summary)
    .map(user => ({
      ...user,
      items: items.reduce(
        (ret, cur) => user.events[state.site.activeEvent].summary.items.reduce(
          (ret2, cur2) => cur2.key === cur ? 1 : ret2,
          0
        ) ? {...ret, [cur]: 1} : ret,
        {}
      )
    }))
    .filter(user => Object.keys(user.items).length)
  const summary = list.reduce(
    (ret, cur) => {
      Object.keys(cur.items).forEach(key => {
        ret[key] += (cur.items[key] || 0)
      })
      return ret
    },
    items.reduce((ret, cur) => ({...ret, [cur]: 0}), {})
  )
  return {
    items,
    list,
    summary
  }
}

export const createEventData = (data, memberships) => ({
  ...data,
  items: data.items.reduce((ret, cur) => {
    let {key, ...item} = cur
    item.category = item.category.trim()
    item.default = getValue(('' + item.default).trim())
    if (item.list) {
      item.list = item.list.map(listItem => {
        listItem.name = listItem.name.trim()
        memberships.forEach(m => {
          listItem[m.key] = getValue(listItem[m.key] || '0')
        })
        return listItem
      })
    } else {
      item.name = item.name.trim()
      memberships.forEach(m => {
        item[m.key] = getValue(item[m.key] || 0)
      })
    }
    ret[key.trim()] = item
    return ret
  }, {})
})
