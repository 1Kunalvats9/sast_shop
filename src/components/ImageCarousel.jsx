'use client'
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const ImageCarousel = ({ images, productName, className = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);

  // Ensure we have at least one image
  const imageList = images && images.length > 0 ? images : [images].filter(Boolean);
  
  if (!imageList || imageList.length === 0) {
    return (
      <div className={`bg-gray-800 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-gray-400">No image available</span>
      </div>
    );
  }

  const nextImage = (e) => {
    e?.stopPropagation();
    e?.preventDefault();
    setCurrentIndex((prev) => (prev + 1) % imageList.length);
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    e?.preventDefault();
    setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  const goToImage = (index, e) => {
    e?.stopPropagation();
    e?.preventDefault();
    setCurrentIndex(index);
  };

  const handleImageClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <>
      <div 
        className={`relative overflow-hidden rounded-lg ${className}`}
        style={{ isolation: 'isolate' }} // Create new stacking context
      >
        {/* Image Container with isolated hover detection */}
        <div 
          className="relative w-full h-full group/image"
          onMouseEnter={() => setIsImageHovered(true)}
          onMouseLeave={() => setIsImageHovered(false)}
          onClick={handleImageClick}
        >
          {/* Main Image */}
          <motion.img
            key={currentIndex}
            src={imageList[currentIndex]}
            alt={`${productName} - Image ${currentIndex + 1}`}
            className="w-full h-full object-cover cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            onError={(e) => { 
              e.target.onerror = null; 
              e.target.src = 'https://placehold.co/400x300/cccccc/333333?text=Image+Error'; 
            }}
          />
          
          {/* Image Counter */}
          {imageList.length > 1 && (
            <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded-full text-xs font-medium z-30 pointer-events-none">
              {currentIndex + 1}/{imageList.length}
            </div>
          )}

          {/* Navigation Arrows - Only show on image hover */}
          {imageList.length > 1 && (
            <>
              <motion.button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black text-white p-2 rounded-full z-30 shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: isImageHovered ? 1 : 0,
                  scale: isImageHovered ? 1 : 0.8,
                  pointerEvents: isImageHovered ? 'auto' : 'none'
                }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft size={18} />
              </motion.button>

              <motion.button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black text-white p-2 rounded-full z-30 shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: isImageHovered ? 1 : 0,
                  scale: isImageHovered ? 1 : 0.8,
                  pointerEvents: isImageHovered ? 'auto' : 'none'
                }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight size={18} />
              </motion.button>
            </>
          )}

          {/* Dots Indicator */}
          {imageList.length > 1 && (
            <motion.div 
              className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-30"
              initial={{ opacity: 0.7 }}
              animate={{ opacity: isImageHovered ? 1 : 0.7 }}
              transition={{ duration: 0.2 }}
            >
              {imageList.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => goToImage(index, e)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-white scale-110 shadow-lg' 
                      : 'bg-white/60 hover:bg-white/90'
                  }`}
                />
              ))}
            </motion.div>
          )}

          {/* Mobile Touch Areas (always visible on mobile) */}
          {imageList.length > 1 && (
            <div className="md:hidden absolute inset-0 flex z-20">
              <div 
                className="w-1/2 h-full flex items-center justify-start pl-2"
                onClick={prevImage}
              >
                <div className="bg-black/60 text-white p-1 rounded-full opacity-70">
                  <ChevronLeft size={16} />
                </div>
              </div>
              <div 
                className="w-1/2 h-full flex items-center justify-end pr-2"
                onClick={nextImage}
              >
                <div className="bg-black/60 text-white p-1 rounded-full opacity-70">
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          )}

          {/* Hover Overlay for better visual feedback */}
          <motion.div
            className="absolute inset-0 bg-black/10 pointer-events-none z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: isImageHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>

      {/* Full Screen Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 z-10 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>

              {/* Main Modal Image */}
              <motion.img
                key={`modal-${currentIndex}`}
                src={imageList[currentIndex]}
                alt={`${productName} - Image ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              />

              {/* Modal Navigation */}
              {imageList.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Modal Dots */}
              {imageList.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {imageList.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentIndex 
                          ? 'bg-white scale-110' 
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Image Counter in Modal */}
              {imageList.length > 1 && (
                <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-full text-sm font-medium">
                  {currentIndex + 1} of {imageList.length}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageCarousel;