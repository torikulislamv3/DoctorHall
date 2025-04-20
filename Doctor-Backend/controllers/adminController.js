import validator from 'validator';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import jwt from 'jsonwebtoken';

const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;

    const imageFile = req.file;

    console.log("Request Body:", req.body);
    console.log("File Data:", imageFile);

    if (
      !name || !email || !password || !speciality || !degree ||
      !experience || !about || !fees || !address || !imageFile
    ) {
      return res.json({ success: false, message: 'Missing Details' });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Please enter a valid email' });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: 'Please enter a strong password' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upload buffer to Cloudinary using base64
    const base64Image = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString('base64')}`;

    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: 'doctors',
    });

    const imageUrl = uploadResponse.secure_url;

    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.json({ success: true, message: 'Doctor Added' });

  } catch (error) {
    console.log("Add Doctor Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// API FOR ADMIN LOGIN

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the provided email and password match the admin credentials
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {

      // Create JWT token (use email and other relevant data as payload)
      const payload = {
        email: email, // Or you could add other fields like user ID if necessary
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // Set expiration for 1 hour

      res.json({ success: true, token });  // Send token as response

    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log("Admin Login Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to get all doctors list for admin panel

const allDoctors = async (req, res) => {

  try {

    const doctors = await doctorModel.find({}).select('-password')
    res.json({ success: true, doctors })

  } catch (error) {
    console.log("Admin Login Error:", error.message);
    res.json({ success: false, message: error.message });
  }

}


export { addDoctor, loginAdmin, allDoctors };
