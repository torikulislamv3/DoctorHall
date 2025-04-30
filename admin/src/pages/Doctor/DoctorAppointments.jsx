import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'

export default function DoctorAppointments() {

  const {dToken, appointments, getAppointments} = useContext(DoctorContext)
  
  useEffect(()=>{
        if (dToken) {
          getAppointments()
        }
  },[dToken])

  return (
    <div>
      
    </div>
  )
}
