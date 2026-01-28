import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const myOpdrachten = searchParams.get('my') === 'true'

    const session = await getServerSession(authOptions)

    const where: Record<string, unknown> = {}

    if (status) {
      where.status = status
    } else if (!myOpdrachten) {
      where.status = 'OPEN'
    }

    if (myOpdrachten && session?.user?.id) {
      where.opdrachtgeverId = session.user.id
    }

    const opdrachten = await prisma.opdracht.findMany({
      where,
      include: {
        opdrachtgever: {
          select: {
            id: true,
            name: true,
            company: true,
          },
        },
        _count: {
          select: {
            reacties: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(opdrachten)
  } catch (error) {
    console.error('Error fetching opdrachten:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'U moet ingelogd zijn' },
        { status: 401 }
      )
    }

    if (session.user.userType !== 'OPDRACHTGEVER') {
      return NextResponse.json(
        { error: 'Alleen opdrachtgevers kunnen opdrachten plaatsen' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, scope, duration, hourlyRate, location, requirements } = body

    if (!title || !description || !scope || !duration || !hourlyRate) {
      return NextResponse.json(
        { error: 'Alle verplichte velden moeten ingevuld zijn' },
        { status: 400 }
      )
    }

    const opdracht = await prisma.opdracht.create({
      data: {
        title,
        description,
        scope,
        duration,
        hourlyRate: parseFloat(hourlyRate),
        location: location || null,
        requirements: requirements || null,
        opdrachtgeverId: session.user.id,
      },
    })

    return NextResponse.json(opdracht, { status: 201 })
  } catch (error) {
    console.error('Error creating opdracht:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden' },
      { status: 500 }
    )
  }
}
