import express from "express";
import { addDoctor, allDoctors, loginAdmin, appointmentsAdmin, appointmentCancel, adminDashboard } from '../controllers/adminController.js';
import upload from '../middlewares/multer.js';
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailablity } from "../controllers/doctorController.js";

const adminRouter = express.Router();

// Route to add a doctor, requires admin authorization and an image upload
adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor);

// Route to log in as an admin and generate a token
adminRouter.post('/login', loginAdmin);

// get all doctor for admin panel
adminRouter.post('/all-doctors', authAdmin , allDoctors);
adminRouter.post('/change-availablity', authAdmin , changeAvailablity);
adminRouter.get('/appointments',authAdmin,appointmentsAdmin)
adminRouter.post('/cancel-appointment',authAdmin,appointmentCancel)
adminRouter.get('/dashboard', authAdmin, adminDashboard)

export default adminRouter;
