import express from "express";
import { addDoctor, loginAdmin } from '../controllers/adminController.js';
import upload from '../middlewares/multer.js';
import authAdmin from "../middlewares/authAdmin.js";

const adminRouter = express.Router();

// Route to add a doctor, requires admin authorization and an image upload
adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor);

// Route to log in as an admin and generate a token
adminRouter.post('/login', loginAdmin);

export default adminRouter;
