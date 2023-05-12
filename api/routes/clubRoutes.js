const express = require('express')
const router = express.Router()

const {
  createClub,
  getClubs,
  updateClub,
  getClub,
  deleteClub,
} = require('../controllers/clubController')

// const requireAuth = require('../middleware/requireAuth')

// require auth for all workouts routes
// router.use(requireAuth)

// Routes
router.get('/', getClubs)
router.get('/:id', getClub)
router.post('/', createClub)
router.patch('/:id', updateClub)
router.delete('/:id', deleteClub)

module.exports = router
