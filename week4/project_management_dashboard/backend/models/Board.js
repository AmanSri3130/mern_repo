const mongoose = require('mongoose');

const taskCardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  assignee: { type: String, default: '' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

const columnSchema = new mongoose.Schema({
  title: { type: String, required: true },
  color: { type: String, default: '#3b82f6' },
  order: { type: Number, default: 0 },
  cards: [taskCardSchema]
});

const boardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  columns: [columnSchema]
}, { timestamps: true });

module.exports = mongoose.model('Board', boardSchema);
