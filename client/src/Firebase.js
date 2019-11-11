const fs = require('firebase')
require('firebase/firestore')

class _Firestore {
  constructor () {
    this.config = {
      apiKey: 'AIzaSyBdCSbXtHoTPO4JfPDicPhnams3q1p_6AQ',
      authDomain: 'abdulla-2c3a5.firebaseapp.com',
      databaseURL: 'https://abdulla-2c3a5.firebaseio.com',
      projectId: 'abdulla-2c3a5',
      storageBucket: 'abdulla-2c3a5.appspot.com',
      messagingSenderId: '1084760992823',
      appId: '1:1084760992823:web:c6402249f92d54372ce3b2'
    }
    if (!this.app || !fs.app) {
      this.app = fs.initializeApp(this.config)
    } else {
      this.app = fs.app
    }
    this.db = fs.firestore()
    this.firebase = fs
    this.googleProvider = new fs.auth.GoogleAuthProvider()
    this.facebookProvider = new fs.auth.FacebookAuthProvider()
    this.twitterProvider = new fs.auth.TwitterAuthProvider()
    this.microsoftProvider = new fs.auth.OAuthProvider('microsoft.com')
  }
}

var instance = null
function getInstance () {
  if (!instance) {
    instance = new _Firestore()
  }
  return instance
}

class Reference {
  constructor (reference) {
    this.reference = reference
  }

  where (attribute, operator, value) {
    this.reference.where(attribute, operator, value)
    return this
  }

  update (model) {
    return new Promise((resolve, reject) => {
      this.reference
        .get()
        .then(snapshot => {
          const updates = new Map()
          snapshot.forEach(document => {
            const datum = document.data()
            // eslint-disable-next-line no-unused-vars
            for (const key of Object.keys(model)) {
              datum[key] = model[key]
            }
            updates.set(document.id, datum)
          })
          return updates
        })
        .then(updates => {
          updates.forEach((id, datum) => {
            this.reference.doc(id).update(datum)
          })
          resolve(updates.size)
        })
        .catch(e => {
          reject(e)
        })
    })
  }

  delete () {
    return new Promise((resolve, reject) => {
      this.reference
        .get()
        .then(snapshot => {
          let count = 0
          snapshot.forEach(doc => {
            doc.ref.delete()
            count++
          })
          resolve(count)
        })
        .catch(e => {
          reject(e)
        })
    })
  }

  select (attribute, operator, value) {
    if (
      typeof attribute === 'undefined' ||
      typeof operator === 'undefined' ||
      typeof value === 'undefined'
    ) {
      return new Promise((resolve, reject) => {
        this.reference
          .get()
          .then(snapshot => {
            resolve(snapshot)
          })
          .catch(err => {
            reject(err)
          })
      })
    } else {
      return new Promise((resolve, reject) => {
        this.reference
          .where(attribute, operator, value)
          .get()
          .then(snapshot => {
            resolve(snapshot)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }

  insert (model) {
    return new Promise(resolve => {
      this.reference
        .add(model)
        .then(result => {
          resolve(true)
        })
        .catch(() => {
          resolve(false)
        })
    })
  }
}

class Firestore {
  constructor () {
    this.firestore = getInstance()
    this.reference = this.firestore.db
    this.googleProvider = this.firestore.googleProvider
    this.firebase = this.firestore.firebase
    this.facebookProvider = this.firestore.facebookProvider
    this.twitterProvider = this.firestore.twitterProvider
    this.microsoftProvider = this.firestore.microsoftProvider
  }

  Bill () {
    return new Reference(this.reference.collection('bills'))
  }

  BillClassification () {
    return new Reference(this.reference.collection('bill_classification'))
  }

  Politician () {
    return new Reference(this.reference.collection('politicians'))
  }

  User () {
    return new Reference(this.reference.collection('users'))
  }

  VoteRecord () {
    return new Reference(this.reference.collection('voteRecord'))
  }

  async close () {
    await this.firestore.app
      .delete()
      .then(result => {
        this.firestore.db
          .terminate()
          .then(result => {})
          .catch(e => {})
      })
      .catch(e => {})
  }
}

export { Firestore }
export { Reference }
