import jwt from 'jsonwebtoken'

const authAdmin = async (req, res, next) => {
    try {
        const header = req.headers.authorization;

        if (!header || !header.startsWith("Bearer ")) {
            return res.json({ success: false, message: 'Not Authorized. Try Again' });
        }

        const token = header.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.json({ success: false, message: 'Not Authorized. Try Again' });
        }

        next();

    } catch (error) {
        console.log("Admin Auth Error:", error.message)
        res.json({ success: false, message: error.message })
    }
}

export default authAdmin;
