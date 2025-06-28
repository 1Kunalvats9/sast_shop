'use client'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { ShoppingCart, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useCheckRole } from '@/utils/client-checkRole';
import { useCart } from '@/context/CartContext';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter()
    const isAdmin = useCheckRole('admin')
    const { getTotalItems } = useCart();

    return (
        <nav className="fixed top-0 overflow-hidden left-0 w-full z-50 px-2 md:px-4">
            <div className="flex items-center justify-between max-w-7xl mx-auto py-2 px-6">
                <div 
                    onClick={() => router.push('/')}
                    className="text-white text-2xl md:text-3xl font-extrabold tracking-wide cursor-pointer select-none"
                >
                    SAST Shop
                </div>

                <div className="flex items-center space-x-6 p-3">
                    {
                        isAdmin && 
                        <button
                            onClick={() => router.push('/admin')}
                            className="px-3 py-1 md:px-4 md:py-2 cursor-pointer hover:text-blue-200 rounded-full
                           text-white font-medium transition-all duration-300 hover:shadow-lg shadow-xl
                            bg-white/10 text-lg md:text-xl backdrop-blur-lg border border-white/20
                            focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 flex items-center gap-2"
                        >
                            <Shield size={20} />
                            Admin
                        </button>
                    }
                    <div onClick={()=>{
                        router.push('/cart')
                    }} className="text-white cursor-pointer rounded-2xl shadow-xl
                        bg-white/10 backdrop-blur-lg border border-white/20 px-2 py-1 md:px-3 md:py-2 hover:text-blue-200 transition-colors duration-200 relative">
                        <ShoppingCart />
                        {getTotalItems() > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {getTotalItems()}
                            </span>
                        )}
                    </div>
                    <SignedOut>
                        <SignInButton mode='modal'>
                            <button
                                className="px-3 py-1 md:px-4 md:py-2 cursor-pointer hover:text-blue-200 rounded-full
                             text-white font-medium transition-all duration-300 hover:shadow-lg shadow-xl
                             bg-white/10 text-lg md:text-xl backdrop-blur-lg border border-white/20
                             focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                            >
                                Sign In
                            </button>
                        </SignInButton>
                        <SignUpButton mode='modal'>
                            <button
                                className="px-3 py-1 md:px-4 md:py-2 cursor-pointer hover:text-blue-200 rounded-full
                       text-white font-medium transition-all duration-300 hover:shadow-lg shadow-xl
                        bg-white/10 text-lg md:text-xl backdrop-blur-lg border border-white/20
                        focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                            >
                                Signup
                            </button>
                        </SignUpButton>
                    </SignedOut>

                    <SignedIn>
                        <UserButton />
                    </SignedIn>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;