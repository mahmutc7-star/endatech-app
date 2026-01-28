import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(
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

    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        opdracht: true,
        opdrachtgever: {
          select: {
            id: true,
            name: true,
            company: true,
            kvkNumber: true,
          },
        },
        zzp: {
          select: {
            id: true,
            name: true,
            company: true,
            kvkNumber: true,
          },
        },
      },
    })

    if (!contract) {
      return NextResponse.json(
        { error: 'Contract niet gevonden' },
        { status: 404 }
      )
    }

    if (contract.opdrachtgeverId !== session.user.id && contract.zzpId !== session.user.id) {
      return NextResponse.json(
        { error: 'U bent niet gemachtigd om dit contract te bekijken' },
        { status: 403 }
      )
    }

    return NextResponse.json(contract)
  } catch (error) {
    console.error('Error fetching contract:', error)
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

    const contract = await prisma.contract.findUnique({
      where: { id },
    })

    if (!contract) {
      return NextResponse.json(
        { error: 'Contract niet gevonden' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { action } = body

    if (action !== 'sign') {
      return NextResponse.json(
        { error: 'Ongeldige actie' },
        { status: 400 }
      )
    }

    const isOpdrachtgever = contract.opdrachtgeverId === session.user.id
    const isZzp = contract.zzpId === session.user.id

    if (!isOpdrachtgever && !isZzp) {
      return NextResponse.json(
        { error: 'U bent niet gemachtigd om dit contract te ondertekenen' },
        { status: 403 }
      )
    }

    const updateData: Record<string, boolean | Date> = {}

    if (isOpdrachtgever && !contract.opdrachtgeverSigned) {
      updateData.opdrachtgeverSigned = true
      updateData.opdrachtgeverSignedAt = new Date()
    } else if (isZzp && !contract.zzpSigned) {
      updateData.zzpSigned = true
      updateData.zzpSignedAt = new Date()
    } else {
      return NextResponse.json(
        { error: 'U heeft dit contract al ondertekend' },
        { status: 400 }
      )
    }

    const updatedContract = await prisma.contract.update({
      where: { id },
      data: updateData,
    })

    // If both have signed, update opdracht status
    if (
      (updatedContract.opdrachtgeverSigned && updatedContract.zzpSigned) ||
      (isOpdrachtgever && contract.zzpSigned) ||
      (isZzp && contract.opdrachtgeverSigned)
    ) {
      await prisma.opdracht.update({
        where: { id: contract.opdrachtId },
        data: { status: 'AFGEROND' },
      })
    }

    return NextResponse.json({
      message: 'Contract ondertekend',
      contract: updatedContract,
    })
  } catch (error) {
    console.error('Error signing contract:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden' },
      { status: 500 }
    )
  }
}
