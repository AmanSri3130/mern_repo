import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { io } from 'socket.io-client';

export default function Feed() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');
  const [commentInputs, setCommentInputs] = useState({});

  const fetchPosts = () => {
    fetch('http://localhost:5007/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchPosts();

    // Setup Socket.io real-time WebSocket connection
    const socket = io('http://localhost:5007');

    socket.on('new_post', (newPost) => {
      setPosts(prev => [newPost, ...prev]);
    });

    socket.on('update_post', (updatedPost) => {
      setPosts(prev => prev.map(p => p._id === updatedPost._id ? updatedPost : p));
    });

    return () => socket.disconnect();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const res = await fetch('http://localhost:5007/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ text })
      });
      if (res.ok) {
        setText('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (id) => {
    try {
      await fetch(`http://localhost:5007/api/posts/${id}/like`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${user.token}` }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (postId) => {
    const commentText = commentInputs[postId];
    if (!commentText || !commentText.trim()) return;

    try {
      await fetch(`http://localhost:5007/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ text: commentText })
      });
      setCommentInputs({ ...commentInputs, [postId]: '' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      {/* Create Post Card */}
      {user && (
        <div className="create-post-card">
          <h3>Share something with the community</h3>
          <form onSubmit={handleCreatePost} style={{ marginTop: '1rem' }}>
            <textarea
              style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px' }}
              rows="3"
              placeholder="What's on your mind?"
              value={text}
              onChange={e => setText(e.target.value)}
              required
            ></textarea>
            <button
              type="submit"
              style={{ marginTop: '0.75rem', padding: '0.6rem 1.5rem', background: '#ec4899', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Post Live
            </button>
          </form>
        </div>
      )}

      {/* Real-time Posts Feed */}
      <h2>Live Community Feed</h2>
      {posts.length === 0 ? (
        <p style={{ marginTop: '1.5rem', color: '#94a3b8' }}>No posts yet. Be the first to post!</p>
      ) : (
        posts.map(post => {
          const isLiked = user && post.likes.includes(user._id);
          return (
            <div key={post._id} className="post-card">
              <div className="post-header">
                <div className="user-avatar">{post.userName ? post.userName[0].toUpperCase() : 'U'}</div>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{post.userName}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{new Date(post.createdAt).toLocaleTimeString()}</div>
                </div>
              </div>

              <div className="post-text">{post.text}</div>

              <div className="post-actions">
                <button onClick={() => handleLike(post._id)} className="btn-like">
                  {isLiked ? '❤️ Liked' : '🤍 Like'} ({post.likes.length})
                </button>
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>💬 {post.comments.length} Comments</span>
              </div>

              {/* Comments Section */}
              <div className="comments-section">
                {post.comments.map((c, i) => (
                  <div key={i} className="comment-item">
                    <strong style={{ color: '#ec4899' }}>{c.userName}:</strong> {c.text}
                  </div>
                ))}

                {user && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      style={{ flex: 1, padding: '0.4rem 0.75rem', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px', fontSize: '0.875rem' }}
                      value={commentInputs[post._id] || ''}
                      onChange={e => setCommentInputs({ ...commentInputs, [post._id]: e.target.value })}
                    />
                    <button
                      onClick={() => handleAddComment(post._id)}
                      style={{ padding: '0.4rem 0.8rem', background: '#334155', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem' }}
                    >
                      Reply
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
