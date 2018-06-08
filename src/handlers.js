import {
  DB_COUNTERS, DB_USERS, getValue, getActiveEvent, getFirestore, getSummary
} from './common'

/**
 * Submit edited accounts.
 * @param {object} collection the collection of Firestore.
 * @param {array} list edited accounts.
 */
export const onSubmitAccounts = async (collection, list) => {
  let tasks = []
  list.forEach(item => {
    if ((item.valid !== item.orgValid) ||
        (item.admin !== item.orgAdmin)) {
      tasks.push(collection.doc(item.key).update({
        valid: item.valid,
        admin: item.admin,
        updatedAt: new Date()
      }))
    }
  })
  try {
    return Promise.all(tasks)
  } catch (error) {
    window.alert(error)
  }
}

/**
 * Submit edited text list.
 * @param {object} collection the collection of Firestore.
 * @param {array} list edited list.
 * @param {boolean} permitEmpty default: false.
 */
export const onSubmitList = async (collection, list, permitEmpty = false) => {
  let tasks = []
  list.forEach(item => {
    if ((item.text || '').trim() !== (item.org || '').trim()) {
      console.log(item.text + ' ' + item.org)
      if ((item.text || '').trim() || permitEmpty) {
        let text = item.isArray ? item.text.trim().split('\n') : item.text.trim()
        tasks.push(collection.doc(item.key).set({text}))
      } else if (!permitEmpty) {
        tasks.push(collection.doc(item.key).delete())
      }
    }
  })
  try {
    return Promise.all(tasks)
  } catch (error) {
    window.alert(error)
  }
}

/**
 * Submit edited text list.
 * @param {object} collection the collection of Firestore.
 * @param {object} event edited event.
 * @param {array} memberships
 */
export const onSubmitEvents = async (collection, event, memberships) => {
  if (!event) {
    return
  }
  try {
    let {key, ...data} = event
    data.items = data.items.reduce((ret, cur) => {
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
    await collection.doc(key).set(data)
  } catch (error) {
    window.alert(error)
  }
}

/**
 * Submit edited user.
 * @param {object} state Vuex app state.
 * @param {object} activeUser
 */
export const onSubmitUser = async (state, editedUser) => {
  const {key, ...user} = editedUser
  const timestamp = new Date()
  const db = getFirestore(state.firebase)

  // Recalc the sum.
  if (user.events[state.site.activeEvent]) {
    user.events[state.site.activeEvent] = {
      number: user.events[state.site.activeEvent].number,
      summary: user.events[state.site.activeEvent].entry
        ? getSummary(state, editedUser)
        : null
    }
  }
  // If add the new user data.
  if (!user.ver) {
    let docRef = db.collection(DB_USERS).doc()
    await docRef.set({
      ...user,
      ver: user.ver + 1,
      createdAt: timestamp,
      updatedAt: timestamp
    })
    state.site.activeUser = docRef.id

  // If update the user data.
  } else {
    // Get the saved user date.
    let docRef = db.collection(DB_USERS).doc(key || 'dummy')
    // Start transaction.
    db.runTransaction(async transaction => {
      try {
        let doc = await transaction.get(docRef)
        // If the user data restored.
        if (doc.exists) {
          // If the version of user data is invalid.
          if (doc.data().ver !== user.ver) {
            /* eslint-disable no-throw-literal */
            throw state.resources.errorConflictUpdated

          // If the version of user data is valid.
          } else {
            // Update the user data
            await transaction.update(docRef, {
              ...user,
              ver: user.ver + 1,
              updatedAt: timestamp
            })
            user.ver = user.ver + 1
            user.updatedAt = timestamp
            state.users = state.users.map(item => item.key === key ? {key, ...user} : item)
          }

        // If the user data is not exists.
        } else {
          /* eslint-disable no-throw-literal */
          window.alert(state.resources.errorConflictDeleted)
          window.location.href = window.location.href
        }
      } catch (error) {
        if (error.code === 'permission-denied') {
          window.alert(state.resources.errorConflictDeleted)
        } else {
          window.alert(error)
        }
        window.location.href = window.location.href
      }
    })
  }
}

/**
 * Get new receipt number.
 * @param {object} state Vuex app state.
 */
export const getReceiptNo = (state) => {
  let user = state.users.reduce(
    (ret, cur) => cur.key === state.site.activeUser ? cur : ret,
    null
  )
  const activeEvent = getActiveEvent(state)
  const db = getFirestore(state.firebase)
  let docRefCounter = db.collection(DB_COUNTERS).doc(
    activeEvent.key
  )
  let docRefUser = db.collection(DB_USERS).doc(
    state.site.activeUser
  )
  // Start transaction.
  return db.runTransaction(async transaction => {
    try {
      let docCounter = await transaction.get(docRefCounter)
      let docUser = await transaction.get(docRefUser)
      // If the receipt number counter is exists,
      if (docCounter.exists) {
        // Get the new number
        let count = docCounter.data().count + 1
        await transaction.update(docRefCounter, {count})
        let events = {
          ...user.events,
          [activeEvent.key]: {
            number: count
          }
        }
        let ver = docUser.data().ver + 1
        let updatedAt = new Date()
        await transaction.update(docRefUser, {
          events,
          ver,
          updatedAt
        })
        user.events = events
        user.ver = ver
        user.updatedAt = updatedAt

        // If the receipt number counter is not exists,
      } else {
        /* eslint-disable no-throw-literal */
        throw state.resources.errorMissReceiptNoCounter
      }
    } catch (error) {
      window.alert(error)
    }
  })
}
