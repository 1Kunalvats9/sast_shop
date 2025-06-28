'use client'
import { useEffect, useState } from "react"
import { X } from 'lucide-react'
import { useRouter } from "next/navigation"

export default function Cart() {
    const [showAddressPopup, setShowAddressPopup] = useState(false)
    const [products, setProducts] = useState([])
    const [deliveryAddress, setDeliveryAddress] = useState(null)
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

    useEffect(() => {
        try {
            const cart = localStorage.getItem('cart')
            if (!cart) {
                setProducts([])
            } else {
                setProducts(JSON.parse(cart))
            }
            const storedAddress = localStorage.getItem('deliveryAddress')
            if (storedAddress) {
                setDeliveryAddress(JSON.parse(storedAddress))
            }
        } catch (err) {
            console.log('cart error', err)
        }
    }, [])

    const calculateTotalPrice = () => {
        return products.reduce((total, product) => {
            const price = product.price || 0;
            const quantity = product.quantity || 1;
            return total + (price * quantity);
        }, 0);
    }

    const handleRemoveItem = (idToRemove) => {
        let updatedCart = products.filter(product => product.id !== idToRemove);
        setProducts(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    }

    const handleClearCart = () => {
        setProducts([]);
        localStorage.removeItem('cart');
    }

    const handleQuantityChange = (id, newQuantity) => {
        let updatedCart = products.map(product => {
            if (product.id === id) {
                return { ...product, quantity: parseInt(newQuantity) };
            }
            return product;
        });
        setProducts(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleAddressFormChange = (e) => {
        const { name, value } = e.target;
        setAddressForm(prev => ({ ...prev, [name]: value }));
    }

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        setDeliveryAddress(addressForm);
        localStorage.setItem('deliveryAddress', JSON.stringify(addressForm));
        setShowAddressPopup(false);
        setAddressForm({
            fullName: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            postalCode: '',
            country: 'India',
            contactNumber: ''
        });
    }

    const totalItemsInCart = products.reduce((total, product) => total + (product.quantity || 1), 0);
    const subtotalPrice = calculateTotalPrice();
    const taxRate = 0.02;
    const taxAmount = subtotalPrice * taxRate;
    const finalTotal = subtotalPrice + taxAmount;

    return (
        <div className="w-full min-h-screen bg-black flex items-center justify-center">
            <div className="flex flex-col md:flex-row py-16 max-w-6xl w-full px-6 mx-auto bg-black text-white">
                <div className='flex-1 max-w-4xl'>
                    <h1 className="text-3xl font-medium mb-6">
                        Shopping Cart <span className="text-sm text-gray-400">{totalItemsInCart} Items</span>
                    </h1>

                    {products.length === 0 ? (
                        <p className="text-gray-400 text-lg">Your cart is empty.</p>
                    ) : (
                        <>
                            <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-400 text-base font-medium pb-3 border-b border-gray-700">
                                <p className="text-left">Product Details</p>
                                <p className="text-center">Subtotal</p>
                                <p className="text-center">Action</p>
                            </div>

                            {products.map((product) => (
                                <div key={product.id} className="grid grid-cols-[2fr_1fr_1fr] text-gray-300 items-center text-sm md:text-base font-medium pt-3 border-b border-gray-800 py-4">
                                    <div className="flex items-center md:gap-6 gap-3">
                                        <div className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-700 rounded bg-white overflow-hidden">
                                            <img className="max-w-full h-full object-cover" src={product.image} alt={product.item_name} />
                                        </div>
                                        <div>
                                            <p className="hidden md:block font-semibold">{product.item_name}</p>
                                            <div className="font-normal text-gray-500">
                                                <p>Price: ₹{product.price ? product.price.toFixed(2) : '0.00'}</p>
                                                <div className='flex items-center'>
                                                    <p>Qty:</p>
                                                    <select
                                                        className='outline-none bg-gray-900 border border-gray-700 text-white ml-2 rounded p-1'
                                                        value={product.quantity || 1}
                                                        onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                                    >
                                                        {Array(10).fill('').map((_, index) => (
                                                            <option key={index} value={index + 1}>{index + 1}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-center">₹{((product.price || 0) * (product.quantity || 1)).toFixed(2)}</p>
                                    <button onClick={() => handleRemoveItem(product.id)} className="cursor-pointer mx-auto text-red-500 hover:text-red-700">
                                        <X size={20} />
                                    </button>
                                </div>
                            ))}
                            <div className="flex justify-between items-center mt-8">
                                <button className="group cursor-pointer flex items-center gap-2 text-gray-400 font-medium hover:text-white transition" onClick={()=>{
                                    router.push('/')
                                }}>
                                     <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">  
                                        <path d="M14.09 5.5H1M6.143 10 1 5.5 6.143 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Continue Shopping
                                </button>
                                <button onClick={handleClearCart} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
                                    Clear Cart
                                </button>
                            </div>
                        </>
                    )}
                </div>

                <div className="max-w-[360px] w-full bg-gray-950 p-5 max-md:mt-16 border rounded-lg ml-10 border-gray-700 text-white">
                    <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
                    <hr className="border-gray-700 my-5" />

                    <div className="mb-6">
                        <p className="text-sm font-medium uppercase text-gray-300">Delivery Address</p>
                        <div className="relative flex justify-between items-start mt-2">
                            {deliveryAddress ? (
                                <p className="text-gray-400">
                                    {deliveryAddress.fullName}<br />
                                    {deliveryAddress.addressLine1}<br />
                                    {deliveryAddress.addressLine2 && `${deliveryAddress.addressLine2}<br />`}
                                    {deliveryAddress.city}, {deliveryAddress.state} - {deliveryAddress.postalCode}<br />
                                    {deliveryAddress.country}<br />
                                    <span className="font-semibold">Contact:</span> {deliveryAddress.contactNumber}
                                </p>
                            ) : (
                                <p className="text-gray-400">No address found</p>
                            )}
                            <button onClick={() => setShowAddressPopup(true)} className="text-gray-400 hover:underline cursor-pointer">
                                {deliveryAddress ? 'Change' : 'Add Address'}
                            </button>
                        </div>

                        <p className="text-sm font-medium uppercase mt-6 text-gray-300">Payment Method</p>

                        <select className="w-full border border-gray-700 bg-gray-900 px-3 py-2 mt-2 outline-none text-white rounded">
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
                        <p className="flex justify-between text-lg font-medium mt-3 text-white">
                            <span>Total Amount:</span><span>₹{finalTotal.toFixed(2)}</span>
                        </p>
                    </div>

                    <button className="w-full py-3 mt-6 cursor-pointer bg-white text-black font-medium hover:bg-gray-300 transition rounded">
                        Place Order
                    </button>
                </div>
            </div>

            {showAddressPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
                    <div className="relative bg-black border border-gray-700 rounded-xl shadow-2xl p-6 sm:p-8 max-w-lg w-full text-white">
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