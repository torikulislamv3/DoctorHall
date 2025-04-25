import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import streamifier from 'streamifier'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'

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
      const userId = req.user.id;
      const { name, phone, address, dob, gender } = req.body;
      const imageFile = req.file;
  
      if (!name || !phone || !dob || !gender) {
        return res.json({ success: false, message: "Missing Details" });
      }
  
      await userModel.findByIdAndUpdate(userId, {
        name,
        phone,
        address: typeof address === 'string' ? JSON.parse(address) : address,
        dob,
        gender,
      });
  
      if (imageFile) {
        const streamUpload = (buffer) => {
          return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { resource_type: "image" },
              (error, result) => {
                if (result) resolve(result);
                else reject(error);
              }
            );
            streamifier.createReadStream(buffer).pipe(stream);
          });
        };
  
        const imageUpload = await streamUpload(imageFile.buffer);
        const imageUrl = imageUpload.secure_url;
  
        await userModel.findByIdAndUpdate(userId, { image: imageUrl });
      }
  
      res.json({ success: true, message: "profile updated" });
    } catch (error) {
      console.log(error);
      return res.json({ success: false, message: error.message });
    }
  };

  // API to book appointment
  const bookAppointment = async (req, res)=>{
    try {
      const userId = req.user.id;
        const { docId, slotDate, slotTime} = req.body
        const docData = await doctorModel.findById(docId).select('-password')

        if (!docData.available) {
          return res.json({success:false, message:'doctor is not available'})
        }

        let slots_booked = docData.slots_booked

        // checking for slot availability
        if (slots_booked[slotDate]) {
          if (slots_booked[slotDate].includes(slotTime)) {
            return res.json({success:false, message:'slot not available'})
          }else {
            slots_booked[slotDate].push(slotTime)
          }
        } else {
          slots_booked[slotDate] = []
          slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password')

        delete docData.slots_booked

        const appointmentData = {
          userId,
          docId,
          userData,
          docData,
          amount:docData.fees,
          slotTime,
          slotDate,
          date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // save new slots data in docData
          await doctorModel.findByIdAndUpdate(docId,{slots_booked})
          res.json({success:true, message:'Appointment booked confirm'})

    } catch (error) {
      console.log(error);
      return res.json({ success: false, message: error.message });
    }
  }

  
  const listAppointment = async (req, res) => {
    try {
      const userId = req.user.id;
      
      const appointments = await appointmentModel.find({ userId });
  
      // Log the appointments fetched from the database
      console.log("Appointments found:", appointments);
      
      res.json({ success: true, appointments });
    } catch (error) {
      console.log(error);
      return res.json({ success: false, message: error.message });
    }
  };
  

  // API to cancel appointment
  const cancelAppointment = async (req, res) => {
    try {
      const { appointmentId } = req.body;
      const userId = req.user.id;
  
      const appointmentData = await appointmentModel.findById(appointmentId);
  
      if (!appointmentData) {
        return res.json({ success: false, message: 'Appointment not found' });
      }
  
      // verify user appointment
      if (appointmentData.userId.toString() !== userId) {
        return res.json({ success: false, message: 'Unauthorized action' });
      }
  
      await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
  
      // releasing doctor slot
      const { docId, slotDate, slotTime } = appointmentData;
      const doctorData = await doctorModel.findById(docId);
      let slots_booked = doctorData.slots_booked;
  
      if (slots_booked[slotDate]) {
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
      }
  
      await doctorModel.findByIdAndUpdate(docId, { slots_booked });
  
      res.json({ success: true, message: 'Appointment cancelled' });
    } catch (error) {
      console.log(error);
      return res.json({ success: false, message: error.message });
    }
  };

  
  //  API to payment for appointment using razorpay
  


export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment }