const express = require('express');
const {
  getEpisodes,
  getEpisodeById,
  createEpisode,
  updateEpisode,
  deleteEpisode
} = require('../controllers/episodeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getEpisodes);
router.get('/:id', getEpisodeById);

// Protected routes - require authentication
router.post('/', protect, createEpisode);
router.put('/:id', protect, updateEpisode);
router.delete('/:id', protect, deleteEpisode);

module.exports = router; 