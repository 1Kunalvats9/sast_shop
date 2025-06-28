'use client'
import React, { useState } from 'react'; 
import Button from '../Button';
import Navbar from '../Navbar';
import { useCheckRole } from '@/utils/client-checkRole';

const HeroSection = () => {
  const isAdmin = useCheckRole('admin');

  return (
    <div className='w-full min-h-screen relative overflow-hidden'>
      <Navbar />
      <div className='absolute top-0 overflow-hidden left-0 w-full h-full bg-black/50 flex flex-col md:px-26 px-10 lg:px-32 justify-start  py-20 text-white z-10'>
        <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-4 mt-20 text-gradient leading-tight'>
          Products That <br /> Sets the Bar
        </h1>
        <button
            className="px-3 py-1 md:px-4 md:py-2 cursor-pointer hover:text-blue-200 rounded-full
                       text-white font-medium transition-all duration-300 hover:shadow-lg shadow-xl
                        bg-white/10 text-lg md:text-xl backdrop-blur-lg border border-white/20
                        focus:outline-none w-fit absolute bottom-10 right-10 focus:ring-2 focus:ring-white focus:ring-opacity-50"
          >
            Contact Us
          </button>
      </div>

      <video src='/vidbg.mp4' className='absolute top-1/2 left-1/2 w-auto min-w-full min-h-full max-w-none -translate-x-1/2 -translate-y-1/2 object-cover'
        autoPlay
        loop
        muted
        playsInline/>
    </div>
  );
}

export default HeroSection;