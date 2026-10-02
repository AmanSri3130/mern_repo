import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(ShopContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5006/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, isAdmin })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '4rem' }}>
      <div style={{ background: '#1e293b', padding: '2rem', borderRadius: '12px', border: '1px solid #334155' }}>
        <h2>Create Account</h2>
        {error && <p style={{ color: '#ef4444', margin: '1rem 0' }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label>Full Name</label>
            <input type="text" style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px' }} value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Email</label>
            <input type="email" style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px' }} value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Password</label>
            <input type="password" style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px' }} value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" id="adminCheck" checked={isAdmin} onChange={e => setIsAdmin(e.target.checked)} />
            <label htmlFor="adminCheck">Register as Admin Account</label>
          </div>
          <button className="btn-cart" type="submit">Register</button>
        </form>
        <p style={{ marginTop: '1rem', color: '#94a3b8' }}>Already registered? <Link to="/login" style={{ color: '#38bdf8' }}>Login</Link></p>
      </div>
    </div>
  );
}
