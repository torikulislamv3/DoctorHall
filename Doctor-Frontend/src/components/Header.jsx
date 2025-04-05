import React from 'react'
import { assets } from '../assets/assets'

export default function Header() {
  return (
    <div className='flex flex-col md:flex-row flex-wrap bg-primary rounded-lg md:px-10'>
      {/* -----left side------ */}

      <div className='md:w-1/2 flex flex-col items-center md:items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]'>
            <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight'>
                Book Appointments <br /> With Trusted Doctors
            </p>
            <div className='flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light'>
                <img className='w-28' src={assets.group_profiles} alt="" />
                <p className='mx-5 md:mx-0'>
                    Simply browse throught our extensive list of our trusted doctors, <br className='hidden md:block' /> schedule your Appointment hassle-free.
                </p>
            </div>
            <a className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300' href="#speciality">
                Book Appointment <img className='w-3' src={assets.arrow_icon} alt="" />
            </a>
      </div>
      {/* -----right side ------ */}

      <div className='md:w-1/2 relative'>
            <img className='w-full md:h-3/4 md:absolute bottom-0 h-auto rounded-lg' src={assets.header_img} alt="" />
      </div>
    </div>
  )
}
