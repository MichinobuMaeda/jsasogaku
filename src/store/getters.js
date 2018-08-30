export const debug = state => {
  let {me, site, memberships, branches, events, accounts, users, resources} = state
  return {me, site, memberships, branches, events, accounts, users, resources}
}

export const res = state => state.resources

export const branches = state => state.branches

export const branch = state => key => state.branches.reduce(
  (ret, cur) => cur.key === key ? cur.text : ret,
  null
)

export const memberships = state => state.memberships

export const membership = state => key => state.memberships.reduce(
  (ret, cur) => cur.key === key ? cur.text : ret,
  null
)

export const accounts = state => state.accounts

export const users = state => state.users

export const me = state => state.me

export const activeUser = state => state.users.reduce(
  (ret, cur) => cur.key === state.site.activeUser ? cur : ret, null)

export const activeEvent = state => state.events.reduce(
  (ret, cur) => cur.key === state.site.activeEvent ? cur : ret, null)

export const selectedUserEvent = state => user => user.events[state.site.activeEvent]

export const page = state => state.site.page

export const collection = state => name => state.db.collection(name)

export const COLOR = () => ({
  INFO: 'brown',
  CARD: 'grey lighten-3'
})

export const summary = state => (user, event) => {
  let activeEvent = state.events.reduce(
    (cur, ret) => cur.key === event ? cur : ret,
    {}
  )
  const categoryNames = {
    GA: '',
    lecture: state.resources.titleLectureEntry,
    excursion: state.resources.titleExcursion
  }
  return state.users.reduce(
    (ret, cur) => cur.key === user
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

export const costSummaryList = (state, getters) => {
  const items = getters.activeEvent.items
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

export const lectureSummaryList = (state, getters) => {
  const items = getters.activeEvent.items
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
