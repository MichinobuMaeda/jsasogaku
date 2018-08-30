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

export const userForEdit = state => {
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
                    ? state.events.reduce(
                        (ret, cur) => cur.key === state.site.activeEvent ? cur : ret,
                        null
                      ).items.reduce(
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
