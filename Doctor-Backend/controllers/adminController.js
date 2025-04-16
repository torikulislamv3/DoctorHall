
import validator from 'validator';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js';

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

export { addDoctor };

