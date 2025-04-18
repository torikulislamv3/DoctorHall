import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import  { AdminContext } from '../context/AdminContext'
import {useNavigate} from 'react-router-dom'

const Navbar = () => {
    const {aToken,setAtoken} = useContext(AdminContext)
    const navigate = useNavigate()

    const logout = ()=> {
        navigate('/')
        aToken && setAtoken('')
        aToken && localStorage.removeItem('aToken')
    }
  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
       <div className='flex items-center gap-2 text-sm'>
    
            <div className='flex items-center justify-around cursor-pointer'>
     <img className='w-20 cursor-pointer rounded-md' src={assets.doctor_hall} alt="" />
     <p className='text-primary font-extrabold text-3xl'>DoctorHall</p>
     </div>
            <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>{aToken ? "Admin" : "Doctor"}</p>
       </div>
       <button onClick={logout} className='bg-primary text-white text-sm px-10 py-2 rounded-full'>Logout</button>
    </div>
  )
}

export default Navbar
