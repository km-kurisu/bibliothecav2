'use client'
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../lib/cart';
import { useAuth } from '@/context/AuthContext';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = 50;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (!user) {
      router.push('/login?redirect=/checkout');
      return;
    }
    router.push('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-[#1d293d]">Your Cart</h1>
          <div className="text-center py-12">
            <p className="text-[#1d293d]/70 text-lg mb-6">Your cart is empty</p>
            <Link 
              href="/shop" 
              className="inline-block bg-[#1d293d] text-white px-6 py-3 rounded-lg hover:bg-[#1d293d]/90 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-[#1d293d]">Your Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-[#1d293d]/5 rounded-lg p-4 flex items-center gap-4">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-[#1d293d]">{item.title}</h3>
                    <p className="text-[#1d293d]/70">{item.author}</p>
                    <p className="text-[#1d293d] font-semibold mt-1">₹{item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1d293d]/10 text-[#1d293d] hover:bg-[#1d293d]/20 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-[#1d293d]">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1d293d]/10 text-[#1d293d] hover:bg-[#1d293d]/20 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-[#1d293d]/70 hover:text-[#1d293d] transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#1d293d]/5 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-[#1d293d]">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-[#1d293d]/70">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#1d293d]/70">
                  <span>Shipping</span>
                  <span>₹{shipping.toFixed(2)}</span>
                </div>
                <div className="border-t border-[#1d293d]/10 pt-2 mt-2">
                  <div className="flex justify-between text-[#1d293d] font-semibold">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full bg-[#1d293d] text-white px-6 py-3 rounded-lg mt-6 hover:bg-[#1d293d]/90 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 