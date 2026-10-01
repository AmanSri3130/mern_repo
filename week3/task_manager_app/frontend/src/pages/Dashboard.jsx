import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import TaskModal from '../components/TaskModal';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (priorityFilter !== 'all') params.append('priority', priorityFilter);
      if (search) params.append('search', search);

      const res = await fetch(`http://localhost:5005/api/tasks?${params.toString()}`, {
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
  }, [user, statusFilter, priorityFilter, search]);

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        // Update task
        const res = await fetch(`http://localhost:5005/api/tasks/${editingTask._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify(taskData)
        });
        if (res.ok) fetchTasks();
      } else {
        // Create task
        const res = await fetch('http://localhost:5005/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify(taskData)
        });
        if (res.ok) fetchTasks();
      }
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const res = await fetch(`http://localhost:5005/api/tasks/${id}`, {
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

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Task Dashboard</h2>
        <button className="btn-primary" onClick={openCreateModal}>+ Add New Task</button>
      </div>

      {/* Stats Summary */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Tasks</h4>
          <p>{totalTasks}</p>
        </div>
        <div className="stat-card">
          <h4>Pending</h4>
          <p style={{ color: '#3b82f6' }}>{pendingTasks}</p>
        </div>
        <div className="stat-card">
          <h4>Completed</h4>
          <p style={{ color: '#10b981' }}>{completedTasks}</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="filters-bar">
        <input
          type="text"
          className="form-control search-input"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="form-control filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In-Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select
          className="form-control filter-select"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="all">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Tasks Grid */}
      {tasks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
          <p style={{ color: '#94a3b8' }}>No tasks found matching your filter criteria.</p>
        </div>
      ) : (
        <div className="tasks-grid">
          {tasks.map(task => (
            <div key={task._id} className="task-card">
              <div>
                <div className="task-header">
                  <div className="task-title">{task.title}</div>
                  <span className={`badge badge-${task.status}`}>{task.status}</span>
                </div>
                <div className="task-desc">{task.description || 'No description provided.'}</div>
              </div>
              <div className="task-footer">
                <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>
                  {task.priority} Priority
                </span>
                <div>
                  <button className="btn-sm btn-edit" onClick={() => openEditModal(task)}>Edit</button>
                  <button className="btn-sm btn-delete" onClick={() => handleDeleteTask(task._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Creation / Editing Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        editingTask={editingTask}
      />
    </div>
  );
}
