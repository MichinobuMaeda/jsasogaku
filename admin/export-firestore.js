const Firestore = require('@google-cloud/firestore')

Promise.resolve(process.env.PROJECT_ID).then(project => {
  const firestore = new Firestore({
    projectId: project,
    keyFilename: `./admin/keys/${project}-firebase.json`
  })
  return firestore.getCollections()
  .then(collections => {
    let all = {}
    let tasks = []
    for (let collection of collections) {
      all[collection.id] = {}
      tasks.push(
        collection.get().then(querySnapshot => {
          querySnapshot.forEach(doc => {
            all[collection.id][doc.id] = doc.data()
          })
        })
      )
    }
    return Promise.all(tasks).then(() => {
      console.log(JSON.stringify(all, null, 2))
    })
  })
})
