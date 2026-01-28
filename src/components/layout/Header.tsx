'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

export default function Header() {
  const { data: session, status } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <Image src="/icon.svg" alt="OpdrachtHub" width={32} height={32} />
              <span className="text-xl font-bold text-slate-900">
                Opdracht<span className="text-emerald-500">Hub</span>
              </span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link
                href="/opdrachten"
                className="text-gray-700 hover:text-emerald-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Opdrachten
              </Link>
              {session && (
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-emerald-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            {status === 'loading' ? (
              <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  {session.user?.name}
                </span>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                  {session.user?.userType === 'OPDRACHTGEVER' ? 'Opdrachtgever' : 'ZZP\'er'}
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Uitloggen
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-emerald-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Inloggen
                </Link>
                <Link
                  href="/registreren"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Registreren
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-emerald-600 hover:bg-gray-100"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              <Link
                href="/opdrachten"
                className="block text-gray-700 hover:text-emerald-600 px-3 py-2 text-base font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Opdrachten
              </Link>
              {session && (
                <Link
                  href="/dashboard"
                  className="block text-gray-700 hover:text-emerald-600 px-3 py-2 text-base font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              {session ? (
                <>
                  <div className="px-3 py-2 text-sm text-gray-500">
                    Ingelogd als {session.user?.name}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left text-red-600 hover:text-red-700 px-3 py-2 text-base font-medium"
                  >
                    Uitloggen
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block text-gray-700 hover:text-emerald-600 px-3 py-2 text-base font-medium"
                    onClick={() => setMenuOpen(false)}
                  >
                    Inloggen
                  </Link>
                  <Link
                    href="/registreren"
                    className="block bg-emerald-500 text-white px-3 py-2 mx-3 rounded-lg text-base font-medium text-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    Registreren
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
