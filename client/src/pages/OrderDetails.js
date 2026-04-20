import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("ppn_token");
        const { data } = await axios.get(`http://localhost:5000/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(data);
      } catch (err) { console.error(err); }
    };
    fetchOrder();
  }, [id]);

  if (!order) return <div style={{padding: '100px', textAlign: 'center', color: '#4a2535'}}>Loading SriNails Luxury...</div>;

  return (
    <div style={{background: '#fdf9fa', minHeight: '100vh', padding: '60px 20px', fontFamily: 'Poppins, sans-serif'}}>
      <div style={{maxWidth: '1100px', margin: '0 auto'}}>
        
        {/* HEADER SECTION */}
        <div style={{textAlign: 'center', marginBottom: '50px'}}>
          <div style={{width: '80px', height: '80px', background: '#4a2535', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', margin: '0 auto 20px', boxShadow: '0 10px 20px rgba(74,37,53,0.2)'}}>✓</div>
          <h1 style={{color: '#4a2535', fontSize: '2.8rem', fontWeight: '700', margin: '0'}}>Order Confirmed!</h1>
          <p style={{color: '#8a6d78', fontSize: '1.1rem'}}>Thank you for choosing SriNails, Mahi!</p>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px'}}>
          
          {/* LEFT: ITEMS CARD */}
          <div style={{background: '#fff', padding: '35px', borderRadius: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.03)'}}>
            <h3 style={{color: '#4a2535', fontSize: '1.3rem', marginBottom: '25px', borderBottom: '1px solid #f5f5f5', paddingBottom: '15px'}}>Your Luxury Selection</h3>
            {order.items.map((item, index) => (
              <div key={index} style={{display: 'flex', alignItems: 'center', gap: '25px', padding: '20px 0', borderBottom: '1px solid #fafafa'}}>
                <img src={item.image} alt="" style={{width: '110px', height: '110px', borderRadius: '20px', objectFit: 'cover', boxShadow: '0 5px 15px rgba(0,0,0,0.08)'}} />
                <div style={{flex: 1}}>
                  <h4 style={{margin: '0 0 8px 0', fontSize: '1.2rem', color: '#4a2535'}}>{item.name}</h4>
                  <div style={{color: '#a0808c', fontSize: '0.9rem'}}>Quantity: {item.quantity}</div>
                </div>
                <div style={{fontSize: '1.3rem', fontWeight: '700', color: '#4a2535'}}>₹{item.price}</div>
              </div>
            ))}
          </div>

          {/* RIGHT: SUMMARY CARD */}
          <div style={{display: 'flex', flexDirection: 'column', gap: '25px'}}>
            <div style={{background: '#4a2535', color: '#fff', padding: '30px', borderRadius: '30px', boxShadow: '0 20px 40px rgba(74,37,53,0.15)'}}>
              <h3 style={{fontSize: '1.1rem', marginBottom: '20px', opacity: '0.9'}}>Order Details</h3>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px'}}><span style={{opacity: '0.8'}}>Order No</span><strong>{order.orderNumber}</strong></div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px'}}><span style={{opacity: '0.8'}}>Status</span><span style={{background: '#fff', color: '#4a2535', padding: '2px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold'}}>{order.status}</span></div>
              <div style={{borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '20px', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 'bold'}}>
                <span>Total</span><span>₹{order.total}</span>
              </div>
            </div>

            <div style={{background: '#fff', padding: '30px', borderRadius: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.03)'}}>
              <h3 style={{fontSize: '1.1rem', color: '#4a2535', marginBottom: '15px'}}>Shipping Address</h3>
              <p style={{color: '#6d4c5a', lineHeight: '1.6', margin: '0'}}>
                <strong>{order.shippingAddress.name}</strong><br/>
                {order.shippingAddress.street}, {order.shippingAddress.city}<br/>
                {order.shippingAddress.state} - {order.shippingAddress.zip}
              </p>
            </div>

            <Link to="/shop" style={{background: '#fff', color: '#4a2535', border: '2px solid #4a2535', textAlign: 'center', padding: '18px', borderRadius: '20px', textDecoration: 'none', fontWeight: 'bold', transition: '0.3s'}}>Back to Shop 💅</Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetails;