import { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

export default function Orders() {
  const { user } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      fetch('http://localhost:5006/api/orders/myorders', {
        headers: { Authorization: `Bearer ${user.token}` }
      })
        .then(res => res.json())
        .then(data => setOrders(data))
        .catch(err => console.error(err));
    }
  }, [user]);

  return (
    <div className="container">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p style={{ marginTop: '2rem', color: '#94a3b8' }}>You have placed no orders yet.</p>
      ) : (
        <div style={{ marginTop: '2rem' }}>
          {orders.map(order => (
            <div key={order._id} style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #334155', paddingBottom: '0.75rem' }}>
                <span>Order ID: <strong>{order._id}</strong></span>
                <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>Total: ${order.totalPrice.toFixed(2)}</span>
              </div>
              <div>
                {order.orderItems.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    <span>{item.name} x {item.qty}</span>
                    <span style={{ marginLeft: 'auto', color: '#94a3b8' }}>${item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
