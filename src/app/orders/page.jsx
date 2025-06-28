'use client'
import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, XCircle, Truck, Home } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function OrdersPage() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/');
      return;
    }
    fetchOrders();
  }, [isSignedIn, user]);

  const fetchOrders = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/orders?userId=${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'approved': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'shipped': return <Truck className="w-5 h-5 text-blue-400" />;
      case 'delivered': return <Home className="w-5 h-5 text-purple-400" />;
      default: return <Package className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'approved': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'rejected': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'shipped': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'delivered': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
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

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
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

  const titleVariants = {
    hidden: { 
      opacity: 0, 
      y: -30,
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

  if (!isSignedIn) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <motion.div 
            className="text-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Loading your orders...
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Glassmorphism Container */}
          <motion.div
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              className="flex items-center justify-between mb-8"
              variants={titleVariants}
              initial="hidden"
              animate="visible"
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                My Orders
              </h1>
              <motion.button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 rounded-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Continue Shopping
              </motion.button>
            </motion.div>

            {orders.length === 0 ? (
              <motion.div 
                className="text-center py-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Package size={64} className="mx-auto mb-4 text-gray-600" />
                <h2 className="text-2xl font-semibold mb-2 text-gray-400">No Orders Yet</h2>
                <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
                <motion.button
                  onClick={() => router.push('/')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Shopping
                </motion.button>
              </motion.div>
            ) : (
              <motion.div 
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {orders.map((order, index) => (
                  <motion.div
                    key={order._id}
                    className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300"
                    variants={cardVariants}
                    whileHover={{ 
                      y: -5,
                      boxShadow: "0 20px 40px rgba(255, 255, 255, 0.05)"
                    }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-blue-400 mb-1">
                          Order #{order.orderId}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-full border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="font-medium capitalize">{order.status}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-400">
                            ₹{order.totalAmount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-300 mb-3">Items ({order.items.length})</h4>
                        <div className="space-y-3">
                          {order.items.map((item, itemIndex) => (
                            <motion.div 
                              key={itemIndex} 
                              className="flex items-center gap-3 p-3 bg-white/5 backdrop-blur-lg rounded-lg border border-white/10"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 + itemIndex * 0.05 }}
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded border border-gray-600"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-gray-200">{item.name}</p>
                                
                                {/* Size and Color Display */}
                                {(item.selectedSize || item.selectedColor) && (
                                  <div className="flex flex-wrap gap-1 mt-1 mb-1">
                                    {item.selectedSize && (
                                      <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                                        Size: {item.selectedSize}
                                      </span>
                                    )}
                                    {item.selectedColor && (
                                      <span className="bg-green-600 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                                        Color: {item.selectedColor}
                                      </span>
                                    )}
                                  </div>
                                )}
                                
                                <p className="text-sm text-gray-400">
                                  Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-gray-300">
                                  ₹{(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-300 mb-3">Delivery Details</h4>
                        <motion.div 
                          className="bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-white/10"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + 0.3 }}
                        >
                          <div className="text-sm text-gray-400 space-y-1">
                            <p className="font-medium text-gray-300">{order.deliveryAddress.fullName}</p>
                            <p>{order.deliveryAddress.addressLine1}</p>
                            {order.deliveryAddress.addressLine2 && <p>{order.deliveryAddress.addressLine2}</p>}
                            <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.postalCode}</p>
                            <p>{order.deliveryAddress.country}</p>
                            <p className="pt-2 border-t border-gray-700 mt-2">
                              <span className="font-medium text-gray-300">Contact:</span> {order.deliveryAddress.contactNumber}
                            </p>
                            <p>
                              <span className="font-medium text-gray-300">Payment:</span> {order.paymentMethod}
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    </div>

                    {order.adminNotes && (
                      <motion.div 
                        className="mt-4 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                      >
                        <h5 className="font-medium text-blue-400 mb-1">Admin Notes:</h5>
                        <p className="text-gray-300 text-sm">{order.adminNotes}</p>
                      </motion.div>
                    )}

                    <motion.div 
                      className="mt-4 pt-4 border-t border-gray-700"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.6 }}
                    >
                      <div className="flex justify-between items-center text-sm text-gray-400">
                        <span>Last updated: {new Date(order.updatedAt).toLocaleString()}</span>
                        <span>Payment Method: {order.paymentMethod}</span>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}