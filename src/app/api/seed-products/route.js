import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

const sampleProducts = [
  {
    name: 'Immersive VR Headset Pro',
    description: 'Step into new realities with stunning visuals and haptic feedback. Compatible with all major gaming platforms.',
    price: 299.99,
    image: '/image.png',
    category: 'Electronics',
    stock: 25,
    featured: true
  },
  {
    name: 'Compact Travel Drone 4K',
    description: 'Capture breathtaking aerial footage wherever you go. Foldable design for ultimate portability.',
    price: 199.50,
    image: '/image.png',
    category: 'Electronics',
    stock: 15,
    featured: true
  },
  {
    name: 'Vintage Bluetooth Speaker',
    description: 'Classic aesthetics meet modern sound. Enjoy rich audio with long-lasting battery life.',
    price: 75.00,
    image: '/image.png',
    category: 'Audio',
    stock: 40,
    featured: false
  },
  {
    name: 'Smartwatch Elite',
    description: 'Stay connected and track your fitness with this sleek and powerful smartwatch.',
    price: 120.00,
    image: '/image.png',
    category: 'Wearables',
    stock: 30,
    featured: true
  },
  {
    name: 'Portable Espresso Maker',
    description: 'Enjoy barista-quality coffee anywhere. Compact and easy to use for the discerning traveler.',
    price: 60.25,
    image: '/image.png',
    category: 'Kitchen',
    stock: 20,
    featured: false
  },
  {
    name: 'AI-Powered Security Camera',
    description: 'Keep your home safe with intelligent motion detection and 24/7 cloud recording.',
    price: 150.00,
    image: '/image.png',
    category: 'Security',
    stock: 18,
    featured: true
  }
];

export async function POST() {
  try {
    await connectDB();
    
    await Product.deleteMany({});
    
    const products = await Product.insertMany(sampleProducts);
    
    return NextResponse.json({ 
      success: true, 
      message: `${products.length} products seeded successfully`,
      products 
    });
  } catch (error) {
    console.error('Error seeding products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed products' },
      { status: 500 }
    );
  }
}