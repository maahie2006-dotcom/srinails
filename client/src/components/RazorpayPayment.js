import React from 'react';
import axios from 'axios';

const RazorpayPayment = ({ amount, cartItems }) => {
    
    const handlePayment = async () => {
        try {
            // 1. Create order on your Node.js backend
            // Note: Use your backend URL (usually http://localhost:5000)
            const { data } = await axios.post('http://localhost:5000/api/payment/orders', {
                amount: amount // Amount in Rupees
            });

            // 2. Options for the Razorpay Modal
            const options = {
                key: "rzp_test_SfD4JHwbQx6ZE9", // Your Test Key ID
                amount: data.amount,
                currency: data.currency,
                name: "SriNails",
                description: "Handcrafted Luxury Nails",
                order_id: data.id,
                handler: async function (response) {
                    // 3. Verify payment signature on backend
                    const verifyData = {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    };

                    const { data: verifyResult } = await axios.post('http://localhost:5000/api/payment/verify', verifyData);

                    if (verifyResult.success) {
                        alert("Payment Successful! Your order is placed.");
                        // Optional: Clear cart or redirect to success page
                    }
                },
                prefill: {
                    name: "Mahi Chauhan", 
                    email: "mahi@example.com",
                },
                theme: {
                    color: "#4a2535", // Matching your SriNails theme color
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error("Payment Error:", error);
            alert("Payment failed to initialize. Is your backend running?");
        }
    };

    return (
        <button 
            onClick={handlePayment}
            style={{ 
                backgroundColor: '#4a2535', 
                color: 'white', 
                padding: '10px 20px', 
                border: 'none', 
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
            }}
        >
            Checkout & Pay (Test Mode)
        </button>
    );
};

export default RazorpayPayment;