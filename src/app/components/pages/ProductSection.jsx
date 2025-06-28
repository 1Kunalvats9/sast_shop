'use client'
import { ShoppingCart, X } from 'lucide-react';
import React, { useState } from 'react';
import { SignInButton, useAuth } from '@clerk/nextjs';
import toast from 'react-hot-toast';

const ProductSection = () => {
  const { isSignedIn } = useAuth();
  const [showSignInPopup, setShowSignInPopup] = useState(false);

  const products = [
    {
      id: 1,
      image: '/image.png',
      item_name: 'Immersive VR Headset Pro',
      item_description: 'Step into new realities with stunning visuals and haptic feedback. Compatible with all major gaming platforms.',
      price: 299.99,
      available_sizes: [], 
      span: 'md:col-span-2 md:row-span-1',
    },
    {
      id: 2,
      image: '/image.png',
      item_name: 'Compact Travel Drone 4K',
      item_description: 'Capture breathtaking aerial footage wherever you go. Foldable design for ultimate portability.',
      price: 199.50,
      available_sizes: [],
      span: 'md:col-span-1 md:row-span-1',
    },
    {
      id: 3,
      image: '/image.png',
      item_name: 'Vintage Bluetooth Speaker',
      item_description: 'Classic aesthetics meet modern sound. Enjoy rich audio with long-lasting battery life.',
      price: 75.00,
      available_sizes: [],
      span: 'md:col-span-1 md:row-span-1',
    },
    {
      id: 4,
      image: '/image.png',
      item_name: 'Smartwatch Elite',
      item_description: 'Stay connected and track your fitness with this sleek and powerful smartwatch.',
      price: 120.00,
      available_sizes: [],
      span: 'md:col-span-1 md:row-span-1',
    },
    {
      id: 5,
      image: '/image.png',
      item_name: 'Portable Espresso Maker',
      item_description: 'Enjoy barista-quality coffee anywhere. Compact and easy to use for the discerning traveler.',
      price: 60.25,
      available_sizes: [],
      span: 'md:col-span-1 md:row-span-1',
    },
    {
      id: 6,
      image: '/image.png',
      item_name: 'AI-Powered Security Camera',
      item_description: 'Keep your home safe with intelligent motion detection and 24/7 cloud recording.',
      price: 150.00,
      available_sizes: [],
      span: 'md:col-span-2 md:row-span-2',
    },
    {
      id: 7,
      image: '/image.png',
      item_name: 'Modular Standing Desk',
      item_description: 'Customize your workspace for ultimate comfort and productivity. Electric height adjustment.',
      price: 450.00,
      available_sizes: [],
      span: 'md:col-span-1 md:row-span-1',
    },
     {
      id: 8,
      image: '/image.png',
      item_name: 'Smart Home Hub',
      item_description: 'Control all your smart devices from one central hub. Seamless integration and voice control.',
      price: 99.99,
      available_sizes: [],
      span: 'md:col-span-1 md:row-span-1',
    },
  ];

  const handleAddToCart = (productToAdd) => {
    if (!isSignedIn) {
      setShowSignInPopup(true);
      return;
    }

    if (typeof window === 'undefined') {
      console.warn("localStorage is not available on the server. Cart functionality will not work.");
      return;
    }

    let cart = [];
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        cart = JSON.parse(storedCart);
      }
    } catch (e) {
      console.error("Failed to parse cart from localStorage, starting with empty cart:", e);
      cart = []; 
    }

    const existingItemIndex = cart.findIndex(item => item.id === productToAdd.id);

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1;
      toast.success(`Increased quantity of ${productToAdd.item_name} in cart! Current quantity: ${cart[existingItemIndex].quantity}`);
    } else {
      cart.push({ ...productToAdd, quantity: 1 });
      
      toast.success(`${productToAdd.item_name} added to cart!`);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
  };


  return (
    <div className='w-full min-h-screen bg-black py-16 px-4 sm:px-6 lg:px-12'>
      <h1 className='text-center my-20 text-4xl sm:text-5xl md:text-6xl font-extrabold mb-16 text-gray-100'>Our Products</h1>

      <div className='grid grid-cols-1 mt-20 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[minmax(280px,auto)]'>
        {products.map((product) => (
          <div
            key={product.id}
            className={`
              relative flex flex-col overflow-hidden
              bg-gray-800
              rounded-2xl border border-gray-700
              shadow-lg transition-all duration-300 ease-in-out
              hover:shadow-xl hover:scale-[1.01]
              hover:border-blue-500
              ${product.span}
            `}
          >
            <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 flex-shrink-0">
              <img
                src={product.image}
                alt={product.item_name}
                className="absolute inset-0 w-full h-full object-cover rounded-t-2xl"
                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x300/cccccc/333333?text=Image+Error'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-t-2xl"></div>
            </div>
            
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="font-bold text-xl sm:text-2xl mb-2 text-gray-50 leading-tight">
                {product.item_name}
              </h3>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed flex-grow">
                {product.item_description}
              </p>
              <div className="mt-2 text-white font-semibold text-lg">
                ₹{product.price.toFixed(2)}
              </div>
              <button
                onClick={() => handleAddToCart(product)} 
                className="mt-4 px-4 py-2 flex items-center gap-2 justify-center cursor-pointer bg-black border border-gray-50 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 self-end"
              >
                Add To Cart <ShoppingCart className="w-5 h-5"/>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showSignInPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black bg-opacity-40 backdrop-filter backdrop-blur-sm"
            onClick={() => setShowSignInPopup(false)} 
          ></div>

          <div className="relative bg-white/10 dark:bg-gray-700/20 backdrop-filter backdrop-blur-lg border border-white/20 dark:border-gray-600 rounded-xl shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center text-white z-10 animate-fade-in-up">
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
              <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md">
                Sign In Now
              </button>
            </SignInButton>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductSection;