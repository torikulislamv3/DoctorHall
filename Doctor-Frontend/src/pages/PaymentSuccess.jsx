import React, { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const { data } = await axios.get('http://localhost:4000/api/payment/success');

        if (data.success) {
          toast.success('✅ Payment Successful! Redirecting to My Appointments...');
          // Optional: Delay a bit so user can see the toast
          setTimeout(() => {
            navigate('/my-appointments');
          }, 2500);
        } else {
          toast.error('❌ Payment verification failed.');
          navigate('/');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        toast.error('❌ Something went wrong during payment verification.');
        navigate('/');
      }
    };

    verifyPayment();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <h2 className="text-xl text-gray-700">Verifying payment... Please wait.</h2>
    </div>
  );
}
