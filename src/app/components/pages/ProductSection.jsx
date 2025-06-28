'use client'
import { ShoppingCart, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
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

  if (loading) {
    return (
      <div className='w-full min-h-screen bg-black py-16 px-4 sm:px-6 lg:px-12 flex items-center justify-center'>
        <div className="text-white text-xl">Loading products...</div>
      </div>
    );
  }

  return (
    <div className='w-full min-h-screen bg-black py-16 px-4 sm:px-6 lg:px-12'>
      <h1 className='text-center my-20 text-4xl sm:text-5xl md:text-6xl font-extrabold mb-16 text-gray-100'>
        {showFeaturedOnly ? 'Featured Products' : 'Our Products'}
      </h1>

      <div className='grid grid-cols-1 mt-20 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[minmax(280px,auto)]'>
        {products.map((product) => (
          <div
            key={product._id}
            className="relative flex flex-col overflow-hidden bg-gray-800 rounded-2xl border border-gray-700 shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.01] hover:border-blue-500"
          >
            <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 flex-shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover rounded-t-2xl"
                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x300/cccccc/333333?text=Image+Error'; }}
              />
              {product.featured && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                  Featured
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-t-2xl"></div>
            </div>
            
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="font-bold text-xl sm:text-2xl mb-2 text-gray-50 leading-tight">
                {product.name}
              </h3>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed flex-grow">
                {product.description}
              </p>
              <div className="mt-2 flex justify-between items-center">
                <div className="text-white font-semibold text-lg">
                  ₹{product.price.toFixed(2)}
                </div>
                <div className="text-sm text-gray-400">
                  Stock: {product.stock}
                </div>
              </div>
              <button
                onClick={() => handleAddToCart(product)} 
                disabled={product.stock === 0}
                className={`mt-4 px-4 py-2 flex items-center gap-2 justify-center cursor-pointer rounded-lg transition-colors duration-200 self-end ${
                  product.stock === 0 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'bg-black border border-gray-50 text-white hover:bg-gray-700'
                }`}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add To Cart'} 
                {product.stock > 0 && <ShoppingCart className="w-5 h-5"/>}
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-xl">No products available</p>
        </div>
      )}

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