'use client'
import { ShoppingCart, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SignInButton, useAuth } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import { useCart } from '@/context/CartContext';

const ProductSection = ({ showFeaturedOnly = false }) => {
  const { isSignedIn } = useAuth();
  const [showSignInPopup, setShowSignInPopup] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, [showFeaturedOnly]);

  const fetchProducts = async () => {
    try {
      const url = showFeaturedOnly ? '/api/products?featured=true' : '/api/products';
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.products);
      } else {
        console.error('Failed to fetch products:', data.error);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    if (!isSignedIn) {
      setShowSignInPopup(true);
      return;
    }

    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const titleVariants = {
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
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      filter: "blur(5px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  if (loading) {
    return (
      <div className='w-full min-h-screen bg-black py-16 px-4 sm:px-6 lg:px-12 flex items-center justify-center'>
        <motion.div 
          className="text-white text-xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Loading products...
        </motion.div>
      </div>
    );
  }

  return (
    <div className='w-full min-h-screen bg-black py-16 px-4 sm:px-6 lg:px-12'>
      <motion.h1 
        className='text-center my-20 text-4xl sm:text-5xl md:text-6xl font-extrabold mb-16 text-gray-100'
        variants={titleVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {showFeaturedOnly ? 'Featured Products' : 'Our Products'}
      </motion.h1>

      <motion.div 
        className='grid grid-cols-1 mt-20 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[minmax(280px,auto)]'
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {products.map((product, index) => (
          <motion.div
            key={product._id}
            className="relative flex flex-col overflow-hidden bg-gray-800 rounded-2xl border border-gray-700 shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.01] hover:border-blue-500"
            variants={cardVariants}
            whileHover={{ 
              y: -10,
              boxShadow: "0 25px 50px rgba(59, 130, 246, 0.15)"
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 flex-shrink-0">
              <motion.img
                src={product.image}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover rounded-t-2xl"
                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x300/cccccc/333333?text=Image+Error'; }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
              {product.featured && (
                <motion.div 
                  className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
                >
                  Featured
                </motion.div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-t-2xl"></div>
            </div>
            
            <div className="p-5 flex flex-col flex-grow">
              <motion.h3 
                className="font-bold text-xl sm:text-2xl mb-2 text-gray-50 leading-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                {product.name}
              </motion.h3>
              <motion.p 
                className="text-sm sm:text-base text-gray-300 leading-relaxed flex-grow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.4 }}
              >
                {product.description}
              </motion.p>
              <motion.div 
                className="mt-2 flex justify-between items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.5 }}
              >
                <div className="text-white font-semibold text-lg">
                  ₹{product.price.toFixed(2)}
                </div>
                <div className="text-sm text-gray-400">
                  Stock: {product.stock}
                </div>
              </motion.div>
              <motion.button
                onClick={() => handleAddToCart(product)} 
                disabled={product.stock === 0}
                className={`mt-4 px-4 py-2 flex items-center gap-2 justify-center cursor-pointer rounded-lg transition-colors duration-200 self-end ${
                  product.stock === 0 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'bg-black border border-gray-50 text-white hover:bg-gray-700'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.6 }}
                whileHover={product.stock > 0 ? { scale: 1.05 } : {}}
                whileTap={product.stock > 0 ? { scale: 0.95 } : {}}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add To Cart'} 
                {product.stock > 0 && <ShoppingCart className="w-5 h-5"/>}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {products.length === 0 && (
        <motion.div 
          className="text-center py-12 text-gray-400"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xl">No products available</p>
        </motion.div>
      )}

      {showSignInPopup && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-40 backdrop-filter backdrop-blur-sm"
            onClick={() => setShowSignInPopup(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          <motion.div 
            className="relative bg-white/10 dark:bg-gray-700/20 backdrop-filter backdrop-blur-lg border border-white/20 dark:border-gray-600 rounded-xl shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center text-white z-10"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <button
              onClick={() => setShowSignInPopup(false)}
              className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-50">Sign In Required</h2>
            <p className="text-gray-200 mb-6">
              Please sign in to add items to your cart and proceed with your order.
            </p>
            <SignInButton mode="modal">
              <motion.button 
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In Now
              </motion.button>
            </SignInButton>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default ProductSection;