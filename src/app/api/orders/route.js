import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    let query = {};
    if (userId) {
      query.userId = userId;
    }
    
    const orders = await Order.find(query)
      .populate('items.productId')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { userId, userEmail, items, deliveryAddress, paymentMethod, totalAmount } = body;
    
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const order = new Order({
      orderId,
      userId,
      userEmail,
      items,
      deliveryAddress,
      paymentMethod,
      totalAmount
    });
    
    await order.save();
    
    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}