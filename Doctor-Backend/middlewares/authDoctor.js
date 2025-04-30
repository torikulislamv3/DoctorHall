import jwt from 'jsonwebtoken';

const authDoctor = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: 'Not Authorized. Try Again' });
    }

    const dtoken = header.split(" ")[1];

    const decoded = jwt.verify(dtoken, process.env.JWT_SECRET);

    req.doctorId = decoded.id;

    next();  

  } catch (error) {
    console.log("User Auth Error:", error.message);
    res.status(401).json({ success: false, message: 'Unauthorized: ' + error.message });
  }
}

export default authDoctor;
