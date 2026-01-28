'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && session?.user?.userType) {
      if (session.user.userType === 'OPDRACHTGEVER') {
        router.push('/dashboard/opdrachtgever')
      } else {
        router.push('/dashboard/zzp')
      }
    }
  }, [status, session, router])

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="animate-pulse text-gray-500">Laden...</div>
    </div>
  )
}
