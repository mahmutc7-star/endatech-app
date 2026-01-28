import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const opdracht = await prisma.opdracht.findUnique({
      where: { id },
      include: {
        opdrachtgever: {
          select: {
            id: true,
            name: true,
            company: true,
          },
        },
        reacties: {
          include: {
            zzp: {
              select: {
                id: true,
                name: true,
                bio: true,
                skills: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!opdracht) {
      return NextResponse.json(
        { error: 'Opdracht niet gevonden' },
        { status: 404 }
      )
    }

    return NextResponse.json(opdracht)
  } catch (error) {
    console.error('Error fetching opdracht:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'U moet ingelogd zijn' },
        { status: 401 }
      )
    }

    const opdracht = await prisma.opdracht.findUnique({
      where: { id },
    })

    if (!opdracht) {
      return NextResponse.json(
        { error: 'Opdracht niet gevonden' },
        { status: 404 }
      )
    }

    if (opdracht.opdrachtgeverId !== session.user.id) {
      return NextResponse.json(
        { error: 'U bent niet gemachtigd om deze opdracht te bewerken' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, scope, duration, hourlyRate, location, requirements, status } = body

    const updatedOpdracht = await prisma.opdracht.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(scope && { scope }),
        ...(duration && { duration }),
        ...(hourlyRate && { hourlyRate: parseFloat(hourlyRate) }),
        ...(location !== undefined && { location }),
        ...(requirements !== undefined && { requirements }),
        ...(status && { status }),
      },
    })

    return NextResponse.json(updatedOpdracht)
  } catch (error) {
    console.error('Error updating opdracht:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'U moet ingelogd zijn' },
        { status: 401 }
      )
    }

    const opdracht = await prisma.opdracht.findUnique({
      where: { id },
    })

    if (!opdracht) {
      return NextResponse.json(
        { error: 'Opdracht niet gevonden' },
        { status: 404 }
      )
    }

    if (opdracht.opdrachtgeverId !== session.user.id) {
      return NextResponse.json(
        { error: 'U bent niet gemachtigd om deze opdracht te verwijderen' },
        { status: 403 }
      )
    }

    await prisma.opdracht.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Opdracht verwijderd' })
  } catch (error) {
    console.error('Error deleting opdracht:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden' },
      { status: 500 }
    )
  }
}
