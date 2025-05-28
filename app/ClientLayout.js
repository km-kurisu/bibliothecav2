'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiShoppingCart, FiMenu, FiX, FiUser, FiChevronDown, FiSettings, FiBookOpen, FiUsers, FiPackage, FiLogIn, FiLogOut, FiHome } from 'react-icons/fi'
import Image from 'next/image'
import { useCart } from './lib/cart'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/utils/supabase/client'

export default function ClientLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { cart } = useCart()
  const { user, loading, signOut } = useAuth()
  const [sessionToken, setSessionToken] = useState(null)

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const userDropdownRef = useRef(null)
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false)
  const adminDropdownRef = useRef(null)

  // Fetch session token when user is logged in
  useEffect(() => {
    async function fetchSessionToken() {
      if (user) {
        const supabase = createClient()
        const { data: session } = await supabase
          .from('user_sessions')
          .select('session_token')
          .eq('user_id', user.id)
          .gt('expires_at', new Date().toISOString())
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (session) {
          setSessionToken(session.session_token)
        }
      }
    }

    fetchSessionToken()
  }, [user])

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false)
      }
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target)) {
        setIsAdminDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isActive = (path) => pathname === path

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-10 bg-white/50 backdrop-filter backdrop-blur-lg border-b border-[#1d293d]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-2xl font-bold text-[#1d293d]">
                  Bibliotheca
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`${
                      isActive(link.href)
                        ? 'border-[#1d293d] text-[#1d293d]'
                        : 'border-transparent text-[#1d293d]/70 hover:border-[#1d293d]/50 hover:text-[#1d293d]'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right side of navbar (Admin, Auth, Cart) */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
              {/* Admin Dropdown */}
              <div className="relative" ref={adminDropdownRef}>
                <button
                  onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
                  className={`${
                    isActive('/admin') || isActive('/admin/login')
                      ? 'border-[#1d293d] text-[#1d293d]'
                      : 'border-transparent text-[#1d293d]/70 hover:border-[#1d293d]/50 hover:text-[#1d293d]'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
                >
                  Admin
                  <FiChevronDown className={`ml-1 h-4 w-4 transition-transform ${isAdminDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isAdminDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-2 z-50 border border-gray-200">
                    <div className="px-4 py-2 text-xs font-semibold text-[#1d293d]/50 uppercase tracking-wider">
                      Admin Access
                    </div>
                    <div className="border-t border-gray-100 my-1"></div>
                    <Link
                      href="/admin/login"
                      className="flex items-center px-4 py-2 text-sm text-[#1d293d] hover:bg-[#1d293d]/5 transition-colors"
                      onClick={() => setIsAdminDropdownOpen(false)}
                    >
                      <FiLogIn size={20} className="mr-2"/>
                      Admin Login
                    </Link>
                    {user && user.user_metadata.is_admin && (
                      <Link
                        href="/admin"
                        className="flex items-center px-4 py-2 text-sm text-[#1d293d] hover:bg-[#1d293d]/5 transition-colors"
                        onClick={() => setIsAdminDropdownOpen(false)}
                      >
                        <FiSettings size={20} className="mr-2"/>
                        Dashboard
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {!loading && (
                <>
                  {user ? (
                    <div className="relative" ref={userDropdownRef}>
                      <button
                        onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                        className="text-[#1d293d] hover:text-[#1d293d]/80 focus:outline-none"
                      >
                        <FiUser size={20} className="text-[#1d293d]/70 hover:text-[#1d293d]"/>
                      </button>
                      {isUserDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                          <div className="px-4 py-3 text-sm text-[#1d293d] border-b border-gray-200">
                            Signed in as:
                            <div className="font-medium truncate">{user?.email}</div>
                          </div>
                          <Link
                            href={`/user/${user.id}`}
                            className="block px-4 py-2 text-sm text-[#1d293d] hover:bg-gray-100"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            Profile
                          </Link>
                          <button
                            onClick={() => {
                              signOut()
                              setIsUserDropdownOpen(false)
                            }}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-[#1d293d] hover:bg-gray-100 transition-colors"
                          >
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      className="text-[#1d293d] hover:text-[#1d293d]/70 transition-colors"
                    >
                      <FiUser className="w-6 h-6" />
                    </Link>
                  )}
                  <Link href="/cart" className="relative text-[#1d293d] hover:text-[#1d293d]/70 transition-colors">
                    <FiShoppingCart size={20} className="text-[#1d293d]/70 hover:text-[#1d293d]"/>
                    {(cart?.length ?? 0) > 0 && (
                      <span className="absolute -top-2 -right-2 bg-[#1d293d] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-[#1d293d]/70 hover:text-[#1d293d] hover:bg-[#1d293d]/5 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#1d293d]"
              >
                {isMenuOpen ? (
                  <FiX className="block h-6 w-6" />
                ) : (
                  <FiMenu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`${
                    isActive(link.href)
                      ? 'bg-[#1d293d]/5 border-[#1d293d] text-[#1d293d]'
                      : 'border-transparent text-[#1d293d]/70 hover:bg-[#1d293d]/5 hover:border-[#1d293d]/50 hover:text-[#1d293d]'
                  } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors`}
                >
                  {link.label}
                </Link>
              ))}
              {/* Mobile Admin Links */}
              <Link
                href="/admin/login"
                onClick={() => setIsMenuOpen(false)}
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-[#1d293d]/70 hover:bg-[#1d293d]/5 hover:border-[#1d293d]/50 hover:text-[#1d293d] text-base font-medium transition-colors"
              >
                <FiLogIn size={20} className="inline-block mr-2"/>
                Admin Login
              </Link>
              {user && user.user_metadata.is_admin && (
                <Link
                  href="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-[#1d293d]/70 hover:bg-[#1d293d]/5 hover:border-[#1d293d]/50 hover:text-[#1d293d] text-base font-medium transition-colors"
                >
                  <FiSettings size={20} className="inline-block mr-2"/>
                  Admin Dashboard
                </Link>
              )}

              {/* Mobile Auth/Cart Links */}
              {!loading && (
                <>
                  {user ? (
                    <>
                      <Link
                        href={`/user/${user.id}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-[#1d293d]/70 hover:bg-[#1d293d]/5 hover:border-[#1d293d]/50 hover:text-[#1d293d] text-base font-medium transition-colors"
                      >
                        <FiUser className="w-6 h-6 inline-block mr-2" />
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          signOut()
                          setIsMenuOpen(false)
                        }}
                        className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-[#1d293d]/70 hover:bg-[#1d293d]/5 hover:border-[#1d293d]/50 hover:text-[#1d293d] text-base font-medium transition-colors"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-[#1d293d]/70 hover:bg-[#1d293d]/5 hover:border-[#1d293d]/50 hover:text-[#1d293d] text-base font-medium transition-colors"
                    >
                      <FiUser className="w-6 h-6 inline-block mr-2" />
                      Sign In
                    </Link>
                  )}
                  <Link
                    href="/cart"
                    onClick={() => setIsMenuOpen(false)}
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-[#1d293d]/70 hover:bg-[#1d293d]/5 hover:border-[#1d293d]/50 hover:text-[#1d293d] text-base font-medium transition-colors"
                  >
                    <FiShoppingCart size={20} className="inline-block mr-2"/>
                    Cart ({cart?.length ?? 0})
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="pt-16">
        {!loading ? (
          <main>{children}</main>
        ) : (
          <div className="flex justify-center items-center h-[calc(100vh-4rem)]">Loading...</div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-[#1d293d] text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Bibliotheca</h3>
              <p className="text-white/70">
                Your one-stop destination for quality books and literature.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-white/70">
                <li>Email: nexdevcorp@gmail.com</li>
                <li>Phone: +91 81778 66278</li>
                <li>Address: 123 Book Street, Reading City</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-white/70">
            <p>&copy; {new Date().getFullYear()} Bibliotheca. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 