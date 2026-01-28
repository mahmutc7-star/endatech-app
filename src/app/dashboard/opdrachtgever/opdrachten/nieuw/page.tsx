'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NieuweOpdrachtPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  if (status === 'authenticated' && session?.user?.userType !== 'OPDRACHTGEVER') {
    router.push('/dashboard')
    return null
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      scope: formData.get('scope') as string,
      duration: formData.get('duration') as string,
      hourlyRate: formData.get('hourlyRate') as string,
      location: formData.get('location') as string,
      requirements: formData.get('requirements') as string,
    }

    try {
      const response = await fetch('/api/opdrachten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Er is een fout opgetreden')
      }

      const opdracht = await response.json()
      router.push(`/opdrachten/${opdracht.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/dashboard/opdrachtgever"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Terug naar dashboard
      </Link>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">Nieuwe opdracht plaatsen</h1>
          <p className="mt-2 text-gray-600">
            Vul de details in om uw opdracht te publiceren
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Titel *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Bijv. Senior React Developer gezocht"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Beschrijving *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Beschrijf de opdracht in detail..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="scope" className="block text-sm font-medium text-gray-700 mb-1">
                Scope *
              </label>
              <select
                id="scope"
                name="scope"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecteer scope</option>
                <option value="Klein project">Klein project (1-4 weken)</option>
                <option value="Middel project">Middel project (1-3 maanden)</option>
                <option value="Groot project">Groot project (3+ maanden)</option>
                <option value="Doorlopend">Doorlopend</option>
              </select>
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                Verwachte duur *
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Bijv. 3 maanden"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-1">
                Uurtarief *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">€</span>
                <input
                  type="number"
                  id="hourlyRate"
                  name="hourlyRate"
                  required
                  min="0"
                  step="0.01"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="75.00"
                />
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Locatie
              </label>
              <input
                type="text"
                id="location"
                name="location"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Bijv. Amsterdam of Remote"
              />
            </div>
          </div>

          <div>
            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
              Vereisten
            </label>
            <textarea
              id="requirements"
              name="requirements"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Gewenste ervaring, certificeringen, etc."
            />
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Publiceren...' : 'Opdracht publiceren'}
              </button>
              <Link
                href="/dashboard/opdrachtgever"
                className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuleren
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
