const Post = require('../models/Post');

// Get all posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new post
const createPost = async (req, res) => {
  try {
    const { text, image } = req.body;
    if (!text) return res.status(400).json({ message: 'Post text is required' });

    const post = await Post.create({
      user: req.user._id,
      userName: req.user.name,
      text,
      image: image || ''
    });

    // Emit socket event if io instance is attached
    if (req.io) req.io.emit('new_post', post);

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Like / Unlike post
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const index = post.likes.indexOf(req.user._id);
    if (index === -1) {
      post.likes.push(req.user._id);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();
    if (req.io) req.io.emit('update_post', post);

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add comment
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({
      user: req.user._id,
      userName: req.user.name,
      text
    });

    await post.save();
    if (req.io) req.io.emit('update_post', post);

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getPosts, createPost, likePost, addComment };
