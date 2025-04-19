
import jwt from 'jsonwebtoken';

const authAdmin = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.json({ success: false, message: 'Not Authorized. Try Again' });
    }

    const token = header.split(" ")[1];

    // Decode token payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the decoded email is the same as the admin email
    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.json({ success: false, message: 'Not Authorized. Try Again' });
    }

    next();  // If everything is okay, proceed to the next middleware or route handler

  } catch (error) {
    console.log("Admin Auth Error:", error.message);
    res.json({ success: false, message: error.message });
  }
}

export default authAdmin;
