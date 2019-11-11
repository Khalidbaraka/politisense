import { Firestore } from '../client/src/Firebase'
import represent from 'represent'

exports.check = (req, res) => {
  const email = req.body.email
  const db = new Firestore()
  db.User().select('email', '==', email)
    .then(snapshot => {
      if (snapshot.empty) {
        res.json({
          success: false,
          data: 'doesnt exist'

        })
      } else {
        res.json({
          success: true,
          data: 'its already in db'
        })
      }
    })
    .catch(err => {
      console.log('Error getting documents', err)
    })
}

exports.userSignup = (req, res) => {
  let user = {}
  if (req.body.password) {
    user = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      postalCode: req.body.postalCode,
      categories: { category1: req.body.category1, category2: req.body.category2 },
      riding: req.body.riding,
      password: req.body.password
    }
  } else {
    user = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      postalCode: req.body.postalCode,
      categories: { category1: req.body.category1, category2: req.body.category2 },
      riding: req.body.riding,
      email: req.body.email
    }
  }
  const db = new Firestore()
  db.User().select('email', '==', user.email)
    .then(snapshot => {
      if (snapshot.empty) {
        db.User()
          .insert(user)
          .then(
            () => {
              res.json({
                success: true
              })
            }
          )
          .catch(err => {
            console.log('Error getting documents', err)
          })
      } else {
        res.json({
          success: false,
          message: 'Please try a different email address'
        })
      }
    })
    .catch(err => {
      console.log('Error getting documents', err)
    })
}
exports.userLogin = (req, res) => {
  const db = new Firestore()
  console.log(req.body.email)
  const user = {
    email: req.body.email,
    password: req.body.password
  }
  let entry = {}
  db.User().select('email', '==', user.email)
    .then(snapshot => {
      if (snapshot.empty) {
        res.json({
          success: false,
          auth: 'Email entered does not exist',
          type: 'email'
        })
      }
      snapshot.forEach(doc => {
        entry = doc.data()
        if (entry.password === user.password) {
          res.json({
            success: true,
            auth: 'Successful login'
          })
        } else {
          res.json({
            success: false,
            auth: 'Incorrect password',
            type: 'password'
          })
        }
      })
    })
    .catch(err => {
      console.log('Error getting documents', err)
    })
}

exports.getUserByEmail = (req, res) => {
  const userEmail = req.params.userEmail
  const db = new Firestore()
  db.User()
    .select('email', '==', userEmail)
    .then(snapshot => {
      if (snapshot.empty) {
        res.status(400).json({
          message: 'user not found',
          success: false
        })
      }
      snapshot.forEach(doc => {
        res.json({
          success: true,
          data: doc.data()
        })
      })
    })
    .catch(err =>
      res.status(404).json({
        message: 'UserController.js',
        success: false
      })
    )
}

exports.setRiding = (req, res) => {
  const postalCode = (req.body.postalCode).replace(/\s/g, '').toUpperCase()
  let riding = ''
  let federalArray = []
  represent.postalCode(postalCode, function (err, data) {
    federalArray = data.boundaries_centroid.filter(entry => entry.boundary_set_name === 'Federal electoral district')
    let maxid = 0
    let maxobj = {}
    for (let i = 0; i < federalArray.length; i++) {
      if (federalArray[i].external_id > maxid) {
        maxid = federalArray[i].external_id
        maxobj = federalArray[i]
      }
    }
    riding = maxobj.name
    res.json({
      success: true,
      data: riding
    })
  })
}
