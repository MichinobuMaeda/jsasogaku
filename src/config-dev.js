const firebaseDev = {
  apiKey: 'AIzaSyCxkfr8E0BRPRCdU7rczxQ6pBOjR9jFORM',
  authDomain: 'jsasogaku-dev.firebaseapp.com',
  databaseURL: 'https://jsasogaku-dev.firebaseio.com',
  projectId: 'jsasogaku-dev',
  storageBucket: 'jsasogaku-dev.appspot.com',
  messagingSenderId: '540544515625'
}

export default {
  production: {
    firebase: firebaseDev
  },
  development: {
    firebase: firebaseDev
  },
  testing: {
    firebase: firebaseDev
  },
  messages: {
    loadingApp: 'Loading ...',
    loadingData: 'Loading stored data.',
    regAccount: 'Registering the account.'
  }
}
