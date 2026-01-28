import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'U moet ingelogd zijn' },
        { status: 401 }
      )
    }

    const where = session.user.userType === 'OPDRACHTGEVER'
      ? { opdrachtgeverId: session.user.id }
      : { zzpId: session.user.id }

    const contracten = await prisma.contract.findMany({
      where,
      include: {
        opdracht: {
          select: {
            id: true,
            title: true,
            hourlyRate: true,
          },
        },
        opdrachtgever: {
          select: {
            id: true,
            name: true,
            company: true,
          },
        },
        zzp: {
          select: {
            id: true,
            name: true,
            company: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(contracten)
  } catch (error) {
    console.error('Error fetching contracten:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden' },
      { status: 500 }
    )
  }
}
