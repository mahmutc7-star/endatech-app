'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type UserType = 'OPDRACHTGEVER' | 'ZZP'

export default function RegistrerenPage() {
  const router = useRouter()
  const [userType, setUserType] = useState<UserType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      name: formData.get('name') as string,
      userType: userType,
      company: formData.get('company') as string,
      kvkNumber: formData.get('kvkNumber') as string,
    }

    const confirmPassword = formData.get('confirmPassword') as string
    if (data.password !== confirmPassword) {
      setError('Wachtwoorden komen niet overeen')
      setLoading(false)
      return
    }

    if (data.password.length < 8) {
      setError('Wachtwoord moet minimaal 8 tekens bevatten')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/registreren', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Er is een fout opgetreden')
        return
      }

      router.push('/login?registered=true')
    } catch {
      setError('Er is een fout opgetreden. Probeer het opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  if (!userType) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8">
          <div>
            <h2 className="text-center text-3xl font-bold text-gray-900">
              Welkom bij OpdrachtHub
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Kies uw rol om te beginnen
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <button
              onClick={() => setUserType('OPDRACHTGEVER')}
              className="flex flex-col items-center p-8 bg-white border-2 border-gray-200 rounded-xl hover:border-slate-400 hover:shadow-lg transition-all group"
            >
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-slate-200 transition-colors">
                <svg
                  className="w-8 h-8 text-slate-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Opdrachtgever
              </h3>
              <p className="text-gray-600 text-center text-sm">
                Ik wil opdrachten plaatsen en professionals vinden voor mijn
                projecten
              </p>
            </button>

            <button
              onClick={() => setUserType('ZZP')}
              className="flex flex-col items-center p-8 bg-white border-2 border-gray-200 rounded-xl hover:border-green-500 hover:shadow-lg transition-all group"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                ZZP'er / Freelancer
              </h3>
              <p className="text-gray-600 text-center text-sm">
                Ik ben zelfstandig professional en zoek opdrachten
              </p>
            </button>
          </div>

          <p className="text-center text-sm text-gray-600">
            Heeft u al een account?{' '}
            <Link
              href="/login"
              className="font-medium text-emerald-600 hover:text-emerald-500"
            >
              Inloggen
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <button
            onClick={() => setUserType(null)}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center mb-4"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Terug naar rolkeuze
          </button>
          <h2 className="text-3xl font-bold text-gray-900">
            Registreren als{' '}
            {userType === 'OPDRACHTGEVER' ? 'Opdrachtgever' : "ZZP'er"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Vul uw gegevens in om een account aan te maken
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Volledige naam *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="Jan Jansen"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                E-mailadres *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="uw@email.nl"
              />
            </div>

            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium text-gray-700"
              >
                Bedrijfsnaam {userType === 'OPDRACHTGEVER' && '*'}
              </label>
              <input
                id="company"
                name="company"
                type="text"
                required={userType === 'OPDRACHTGEVER'}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="Uw bedrijfsnaam"
              />
            </div>

            <div>
              <label
                htmlFor="kvkNumber"
                className="block text-sm font-medium text-gray-700"
              >
                KvK-nummer
              </label>
              <input
                id="kvkNumber"
                name="kvkNumber"
                type="text"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="12345678"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Wachtwoord *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="Minimaal 8 tekens"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Bevestig wachtwoord *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="Herhaal uw wachtwoord"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Account aanmaken...' : 'Account aanmaken'}
            </button>
          </div>

          <p className="text-center text-sm text-gray-600">
            Door te registreren gaat u akkoord met onze voorwaarden
          </p>
        </form>
      </div>
    </div>
  )
}
