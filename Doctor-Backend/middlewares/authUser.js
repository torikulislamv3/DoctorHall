import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.json({ success: false, message: "Not Authorized. Try Again" });
    }

    const token = header.split(" ")[1];

    // Decode token payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ei line e user er decoded info rakhlam

    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export default authUser;
