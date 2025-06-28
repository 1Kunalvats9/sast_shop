import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from '@/context/CartContext'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata = {
  title: 'SAST Shop - Premium Products',
  description: 'Discover premium products that set the bar',
}

export default function RootLayout({
  children,
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <CartProvider>
            {children}
            <Toaster
              position="bottom-right"
              reverseOrder={false}
              gutter={8}
              containerClassName=""
              containerStyle={{}}
              toastOptions={{
                className: '',
                duration: 5000,
                removeDelay: 1000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },

                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: 'green',
                    secondary: 'black',
                  },
                },
              }} />
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}