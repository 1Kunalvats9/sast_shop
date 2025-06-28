import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { status } = body;
    
    // Get the current order
    const currentOrder = await Order.findById(params.id);
    
    if (!currentOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }
    
    const previousStatus = currentOrder.status;
    
    // Handle stock restoration when order is rejected
    if (status === 'rejected' && previousStatus !== 'rejected') {
      // Restore stock for all items in the order
      for (const item of currentOrder.items) {
        const product = await Product.findById(item.productId);
        
        if (!product) {
          console.error(`Product ${item.productId} not found for stock restoration`);
          continue;
        }
        
        if (product.hasVariants && item.selectedSize && item.selectedColor) {
          // Find and restore variant stock
          const variantIndex = product.variants.findIndex(v => 
            v.size === item.selectedSize && v.color === item.selectedColor
          );
          
          if (variantIndex !== -1) {
            product.variants[variantIndex].stock += item.quantity;
            await product.save();
            console.log(`Restored ${item.quantity} stock for ${product.name} (${item.selectedSize}, ${item.selectedColor})`);
          }
        } else if (!product.hasVariants) {
          // Restore regular product stock
          product.stock += item.quantity;
          await product.save();
          console.log(`Restored ${item.quantity} stock for ${product.name}`);
        }
      }
    }
    
    // Update the order
    const order = await Order.findByIdAndUpdate(
      params.id,
      { ...body, updatedAt: Date.now() },
      { new: true }
    ).populate('items.productId');
    
    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    // Get the order before deletion to restore stock
    const order = await Order.findById(params.id);
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Restore stock for all items if order is not delivered
    if (order.status !== 'delivered') {
      for (const item of order.items) {
        const product = await Product.findById(item.productId);
        
        if (!product) {
          console.error(`Product ${item.productId} not found for stock restoration`);
          continue;
        }
        
        if (product.hasVariants && item.selectedSize && item.selectedColor) {
          // Find and restore variant stock
          const variantIndex = product.variants.findIndex(v => 
            v.size === item.selectedSize && v.color === item.selectedColor
          );
          
          if (variantIndex !== -1) {
            product.variants[variantIndex].stock += item.quantity;
            await product.save();
            console.log(`Restored ${item.quantity} stock for ${product.name} (${item.selectedSize}, ${item.selectedColor}) due to order deletion`);
          }
        } else if (!product.hasVariants) {
          // Restore regular product stock
          product.stock += item.quantity;
          await product.save();
          console.log(`Restored ${item.quantity} stock for ${product.name} due to order deletion`);
        }
      }
    }
    
    // Delete the order
    await Order.findByIdAndDelete(params.id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Order deleted successfully and stock restored' 
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}