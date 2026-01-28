'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Contract {
  id: string
  contractNumber: string
  content: string
  opdrachtgeverSigned: boolean
  zzpSigned: boolean
  opdrachtgeverSignedAt: string | null
  zzpSignedAt: string | null
  createdAt: string
  opdracht: {
    id: string
    title: string
    description: string
    hourlyRate: string
    duration: string
  }
  opdrachtgever: {
    id: string
    name: string
    company: string | null
    kvkNumber: string | null
  }
  zzp: {
    id: string
    name: string
    company: string | null
    kvkNumber: string | null
  }
}

export default function ContractDetailPage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const [contract, setContract] = useState<Contract | null>(null)
  const [loading, setLoading] = useState(true)
  const [signing, setSigning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && params.id) {
      fetchContract()
    }
  }, [status, params.id, router])

  const fetchContract = async () => {
    try {
      const response = await fetch(`/api/contracten/${params.id}`)
      if (!response.ok) {
        throw new Error('Contract niet gevonden')
      }
      const data = await response.json()
      setContract(data)
    } catch (error) {
      console.error('Error fetching contract:', error)
      setError('Contract niet gevonden')
    } finally {
      setLoading(false)
    }
  }

  const handleSign = async () => {
    setSigning(true)
    setError(null)

    try {
      const response = await fetch(`/api/contracten/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sign' }),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Er is een fout opgetreden')
      }

      fetchContract()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden')
    } finally {
      setSigning(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const canSign = () => {
    if (!contract || !session) return false
    const isOpdrachtgever = contract.opdrachtgever.id === session.user?.id
    const isZzp = contract.zzp.id === session.user?.id

    if (isOpdrachtgever && !contract.opdrachtgeverSigned) return true
    if (isZzp && !contract.zzpSigned) return true
    return false
  }

  const hasSigned = () => {
    if (!contract || !session) return false
    const isOpdrachtgever = contract.opdrachtgever.id === session.user?.id
    const isZzp = contract.zzp.id === session.user?.id

    if (isOpdrachtgever && contract.opdrachtgeverSigned) return true
    if (isZzp && contract.zzpSigned) return true
    return false
  }

  if (status === 'loading' || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !contract) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-700 mb-2">
            {error || 'Contract niet gevonden'}
          </h2>
          <Link href="/contracten" className="text-blue-600 hover:text-blue-700">
            Terug naar contracten
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/contracten"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Terug naar contracten
      </Link>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{contract.opdracht.title}</h1>
              <p className="text-gray-600 mt-1">Contractnummer: {contract.contractNumber}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              {contract.opdrachtgeverSigned && contract.zzpSigned ? (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Volledig getekend
                </span>
              ) : (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  Wacht op handtekening
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Signature status */}
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ondertekeningen</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg ${contract.opdrachtgeverSigned ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
              <div className="flex items-center gap-3">
                {contract.opdrachtgeverSigned ? (
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  </svg>
                )}
                <div>
                  <p className="font-medium text-gray-900">Opdrachtgever</p>
                  <p className="text-sm text-gray-600">
                    {contract.opdrachtgever.company || contract.opdrachtgever.name}
                  </p>
                  {contract.opdrachtgeverSignedAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      Getekend op {formatDate(contract.opdrachtgeverSignedAt)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${contract.zzpSigned ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
              <div className="flex items-center gap-3">
                {contract.zzpSigned ? (
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  </svg>
                )}
                <div>
                  <p className="font-medium text-gray-900">ZZP'er</p>
                  <p className="text-sm text-gray-600">
                    {contract.zzp.company || contract.zzp.name}
                  </p>
                  {contract.zzpSignedAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      Getekend op {formatDate(contract.zzpSignedAt)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contract content */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contractinhoud</h2>
          <div className="bg-gray-50 rounded-lg p-6 font-mono text-sm whitespace-pre-wrap border border-gray-200">
            {contract.content}
          </div>
        </div>

        {/* Sign button */}
        {canSign() && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-gray-700">
                Door te ondertekenen gaat u akkoord met de voorwaarden van dit contract.
              </p>
              <button
                onClick={handleSign}
                disabled={signing}
                className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {signing ? 'Ondertekenen...' : 'Contract ondertekenen'}
              </button>
            </div>
          </div>
        )}

        {hasSigned() && !contract.opdrachtgeverSigned || !contract.zzpSigned ? (
          <div className="border-t border-gray-200 p-6 bg-blue-50">
            <p className="text-blue-800 text-center">
              U heeft dit contract ondertekend. Wacht tot de andere partij ook tekent.
            </p>
          </div>
        ) : null}

        {contract.opdrachtgeverSigned && contract.zzpSigned && (
          <div className="border-t border-gray-200 p-6 bg-green-50">
            <p className="text-green-800 text-center font-medium">
              Dit contract is volledig ondertekend door beide partijen.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
