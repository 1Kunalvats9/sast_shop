'use client'
import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Package, Clock, CheckCircle, XCircle, Truck, Home } from 'lucide-react';

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

  if (!isSignedIn) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading your orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            My Orders
          </h1>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
          >
            Continue Shopping
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package size={64} className="mx-auto mb-4 text-gray-600" />
            <h2 className="text-2xl font-semibold mb-2 text-gray-400">No Orders Yet</h2>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-gray-900/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-300"
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
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded border border-gray-600"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-200">{item.name}</p>
                            <p className="text-sm text-gray-400">
                              Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-300">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-300 mb-3">Delivery Details</h4>
                    <div className="bg-gray-800/50 rounded-lg p-4">
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
                    </div>
                  </div>
                </div>

                {order.adminNotes && (
                  <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
                    <h5 className="font-medium text-blue-400 mb-1">Admin Notes:</h5>
                    <p className="text-gray-300 text-sm">{order.adminNotes}</p>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <span>Last updated: {new Date(order.updatedAt).toLocaleString()}</span>
                    <span>Payment Method: {order.paymentMethod}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}