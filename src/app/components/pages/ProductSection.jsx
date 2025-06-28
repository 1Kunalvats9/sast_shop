'use client'
import { ShoppingCart, X, Palette, Ruler } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SignInButton, useAuth } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import { useCart } from '@/context/CartContext';
import ImageCarousel from '@/components/ImageCarousel';

const ProductSection = ({ showFeaturedOnly = false }) => {
  const { isSignedIn } = useAuth();
  const [showSignInPopup, setShowSignInPopup] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
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

    if (product.hasVariants) {
      setSelectedProduct(product);
      setSelectedSize('');
      setSelectedColor('');
      return;
    }

    if (product.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }

    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleVariantAddToCart = () => {
    if (!selectedProduct) return;

    if (selectedProduct.hasVariants && (!selectedSize || !selectedColor)) {
      toast.error('Please select both size and color');
      return;
    }

    // Find the specific variant
    const variant = selectedProduct.variants?.find(v => 
      v.size === selectedSize && v.color === selectedColor && v.available
    );

    if (!variant || variant.stock <= 0) {
      toast.error('Selected variant is out of stock');
      return;
    }

    const productWithVariant = {
      ...selectedProduct,
      selectedSize,
      selectedColor,
      variantStock: variant.stock
    };

    addToCart(productWithVariant);
    toast.success(`${selectedProduct.name} (${selectedSize}, ${selectedColor}) added to cart!`);
    setSelectedProduct(null);
    setSelectedSize('');
    setSelectedColor('');
  };

  const getAvailableStock = (product) => {
    if (!product.hasVariants) {
      return product.stock || 0;
    }

    if (!selectedSize || !selectedColor) {
      return product.variants?.reduce((total, variant) => {
        return variant.available ? total + variant.stock : total;
      }, 0) || 0;
    }

    const variant = product.variants?.find(v => 
      v.size === selectedSize && v.color === selectedColor && v.available
    );
    return variant ? variant.stock : 0;
  };

  const getTotalStock = (product) => {
    if (product.hasVariants) {
      return product.variants?.reduce((total, variant) => {
        return variant.available ? total + variant.stock : total;
      }, 0) || 0;
    }
    return product.stock || 0;
  };

  const getProductImages = (product) => {
    const images = [];
    if (product.image) images.push(product.image);
    if (product.images && product.images.length > 0) {
      images.push(...product.images);
    }
    return images.length > 0 ? images : [product.image];
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
            className="relative flex flex-col overflow-hidden bg-gray-800 rounded-2xl border border-gray-700 shadow-lg transition-all duration-300 ease-in-out"
            variants={cardVariants}
          >
            <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 flex-shrink-0">
              <ImageCarousel 
                images={getProductImages(product)}
                productName={product.name}
                className="w-full h-full"
              />
              
              {product.featured && (
                <motion.div 
                  className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold z-10"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
                >
                  Featured
                </motion.div>
              )}
              {product.hasVariants && (
                <motion.div 
                  className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 z-10"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.1 + 0.6, duration: 0.5 }}
                >
                  <Palette size={12} />
                  <Ruler size={12} />
                </motion.div>
              )}
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
                  Stock: {getTotalStock(product)}
                </div>
              </motion.div>

              {product.hasVariants && (
                <motion.div 
                  className="mt-2 text-xs text-gray-400"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.55 }}
                >
                  <div className="flex flex-wrap gap-1 mb-1">
                    <span className="font-medium">Sizes:</span>
                    {product.availableSizes?.slice(0, 3).map(size => (
                      <span key={size} className="bg-gray-700 px-1 rounded">{size}</span>
                    ))}
                    {product.availableSizes?.length > 3 && <span>+{product.availableSizes.length - 3}</span>}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <span className="font-medium">Colors:</span>
                    {product.availableColors?.slice(0, 3).map(color => (
                      <span key={color} className="bg-gray-700 px-1 rounded">{color}</span>
                    ))}
                    {product.availableColors?.length > 3 && <span>+{product.availableColors.length - 3}</span>}
                  </div>
                </motion.div>
              )}

              <motion.button
                onClick={() => handleAddToCart(product)} 
                disabled={getTotalStock(product) === 0}
                className={`mt-4 px-4 py-2 flex items-center gap-2 justify-center cursor-pointer rounded-lg transition-colors duration-200 self-end ${
                  getTotalStock(product) === 0 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'bg-black border border-gray-50 text-white hover:bg-gray-700'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.6 }}
                whileHover={getTotalStock(product) > 0 ? { scale: 1.05 } : {}}
                whileTap={getTotalStock(product) > 0 ? { scale: 0.95 } : {}}
              >
                {getTotalStock(product) === 0 ? 'Out of Stock' : (product.hasVariants ? 'Select Options' : 'Add To Cart')} 
                {getTotalStock(product) > 0 && <ShoppingCart className="w-5 h-5"/>}
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

      {/* Variant Selection Modal */}
      {selectedProduct && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-40 backdrop-filter backdrop-blur-sm"
            onClick={() => setSelectedProduct(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          <motion.div 
            className="relative bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-6 max-w-md w-full text-white z-10"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mb-4">
              <div className="w-full h-48 mb-4">
                <ImageCarousel 
                  images={getProductImages(selectedProduct)}
                  productName={selectedProduct.name}
                  className="w-full h-full"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">{selectedProduct.name}</h3>
              <p className="text-2xl font-bold text-green-400 mb-4">₹{selectedProduct.price.toFixed(2)}</p>
            </div>

            <div className="space-y-4">
              {/* Size Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Select Size:</label>
                <div className="grid grid-cols-4 gap-2">
                  {selectedProduct.availableSizes?.map(size => {
                    const hasStock = selectedProduct.variants?.some(v => 
                      v.size === size && v.available && v.stock > 0
                    );
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        disabled={!hasStock}
                        className={`p-2 rounded border transition-colors ${
                          selectedSize === size
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : hasStock
                            ? 'border-gray-600 hover:border-gray-400 text-gray-300'
                            : 'border-gray-700 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Select Color:</label>
                <div className="grid grid-cols-3 gap-2">
                  {selectedProduct.availableColors?.map(color => {
                    const hasStock = selectedProduct.variants?.some(v => 
                      v.color === color && v.available && v.stock > 0 && (!selectedSize || v.size === selectedSize)
                    );
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        disabled={!hasStock}
                        className={`p-2 rounded border transition-colors ${
                          selectedColor === color
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : hasStock
                            ? 'border-gray-600 hover:border-gray-400 text-gray-300'
                            : 'border-gray-700 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stock Info */}
              {selectedSize && selectedColor && (
                <div className="text-sm text-gray-400">
                  Available Stock: {getAvailableStock(selectedProduct)}
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleVariantAddToCart}
                disabled={!selectedSize || !selectedColor || getAvailableStock(selectedProduct) === 0}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Sign In Popup */}
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