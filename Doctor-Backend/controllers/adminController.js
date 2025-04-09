
// API for adding doctor
const addDoctor = async(req, res)=> {
    try {
        const {name, email, password, speciality, degree, experience, about, fees, address} = req.body
        const imageFile = req.file

        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){
            return res.json({success:false,message:'Missing Details'})
        }

    } catch (error) {
        
    }
}


export {addDoctor}