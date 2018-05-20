const firebaseProd = {
  apiKey: 'AIzaSyAhEiUCXEeh4QTdiNRi68z1e_HF-NAd7Fc',
  authDomain: 'jsasogaku.firebaseapp.com',
  databaseURL: 'https://jsasogaku.firebaseio.com',
  projectId: 'jsasogaku',
  storageBucket: 'jsasogaku.appspot.com',
  messagingSenderId: '105409434786'
}
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
    firebase: firebaseProd
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
