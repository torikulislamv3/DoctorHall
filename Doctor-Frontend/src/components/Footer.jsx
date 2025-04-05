import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <div className='md:mx-10'>
       <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            {/* -----Left side----- */}
            <div>
                {/* <img className='mb-5 w-40' src={assets.logo} alt="" /> */}
                <div className='flex items-center gap-2 cursor-pointer'>
                     <img className='w-20 cursor-pointer rounded-md' src={assets.doctorhall} alt="" />
                     <p className='text-primary font-extrabold text-3xl'>DoctorHall</p>
                     </div>
                <p className='w-full md:w-2/3 text-gray-600 leading-6'>
                Discover trusted healthcare professionals at your fingertips. Our platform connects you with top-rated doctors for hassle-free appointments, expert advice, and personalized care. Prioritize your health today and experience seamless medical support from the comfort of your home.
                </p>
            </div>

            {/* -----Center side----- */}
            <div>
                <p className='text-xl font-medium mb-5'>Company</p>
                <ul className='flex flex-col gap-2 text-gray-600 cursor-pointer'>
                    <li>
                       <Link to='/'>Home</Link>
                    </li>
                    <li>
                        <Link to='/about'>About us</Link>
                    </li>
                    <li>
                        <Link to='/contact'>Contact us</Link>
                    </li>
                    <li>
                        <Link to='/'>Privecy Policy</Link>
                    </li>
                </ul>
            </div>

            {/* -----Right side----- */}
            <div>
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>
                    <a href="tel:+8801234567890" className=" hover:underline">
                        +212-000-1576-240
                   </a>
                    </li>
                    <li>
                    <a href="mailto:doctorhall@gmail.com" className="hover:underline">
                        doctorhall247@gmail.com
                    </a>
                    </li>
                </ul>
            </div>
       </div>
       {/* -----copyright-resolve----- */}
       <div>
        <hr />
        <p className='py-5 text-sm text-center'>
            Copyright {new Date().getFullYear()} @ DoctorHall - All Rights Reserved
        </p>
       </div>
    </div>
  )
}
