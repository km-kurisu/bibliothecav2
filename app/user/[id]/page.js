import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import LogoutButton from '@/components/LogoutButton'

export default async function UserProfile({ params }) {
  const userId = params.id;
  
  if (!userId) {
    redirect('/login?message=Please log in');
  }

  const supabase = createClient();
  
  // Fetch user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('name, email')
    .eq('id', userId)
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
    .select('id, amount, description, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (transactionsError) {
    console.error('Error fetching transactions:', transactionsError);
  }

  const { data: payments } = await supabase
    .from('payments')
    .select('id, amount, created_at, status')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

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
              {transactions.filter(transaction => transaction && transaction.id).map((transaction) => (
                <li key={transaction.id.toString()} className="border-b border-[#1d293d]/10 pb-4 last:border-b-0 last:pb-0">
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
            <div className="space-y-4">
              {payments.filter(payment => payment && payment.id).map(payment => (
                <div 
                  key={payment.id.toString()} 
                  className="bg-white p-4 rounded-lg shadow-sm border border-[#1d293d]/10 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-lg font-semibold text-[#1d293d]">₹{payment.amount.toFixed(2)}</p>
                      <p className="text-sm text-[#1d293d]">
                        {new Date(payment.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      payment.status === 'completed' 
                        ? 'bg-green-500 text-white'
                        : payment.status === 'pending'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-sm text-[#1d293d]">
                    Payment ID: {payment.id}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-[#1d293d]">No payment history found.</p>
            </div>
          )}
        </div>

        <div>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}