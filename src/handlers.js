import {
  EXCEPTION_CONFLICT, EXCEPTION_DELETED, createEventData
} from './common'

/**
 * Submit edited accounts.
 * @param {object} collection the accounts collection of Firestore.
 * @param {array} list edited accounts.
 */
export const onSubmitAccounts = (collection, list) => {
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
  return Promise.all(tasks)
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
  return Promise.all(tasks)
}

/**
 * Submit edited text list.
 * @param {object} collection the collection of Firestore.
 * @param {object} event edited event.
 * @param {array} memberships
 */
export const onSubmitEvents = (collection, event, memberships) => {
  if (!event) {
    return
  }
  let {key, ...data} = event
  data = createEventData(data, memberships)
  return collection.doc(key).set(data)
}

/**
 * Submit new user.
 * @param {object} collection the users collection of Firestore.
 * @param {object} editedUser
 */
export const onSubmitNewUser = async (collection, editedUser) => {
  const {key, ...user} = editedUser
  const timestamp = new Date()
  let docRef = collection.doc()
  await docRef.set({
    ...user,
    ver: user.ver + 1,
    createdAt: timestamp,
    updatedAt: timestamp
  })
  return docRef.id
}

/**
 * Submit edited user.
 * @param {object} collection the users collection of Firestore.
 * @param {object} editedUser
 */
export const onSubmitUser = async (collection, editedUser) => {
  const {key, ...user} = editedUser
  const timestamp = new Date()

  // Get the saved user date.
  let docRef = collection.doc(key)
  // Start transaction.
  await collection.firestore.runTransaction(async transaction => {
    let doc = await transaction.get(docRef)
    // If the user data restored.
    if (doc.exists) {
      // If the version of user data is invalid.
      if (doc.data().ver !== user.ver) {
        throw EXCEPTION_CONFLICT

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
      }

    // If the user data is not exists.
    } else {
      throw EXCEPTION_DELETED
    }
  })
}

/**
 * Get new receipt number.
 * @param {object} collection the counters collection of Firestore.
 * @param {object} collection the users collection of Firestore.
 * @param {string} activeEvent
 * @param {object} user
 */
export const getReceiptNo = async (counters, users, activeEvent, user) => {
  let docRefCounter = counters.doc(activeEvent)
  let docRefUser = users.doc(user.key)
  let ret = null
  // Start transaction.
  await docRefCounter.firestore.runTransaction(async transaction => {
    let docCounter = await transaction.get(docRefCounter)
    let docUser = await transaction.get(docRefUser)
    // Get the new number
    let count = docCounter.data().count + 1
    await transaction.update(docRefCounter, {count})
    user.events = user.events | {}
    user.events = {
      ...user.events,
      [activeEvent]: {
        number: count
      }
    }
    user.ver = docUser.data().ver + 1
    user.updatedAt = new Date()
    await transaction.update(docRefUser, {
      events: user.events,
      ver: user.ver,
      updatedAt: user.updatedAt
    })
    ret = count
  })
  return ret
}
