import { Firestore } from '../client/src/Firebase'

exports.getRepresentativeByRiding = (req, res) => {
  const db = new Firestore()
  const riding = req.params.riding.toLowerCase()
  db.Politician()
    .select('riding', '==', riding)
    .then(snapshot => {
      if (snapshot.empty) {
        res.status(400).json({
          message: 'Riding Not Found',
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
}