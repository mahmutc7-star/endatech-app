import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, userType, company, kvkNumber } = body

    if (!email || !password || !name || !userType) {
      return NextResponse.json(
        { error: 'Alle verplichte velden moeten ingevuld zijn' },
        { status: 400 }
      )
    }

    if (userType !== 'OPDRACHTGEVER' && userType !== 'ZZP') {
      return NextResponse.json(
        { error: 'Ongeldig gebruikerstype' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Er bestaat al een account met dit e-mailadres' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        userType,
        company: company || null,
        kvkNumber: kvkNumber || null,
      },
    })

    return NextResponse.json(
      {
        message: 'Account succesvol aangemaakt',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          userType: user.userType,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het registreren' },
      { status: 500 }
    )
  }
}
