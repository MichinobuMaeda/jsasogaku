import {
  DB_COUNTERS, DB_USERS, DB_ACCOUNTS, getValue
} from './common'

/**
 * Submit edited accounts.
 * @param {object} state Vuex app state.
 * @param {array} list edited accounts.
 */
export const onSubmitAccounts = async (state, list) => {
  let tasks = []
  const db = state.firebase.firestore()
  list.forEach(item => {
    if ((item.valid !== item.orgValid) ||
        (item.admin !== item.orgAdmin)) {
      tasks.push(db.collection(DB_ACCOUNTS).doc(item.key).update({
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
 * @param {array} list edited memberships.
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
 * Submit edited user.
 * @param {object} state Vuex app state.
 */
export const onSubmitUser = (state) => {
  let {key, ver, ...user} = state.site.selectedUser
  const timestamp = new Date()
  const db = state.firebase.firestore()

  // Recalc the sum.
  const activeEvent = state.site.selectedEvent
  const activeUser = state.site.selectedUser
  let userEvent = activeUser.events[activeEvent.key]
  if (userEvent) {
    userEvent.cost = !userEvent.entry
      ? 0
      : Object.keys(userEvent.items).reduce(
        (ret1, cur1) => ret1 + activeEvent.items.reduce(
          (ret2, cur2) => ret2 + (cur2.key === cur1
            ? userEvent.items[cur1]
              ? Array.isArray(cur2.list)
                ? cur2.list[userEvent.items[cur1] - 1][activeUser.membership] || 0
                : (cur2[activeUser.membership] || 0)
              : 0
            : 0)
          , 0
        ), 0
      )
  }
  // If add the new user data.
  if (!ver) {
    db.collection(DB_USERS).doc().set({
      ...user,
      ver: ver + 1,
      createdAt: timestamp,
      updatedAt: timestamp
    })

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
          if (doc.data().ver !== ver) {
            /* eslint-disable no-throw-literal */
            throw state.resources.errorConflictUpdated

          // If the version of user data is valid.
          } else {
            // Update the user data
            await transaction.update(docRef, {
              ...user,
              ver: ver + 1,
              updatedAt: timestamp
            })
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
      } finally {
        window.scrollTo({top: 0, behavior: 'smooth'})
      }
    })
  }
}

/**
 * Get new receipt number.
 * @param {object} state Vuex app state.
 */
export const getReceiptNo = (state) => {
  const db = state.firebase.firestore()
  let docRefCounter = db.collection(DB_COUNTERS).doc(
    state.site.selectedEvent.key
  )
  let docRefUser = db.collection(DB_USERS).doc(
    state.site.selectedUser.key
  )
  // Start transaction.
  return db.runTransaction(async transaction => {
    let timestamp = new Date()
    try {
      let docCounter = await transaction.get(docRefCounter)
      let docUser = await transaction.get(docRefUser)
      // If the receipt number counter is exists,
      if (docCounter.exists) {
        // Get the new number
        let count = docCounter.data().count + 1
        await transaction.update(docRefCounter, {count})
        // Save the user data.
        await transaction.update(docRefUser, {
          events: {
            [state.site.selectedEvent.key]: {
              number: count,
              cost: 0,
              entry: 1,
              items: state.site.selectedEvent.items.reduce(
                (ret, cur) => ({...ret, [cur.key]: getValue(cur.default)}), {}
              )
            }
          },
          ver: docUser.data().ver + 1,
          updatedAt: timestamp
        })

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
