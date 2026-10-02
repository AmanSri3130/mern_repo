const Board = require('../models/Board');

// Get all boards for user (admin sees all, member sees their boards)
const getBoards = async (req, res) => {
  try {
    const filter = req.user.role === 'admin'
      ? {}
      : { $or: [{ owner: req.user._id }, { members: req.user._id }] };
    const boards = await Board.find(filter).sort({ createdAt: -1 });
    res.json(boards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single board
const getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create board
const createBoard = async (req, res) => {
  try {
    const { name, description } = req.body;
    const board = await Board.create({
      name,
      description,
      owner: req.user._id,
      columns: [
        { title: 'To Do', color: '#3b82f6', order: 0, cards: [] },
        { title: 'In Progress', color: '#f59e0b', order: 1, cards: [] },
        { title: 'Done', color: '#10b981', order: 2, cards: [] }
      ]
    });
    res.status(201).json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add card to column
const addCard = async (req, res) => {
  try {
    const { columnId } = req.params;
    const { title, description, priority, assignee } = req.body;
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });

    const column = board.columns.id(columnId);
    if (!column) return res.status(404).json({ message: 'Column not found' });

    column.cards.push({ title, description, priority, assignee });
    await board.save();
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Move card between columns
const moveCard = async (req, res) => {
  try {
    const { fromColumnId, toColumnId, cardId } = req.body;
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });

    const fromColumn = board.columns.id(fromColumnId);
    const toColumn = board.columns.id(toColumnId);

    const cardIndex = fromColumn.cards.findIndex(c => c._id.toString() === cardId);
    if (cardIndex === -1) return res.status(404).json({ message: 'Card not found' });

    const [card] = fromColumn.cards.splice(cardIndex, 1);
    toColumn.cards.push(card);
    await board.save();
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete card
const deleteCard = async (req, res) => {
  try {
    const { columnId, cardId } = req.params;
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });

    const column = board.columns.id(columnId);
    if (!column) return res.status(404).json({ message: 'Column not found' });

    column.cards = column.cards.filter(c => c._id.toString() !== cardId);
    await board.save();
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete board (admin only)
const deleteBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });
    await board.deleteOne();
    res.json({ message: 'Board deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getBoards, getBoardById, createBoard, addCard, moveCard, deleteCard, deleteBoard };
