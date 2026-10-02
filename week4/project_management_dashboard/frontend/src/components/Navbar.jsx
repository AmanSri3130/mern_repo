import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="brand">⬡ ProBoard</div>
      <div className="nav-right">
        {user ? (
          <>
            <Link to="/boards">My Boards</Link>
            <span className={`role-badge ${user.role === 'admin' ? 'admin' : ''}`}>
              {user.role === 'admin' ? '👑 Admin' : '👤 Member'}
            </span>
            <span style={{ color: '#cbd5e1' }}>{user.name}</span>
            <button className="btn-link" onClick={() => { logout(); navigate('/login'); }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
