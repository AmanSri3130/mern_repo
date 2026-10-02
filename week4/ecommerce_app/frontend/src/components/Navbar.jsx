import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

export default function Navbar() {
  const { user, logout, cart } = useContext(ShopContext);
  const navigate = useNavigate();

  const totalCartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">🛒 ShopZone</Link>
      <div className="nav-items">
        <Link to="/">Products</Link>
        <Link to="/cart">
          Cart <span className="cart-badge">{totalCartCount}</span>
        </Link>
        {user ? (
          <>
            <Link to="/orders">My Orders</Link>
            {user.isAdmin && <Link to="/admin" style={{ color: '#f59e0b', fontWeight: 'bold' }}>Admin Panel</Link>}
            <button onClick={handleLogout} className="btn-link">Logout</button>
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
