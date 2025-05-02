import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";

// Change the availability of a doctor
const changeAvailablity = async (req, res) => {
  try {
    const { docId } = req.body; // Get the docId from the request body

    if (!docId) {
      return res
        .status(400)
        .json({ success: false, message: "Doctor ID is required." });
    }

    // Find the doctor by docId
    const docData = await doctorModel.findById(docId);
    if (!docData) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found." });
    }

    // Toggle the availability
    const updatedDoctor = await doctorModel.findByIdAndUpdate(
      docId,
      {
        available: !docData.available,
      },
      { new: true }
    ); // `new: true` will return the updated document

    return res.status(200).json({
      success: true,
      message: "Availability changed successfully.",
      doctor: updatedDoctor, // Optionally return updated doctor info
    });
  } catch (error) {
    console.error("Error updating availability:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
    res.json({ success: true, doctors });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// API for login Doctor
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      return res.json({ success: false, message: "invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);

    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "invalid credentials" });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// API to get appointment for doctor route

const appointmentsDoctor = async (req, res) => {
  try {
    const docId = req.doctorId; // ✅ From middleware
    const appointments = await appointmentModel.find({ docId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.error("appointmentsDoctor Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

//   API to mark appointment completed for doctor panel

const appointmentComplete = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const docId = req.doctorId;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (
      appointmentData &&
      appointmentData.docId.toString() === docId.toString()
    ) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
      return res.json({ success: true, message: "Appointment completed" });
    } else {
      return res.json({
        success: false,
        message: "Mark failed: unauthorized or invalid",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const docId = req.doctorId;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (
      appointmentData &&
      appointmentData.docId.toString() === docId.toString()
    ) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });
      return res.json({ success: true, message: "Appointment cancelled" });
    } else {
      return res.json({
        success: false,
        message: "Canceling failed: unauthorized or invalid",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
  try {
    const docId = req.doctorId;

    const appointments = await appointmentModel.find({ docId });

    let earnings = 0;

    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
    });

    let patients = [];

    appointments.map((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };
    res.json({ success: true, dashData });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// API to get doctor profile for doctor panel
const doctorProfile = async (req, res) => {
  try {
    const docId = req.doctorId;

    const profileData = await doctorModel.find(docId).select("-password");
    res.json({ success: true, profileData });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// APT to update doctor profile by the doctor panel
const updateDoctorProfile = async (req, res) => {
  try {
    const docId = req.doctorId;
    const { fees, address, available } = req.body;
    await doctorModel.findByIdAndUpdate(docId, { fees, address, available });
    res.json({ success: true, message: "profile updated" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export {
  changeAvailablity,
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  appointmentCancel,
  appointmentComplete,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
};
