import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
const razorpayInstance = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Handles POST requests to create a new Razorpay order.
 * @param {Request} request The incoming request object.
 * @returns {NextResponse} A response object with the order details or an error.
 */
export async function POST(request) {
    try {
        const { amount, currency } = await request.json();

        // Basic validation for amount
        if (!amount || typeof amount !== 'number' || amount <= 0) {
            return NextResponse.json(
                { success: false, error: 'Invalid amount provided.' },
                { status: 400 }
            );
        }

        const options = {
            amount: Math.round(amount * 100),
            currency: currency || 'INR',
            receipt: `receipt_order_${new Date().getTime()}`,
        };
        const order = await razorpayInstance.orders.create(options);

        if (!order) {
            return NextResponse.json(
                { success: false, error: 'Failed to create order on Razorpay.' },
                { status: 500 }
            );
        }

        console.log('Razorpay order created successfully:', order);
        return NextResponse.json({ success: true, order });

    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        return NextResponse.json(
            { success: false, error: 'An internal server error occurred.' },
            { status: 500 }
        );
    }
}
