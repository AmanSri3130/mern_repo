const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  getBoards, getBoardById, createBoard,
  addCard, moveCard, deleteCard, deleteBoard
} = require('../controllers/boardController');

router.route('/')
  .get(protect, getBoards)
  .post(protect, createBoard);

router.route('/:id')
  .get(protect, getBoardById)
  .delete(protect, adminOnly, deleteBoard);

router.post('/:id/columns/:columnId/cards', protect, addCard);
router.put('/:id/move-card', protect, moveCard);
router.delete('/:id/columns/:columnId/cards/:cardId', protect, deleteCard);

module.exports = router;
