import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { FiCheckCircle, FiCreditCard, FiSmartphone } from 'react-icons/fi'
import Link from 'next/link'

export default async function PaymentConfirmation({ params }) {
  const supabase = createClient()
  const { data: payment } = await supabase
    .from('payments')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!payment) redirect('/')

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'card':
        return <FiCreditCard className="h-5 w-5" />
      case 'upi':
        return <FiSmartphone className="h-5 w-5" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <FiCheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Payment Successful! 🎉</h1>
          <p className="text-muted-foreground">Thank you for your purchase</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>Your payment has been processed successfully</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">Amount Paid</p>
              <p className="text-2xl font-bold">₹{payment.amount.toFixed(2)}</p>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">Payment Method</p>
              <div className="flex items-center gap-2">
                {getPaymentMethodIcon(payment.payment_method)}
                <p className="font-medium">{payment.payment_method.toUpperCase()}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">Transaction ID</p>
              <p className="font-mono text-sm">{payment.id}</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button asChild className="w-full">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/user">View Order History</Link>
            </Button>
          </CardFooter>
        </Card>

        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>A confirmation email has been sent to your registered email address</p>
          <p>If you have any questions, please contact our support team</p>
        </div>
      </div>
    </div>
  )
}