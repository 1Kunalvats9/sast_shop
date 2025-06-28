'use client'
import { useEffect, useState } from "react"
import { X } from 'lucide-react'
import { useRouter } from "next/navigation"
import { useCart } from '@/context/CartContext'
import { useAuth, useUser } from '@clerk/nextjs'
import toast from 'react-hot-toast'

export default function Cart() {
    const [showAddressPopup, setShowAddressPopup] = useState(false)
    const [deliveryAddress, setDeliveryAddress] = useState(null)
    const [paymentMethod, setPaymentMethod] = useState('COD')
    const [loading, setLoading] = useState(false)
    const [addressForm, setAddressForm] = useState({
        fullName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        contactNumber: ''
    })
    const router = useRouter()
    const { cart, updateQuantity, removeFromCart, clearCart, getTotalItems, getTotalPrice } = useCart()
    const { isSignedIn } = useAuth()
    const { user } = useUser()

    useEffect(() => {
        const storedAddress = localStorage.getItem('deliveryAddress')
        if (storedAddress) {
            setDeliveryAddress(JSON.parse(storedAddress))
        }
    }, [])

    const handleRemoveItem = (idToRemove) => {
        removeFromCart(idToRemove)
    }

    const handleClearCart = () => {
        clearCart()
    }

    const handleQuantityChange = (id, newQuantity) => {
        updateQuantity(id, parseInt(newQuantity))
    }

    const handleAddressFormChange = (e) => {
        const { name, value } = e.target
        setAddressForm(prev => ({ ...prev, [name]: value }))
    }

    const handleAddressSubmit = (e) => {
        e.preventDefault()
        setDeliveryAddress(addressForm)
        localStorage.setItem('deliveryAddress', JSON.stringify(addressForm))
        setShowAddressPopup(false)
        setAddressForm({
            fullName: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            postalCode: '',
            country: 'India',
            contactNumber: ''
        })
    }

    const handlePlaceOrder = async () => {
        if (!isSignedIn) {
            toast.error('Please sign in to place an order')
            return
        }

        if (!deliveryAddress) {
            toast.error('Please add a delivery address')
            return
        }

        if (cart.length === 0) {
            toast.error('Your cart is empty')
            return
        }

        setLoading(true)

        try {
            const orderData = {
                userId: user.id,
                userEmail: user.emailAddresses[0].emailAddress,
                items: cart.map(item => ({
                    productId: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image,
                    selectedSize: item.selectedSize || null,
                    selectedColor: item.selectedColor || null
                })),
                deliveryAddress,
                paymentMethod,
                totalAmount: finalTotal
            }

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            })

            const data = await response.json()

            if (data.success) {
                toast.success('Order placed successfully! Your order is under process and our team will approve it soon.')
                clearCart()
                localStorage.removeItem('deliveryAddress')
                router.push('/orders')
            } else {
                toast.error(data.error || 'Failed to place order')
            }
        } catch (error) {
            console.error('Error placing order:', error)
            toast.error('Failed to place order')
        } finally {
            setLoading(false)
        }
    }

    const totalItemsInCart = getTotalItems()
    const subtotalPrice = getTotalPrice()
    const taxRate = 0.02
    const taxAmount = subtotalPrice * taxRate
    const finalTotal = subtotalPrice + taxAmount

    return (
        <div className="w-full min-h-screen bg-black flex items-center justify-center">
            <div className="flex flex-col lg:flex-row py-16 max-w-7xl w-full px-4 sm:px-6 mx-auto bg-black text-white gap-8">
                {/* Cart Items Section */}
                <div className='flex-1 w-full'>
                    <h1 className="text-2xl sm:text-3xl font-medium mb-6">
                        Shopping Cart <span className="text-sm text-gray-400">{totalItemsInCart} Items</span>
                    </h1>

                    {cart.length === 0 ? (
                        <p className="text-gray-400 text-lg">Your cart is empty.</p>
                    ) : (
                        <>
                            {/* Desktop Header */}
                            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr] text-gray-400 text-base font-medium pb-3 border-b border-gray-700">
                                <p className="text-left">Product Details</p>
                                <p className="text-center">Subtotal</p>
                                <p className="text-center">Action</p>
                            </div>

                            {/* Cart Items */}
                            <div className="space-y-4 md:space-y-0">
                                {cart.map((product) => {
                                    const itemId = product.selectedSize || product.selectedColor 
                                        ? `${product._id}-${product.selectedSize || 'no-size'}-${product.selectedColor || 'no-color'}`
                                        : product._id;
                                    
                                    return (
                                        <div key={itemId} className="md:grid md:grid-cols-[2fr_1fr_1fr] flex flex-col bg-gray-900 md:bg-transparent rounded-lg md:rounded-none p-4 md:p-0 text-gray-300 items-start md:items-center text-sm md:text-base font-medium md:pt-3 border-b border-gray-800 md:py-4">
                                            {/* Product Info */}
                                            <div className="flex items-center gap-3 md:gap-6 w-full mb-4 md:mb-0">
                                                <div className="cursor-pointer w-20 h-20 md:w-24 md:h-24 flex items-center justify-center border border-gray-700 rounded bg-white overflow-hidden flex-shrink-0">
                                                    <img className="max-w-full h-full object-cover" src={product.image} alt={product.name} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-white mb-2 line-clamp-2">{product.name}</p>
                                                    
                                                    {/* Size and Color Display */}
                                                    {(product.selectedSize || product.selectedColor) && (
                                                        <div className="mb-2 flex flex-wrap gap-2">
                                                            {product.selectedSize && (
                                                                <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                                    Size: {product.selectedSize}
                                                                </span>
                                                            )}
                                                            {product.selectedColor && (
                                                                <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                                    Color: {product.selectedColor}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className="font-normal text-gray-500 space-y-1">
                                                        <p>Price: ₹{product.price ? product.price.toFixed(2) : '0.00'}</p>
                                                        <div className='flex items-center'>
                                                            <p>Qty:</p>
                                                            <select
                                                                className='outline-none bg-gray-800 border border-gray-600 text-white ml-2 rounded p-1 text-sm'
                                                                value={product.quantity || 1}
                                                                onChange={(e) => handleQuantityChange(itemId, e.target.value)}
                                                            >
                                                                {Array(10).fill('').map((_, index) => (
                                                                    <option key={index} value={index + 1}>{index + 1}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Mobile Layout for Price and Action */}
                                            <div className="flex justify-between items-center w-full md:hidden">
                                                <p className="text-lg font-semibold text-white">₹{((product.price || 0) * (product.quantity || 1)).toFixed(2)}</p>
                                                <button onClick={() => handleRemoveItem(itemId)} className="cursor-pointer text-red-500 hover:text-red-700 p-2">
                                                    <X size={20} />
                                                </button>
                                            </div>

                                            {/* Desktop Layout for Price and Action */}
                                            <p className="hidden md:block text-center">₹{((product.price || 0) * (product.quantity || 1)).toFixed(2)}</p>
                                            <div className="hidden md:flex justify-center">
                                                <button onClick={() => handleRemoveItem(itemId)} className="cursor-pointer text-red-500 hover:text-red-700">
                                                    <X size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
                                <button className="group cursor-pointer flex items-center gap-2 text-gray-400 font-medium hover:text-white transition order-2 sm:order-1" onClick={()=>{
                                    router.push('/')
                                }}>
                                     <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">  
                                        <path d="M14.09 5.5H1M6.143 10 1 5.5 6.143 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Continue Shopping
                                </button>
                                <button onClick={handleClearCart} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition order-1 sm:order-2 w-full sm:w-auto">
                                    Clear Cart
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Order Summary Section */}
                <div className="w-full lg:w-96 lg:flex-shrink-0">
                    <div className="bg-gray-950 p-5 border rounded-lg border-gray-700 text-white sticky top-24">
                        <h2 className="text-xl font-medium">Order Summary</h2>
                        <hr className="border-gray-700 my-5" />

                        <div className="mb-6">
                            <p className="text-sm font-medium uppercase text-gray-300">Delivery Address</p>
                            <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-start mt-2 gap-2">
                                {deliveryAddress ? (
                                    <div className="text-gray-400 text-sm flex-1">
                                        <p>{deliveryAddress.fullName}</p>
                                        <p>{deliveryAddress.addressLine1}</p>
                                        {deliveryAddress.addressLine2 && <p>{deliveryAddress.addressLine2}</p>}
                                        <p>{deliveryAddress.city}, {deliveryAddress.state} - {deliveryAddress.postalCode}</p>
                                        <p>{deliveryAddress.country}</p>
                                        <p className="mt-1"><span className="font-semibold">Contact:</span> {deliveryAddress.contactNumber}</p>
                                    </div>
                                ) : (
                                    <p className="text-gray-400 flex-1">No address found</p>
                                )}
                                <button onClick={() => setShowAddressPopup(true)} className="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer text-sm whitespace-nowrap">
                                    {deliveryAddress ? 'Change' : 'Add Address'}
                                </button>
                            </div>

                            <p className="text-sm font-medium uppercase mt-6 text-gray-300">Payment Method</p>

                            <select 
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-full border border-gray-700 bg-gray-900 px-3 py-2 mt-2 outline-none text-white rounded"
                            >
                                <option value="COD">Cash On Delivery</option>
                                <option value="Online">Online Payment</option>
                            </select>
                        </div>

                        <hr className="border-gray-700" />

                        <div className="text-gray-400 mt-4 space-y-2">
                            <p className="flex justify-between">
                                <span>Price ({totalItemsInCart} items)</span><span>₹{subtotalPrice.toFixed(2)}</span>
                            </p>
                            <p className="flex justify-between">
                                <span>Shipping Fee</span><span className="text-green-500">Free</span>
                            </p>
                            <p className="flex justify-between">
                                <span>Tax (2%)</span><span>₹{taxAmount.toFixed(2)}</span>
                            </p>
                            <p className="flex justify-between text-lg font-medium mt-3 text-white border-t border-gray-700 pt-3">
                                <span>Total Amount:</span><span>₹{finalTotal.toFixed(2)}</span>
                            </p>
                        </div>

                        <button 
                            onClick={handlePlaceOrder}
                            disabled={loading || cart.length === 0 || !deliveryAddress}
                            className="w-full py-3 mt-6 cursor-pointer bg-white text-black font-medium hover:bg-gray-300 transition rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Address Popup Modal */}
            {showAddressPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
                    <div className="relative bg-black border border-gray-700 rounded-xl shadow-2xl p-6 sm:p-8 max-w-lg w-full text-white max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setShowAddressPopup(false)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-50 text-center">Add Delivery Address</h2>
                        <form onSubmit={handleAddressSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={addressForm.fullName}
                                    onChange={handleAddressFormChange}
                                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-300 mb-1">Contact Number</label>
                                <input
                                    type="tel"
                                    id="contactNumber"
                                    name="contactNumber"
                                    value={addressForm.contactNumber}
                                    onChange={handleAddressFormChange}
                                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-300 mb-1">Address Line 1</label>
                                <input
                                    type="text"
                                    id="addressLine1"
                                    name="addressLine1"
                                    value={addressForm.addressLine1}
                                    onChange={handleAddressFormChange}
                                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-300 mb-1">Address Line 2 (Optional)</label>
                                <input
                                    type="text"
                                    id="addressLine2"
                                    name="addressLine2"
                                    value={addressForm.addressLine2}
                                    onChange={handleAddressFormChange}
                                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1">City</label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={addressForm.city}
                                        onChange={handleAddressFormChange}
                                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="state" className="block text-sm font-medium text-gray-300 mb-1">State</label>
                                    <input
                                        type="text"
                                        id="state"
                                        name="state"
                                        value={addressForm.state}
                                        onChange={handleAddressFormChange}
                                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-300 mb-1">Postal Code</label>
                                    <input
                                        type="text"
                                        id="postalCode"
                                        name="postalCode"
                                        value={addressForm.postalCode}
                                        onChange={handleAddressFormChange}
                                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-1">Country</label>
                                    <input
                                        type="text"
                                        id="country"
                                        name="country"
                                        value={addressForm.country}
                                        onChange={handleAddressFormChange}
                                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 mt-6 bg-white text-black cursor-pointer font-medium rounded hover:bg-gray-300 transition"
                            >
                                Save Address
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}