const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp()
const db = admin.firestore()

// 認証ユーザ作成時の処理。
exports.onAuthUserCreated = functions.auth.user().onCreate(user => {
  // アカウント情報を作成する。
  const timestamp = new Date()
  return db.collection('accounts').doc(user.uid).set({
    admin: false,
    email: user.email,
    createdAt: timestamp,
    updatedAt: timestamp
  })
  .then(doc => true)
  .catch(error => console.error(error))
})

// 認証ユーザ削除時の処理。
exports.onAuthUserDeleted = functions.auth.user().onDelete(user => {
  // アカウント情報を削除する。
  return db.collection("accounts").doc(user.uid).delete()
  .then(doc => true)
  .catch(error => console.error(error))
})
