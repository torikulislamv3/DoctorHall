# 🏥 DoctorHall

DoctorHall is a complete medical appointment and consultation platform designed to bridge the gap
between doctors and patients. With a focus on efficiency, security, and user experience, DoctorHall
enables users to book appointments, consult with doctors, upload reports,
and make payments—all in one place.

---
## 🌐 Live Demo

🔗 [Visit Live Site](https://doctor-frontend-v2x6.onrender.com)
---

## 🌟 Features

- 🔐 User authentication (JWT + bcryptjs)
- 🩺 Doctor dashboard for managing appointments and patients
- 📅 Appointment booking and schedule management
- ❌ Cancelling appointments by patient or doctor
- ✅ Completing appointments with feedback option
- 🗂️ Upload and access profile users and doctors (Cloudinary)
- 💬 Doctor-patient communication
- 💳 Payment gateway integration (SSLCommerz)
- 📈 Admin features for management and monitoring

---

## 📁 Project Structure

DoctorHall/
├── Doctor-Frontend/ # React-based frontend
│ ├── public/
│ └── src/
│ ├── components/
│ ├── pages/
│ ├── hooks/
│ └── App.jsx
│
├── Doctor-Backend/ # Express backend
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ ├── utils/
│ └── server.js
│
├── README.md
└── .env (add your secrets here)


---

## 🚀 Tech Stack

### Frontend:
- React.js
- Tailwind CSS
- DaisyUI
- Axios

### Backend:
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT (Authentication)
- bcryptjs (Password hashing)
- Multer (File uploads)
- Cloudinary (Image hosting)
- Razorpay / SSLCommerz (Payment gateways)

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/torikulislamv3/DoctorHall.git
cd DoctorHall


### Backend Setup

cd Doctor-Backend
npm install
npm run server


Create a .env file with:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
STORE_ID=your_sslcommerz_id
STORE_PASSWORD=your_sslcommerz_password


### Frontend Setup

cd ../Doctor-Frontend
npm install
npm run dev

 ** Author **
MD TORIKUL ISLAM
Frontend Developer & Full Stack Enthusiast
https://www.linkedin.com/in/md-torikulislam/


