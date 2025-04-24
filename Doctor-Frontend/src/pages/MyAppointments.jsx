import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

export default function MyAppointments() {

  const { backendUrl, token } = useContext(AppContext)

  const [appointments, setAppointments] = useState([])

  const getUserAppointments = async () => {
    try {
      // Check if token and backendUrl are available
      if (!token || !backendUrl) {
        toast.error("Missing token or backend URL");
        return;
      }
  
      const { data } = await axios.get(backendUrl + '/api/user/appointments', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (data.success) {
        setAppointments(data.appointments.reverse());
        console.log(data.appointments);
      } else {
        toast.error("No appointments found");
      }
    } catch (error) {
      // Improved error handling
      console.log(error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  }

  useEffect(()=>{
    if (token) {
      getUserAppointments()
    }
  },[token])

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>
      {
        appointments.map((item, index) => (
          <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
            <div>
              <img className='w-32 bg-indigo-50' src={item.docData.image} alt="" />
            </div>
            <div className='flex-1 text-zinc-600 text-sm'>
              <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
              <p>{item.docData.speciality}</p>
              <p className='text-zinc-700 font-medium mt-1'>Address:</p>
              <p className='text-xs'>{item.docData.address.line1}</p>
              <p className='text-xs'>{item.docData.address.line1}</p>
              <p className='text-xm mt-1 '><span className='text-sm text-neutral-700 font-medium'>Date & Time:</span>{item.slotDate} | {item.slotTime}  </p>
            </div>

            <div></div>

            <div className='flex flex-col gap-2 justify-end'>
              <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>Pay Online</button>
              <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel Appointment</button>
            </div>
          </div>
        ))
      }
    </div>
  )
}
