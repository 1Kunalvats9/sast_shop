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
    
    // Check stock availability and update stock for each item
    const stockUpdates = [];
    
    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product ${item.name} not found` },
          { status: 400 }
        );
      }
      
      // Check if product has variants
      if (product.hasVariants) {
        if (!item.selectedSize || !item.selectedColor) {
          return NextResponse.json(
            { success: false, error: `Size and color must be selected for ${item.name}` },
            { status: 400 }
          );
        }
        
        // Find the specific variant
        const variantIndex = product.variants.findIndex(v => 
          v.size === item.selectedSize && 
          v.color === item.selectedColor && 
          v.available
        );
        
        if (variantIndex === -1) {
          return NextResponse.json(
            { success: false, error: `Selected variant of ${item.name} is not available` },
            { status: 400 }
          );
        }
        
        const variant = product.variants[variantIndex];
        
        if (variant.stock < item.quantity) {
          return NextResponse.json(
            { success: false, error: `Insufficient stock for ${item.name} (${item.selectedSize}, ${item.selectedColor}). Available: ${variant.stock}` },
            { status: 400 }
          );
        }
        
        // Prepare stock update for variant
        stockUpdates.push({
          productId: product._id,
          type: 'variant',
          variantIndex,
          quantity: item.quantity,
          originalStock: variant.stock
        });
        
      } else {
        // Regular product without variants
        if (product.stock < item.quantity) {
          return NextResponse.json(
            { success: false, error: `Insufficient stock for ${item.name}. Available: ${product.stock}` },
            { status: 400 }
          );
        }
        
        // Prepare stock update for regular product
        stockUpdates.push({
          productId: product._id,
          type: 'regular',
          quantity: item.quantity,
          originalStock: product.stock
        });
      }
    }
    
    // Apply stock updates
    for (const update of stockUpdates) {
      const product = await Product.findById(update.productId);
      
      if (update.type === 'variant') {
        product.variants[update.variantIndex].stock -= update.quantity;
      } else {
        product.stock -= update.quantity;
      }
      
      await product.save();
    }
    
    // Create the order
    const order = new Order({
      orderId,
      userId,
      userEmail,
      items,
      deliveryAddress,
      paymentMethod,
      totalAmount,
      stockUpdates // Store stock update info for potential rollback
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