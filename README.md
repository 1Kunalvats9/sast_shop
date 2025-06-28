# SAST Shop - E-commerce Platform

This is a modern e-commerce platform built with Next.js, featuring admin dashboard, product management, and Cloudinary integration for image uploads.

## Features

- Product catalog with featured items
- Shopping cart functionality
- User authentication with Clerk
- Order management system
- Admin dashboard for product and order management
- Cloudinary integration for image uploads
- Responsive design

## Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Cloudinary Setup

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to your Dashboard
3. Copy the following credentials:
   - Cloud Name
   - API Key
   - API Secret
4. Add them to your `.env.local` file

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up your environment variables in `.env.local`

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Admin Access

To access the admin dashboard:
1. Sign up/Sign in to the application
2. Set your user role to 'admin' in Clerk dashboard
3. Navigate to `/admin` to access the admin panel

## Project Structure

- `/src/app` - Next.js app router pages
- `/src/components` - Reusable React components
- `/src/context` - React context providers
- `/src/lib` - Utility functions and configurations
- `/src/models` - MongoDB models
- `/src/utils` - Helper utilities

## Technologies Used

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Authentication**: Clerk
- **Database**: MongoDB with Mongoose
- **Image Storage**: Cloudinary
- **UI Components**: Lucide React icons
- **Notifications**: React Hot Toast
