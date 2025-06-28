'use client'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { ShoppingCart, Shield, Package, ClipboardList } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCheckRole } from '@/utils/client-checkRole';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@clerk/nextjs';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter()
    const isAdmin = useCheckRole('admin')
    const { getTotalItems } = useCart();
    const { isSignedIn } = useAuth();

    return (
        <motion.nav 
            className="fixed top-0 left-0 w-full z-[9999] px-2 md:px-4 bg-black/20 backdrop-blur-lg border-b border-white/10"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <div className="flex items-center justify-between max-w-7xl mx-auto py-3 px-6">
                <motion.div 
                    onClick={() => router.push('/')}
                    className="text-white text-2xl md:text-3xl font-extrabold tracking-wide cursor-pointer select-none"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    SAST Shop
                </motion.div>

                <div className="flex items-center space-x-3 md:space-x-4">
                    {/* Products Button */}
                    <motion.button
                        onClick={() => router.push('/products')}
                        className="px-3 py-2 md:px-4 md:py-2 cursor-pointer hover:text-blue-200 rounded-full
                       text-white font-medium transition-all duration-300 hover:shadow-lg
                        bg-white/10 text-sm md:text-base backdrop-blur-lg border border-white/20
                        focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 flex items-center gap-2"
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Package size={18} />
                        <span className="hidden sm:inline">Products</span>
                    </motion.button>

                    {/* My Orders Button - Only show when signed in */}
                    {isSignedIn && (
                        <motion.button
                            onClick={() => router.push('/orders')}
                            className="px-3 py-2 md:px-4 md:py-2 cursor-pointer hover:text-blue-200 rounded-full
                           text-white font-medium transition-all duration-300 hover:shadow-lg
                            bg-white/10 text-sm md:text-base backdrop-blur-lg border border-white/20
                            focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 flex items-center gap-2"
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ClipboardList size={18} />
                            <span className="hidden sm:inline">Orders</span>
                        </motion.button>
                    )}

                    {/* Admin Button */}
                    {isAdmin && (
                        <motion.button
                            onClick={() => router.push('/admin')}
                            className="px-3 py-2 md:px-4 md:py-2 cursor-pointer hover:text-blue-200 rounded-full
                           text-white font-medium transition-all duration-300 hover:shadow-lg
                            bg-white/10 text-sm md:text-base backdrop-blur-lg border border-white/20
                            focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 flex items-center gap-2"
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Shield size={18} />
                            <span className="hidden sm:inline">Admin</span>
                        </motion.button>
                    )}

                    {/* Cart Button */}
                    <motion.div 
                        onClick={() => router.push('/cart')}
                        className="text-white cursor-pointer rounded-full
                            bg-white/10 backdrop-blur-lg border border-white/20 px-3 py-2 hover:text-blue-200 transition-colors duration-200 relative"
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ShoppingCart size={20} />
                        {getTotalItems() > 0 && (
                            <motion.span 
                                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            >
                                {getTotalItems()}
                            </motion.span>
                        )}
                    </motion.div>

                    {/* Auth Buttons */}
                    <SignedOut>
                        <SignInButton mode='modal'>
                            <motion.button
                                className="px-3 py-2 md:px-4 md:py-2 cursor-pointer hover:text-blue-200 rounded-full
                             text-white font-medium transition-all duration-300 hover:shadow-lg
                             bg-white/10 text-sm md:text-base backdrop-blur-lg border border-white/20
                             focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Sign In
                            </motion.button>
                        </SignInButton>
                        <SignUpButton mode='modal'>
                            <motion.button
                                className="px-3 py-2 md:px-4 md:py-2 cursor-pointer hover:text-blue-200 rounded-full
                       text-white font-medium transition-all duration-300 hover:shadow-lg
                        bg-white/10 text-sm md:text-base backdrop-blur-lg border border-white/20
                        focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Signup
                            </motion.button>
                        </SignUpButton>
                    </SignedOut>

                    <SignedIn>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <UserButton />
                        </motion.div>
                    </SignedIn>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;