import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(ShopContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5006/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
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
        <h2>Sign In</h2>
        {error && <p style={{ color: '#ef4444', margin: '1rem 0' }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label>Email</label>
            <input type="email" style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px' }} value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label>Password</label>
            <input type="password" style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px' }} value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button className="btn-cart" type="submit">Login</button>
        </form>
        <p style={{ marginTop: '1rem', color: '#94a3b8' }}>New customer? <Link to="/register" style={{ color: '#38bdf8' }}>Register</Link></p>
      </div>
    </div>
  );
}
