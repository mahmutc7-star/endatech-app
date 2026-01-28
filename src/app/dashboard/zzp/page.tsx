'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Reactie {
  id: string
  motivation: string
  status: string
  createdAt: string
  opdracht: {
    id: string
    title: string
    hourlyRate: string
    status: string
    opdrachtgever: {
      name: string
      company: string | null
    }
  }
}

interface Contract {
  id: string
  contractNumber: string
  opdrachtgeverSigned: boolean
  zzpSigned: boolean
  opdracht: {
    title: string
  }
  opdrachtgever: {
    name: string
    company: string | null
  }
}

export default function ZzpDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [reacties, setReacties] = useState<Reactie[]>([])
  const [contracten, setContracten] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      if (session?.user?.userType !== 'ZZP') {
        router.push('/dashboard/opdrachtgever')
      } else {
        fetchData()
      }
    }
  }, [status, session, router])

  const fetchData = async () => {
    try {
      const [reactiesRes, contractenRes] = await Promise.all([
        fetch('/api/reacties'),
        fetch('/api/contracten'),
      ])
      const reactiesData = await reactiesRes.json()
      const contractenData = await contractenRes.json()
      setReacties(reactiesData)
      setContracten(contractenData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
    }).format(parseFloat(amount))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'GEACCEPTEERD':
        return 'bg-green-100 text-green-800'
      case 'AFGEWEZEN':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'In afwachting'
      case 'GEACCEPTEERD':
        return 'Geaccepteerd'
      case 'AFGEWEZEN':
        return 'Afgewezen'
      default:
        return status
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm h-32"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const pendingReacties = reacties.filter((r) => r.status === 'PENDING')
  const acceptedReacties = reacties.filter((r) => r.status === 'GEACCEPTEERD')
  const pendingContracts = contracten.filter((c) => !c.zzpSigned)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welkom, {session?.user?.name}
        </h1>
        <p className="mt-2 text-gray-600">
          Bekijk uw reacties en contracten
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-3xl font-bold text-blue-600">{reacties.length}</div>
          <div className="text-gray-600 mt-1">Totaal reacties</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-3xl font-bold text-yellow-600">{pendingReacties.length}</div>
          <div className="text-gray-600 mt-1">In afwachting</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-3xl font-bold text-green-600">{acceptedReacties.length}</div>
          <div className="text-gray-600 mt-1">Geaccepteerd</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-3xl font-bold text-purple-600">{contracten.length}</div>
          <div className="text-gray-600 mt-1">Contracten</div>
        </div>
      </div>

      {/* Quick action */}
      <div className="mb-8">
        <Link
          href="/opdrachten"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Zoek opdrachten
        </Link>
      </div>

      {/* Alert for pending contracts */}
      {pendingContracts.length > 0 && (
        <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-yellow-800">
              U heeft {pendingContracts.length} contract{pendingContracts.length !== 1 && 'en'} die uw handtekening nodig {pendingContracts.length === 1 ? 'heeft' : 'hebben'}.
            </span>
            <Link href="/contracten" className="ml-auto text-yellow-800 font-medium hover:text-yellow-900">
              Bekijken →
            </Link>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent reacties */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Mijn reacties</h2>
              <Link href="/dashboard/zzp/reacties" className="text-blue-600 text-sm hover:text-blue-700">
                Alle bekijken →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {reacties.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                U heeft nog geen reacties geplaatst
              </div>
            ) : (
              reacties.slice(0, 5).map((reactie) => (
                <Link
                  key={reactie.id}
                  href={`/opdrachten/${reactie.opdracht.id}`}
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{reactie.opdracht.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-gray-600">
                          {reactie.opdracht.opdrachtgever.company || reactie.opdracht.opdrachtgever.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatCurrency(reactie.opdracht.hourlyRate)}/uur
                        </span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(reactie.status)}`}>
                      {getStatusLabel(reactie.status)}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Contracts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Contracten</h2>
              <Link href="/contracten" className="text-blue-600 text-sm hover:text-blue-700">
                Alle bekijken →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {contracten.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                U heeft nog geen contracten
              </div>
            ) : (
              contracten.slice(0, 5).map((contract) => (
                <Link
                  key={contract.id}
                  href={`/contracten/${contract.id}`}
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{contract.opdracht.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        met {contract.opdrachtgever.company || contract.opdrachtgever.name}
                      </p>
                    </div>
                    {contract.opdrachtgeverSigned && contract.zzpSigned ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Getekend
                      </span>
                    ) : !contract.zzpSigned ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                        Actie nodig
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                        Wacht op opdrachtgever
                      </span>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
