import doctorModel from "../models/doctorModel.js";

// Change the availability of a doctor
const changeAvailablity = async (req, res) => {
    try {
        const { docId } = req.body;  // Get the docId from the request body

        if (!docId) {
            return res.status(400).json({ success: false, message: 'Doctor ID is required.' });
        }

        // Find the doctor by docId
        const docData = await doctorModel.findById(docId);
        if (!docData) {
            return res.status(404).json({ success: false, message: 'Doctor not found.' });
        }

        // Toggle the availability
        const updatedDoctor = await doctorModel.findByIdAndUpdate(docId, {
            available: !docData.available
        }, { new: true }); // `new: true` will return the updated document

        return res.status(200).json({
            success: true,
            message: 'Availability changed successfully.',
            doctor: updatedDoctor // Optionally return updated doctor info
        });

    } catch (error) {
        console.error('Error updating availability:', error);
        return res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
};

const doctorList = async (req, res)=>{
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({success:true, doctors})
    } catch (error) {
        console.error( error.message);
        return res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
}

export { changeAvailablity, doctorList };
