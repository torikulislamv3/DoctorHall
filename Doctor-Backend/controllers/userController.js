import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'

// API  to register user

const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' })
        }
        // validating email formate
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'Enter your valid email' })
        }
        // validating password formate
        if (password.length < 8) {
            return res.json({ success: false, message: 'Enter a strong password' })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        res.json({ success: true, token })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

}

// API for user login
const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: 'user does not exist' })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "invalid credentials" })
        }

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }

}

// API to get User Profile Data
const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;  // Using req.user.id instead of req.body.userId
        const userData = await userModel.findById(userId).select('-password');

        if (!userData) {
            return res.json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, userData });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
}
// API for update user Profile
const updateProfile = async (req, res) => {
    try {
      const { name, phone, address, dob, gender } = req.body;
      const userId = req.user.id; // Get userId from auth middleware
      const imageFile = req.file;
  
      if (!name || !phone || !dob || !gender) {
        return res.json({ success: false, message: "Missing Details" });
      }
  
      await userModel.findByIdAndUpdate(userId, {
        name,
        phone,
        address: JSON.parse(address),
        dob,
        gender,
      });
  
      if (imageFile) {
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
          resource_type: "image",
        });
        const imageUrl = imageUpload.secure_url;
        await userModel.findByIdAndUpdate(userId, { image: imageUrl });
      }
  
      res.json({ success: true, message: "Profile updated" });
    } catch (error) {
      console.log(error);
      return res.json({ success: false, message: error.message });
    }
  };


export { registerUser, loginUser, getProfile, updateProfile }