'use client'
import { useCart } from '../lib/cart'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const handlePayment = async (paymentMethod) => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    
    const { data, error } = await supabase.from('payments').insert([{
      user_id: user.id,
      amount: total,
      payment_method: paymentMethod,
      status: 'completed'
    }]).select()

    if (error) {
      console.error('Payment failed:', error)
      return
    }

    clearCart()
    router.push(`/payment-confirmation/${data[0].id}`)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#1d293d]">Secure Checkout</h1>
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2 text-[#1d293d]">Order Summary</h2>
          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between mb-2 text-[#1d293d]">
              <span>{item.title} x {item.quantity}</span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-semibold text-[#1d293d]">
              <span>Total:</span>
              <span>₹{cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-[#1d293d]">Payment Methods</h2>
          <button 
            onClick={() => handlePayment('card')}
            className="w-full bg-[#1d293d] text-white p-3 rounded-lg hover:bg-[#1d293d]/90"
          >
            Credit/Debit Card
          </button>
          <button
            onClick={() => handlePayment('upi')}
            className="w-full mt-4 bg-[#1d293d] text-white p-3 rounded-lg hover:bg-[#1d293d]/90"
          >
            UPI Payment
          </button>
        </div>
      </div>
    </div>
  )
}