import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import LogoutButton from '@/components/LogoutButton'
import { FiBookOpen } from 'react-icons/fi'
import EBookReader from '@/components/EBookReader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

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

  // Fetch user purchases and their books
  const { data: purchases, error: purchasesError } = await supabase
    .from('purchases')
    .select('id, purchased_at, books(id, title, author, image, file_url)')
    .eq('user_id', userId)
    .order('purchased_at', { ascending: false });

  if (purchasesError) {
    console.error('Error fetching purchases:', purchasesError);
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 text-foreground">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Profile</h1>
        </div>

        <Card className="bg-card p-6 shadow-md">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-xl font-semibold text-foreground">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <p><span className="font-medium">Name:</span> {profile.name}</p>
            <p><span className="font-medium">Email:</span> {profile.email}</p>
          </CardContent>
        </Card>

        <Card className="bg-card p-6 shadow-md">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-xl font-semibold text-foreground">Transaction History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {transactions && transactions.length > 0 ? (
              <ul className="space-y-4">
                {transactions.filter(transaction => transaction && transaction.id).map((transaction) => (
                  <li key={transaction.id.toString()} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
                    <p><span className="font-medium">Amount:</span> ${transaction.amount.toFixed(2)}</p>
                    {transaction.description && <p><span className="font-medium">Description:</span> {transaction.description}</p>}
                    <p className="text-sm text-muted-foreground">Date: {new Date(transaction.created_at).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No transactions found.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card p-6 shadow-md">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-xl font-semibold text-foreground">Payment History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {payments?.length > 0 ? (
              <div className="space-y-4">
                {payments.filter(payment => payment && payment.id).map(payment => (
                  <div 
                    key={payment.id.toString()} 
                    className="bg-background p-4 rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-lg font-semibold text-foreground">₹{payment.amount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
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
                    <div className="text-sm text-foreground">
                      Payment ID: {payment.id}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No payment history found.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card p-6 shadow-md">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
              <FiBookOpen className="inline-block mr-2" /> Your eBook Library
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {purchases && purchases.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {purchases.map((purchase) => (
                  <div key={purchase.id} className="flex flex-col bg-background rounded-lg border border-border p-4">
                    <div className="flex items-center gap-4 mb-2">
                      <img src={purchase.books?.image} alt={purchase.books?.title} className="w-16 h-24 object-cover rounded shadow" />
                      <div>
                        <div className="font-semibold text-lg">{purchase.books?.title}</div>
                        <div className="text-sm text-muted-foreground">{purchase.books?.author}</div>
                        <div className="text-xs text-muted-foreground mt-1">Purchased: {new Date(purchase.purchased_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                    {purchase.books?.file_url && (
                      <Button asChild size="sm" className="mt-2 w-fit">
                        <a href={`/reader?url=${encodeURIComponent(purchase.books.file_url)}`} target="_blank" rel="noopener noreferrer">
                          Read Book
                        </a>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No purchased books yet.</p>
            )}
          </CardContent>
        </Card>

        <div>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}