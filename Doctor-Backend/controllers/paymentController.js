import { v4 as uuidv4 } from 'uuid';
import { config } from 'dotenv';
import SSLCommerzPayment from 'sslcommerz-lts';
import appointmentModel from '../models/appointmentModel.js';

config(); // Load environment variables

// 1️⃣ Initiate Payment
export const initiateSSLPayment = async (req, res) => {
  const { total_amount, user, appointmentId } = req.body;

  const transactionId = uuidv4(); // Unique transaction ID

  const data = {
    total_amount: total_amount,
    currency: 'BDT',
    tran_id: transactionId,
    success_url: 'http://localhost:4000/api/payment/success',
    fail_url: 'http://localhost:4000/api/payment/fail',
    cancel_url: 'http://localhost:5173/cancel',
    ipn_url: 'http://localhost:4000/api/payment/ipn',
    shipping_method: 'No',
    product_name: 'Appointment Booking',
    product_category: 'Medical',
    product_profile: 'general',
    cus_name: user.name,
    cus_email: user.email,
    cus_add1: user.address || 'N/A',
    cus_phone: user.phone,
    cus_city: 'Dhaka',
    cus_country: 'Bangladesh',
    value_a: appointmentId,
  };

  const sslcz = new SSLCommerzPayment(
    process.env.SSL_STORE_ID,
    process.env.SSL_STORE_PASSWORD,
    false // false = sandbox mode
  );

  try {
    const apiResponse = await sslcz.init(data);
    if (apiResponse?.GatewayPageURL) {
      res.json({ success: true, url: apiResponse.GatewayPageURL });
    } else {
      res.status(500).json({ success: false, message: 'Payment initialization failed' });
    }
  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2️⃣ Success Handler
export const sslPaymentSuccess = async (req, res) => {
  try {
    console.log('Payment Success Webhook Body:', req.body); // Log the whole request body

    const { value_a, transaction_id, status } = req.body; // Extract appointmentId and transaction_id

    if (status !== 'VALID') {
      return res.status(400).json({
        success: false,
        message: '❌ Invalid payment response received.',
      });
    }

    // Check if value_a (appointmentId) is provided
    if (!value_a) {
      return res.status(400).json({
        success: false,
        message: '❌ Appointment ID missing in the request.',
      });
    }

    // Find the appointment by appointmentId
    const appointment = await appointmentModel.findById(value_a);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: '❌ Appointment not found.',
      });
    }

    // Update the appointment with payment status and transaction info
    const updatedAppointment = await appointmentModel.findByIdAndUpdate(
      value_a,
      {
        payment: true,
        payment_date: new Date(), // Set current date and time
        transaction_id: transaction_id, // Use the transaction ID from the payment response
      },
      { new: true } // To return the updated document
    );

    console.log('Updated Appointment:', updatedAppointment); // Verify the updated appointment

    // Send success response
    res.status(200).json({
      success: true,
      message: '✅ Appointment updated successfully',
      data: updatedAppointment,
    });
  } catch (error) {
    console.error('Error during payment success handling:', error);
    res.status(500).json({
      success: false,
      message: '❌ Server error while processing payment.',
    });
  }
};

// 3️⃣ Fail Handler
export const sslPaymentFail = (req, res) => {
  const { status, message } = req.body; // Extract status or message from the failure response
  console.log('Payment Failed:', req.body);
  res.status(400).json({
    success: false,
    message: `❌ Payment Failed: ${message || status}`,
  });
};

// 4️⃣ Optionally: IPN handler if needed later
export const sslPaymentIPN = (req, res) => {
  console.log('IPN Received:', req.body);
  const { status, transaction_id } = req.body;
  
  if (status === 'VALID') {
    // Handle payment success from IPN (if necessary)
  } else {
    console.error('Invalid IPN message received:', req.body);
  }

  res.status(200).json({ message: 'IPN Received', data: req.body });
};
