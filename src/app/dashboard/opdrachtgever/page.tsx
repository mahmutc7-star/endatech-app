'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Opdracht {
  id: string
  title: string
  status: string
  hourlyRate: string
  createdAt: string
  _count: {
    reacties: number
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
  zzp: {
    name: string
    company: string | null
  }
}

export default function OpdrachtgeverDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [opdrachten, setOpdrachten] = useState<Opdracht[]>([])
  const [contracten, setContracten] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      if (session?.user?.userType !== 'OPDRACHTGEVER') {
        router.push('/dashboard/zzp')
      } else {
        fetchData()
      }
    }
  }, [status, session, router])

  const fetchData = async () => {
    try {
      const [opdrachtenRes, contractenRes] = await Promise.all([
        fetch('/api/opdrachten?my=true'),
        fetch('/api/contracten'),
      ])
      const opdrachtenData = await opdrachtenRes.json()
      const contractenData = await contractenRes.json()
      setOpdrachten(opdrachtenData)
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
      case 'OPEN':
        return 'bg-green-100 text-green-800'
      case 'IN_SELECTIE':
        return 'bg-yellow-100 text-yellow-800'
      case 'GEMATCHT':
        return 'bg-blue-100 text-blue-800'
      case 'AFGEROND':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'Open'
      case 'IN_SELECTIE':
        return 'In selectie'
      case 'GEMATCHT':
        return 'Gematcht'
      case 'AFGEROND':
        return 'Afgerond'
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

  const openOpdrachten = opdrachten.filter((o) => o.status === 'OPEN')
  const pendingContracts = contracten.filter((c) => !c.opdrachtgeverSigned || !c.zzpSigned)
  const totalReacties = opdrachten.reduce((sum, o) => sum + o._count.reacties, 0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welkom, {session?.user?.name}
        </h1>
        <p className="mt-2 text-gray-600">
          Beheer uw opdrachten en contracten
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-3xl font-bold text-blue-600">{opdrachten.length}</div>
          <div className="text-gray-600 mt-1">Totaal opdrachten</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-3xl font-bold text-green-600">{openOpdrachten.length}</div>
          <div className="text-gray-600 mt-1">Open opdrachten</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-3xl font-bold text-yellow-600">{totalReacties}</div>
          <div className="text-gray-600 mt-1">Reacties ontvangen</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-3xl font-bold text-purple-600">{contracten.length}</div>
          <div className="text-gray-600 mt-1">Contracten</div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <Link
          href="/dashboard/opdrachtgever/opdrachten/nieuw"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nieuwe opdracht plaatsen
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent opdrachten */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Mijn opdrachten</h2>
              <Link href="/dashboard/opdrachtgever/opdrachten" className="text-blue-600 text-sm hover:text-blue-700">
                Alle bekijken →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {opdrachten.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                U heeft nog geen opdrachten geplaatst
              </div>
            ) : (
              opdrachten.slice(0, 5).map((opdracht) => (
                <Link
                  key={opdracht.id}
                  href={`/opdrachten/${opdracht.id}`}
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{opdracht.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-gray-600">
                          {formatCurrency(opdracht.hourlyRate)}/uur
                        </span>
                        <span className="text-sm text-gray-500">
                          {opdracht._count.reacties} reactie{opdracht._count.reacties !== 1 && 's'}
                        </span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(opdracht.status)}`}>
                      {getStatusLabel(opdracht.status)}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Pending contracts */}
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
                        met {contract.zzp.company || contract.zzp.name}
                      </p>
                    </div>
                    {contract.opdrachtgeverSigned && contract.zzpSigned ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Getekend
                      </span>
                    ) : !contract.opdrachtgeverSigned ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                        Actie nodig
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                        Wacht op ZZP'er
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
