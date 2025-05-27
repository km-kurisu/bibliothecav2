'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function AdminLogoutButton() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLogout = async () => {
    // Remove the session query parameter and redirect to login
    const params = new URLSearchParams(searchParams.toString());
    params.delete('session');
    router.push(`/admin/login?${params.toString()}`);
  };

  return (
    <button
      onClick={handleLogout}
      className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
    >
      Logout
    </button>
  );
} 