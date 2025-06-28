'use client'
import { useState, useEffect } from 'react';
import { useCheckRole } from '@/utils/client-checkRole';
import { useRouter } from 'next/navigation';
import { Package, ShoppingBag, Plus, Edit, Trash2, Eye, Check, X, Clock, Upload, Image as ImageIcon, Palette, Ruler } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

export default function AdminDashboard() {
  const isAdmin = useCheckRole('admin');
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    stock: '',
    featured: false,
    hasVariants: false,
    availableSizes: [],
    availableColors: [],
    variants: []
  });

  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      router.push('/');
      return;
    }
    fetchOrders();
    fetchProducts();
  }, [isAdmin, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setImageUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        setProductForm(prev => ({ ...prev, image: data.url }));
        setImagePreview(data.url);
        toast.success('Image uploaded successfully!');
      } else {
        toast.error(data.error || 'Failed to upload image');
        console.error('Upload error:', data.error);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setImageUploading(false);
    }
  };

  const handleOrderStatusUpdate = async (orderId, status, adminNotes = '') => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes })
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`Order ${status} successfully`);
        fetchOrders();
        setSelectedOrder(null);
      } else {
        toast.error('Failed to update order');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Order deleted successfully');
        fetchOrders();
      } else {
        toast.error('Failed to delete order');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
    }
  };

  const addSize = () => {
    if (newSize.trim() && !productForm.availableSizes.includes(newSize.trim())) {
      setProductForm(prev => ({
        ...prev,
        availableSizes: [...prev.availableSizes, newSize.trim()]
      }));
      setNewSize('');
      generateVariants();
    }
  };

  const removeSize = (sizeToRemove) => {
    setProductForm(prev => ({
      ...prev,
      availableSizes: prev.availableSizes.filter(size => size !== sizeToRemove)
    }));
    generateVariants();
  };

  const addColor = () => {
    if (newColor.trim() && !productForm.availableColors.includes(newColor.trim())) {
      setProductForm(prev => ({
        ...prev,
        availableColors: [...prev.availableColors, newColor.trim()]
      }));
      setNewColor('');
      generateVariants();
    }
  };

  const removeColor = (colorToRemove) => {
    setProductForm(prev => ({
      ...prev,
      availableColors: prev.availableColors.filter(color => color !== colorToRemove)
    }));
    generateVariants();
  };

  const generateVariants = () => {
    if (!productForm.hasVariants) return;

    const newVariants = [];
    productForm.availableSizes.forEach(size => {
      productForm.availableColors.forEach(color => {
        const existingVariant = productForm.variants.find(v => v.size === size && v.color === color);
        newVariants.push({
          size,
          color,
          stock: existingVariant ? existingVariant.stock : 0,
          available: existingVariant ? existingVariant.available : true
        });
      });
    });

    setProductForm(prev => ({
      ...prev,
      variants: newVariants
    }));
  };

  const updateVariant = (size, color, field, value) => {
    setProductForm(prev => ({
      ...prev,
      variants: prev.variants.map(variant => 
        variant.size === size && variant.color === color
          ? { ...variant, [field]: value }
          : variant
      )
    }));
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    
    if (!productForm.image) {
      toast.error('Please upload an image or provide an image URL');
      return;
    }

    if (productForm.hasVariants && productForm.variants.length === 0) {
      toast.error('Please add at least one size and color combination');
      return;
    }

    setLoading(true);

    try {
      const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const submitData = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: productForm.hasVariants ? 0 : parseInt(productForm.stock)
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`Product ${editingProduct ? 'updated' : 'created'} successfully`);
        fetchProducts();
        setShowProductForm(false);
        setEditingProduct(null);
        setImagePreview('');
        setProductForm({
          name: '',
          description: '',
          price: '',
          image: '',
          category: '',
          stock: '',
          featured: false,
          hasVariants: false,
          availableSizes: [],
          availableColors: [],
          variants: []
        });
      } else {
        toast.error('Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Product deleted successfully');
        fetchProducts();
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: product.image,
      category: product.category,
      stock: product.stock?.toString() || '0',
      featured: product.featured,
      hasVariants: product.hasVariants || false,
      availableSizes: product.availableSizes || [],
      availableColors: product.availableColors || [],
      variants: product.variants || []
    });
    setImagePreview(product.image);
    setShowProductForm(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'approved': return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
      case 'shipped': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'delivered': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTotalStock = (product) => {
    if (product.hasVariants) {
      return product.variants?.reduce((total, variant) => {
        return variant.available ? total + variant.stock : total;
      }, 0) || 0;
    }
    return product.stock || 0;
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <h1 className="text-4xl font-bold mb-8 text-center text-white">
          Admin Dashboard
        </h1>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-2 flex gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'orders'
                  ? 'bg-white text-black shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <ShoppingBag size={20} />
              Orders
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'products'
                  ? 'bg-white text-black shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Package size={20} />
              Products
            </button>
          </div>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white">Order Management</h2>
              <div className="text-sm text-gray-400">
                Total Orders: {orders.length}
              </div>
            </div>

            <div className="grid gap-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Order #{order.orderId}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-gray-300">{order.userEmail}</p>
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </div>
                      <p className="text-xl font-bold text-green-400 mt-2">
                        ₹{order.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium text-gray-300 mb-2">Items ({order.items.length})</h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm bg-gray-800 p-3 rounded">
                            <div>
                              <span className="text-gray-400">{item.name} x{item.quantity}</span>
                              {(item.selectedSize || item.selectedColor) && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                                  {item.selectedSize && item.selectedColor && <span> | </span>}
                                  {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                                </div>
                              )}
                            </div>
                            <span className="text-gray-300">₹{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-300 mb-2">Delivery Address</h4>
                      <div className="text-sm text-gray-400">
                        <p>{order.deliveryAddress.fullName}</p>
                        <p>{order.deliveryAddress.addressLine1}</p>
                        {order.deliveryAddress.addressLine2 && <p>{order.deliveryAddress.addressLine2}</p>}
                        <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.postalCode}</p>
                        <p>Contact: {order.deliveryAddress.contactNumber}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-700">
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleOrderStatusUpdate(order._id, 'approved')}
                          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-200 text-black rounded-lg transition-colors"
                        >
                          <Check size={16} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleOrderStatusUpdate(order._id, 'rejected')}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 rounded-lg transition-colors"
                        >
                          <X size={16} />
                          Reject
                        </button>
                      </>
                    )}

                    {order.status === 'approved' && (
                      <button
                        onClick={() => handleOrderStatusUpdate(order._id, 'shipped')}
                        className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-200 text-black rounded-lg transition-colors"
                      >
                        <Package size={16} />
                        Mark as Shipped
                      </button>
                    )}

                    {order.status === 'shipped' && (
                      <button
                        onClick={() => handleOrderStatusUpdate(order._id, 'delivered')}
                        className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-200 text-black rounded-lg transition-colors"
                      >
                        <Check size={16} />
                        Mark as Delivered
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteOrder(order._id)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 rounded-lg transition-colors ml-auto"
                    >
                      <Trash2 size={16} />
                      Delete Order
                    </button>
                  </div>
                </div>
              ))}

              {orders.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <ShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No orders found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white">Product Management</h2>
              <button
                onClick={() => {
                  setShowProductForm(true);
                  setEditingProduct(null);
                  setImagePreview('');
                  setProductForm({
                    name: '',
                    description: '',
                    price: '',
                    image: '',
                    category: '',
                    stock: '',
                    featured: false,
                    hasVariants: false,
                    availableSizes: [],
                    availableColors: [],
                    variants: []
                  });
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-200 text-black rounded-lg transition-colors"
              >
                <Plus size={20} />
                Add Product
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden hover:border-gray-600 transition-all duration-300"
                >
                  <div className="relative h-48">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.featured && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                        Featured
                      </div>
                    )}
                    {product.hasVariants && (
                      <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Palette size={12} />
                        <Ruler size={12} />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 text-white">{product.name}</h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xl font-bold text-green-400">₹{product.price}</span>
                      <span className="text-sm text-gray-400">Stock: {getTotalStock(product)}</span>
                    </div>
                    
                    {product.hasVariants && (
                      <div className="mb-3 text-xs text-gray-400">
                        <div className="flex flex-wrap gap-1 mb-1">
                          <span className="font-medium">Sizes:</span>
                          {product.availableSizes?.map(size => (
                            <span key={size} className="bg-gray-700 px-1 rounded">{size}</span>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          <span className="font-medium">Colors:</span>
                          {product.availableColors?.map(color => (
                            <span key={color} className="bg-gray-700 px-1 rounded">{color}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-gray-200 text-black rounded text-sm transition-colors"
                      >
                        <Edit size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 rounded text-sm transition-colors"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Package size={48} className="mx-auto mb-4 opacity-50" />
                <p>No products found</p>
              </div>
            )}
          </div>
        )}

        {/* Product Form Modal */}
        {showProductForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold mb-4 text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-white">Name</label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="w-full p-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:border-white text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-white">Category</label>
                    <input
                      type="text"
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full p-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:border-white text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-white">Description</label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full p-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:border-white h-20 text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-white">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="w-full p-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:border-white text-white"
                      required
                    />
                  </div>
                  {!productForm.hasVariants && (
                    <div>
                      <label className="block text-sm font-medium mb-1 text-white">Stock</label>
                      <input
                        type="number"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                        className="w-full p-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:border-white text-white"
                        required
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-white">Product Image</label>
                  <div className="space-y-3">
                    {imagePreview && (
                      <div className="relative w-full h-32 border border-gray-600 rounded overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(file);
                          }
                        }}
                        className="hidden"
                        id="image-upload"
                        disabled={imageUploading}
                      />
                      <label
                        htmlFor="image-upload"
                        className={`flex items-center gap-2 px-4 py-2 border border-gray-600 rounded cursor-pointer hover:bg-gray-800 transition-colors text-white ${
                          imageUploading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {imageUploading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload size={16} />
                            Upload Image
                          </>
                        )}
                      </label>
                    </div>
                    <div className="text-center text-gray-400 text-sm">OR</div>
                    <input
                      type="url"
                      placeholder="Enter image URL"
                      value={productForm.image}
                      onChange={(e) => {
                        setProductForm({ ...productForm, image: e.target.value });
                        setImagePreview(e.target.value);
                      }}
                      className="w-full p-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:border-white text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={productForm.featured}
                    onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="featured" className="text-sm text-white">Featured Product</label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hasVariants"
                    checked={productForm.hasVariants}
                    onChange={(e) => {
                      setProductForm({ 
                        ...productForm, 
                        hasVariants: e.target.checked,
                        variants: e.target.checked ? productForm.variants : []
                      });
                    }}
                    className="rounded"
                  />
                  <label htmlFor="hasVariants" className="text-sm text-white">Has Size/Color Variants</label>
                </div>

                {productForm.hasVariants && (
                  <div className="space-y-4 border border-gray-600 rounded p-4">
                    <h4 className="text-lg font-medium text-white">Variant Configuration</h4>
                    
                    {/* Sizes */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">Available Sizes</label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={newSize}
                          onChange={(e) => setNewSize(e.target.value)}
                          placeholder="Add size (e.g., S, M, L, XL)"
                          className="flex-1 p-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:border-white text-white"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                        />
                        <button
                          type="button"
                          onClick={addSize}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {productForm.availableSizes.map(size => (
                          <span key={size} className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                            {size}
                            <button
                              type="button"
                              onClick={() => removeSize(size)}
                              className="text-red-400 hover:text-red-300"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Colors */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">Available Colors</label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={newColor}
                          onChange={(e) => setNewColor(e.target.value)}
                          placeholder="Add color (e.g., Red, Blue, Black)"
                          className="flex-1 p-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:border-white text-white"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                        />
                        <button
                          type="button"
                          onClick={addColor}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {productForm.availableColors.map(color => (
                          <span key={color} className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                            {color}
                            <button
                              type="button"
                              onClick={() => removeColor(color)}
                              className="text-red-400 hover:text-red-300"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Variants Table */}
                    {productForm.variants.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium mb-2 text-white">Variant Stock & Availability</label>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-white">
                            <thead>
                              <tr className="border-b border-gray-600">
                                <th className="text-left p-2">Size</th>
                                <th className="text-left p-2">Color</th>
                                <th className="text-left p-2">Stock</th>
                                <th className="text-left p-2">Available</th>
                              </tr>
                            </thead>
                            <tbody>
                              {productForm.variants.map((variant, index) => (
                                <tr key={`${variant.size}-${variant.color}`} className="border-b border-gray-700">
                                  <td className="p-2">{variant.size}</td>
                                  <td className="p-2">{variant.color}</td>
                                  <td className="p-2">
                                    <input
                                      type="number"
                                      value={variant.stock}
                                      onChange={(e) => updateVariant(variant.size, variant.color, 'stock', parseInt(e.target.value) || 0)}
                                      className="w-20 p-1 bg-gray-800 border border-gray-600 rounded text-white"
                                      min="0"
                                    />
                                  </td>
                                  <td className="p-2">
                                    <input
                                      type="checkbox"
                                      checked={variant.available}
                                      onChange={(e) => updateVariant(variant.size, variant.color, 'available', e.target.checked)}
                                      className="rounded"
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={generateVariants}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                    >
                      Generate Variants
                    </button>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading || imageUploading}
                    className="flex-1 py-2 bg-white hover:bg-gray-200 text-black rounded transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (editingProduct ? 'Update' : 'Create')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProductForm(false);
                      setEditingProduct(null);
                      setImagePreview('');
                    }}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 rounded transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}