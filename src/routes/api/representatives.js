import express from 'express'

const router = express.Router()
const controller = require('../../controllers/Controller')

// @route post api/representatives/:riding/getRepresentative
// @desc  get representative by riding
// @access Public
router.get('/:riding/getRepresentative', controller.getRepresentativeByRiding)

// @route post api/getAllRepresentatives
// @desc  get all representatives currently stored in DB
// @access Public
router.get('/getAllRepresentatives', controller.getAllRepresentatives)

router.get('/:name/getRepresentativesInfo', controller.getRepresentativesInfo)
// @route post api/:representative/getRepresentativeId
// @desc get id of representative
// @access Public
router.get(
  '/:representative/getRepresentativeId',
  controller.getRepresentativeId
)

// api/representatives
router.get('/:parliamentNumber/getRepresentatives',
  controller.getRepresentatives)

router.get('/representative/representative/:name', controller.getImageData)

module.exports = router
