'use client'
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../lib/cart';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FiTrash2, FiShoppingBag } from 'react-icons/fi';

export default function Cart() {
  const { addToCart } = useCart();
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = 50;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    // Navigate to checkout page
    router.push('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-accent">Your Cart</h1>
            <p className="text-muted-foreground">Manage your shopping cart</p>
          </div>
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <FiShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg text-muted-foreground mb-6">Your cart is empty</p>
                <Button asChild>
                  <Link href="/shop" className="bg-accent text-accent-foreground hover:bg-accent/90">Continue Shopping</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-accent">Your Cart</h1>
          <p className="text-muted-foreground">Review your items and proceed to checkout</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="flex flex-row items-start gap-6 p-4">
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  {/* Content and Controls Area */}
                  <div className="flex flex-grow justify-between">
                    {/* Text and Quantity */}
                    <div className="flex flex-col">
                      <div>
                        <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                        <p className="text-muted-foreground">{item.author}</p>
                        <p className="font-semibold mt-1">₹{item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          className="border-accent text-accent hover:bg-accent/10"
                        >
                          -
                        </Button>
                        <span className="w-8 text-center text-foreground">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="border-accent text-accent hover:bg-accent/10"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    {/* Remove Button */}
                    <div className="flex flex-col justify-between h-full">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                        className="text-accent hover:text-accent/70 ml-auto"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </Button>
                      {/* Add spacing if needed below remove button */}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-accent">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  Proceed to Checkout
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}