import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminLogoutButton from './components/AdminLogoutButton'
import { createClient as createServerClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function AdminPage({ searchParams }) {
  const sessionToken = searchParams.session;
  
  if (!sessionToken) {
    redirect('/admin/login?message=Please log in');
  }

  const supabase = createServerClient();
  
  // Validate session
  const { data: validSession, error } = await supabase
    .from('admin_sessions')
    .select('*')
    .eq('session_token', sessionToken)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (!validSession || error) {
    redirect('/admin/login?message=Invalid or expired session');
  }

  let totalUsers = 0;
  let totalBooks = 0;
  let totalOrders = 0;
  let recentOrders = [];
  let recentUsers = [];

  try {
    // Remove the parallel fetch block entirely and keep only this:
    
    // Fetch total users count
    const { count: userCount, error: userError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    // Fetch total books count
    const { count: bookCount, error: bookError } = await supabase
      .from('books')
      .select('*', { count: 'exact', head: true });
    
    // Fetch total orders count
    const { count: orderCount, error: orderError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });
    
    // Assign counts once
    totalUsers = userCount || 0;
    totalBooks = bookCount || 0;
    totalOrders = orderCount || 0;
    
    // Keep recent activity fetches
    const { data: ordersData } = await supabase
      .from('orders')
      .select('id, total, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    recentOrders = ordersData || [];
    
    const { data: usersData } = await supabase
      .from('profiles')
      .select('id, name, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    recentUsers = usersData || [];
    
    // Error handling for counts
    if (userError) console.error('User count error:', userError);
    if (bookError) console.error('Book count error:', bookError);
    if (orderError) console.error('Order count error:', orderError);
  } catch (fetchError) {
    console.error('An unexpected error occurred:', fetchError);
  }

  // Get admin user details
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('username')
    .eq('id', validSession.admin_id)
    .single();

  return (
    <div className="w-full flex flex-col items-center p-6">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-[#1d293d]">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-[#1d293d]/70">
              Welcome, {adminUser?.username || 'Admin'}
            </span>
            <AdminLogoutButton />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-[#1d293d] mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#1d293d]/70">Total Users</p>
                <p className="text-2xl font-bold text-[#1d293d]" suppressHydrationWarning>{totalUsers}</p>
              </div>
              <div>
                <p className="text-sm text-[#1d293d]/70">Total Books</p>
                <p className="text-2xl font-bold text-[#1d293d]" suppressHydrationWarning>{totalBooks}</p>
              </div>
              <div>
                <p className="text-sm text-[#1d293d]/70">Total Orders</p>
                <p className="text-2xl font-bold text-[#1d293d]" suppressHydrationWarning>{totalOrders}</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-[#1d293d] mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Latest Orders</h3>
                {recentOrders?.map(order => (
                  <div key={order.id} className="text-sm border-b pb-2">
                    <Link href={`/admin/orders/${order.id}`} className="text-[#1d293d] hover:text-[#1d293d]/80">
                      Order #{order.id} - ₹{order.total.toFixed(2)} ({order.status})
                    </Link>
                    <p className="text-[#1d293d]/70 text-xs">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
              
              <div>
                <h3 className="font-medium mb-2">New Users</h3>
                {recentUsers?.map(user => (
                  <div key={user.id} className="text-sm border-b pb-2">
                    <Link href={`/admin/users/${user.id}`} className="text-[#1d293d] hover:text-[#1d293d]/80">
                      {user.name}
                    </Link>
                    <p className="text-[#1d293d]/70 text-xs">
                      Joined {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-[#1d293d] mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <Link 
                href="/admin/books/add"
                className="block w-full bg-[#1d293d] text-white px-4 py-2 rounded-md hover:bg-[#1d293d]/90 transition-colors text-center"
              >
                Add New Book
              </Link>
              <Link
                href="/admin/orders"
                className="block w-full bg-[#1d293d] text-white px-4 py-2 rounded-md hover:bg-[#1d293d]/90 transition-colors text-center"
              >
                View Orders
              </Link>
              <Link
                href="/admin/users"
                className="block w-full bg-[#1d293d] text-white px-4 py-2 rounded-md hover:bg-[#1d293d]/90 transition-colors text-center"
              >
                Manage Users
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}