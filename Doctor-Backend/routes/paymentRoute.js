import express from 'express';
import { initiateSSLPayment, sslPaymentSuccess, sslPaymentFail, sslPaymentIPN } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/initiate', initiateSSLPayment);
router.post('/success', sslPaymentSuccess);
router.post('/fail', sslPaymentFail);
router.post('/ipn', sslPaymentIPN); // Optional but helpful


export default router;
