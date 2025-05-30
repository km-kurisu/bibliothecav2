import './globals.css'
import { Inter } from "next/font/google";
import { CartProvider } from "./lib/cart";
import ClientLayout from './ClientLayout';
import { AuthProvider } from '@/context/AuthContext'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'Bibliotheca',
  description: 'Your online bookstore',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
