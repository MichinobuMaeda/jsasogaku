const Firestore = require('@google-cloud/firestore')

Promise.resolve(process.env.PROJECT_ID).then(project => {
  const firestore = new Firestore({
    projectId: project,
    keyFilename: `./admin/keys/${project}-firebase.json`
  })
  return firestore.getCollections()
  .then(collections => {
    let tasks = []
    for (let collection of collections) {
      collection.get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          tasks.push(collection.doc(doc.id).delete())
        })
      })
    }
    return Promise.all(tasks).then(() => {
      console.log('done.')
    })
  })
})
