'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Opdracht {
  id: string
  title: string
  description: string
  scope: string
  duration: string
  hourlyRate: string
  location: string | null
  requirements: string | null
  status: string
  createdAt: string
  opdrachtgever: {
    id: string
    name: string
    company: string | null
  }
  reacties: Array<{
    id: string
    motivation: string
    proposal: string | null
    hourlyRate: string | null
    status: string
    createdAt: string
    zzp: {
      id: string
      name: string
      bio: string | null
      skills: string[]
    }
  }>
}

export default function OpdrachtDetailPage() {
  const { data: session } = useSession()
  const params = useParams()
  const router = useRouter()
  const [opdracht, setOpdracht] = useState<Opdracht | null>(null)
  const [loading, setLoading] = useState(true)
  const [showReactieForm, setShowReactieForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchOpdracht()
    }
  }, [params.id])

  const fetchOpdracht = async () => {
    try {
      const response = await fetch(`/api/opdrachten/${params.id}`)
      if (!response.ok) {
        throw new Error('Opdracht niet gevonden')
      }
      const data = await response.json()
      setOpdracht(data)
    } catch (error) {
      console.error('Error fetching opdracht:', error)
      setError('Opdracht niet gevonden')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReactie = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      motivation: formData.get('motivation') as string,
      proposal: formData.get('proposal') as string,
      hourlyRate: formData.get('hourlyRate') as string,
    }

    try {
      const response = await fetch(`/api/reacties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          opdrachtId: params.id,
        }),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Er is een fout opgetreden')
      }

      setShowReactieForm(false)
      fetchOpdracht()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
    }).format(parseFloat(amount))
  }

  const hasAlreadyReacted = opdracht?.reacties.some(
    (r) => r.zzp.id === session?.user?.id
  )

  const isOwner = opdracht?.opdrachtgever.id === session?.user?.id

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !opdracht) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-700 mb-2">
            {error || 'Opdracht niet gevonden'}
          </h2>
          <Link href="/opdrachten" className="text-blue-600 hover:text-blue-700">
            Terug naar opdrachten
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/opdrachten"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Terug naar opdrachten
      </Link>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{opdracht.title}</h1>
              <p className="text-gray-600">
                Geplaatst door{' '}
                <span className="font-medium">
                  {opdracht.opdrachtgever.company || opdracht.opdrachtgever.name}
                </span>{' '}
                op {formatDate(opdracht.createdAt)}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                {formatCurrency(opdracht.hourlyRate)}
              </div>
              <div className="text-sm text-gray-500">per uur</div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">Scope</div>
              <div className="font-medium text-gray-900">{opdracht.scope}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">Duur</div>
              <div className="font-medium text-gray-900">{opdracht.duration}</div>
            </div>
            {opdracht.location && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">Locatie</div>
                <div className="font-medium text-gray-900">{opdracht.location}</div>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Beschrijving</h2>
            <div className="prose prose-gray max-w-none">
              <p className="whitespace-pre-wrap text-gray-700">{opdracht.description}</p>
            </div>
          </div>

          {opdracht.requirements && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Vereisten</h2>
              <div className="prose prose-gray max-w-none">
                <p className="whitespace-pre-wrap text-gray-700">{opdracht.requirements}</p>
              </div>
            </div>
          )}

          {/* Action buttons */}
          {session?.user?.userType === 'ZZP' && opdracht.status === 'OPEN' && (
            <div className="border-t border-gray-100 pt-6">
              {hasAlreadyReacted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
                  U heeft al gereageerd op deze opdracht
                </div>
              ) : (
                <>
                  {!showReactieForm ? (
                    <button
                      onClick={() => setShowReactieForm(true)}
                      className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Reageren op deze opdracht
                    </button>
                  ) : (
                    <form onSubmit={handleSubmitReactie} className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Uw reactie
                      </h3>

                      {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                          {error}
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Motivatie *
                        </label>
                        <textarea
                          name="motivation"
                          required
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Vertel waarom u geschikt bent voor deze opdracht..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Voorstel / Aanpak
                        </label>
                        <textarea
                          name="proposal"
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Beschrijf uw aanpak (optioneel)..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Uw uurtarief (optioneel)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-gray-500">€</span>
                          <input
                            type="number"
                            name="hourlyRate"
                            step="0.01"
                            min="0"
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder={opdracht.hourlyRate}
                          />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          {submitting ? 'Versturen...' : 'Reactie versturen'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowReactieForm(false)}
                          className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Annuleren
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </div>
          )}

          {!session && opdracht.status === 'OPEN' && (
            <div className="border-t border-gray-100 pt-6">
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <p className="text-gray-700 mb-4">
                  Log in of registreer om te reageren op deze opdracht
                </p>
                <div className="flex gap-3 justify-center">
                  <Link
                    href="/login"
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Inloggen
                  </Link>
                  <Link
                    href="/registreren"
                    className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Registreren
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Show reactions to owner */}
          {isOwner && opdracht.reacties.length > 0 && (
            <div className="border-t border-gray-100 pt-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Reacties ({opdracht.reacties.length})
              </h2>
              <div className="space-y-4">
                {opdracht.reacties.map((reactie) => (
                  <div
                    key={reactie.id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-100"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{reactie.zzp.name}</h3>
                        {reactie.zzp.bio && (
                          <p className="text-sm text-gray-600 mt-1">{reactie.zzp.bio}</p>
                        )}
                      </div>
                      <div className="text-right">
                        {reactie.hourlyRate && (
                          <div className="font-semibold text-blue-600">
                            {formatCurrency(reactie.hourlyRate)}/uur
                          </div>
                        )}
                        <span
                          className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                            reactie.status === 'GEACCEPTEERD'
                              ? 'bg-green-100 text-green-800'
                              : reactie.status === 'AFGEWEZEN'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {reactie.status === 'PENDING' ? 'In afwachting' : reactie.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-gray-700">
                      <p className="font-medium text-sm text-gray-500 mb-1">Motivatie:</p>
                      <p className="whitespace-pre-wrap">{reactie.motivation}</p>
                    </div>
                    {reactie.proposal && (
                      <div className="mt-3 text-gray-700">
                        <p className="font-medium text-sm text-gray-500 mb-1">Voorstel:</p>
                        <p className="whitespace-pre-wrap">{reactie.proposal}</p>
                      </div>
                    )}
                    {reactie.status === 'PENDING' && (
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => router.push(`/dashboard/opdrachtgever/opdrachten/${params.id}?select=${reactie.id}`)}
                          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Selecteren
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
