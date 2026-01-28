import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'U moet ingelogd zijn' },
        { status: 401 }
      )
    }

    const reacties = await prisma.reactie.findMany({
      where: {
        zzpId: session.user.id,
      },
      include: {
        opdracht: {
          include: {
            opdrachtgever: {
              select: {
                id: true,
                name: true,
                company: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(reacties)
  } catch (error) {
    console.error('Error fetching reacties:', error)
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

    if (session.user.userType !== 'ZZP') {
      return NextResponse.json(
        { error: 'Alleen ZZP\'ers kunnen reageren op opdrachten' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { opdrachtId, motivation, proposal, hourlyRate } = body

    if (!opdrachtId || !motivation) {
      return NextResponse.json(
        { error: 'Opdracht ID en motivatie zijn verplicht' },
        { status: 400 }
      )
    }

    const opdracht = await prisma.opdracht.findUnique({
      where: { id: opdrachtId },
    })

    if (!opdracht) {
      return NextResponse.json(
        { error: 'Opdracht niet gevonden' },
        { status: 404 }
      )
    }

    if (opdracht.status !== 'OPEN') {
      return NextResponse.json(
        { error: 'Deze opdracht is niet meer beschikbaar' },
        { status: 400 }
      )
    }

    const existingReactie = await prisma.reactie.findUnique({
      where: {
        zzpId_opdrachtId: {
          zzpId: session.user.id,
          opdrachtId,
        },
      },
    })

    if (existingReactie) {
      return NextResponse.json(
        { error: 'U heeft al gereageerd op deze opdracht' },
        { status: 400 }
      )
    }

    const reactie = await prisma.reactie.create({
      data: {
        motivation,
        proposal: proposal || null,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
        zzpId: session.user.id,
        opdrachtId,
      },
    })

    return NextResponse.json(reactie, { status: 201 })
  } catch (error) {
    console.error('Error creating reactie:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden' },
      { status: 500 }
    )
  }
}
