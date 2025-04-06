import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>CONTACT <span className='text-gray-700 font-semibold'>US</span></p>
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>

        <img className='w-full md:max-w-[360px]' src={assets.contact_image} alt="" />

        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-lg text-gray-600'>OUR OFFICE</p>
          <p className='text-gray-500'>54709 Willms Station <br /> Suit 350, Washington : USA</p>
          <p className='text-gray-500'>
            Tel : +212-000-1576-240 <br />
            Email : doctorhall247@gmail.com
          </p>
          <p className='font-semibold text-lg text-gray-600'>Career at DoctorHall</p>
          <p className='text-gray-500'>Learn more about our teams and job opening...</p>
          <button className='border border-black text-sm px-8 py-4 hover:bg-black hover:text-white transition-all duration-500'>Explore Jobs</button>
        </div>

      </div>

    </div>
  )
}

export default Contact
