import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function PaymentConfirmation({ params }) {
  const supabase = createClient()
  const { data: payment } = await supabase
    .from('payments')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!payment) redirect('/')

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-4 text-[#1d293d]">Payment Successful! 🎉</h1>
      <div className="bg-gray-50 p-6 rounded-lg text-[#1d293d]">
        <p className="text-lg mb-2">Amount: ₹{payment.amount.toFixed(2)}</p>
        <p className="text-gray-600">Payment ID: {payment.id}</p>
        <p className="text-gray-600">Method: {payment.payment_method.toUpperCase()}</p>
      </div>
    </div>
  )
}