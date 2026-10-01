import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function TodoList() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');

  const fetchTasks = async () => {
    try {
      const res = await fetch('http://localhost:5003/api/tasks', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (res.ok) setTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await fetch('http://localhost:5003/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ title, priority })
      });
      const newTask = await res.json();
      if (res.ok) {
        setTasks([newTask, ...tasks]);
        setTitle('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const res = await fetch(`http://localhost:5003/api/tasks/${task._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ completed: !task.completed })
      });
      const updated = await res.json();
      if (res.ok) {
        setTasks(tasks.map(t => t._id === task._id ? updated : t));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const res = await fetch(`http://localhost:5003/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        setTasks(tasks.filter(t => t._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 style={{ marginBottom: '1.5rem' }}>My To-Do Tasks</h2>

        <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Add a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <select
            className="form-control"
            style={{ width: '130px' }}
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button type="submit" className="btn" style={{ width: 'auto' }}>Add</button>
        </form>

        <div className="task-list">
          {tasks.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#64748b' }}>No tasks found. Add your first task!</p>
          ) : (
            tasks.map(task => (
              <div key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                <div className="task-left">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleComplete(task)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span>{task.title}</span>
                  <span className={`priority-badge priority-${task.priority}`}>{task.priority}</span>
                </div>
                <button onClick={() => handleDeleteTask(task._id)} className="btn-delete">Delete</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
