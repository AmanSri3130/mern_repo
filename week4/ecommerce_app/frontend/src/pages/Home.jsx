import { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

export default function Home() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(ShopContext);

  useEffect(() => {
    fetch('http://localhost:5006/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container">
      <h2>Featured Products</h2>
      {products.length === 0 ? (
        <p style={{ marginTop: '2rem', color: '#94a3b8' }}>No products available. Add products via Admin Panel!</p>
      ) : (
        <div className="product-grid">
          {products.map(product => (
            <div key={product._id} className="product-card">
              <img src={product.image} alt={product.name} className="product-img" />
              <div className="product-info">
                <div className="product-title">{product.name}</div>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.75rem' }}>{product.description}</p>
                <div className="product-price">${product.price.toFixed(2)}</div>
                <button className="btn-cart" onClick={() => addToCart(product)}>Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
