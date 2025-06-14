import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import LogoutButton from '@/components/LogoutButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function UserProfile(props) {
  const searchParams = typeof props.searchParams?.then === 'function' ? await props.searchParams : props.searchParams;
  const sessionToken = searchParams?.session;
  
  if (!sessionToken) {
    redirect('/login?message=Please log in');
  }

  const supabase = createClient();
  
  // Validate session
  const { data: validSession, error: sessionError } = await supabase
    .from('user_sessions')
    .select('*')
    .eq('session_token', sessionToken)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (!validSession || sessionError) {
    redirect('/login?message=Invalid or expired session');
  }

  // Fetch user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('name, email')
    .eq('id', validSession.user_id)
    .single();

  if (profileError || !profile) {
    console.error('Error fetching user profile:', profileError);
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-[#1d293d] mb-6">User Profile</h1>
          <p className="text-red-600">Could not load user profile.</p>
        </div>
      </div>
    );
  }

  // Fetch user transactions
  const { data: transactions, error: transactionsError } = await supabase
    .from('transactions')
    .select('amount, description, created_at')
    .eq('user_id', validSession.user_id)
    .order('created_at', { ascending: false });

  if (transactionsError) {
    console.error('Error fetching transactions:', transactionsError);
  }

  const { data: payments } = await supabase
    .from('payments')
    .select('id, amount, created_at, status')
    .eq('user_id', validSession.user_id)
    .order('created_at', { ascending: false });

  // Fetch user purchases and their books
  const { data: purchases, error: purchasesError } = await supabase
    .from('purchases')
    .select('id, purchased_at, books(id, title, author, image, file_url)')
    .eq('user_id', validSession.user_id)
    .order('purchased_at', { ascending: false });

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8 text-[#1d293d]">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1d293d]">User Profile</h1>
        </div>

        <div className="bg-[#f0f4f8] p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-[#1d293d] mb-4">Profile Information</h2>
          <p><span className="font-medium">Name:</span> {profile.name}</p>
          <p><span className="font-medium">Email:</span> {profile.email}</p>
        </div>

        <div className="bg-[#f0f4f8] p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-[#1d293d] mb-4">Transaction History</h2>
          {transactions && transactions.length > 0 ? (
            <ul className="space-y-4">
              {transactions.map((transaction) => (
                <li key={transaction.id} className="border-b border-[#1d293d]/10 pb-4 last:border-b-0 last:pb-0">
                  <p><span className="font-medium">Amount:</span> ${transaction.amount.toFixed(2)}</p>
                  {transaction.description && <p><span className="font-medium">Description:</span> {transaction.description}</p>}
                  <p className="text-sm text-[#1d293d]/70">Date: {new Date(transaction.created_at).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[#1d293d]/70">No transactions found.</p>
          )}
        </div>

        <div className="bg-[#f0f4f8] p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-[#1d293d] mb-4">Payment History</h2>
          {payments?.length > 0 ? (
            <ul className="space-y-4">
              {payments.map(payment => (
                <li key={payment.id} className="border-b border-[#1d293d]/10 pb-4">
                  <p><span className="font-medium">Amount:</span> ₹{payment.amount.toFixed(2)}</p>
                  <p><span className="font-medium">Status:</span> {payment.status}</p>
                  <p className="text-sm text-[#1d293d]/70">
                    Date: {new Date(payment.created_at).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[#1d293d]/70">No payment history found.</p>
          )}
        </div>

        {/* eBook Library Section */}
        {/* The eBook library is now handled by the EBookReader component. */}
        {/* To view your eBook library, visit the E-Book Reader page. */}

        <div>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}