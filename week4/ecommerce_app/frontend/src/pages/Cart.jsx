import { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { cart, removeFromCart, clearCart, user } = useContext(ShopContext);
  const navigate = useNavigate();
  const [address, setAddress] = useState('123 Tech Street');
  const [city, setCity] = useState('New York');
  const [postalCode, setPostalCode] = useState('10001');

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleCheckout = async () => {
    if (!user) {
      alert('Please login to complete your order');
      return navigate('/login');
    }

    try {
      const res = await fetch('http://localhost:5006/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          orderItems: cart.map(item => ({
            name: item.name,
            qty: item.qty,
            image: item.image,
            price: item.price,
            product: item._id
          })),
          shippingAddress: { address, city, postalCode },
          totalPrice
        })
      });

      if (res.ok) {
        alert('Order Placed Successfully!');
        clearCart();
        navigate('/orders');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2>Shopping Cart</h2>

      {cart.length === 0 ? (
        <p style={{ marginTop: '2rem', color: '#94a3b8' }}>Your cart is empty.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '2rem' }}>
          <div>
            {cart.map(item => (
              <div key={item._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1e293b', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #334155' }}>
                <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                <div style={{ flex: 1, marginLeft: '1rem' }}>
                  <h4>{item.name}</h4>
                  <p style={{ color: '#94a3b8' }}>${item.price} x {item.qty}</p>
                </div>
                <button onClick={() => removeFromCart(item._id)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer' }}>Remove</button>
              </div>
            ))}
          </div>

          <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155', height: 'fit-content' }}>
            <h3>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '1.5rem 0', fontSize: '1.2rem', fontWeight: 'bold' }}>
              <span>Total:</span>
              <span style={{ color: '#38bdf8' }}>${totalPrice.toFixed(2)}</span>
            </div>
            <button className="btn-cart" onClick={handleCheckout}>Place Order</button>
          </div>
        </div>
      )}
    </div>
  );
}
