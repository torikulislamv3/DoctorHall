import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>

      <div className='text-2xl pt-10 text-gray-500 text-center'>
        <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
      </div>
      <div className='flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>
          We aim to connect patients with skilled, compassionate doctors. Our platform simplifies appointment booking, ensuring quality healthcare is just a click away—reliable, accessible, and tailored to your needs.
          </p>
          <p>
          We provide a trusted digital space where users can find top-rated doctors by specialty. With verified profiles and real-time availability, you can easily choose the right doctor for your health journey.
          </p>
          <b>Our Vision</b>
          <p>
          Your health is our priority. We bring transparency, convenience, and care together—making it easy to find expert doctors, read reviews, and book appointments without hassle.
          </p>
        </div>
      </div>

      <div className='text-xl my-4'>
        <p>WHY <span className='text-gray-700 font-semibold'>CHOOSE US</span></p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>
          <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
            <b>EFFICIENCY:</b>
            <p>Quick access to top doctors with real-time availability updates.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
            <b>CONVENIENCE:</b>
            <p>Book appointments anytime, anywhere—no long waits or calls.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
            <b>PERSONALIZATION:</b>
            <p>Tailored doctor recommendations based on your unique health needs.</p>
          </div>
      </div>
      
    </div>
  )
}

export default About
