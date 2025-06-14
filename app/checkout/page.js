'use client'
export const dynamic = 'force-dynamic';

import { useCart } from '../lib/cart'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { FiCreditCard, FiSmartphone } from 'react-icons/fi'
import { useState, useEffect } from 'react';

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  // Payment UI state
  const [step, setStep] = useState('checkout'); // 'checkout' | 'processing' | 'confirmation' | 'error'
  const [paymentMethod, setPaymentMethod] = useState(null); // 'card' | 'upi'
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [error, setError] = useState('');

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  // Simulate payment processing
  const handlePayment = async (method) => {
    setPaymentMethod(method);
    setError('');
    if (method === 'upi' && !upiId) {
      setError('Please enter your UPI ID.');
      return;
    }
    if (method === 'card' && !cardNumber) {
      setError('Please enter your card number.');
      return;
    }
    setStep('processing');
    setTimeout(async () => {
      let paymentId;
      if (user && user.id && cartItems.length) {
        // Insert payment record
        paymentId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
        await supabase.from('payments').insert({
          id: paymentId,
          user_id: user.id,
          amount: total,
          status: 'completed',
          payment_method: method,
        });
        // Insert purchases
        for (const item of cartItems) {
          // Find the real book by title and author (adjust if you have a better unique field)
          const { data: bookRecord, error: bookError } = await supabase
            .from('books')
            .select('id')
            .eq('title', item.title)
            .eq('author', item.author)
            .maybeSingle();
          if (!bookRecord || bookError) continue;
          const { data: existing, error: existingError } = await supabase
            .from('purchases')
            .select('id')
            .eq('user_id', user.id)
            .eq('book_id', bookRecord.id)
            .maybeSingle();
          if (!existing && !existingError) {
            await supabase.from('purchases').insert({
              user_id: user.id,
              book_id: bookRecord.id,
            });
          }
        }
      }
      setStep('confirmation');
      clearCart();
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Secure Checkout</h1>
          <p className="text-muted-foreground">Complete your purchase securely</p>
        </div>
        <div className="space-y-6">
          {step === 'checkout' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>Review your order details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between items-center">
                    <p className="font-medium">Total Amount</p>
                    <p className="text-lg font-semibold">₹{total.toFixed(2)}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Choose your preferred payment method</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() => setPaymentMethod('card')}
                    className="w-full"
                    variant={paymentMethod === 'card' ? 'default' : 'outline'}
                  >
                    <FiCreditCard className="mr-2 h-4 w-4" />
                    Credit/Debit Card
                  </Button>
                  <Button
                    onClick={() => setPaymentMethod('upi')}
                    className="w-full"
                    variant={paymentMethod === 'upi' ? 'default' : 'outline'}
                  >
                    <FiSmartphone className="mr-2 h-4 w-4" />
                    UPI Payment
                  </Button>
                  {paymentMethod === 'upi' && (
                    <div className="mt-4">
                      <label className="block mb-2 font-medium">Enter UPI ID</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={e => setUpiId(e.target.value)}
                        className="w-full border rounded px-3 py-2 text-foreground bg-background"
                        placeholder="yourname@bank"
                      />
                      <Button
                        className="w-full mt-4"
                        onClick={() => handlePayment('upi')}
                      >
                        Pay with UPI
                      </Button>
                    </div>
                  )}
                  {paymentMethod === 'card' && (
                    <div className="mt-4">
                      <label className="block mb-2 font-medium">Enter Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        className="w-full border rounded px-3 py-2 text-foreground bg-background"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                      <Button
                        className="w-full mt-4"
                        onClick={() => handlePayment('card')}
                      >
                        Pay with Card
                      </Button>
                    </div>
                  )}
                  {error && <div className="text-red-600 mt-2">{error}</div>}
                </CardContent>
              </Card>
              <Button
                onClick={() => router.push('/cart')}
                variant="outline"
                className="w-full mt-4"
              >
                Back to Cart
              </Button>
            </>
          )}
          {step === 'processing' && (
            <Card>
              <CardHeader>
                <CardTitle>Processing Payment...</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">Please wait while your payment is being processed.</p>
              </CardContent>
            </Card>
          )}
          {step === 'confirmation' && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Successful</CardTitle>
                <CardDescription>Your payment has been processed successfully</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-muted-foreground">Amount Paid</p>
                  <p className="text-2xl font-bold">₹{total.toFixed(2)}</p>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <p className="text-muted-foreground">Payment Method</p>
                  <div className="flex items-center gap-2">
                    {paymentMethod === 'card' ? <FiCreditCard /> : <FiSmartphone />}
                    <p className="font-medium">{paymentMethod ? paymentMethod.toUpperCase() : ''}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button asChild className="w-full">
                  <a href="/shop">Continue Shopping</a>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <a href="/user">View Order History</a>
                </Button>
              </CardFooter>
            </Card>
          )}
          {step === 'error' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Payment Failed</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">There was an issue processing your payment. Please try again.</p>
                <Button
                  onClick={() => setStep('checkout')}
                  className="w-full"
                >
                  Retry Payment
                </Button>
                <Button
                  onClick={() => router.push('/cart')}
                  variant="outline"
                  className="w-full mt-2"
                >
                  Back to Cart
                </Button>
              </CardContent>
            </Card>
          )}
          <div className="text-center text-sm text-muted-foreground">
            <p>Your payment information is secure and encrypted</p>
            <p>We never store your card details</p>
          </div>
        </div>
      </div>
    </div>
  )
}