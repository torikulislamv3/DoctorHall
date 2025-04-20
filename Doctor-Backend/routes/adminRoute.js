import express from "express";
import { addDoctor, allDoctors, loginAdmin } from '../controllers/adminController.js';
import upload from '../middlewares/multer.js';
import authAdmin from "../middlewares/authAdmin.js";

const adminRouter = express.Router();

// Route to add a doctor, requires admin authorization and an image upload
adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor);

// Route to log in as an admin and generate a token
adminRouter.post('/login', loginAdmin);

// get all doctor for admin panel
adminRouter.post('/all-doctors', authAdmin , allDoctors);

export default adminRouter;
