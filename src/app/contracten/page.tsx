'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Contract {
  id: string
  contractNumber: string
  opdrachtgeverSigned: boolean
  zzpSigned: boolean
  createdAt: string
  opdracht: {
    id: string
    title: string
    hourlyRate: string
  }
  opdrachtgever: {
    id: string
    name: string
    company: string | null
  }
  zzp: {
    id: string
    name: string
    company: string | null
  }
}

export default function ContractenPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [contracten, setContracten] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchContracten()
    }
  }, [status, router])

  const fetchContracten = async () => {
    try {
      const response = await fetch('/api/contracten')
      const data = await response.json()
      setContracten(data)
    } catch (error) {
      console.error('Error fetching contracten:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const getStatusLabel = (contract: Contract) => {
    if (contract.opdrachtgeverSigned && contract.zzpSigned) {
      return { label: 'Volledig getekend', color: 'bg-green-100 text-green-800' }
    }
    if (contract.opdrachtgeverSigned || contract.zzpSigned) {
      return { label: 'Wacht op handtekening', color: 'bg-yellow-100 text-yellow-800' }
    }
    return { label: 'Niet getekend', color: 'bg-gray-100 text-gray-800' }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mijn contracten</h1>
        <p className="mt-2 text-gray-600">
          Bekijk en onderteken uw contracten
        </p>
      </div>

      {contracten.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nog geen contracten
          </h3>
          <p className="text-gray-600">
            {session?.user?.userType === 'OPDRACHTGEVER'
              ? 'Zodra u een ZZP\'er selecteert voor uw opdracht, wordt hier het contract aangemaakt.'
              : 'Zodra u geselecteerd wordt voor een opdracht, verschijnt hier het contract.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {contracten.map((contract) => {
            const status = getStatusLabel(contract)
            const otherParty = session?.user?.userType === 'OPDRACHTGEVER'
              ? contract.zzp
              : contract.opdrachtgever

            return (
              <Link
                key={contract.id}
                href={`/contracten/${contract.id}`}
                className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-lg font-semibold text-gray-900">
                          {contract.opdracht.title}
                        </h2>
                        <span className={`px-2 py-1 text-xs rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Contractnummer: {contract.contractNumber}</p>
                        <p>
                          {session?.user?.userType === 'OPDRACHTGEVER' ? 'ZZP\'er' : 'Opdrachtgever'}:{' '}
                          {otherParty.company || otherParty.name}
                        </p>
                        <p>Aangemaakt op: {formatDate(contract.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <div className="flex items-center gap-2">
                          {contract.opdrachtgeverSigned ? (
                            <span className="text-green-600">✓ Opdrachtgever</span>
                          ) : (
                            <span className="text-gray-400">○ Opdrachtgever</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {contract.zzpSigned ? (
                            <span className="text-green-600">✓ ZZP'er</span>
                          ) : (
                            <span className="text-gray-400">○ ZZP'er</span>
                          )}
                        </div>
                      </div>
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
