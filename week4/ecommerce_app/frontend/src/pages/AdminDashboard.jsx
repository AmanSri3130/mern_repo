import { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

export default function AdminDashboard() {
  const { user } = useContext(ShopContext);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('10');

  const fetchProducts = () => {
    fetch('http://localhost:5006/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5006/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          name, price: Number(price), description, image, category, countInStock: Number(countInStock)
        })
      });
      if (res.ok) {
        alert('Product added successfully!');
        setName(''); setPrice(''); setDescription(''); setImage(''); setCategory('');
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const res = await fetch(`http://localhost:5006/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2>Admin Control Panel</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginTop: '2rem' }}>
        {/* Create Product Form */}
        <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155' }}>
          <h3>Add New Product</h3>
          <form onSubmit={handleAddProduct} style={{ marginTop: '1rem' }}>
            <div style={{ marginBottom: '0.75rem' }}>
              <label>Product Name</label>
              <input type="text" style={{ width: '100%', padding: '0.6rem', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px' }} value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label>Price ($)</label>
              <input type="number" style={{ width: '100%', padding: '0.6rem', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px' }} value={price} onChange={e => setPrice(e.target.value)} required />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label>Image URL</label>
              <input type="text" style={{ width: '100%', padding: '0.6rem', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px' }} value={image} onChange={e => setImage(e.target.value)} required />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label>Category</label>
              <input type="text" style={{ width: '100%', padding: '0.6rem', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px' }} value={category} onChange={e => setCategory(e.target.value)} required />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Description</label>
              <textarea style={{ width: '100%', padding: '0.6rem', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px' }} value={description} onChange={e => setDescription(e.target.value)} required />
            </div>
            <button className="btn-cart" type="submit">Create Product</button>
          </form>
        </div>

        {/* Existing Products Table */}
        <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155' }}>
          <h3>Manage Inventory ({products.length})</h3>
          <div style={{ marginTop: '1rem' }}>
            {products.map(p => (
              <div key={p._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #334155', padding: '0.75rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={p.image} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{p.name}</div>
                    <div style={{ color: '#38bdf8' }}>${p.price}</div>
                  </div>
                </div>
                <button onClick={() => handleDeleteProduct(p._id)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
