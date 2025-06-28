'use client'
import React, { useState } from 'react'; 
import { motion } from 'framer-motion';
import Button from '../Button';
import Navbar from '../Navbar';
import { useCheckRole } from '@/utils/client-checkRole';

const HeroSection = () => {
  const isAdmin = useCheckRole('admin');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const textVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      filter: "blur(10px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      filter: "blur(10px)"
    },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.5
      }
    }
  };

  const navbarVariants = {
    hidden: { 
      opacity: 0, 
      y: -50,
      filter: "blur(10px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className='w-full min-h-screen relative overflow-hidden'>
      <motion.div
        variants={navbarVariants}
        initial="hidden"
        animate="visible"
      >
        <Navbar />
      </motion.div>
      
      <motion.div 
        className='absolute top-0 overflow-hidden left-0 w-full h-full bg-black/50 flex flex-col md:px-26 px-10 lg:px-32 justify-start py-20 text-white z-10'
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className='text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-4 mt-20 text-gradient leading-tight'
          variants={textVariants}
        >
          Products That <br /> Sets the Bar
        </motion.h1>
        
        <motion.button
          className="px-3 py-1 md:px-4 md:py-2 cursor-pointer hover:text-blue-200 rounded-full
                     text-white font-medium transition-all duration-300 hover:shadow-lg shadow-xl
                      bg-white/10 text-lg md:text-xl backdrop-blur-lg border border-white/20
                      focus:outline-none w-fit absolute bottom-10 right-10 focus:ring-2 focus:ring-white focus:ring-opacity-50"
          variants={buttonVariants}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 20px 40px rgba(255, 255, 255, 0.1)"
          }}
          whileTap={{ scale: 0.95 }}
        >
          Contact Us
        </motion.button>
      </motion.div>

      <motion.video 
        src='/vidbg.mp4' 
        className='absolute top-1/2 left-1/2 w-auto min-w-full min-h-full max-w-none -translate-x-1/2 -translate-y-1/2 object-cover'
        autoPlay
        loop
        muted
        playsInline
        initial={{ scale: 1.1, filter: "blur(5px)" }}
        animate={{ 
          scale: 1, 
          filter: "blur(0px)",
          transition: { duration: 2, ease: "easeOut" }
        }}
      />
    </div>
  );
}

export default HeroSection;