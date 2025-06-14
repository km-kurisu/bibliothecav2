'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiShoppingCart, FiMenu, FiX, FiUser, FiChevronDown, FiSettings, FiBookOpen, FiUsers, FiPackage, FiLogIn, FiLogOut, FiHome } from 'react-icons/fi'
import Image from 'next/image'
import { useCart } from './lib/cart'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/utils/supabase/client'
import { ModeToggle } from "@/components/dark-mode-toggle"

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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-filter backdrop-blur-lg border-b border-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-2xl font-bold text-accent">
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
                        ? 'border-accent text-accent'
                        : 'border-transparent text-muted-foreground hover:border-accent/50 hover:text-accent'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right side of navbar (Admin, Auth, Cart, Dark Mode) */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
              {/* Admin Dropdown */}
              <div className="relative" ref={adminDropdownRef}>
                <button
                  onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
                  className={`${
                    isActive('/admin') || isActive('/admin/login')
                      ? 'border-accent text-accent'
                      : 'border-transparent text-muted-foreground hover:border-accent/50 hover:text-accent'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
                >
                  Admin
                  <FiChevronDown className={`ml-1 h-4 w-4 transition-transform ${isAdminDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isAdminDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-popover rounded-md shadow-lg py-2 z-50 border border-accent/20 text-popover-foreground">
                    <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Admin Access
                    </div>
                    <div className="border-t border-accent/20 my-1"></div>
                    <Link
                      href="/admin/login"
                      className="flex items-center px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                      onClick={() => setIsAdminDropdownOpen(false)}
                    >
                      <FiLogIn size={20} className="mr-2"/>
                      Admin Login
                    </Link>
                    {user && user.user_metadata.is_admin && (
                      <Link
                        href="/admin"
                        className="flex items-center px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
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
                        className="text-accent hover:text-accent/80 focus:outline-none"
                      >
                        <FiUser size={20} className="text-muted-foreground hover:text-accent"/>
                      </button>
                      {isUserDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-popover rounded-md shadow-lg py-1 z-50 border border-accent/20 text-popover-foreground">
                          <div className="px-4 py-3 text-sm text-popover-foreground border-b border-accent/20">
                            Signed in as:
                            <div className="font-medium truncate">{user?.email}</div>
                          </div>
                          <Link
                            href={`/user/${user.id}`}
                            className="block px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            Profile
                          </Link>
                          <Link
                            href="/reader"
                            className="block px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            E-Book Reader
                          </Link>
                          <button
                            onClick={() => {
                              signOut()
                              setIsUserDropdownOpen(false)
                            }}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                          >
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      className="text-accent hover:text-accent/80 transition-colors"
                    >
                      <FiUser className="w-6 h-6 text-muted-foreground hover:text-accent" />
                    </Link>
                  )}
                  <Link href="/cart" className="relative text-accent hover:text-accent/80 transition-colors">
                    <FiShoppingCart size={20} className="text-muted-foreground hover:text-accent"/>
                    {(cart?.length ?? 0) > 0 && (
                      <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                  <ModeToggle />
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ring"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <FiX className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <FiMenu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${
                    isActive(link.href)
                      ? 'bg-primary text-primary-foreground block'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  } block px-3 py-2 rounded-md text-base font-medium`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/admin/login"
                className={`${
                  isActive('/admin') || isActive('/admin/login')
                    ? 'bg-primary text-primary-foreground block'
                    : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                } block px-3 py-2 rounded-md text-base font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Login
              </Link>

              {!loading && (
                <>
                  {user ? (
                    <div className="border-t border-border pt-4 pb-3">
                      <div className="flex items-center px-5">
                        <div className="flex-shrink-0">
                          <FiUser className="h-8 w-8 text-muted-foreground"/>
                        </div>
                        <div className="ml-3">
                          <div className="text-base font-medium text-foreground">{user?.email}</div>
                        </div>
                      </div>
                      <div className="mt-3 px-2 space-y-1">
                        <Link
                          href={`/user/${user.id}`}
                          className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-foreground/80 hover:bg-accent"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Your Profile
                        </Link>
                         <Link
                          href="/reader"
                          className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-foreground/80 hover:bg-accent"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          E-Book Reader
                        </Link>
                        <button
                          onClick={() => {
                            signOut()
                            setIsMenuOpen(false)
                          }}
                          className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-foreground/80 hover:bg-accent"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  ) : (
                     <Link
                      href="/login"
                      className={`${
                        isActive('/login')
                          ? 'bg-primary text-primary-foreground block'
                          : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                      } block px-3 py-2 rounded-md text-base font-medium`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                  )}
                  <Link
                    href="/cart"
                    className={`${
                      isActive('/cart')
                        ? 'bg-primary text-primary-foreground block'
                        : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                    } block px-3 py-2 rounded-md text-base font-medium relative`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Cart
                    {(cart?.length ?? 0) > 0 && (
                      <span className="absolute top-2 right-2 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main content with padding for fixed navbar */}
      <main className="flex-grow pt-16">
        {!loading ? (
          <main>{children}</main>
        ) : (
          <div className="flex justify-center items-center h-[calc(100vh-4rem)]">Loading...</div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-card text-card-foreground py-8 mt-12">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-accent">About Bibliotheca</h3>
              <p className="text-muted-foreground">
                Your one-stop destination for quality books and literature.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-accent">Quick Links</h3>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-accent">Contact Us</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Email: nexdevcorp@gmail.com</li>
                <li>Phone: +91 81778 66278</li>
                <li>Address: 123 Book Street, Reading City</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-accent/20 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Bibliotheca. All rights reserved.</p>
            <Link 
              href="/admin/signup" 
              className="text-muted-foreground hover:text-accent text-xs mt-2 inline-block transition-colors"
            >
              Admin Signup
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}