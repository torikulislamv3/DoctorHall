import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRouter.js'
import paymentRoute from './routes/paymentRoute.js'

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())

// api endpoint
app.use('/api/admin',adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)

// for ssl-commerz payment method
app.use('/api/payment', paymentRoute);




app.get('/', (req, res) => {
    res.send('API WORKING FOR DoctorHall')
})

app.listen(port, () => console.log('Server is running on :', port))
