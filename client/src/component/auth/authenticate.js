const fs = require('firebase')
require('firebase/auth')
export function tokenAuthenticate (token) {
  fs.initializeApp({
    apiKey: 'AIzaSyBdCSbXtHoTPO4JfPDicPhnams3q1p_6AQ',
    authDomain: 'abdulla-2c3a5.firebaseapp.com',
    databaseURL: 'https://abdulla-2c3a5.firebaseio.com',
    projectId: 'abdulla-2c3a5',
    storageBucket: 'abdulla-2c3a5.appspot.com',
    messagingSenderId: '1084760992823',
    appId: '1:1084760992823:web:c6402249f92d54372ce3b2'
  })
  return fs.auth().signInWithPopup(token)
}
