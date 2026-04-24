import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const CouponSection = () => {
  const [couponCode, setCouponCode] = useState('');
  const { applyCoupon, appliedCoupon, removeCoupon } = useCart();

  // Handle Apply Action
  const handleApply = async () => {
    if (!couponCode.trim()) {
      return toast.error("Please enter a code 💅");
    }

    const isSuccessful = await applyCoupon(couponCode); 
    
    if (isSuccessful === true) {
      toast.success("Coupon Applied! ✨");
      setCouponCode('');
    } else {
      toast.error("Invalid coupon code 💅");
    }
  };

  
  const handleRemoveAction = () => {
    removeCoupon();
    toast.success("Coupon removed"); 
  };

  return (
    <div style={{ margin: '20px 0' }}>
      {appliedCoupon ? (
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          background: 'rgba(74, 37, 53, 0.05)', 
          padding: '12px 20px', 
          borderRadius: '12px',
          border: '1px dashed #4a2535'
        }}>
          <span style={{ color: '#4a2535', fontWeight: '600', fontSize: '0.9rem' }}>
            ✨ {appliedCoupon.code} Applied
          </span>
          <button 
            onClick={handleRemoveAction}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#ff4d4d', 
              cursor: 'pointer', 
              fontWeight: '700',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            Remove
          </button>
        </div>
      ) : (
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="ENTER COUPON CODE"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            style={{
              flex: 1,
              padding: '12px 15px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '0.85rem',
              letterSpacing: '1px',
              outline: 'none',
              fontFamily: 'Montserrat, sans-serif'
            }}
          />
          <button
            onClick={handleApply}
            style={{
              backgroundColor: '#4a2535',
              color: 'white',
              padding: '0 25px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: '600',
              letterSpacing: '1px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.opacity = '0.9'}
            onMouseOut={(e) => e.target.style.opacity = '1'}
          >
            APPLY
          </button>
        </div>
      )}
    </div>
  );
};

export default CouponSection;