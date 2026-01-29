import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

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

    const reactie = await prisma.reactie.findUnique({
      where: { id },
      include: {
        opdracht: true,
        zzp: true,
      },
    })

    if (!reactie) {
      return NextResponse.json(
        { error: 'Reactie niet gevonden' },
        { status: 404 }
      )
    }

    if (reactie.opdracht.opdrachtgeverId !== session.user.id) {
      return NextResponse.json(
        { error: 'U bent niet gemachtigd om deze reactie te bewerken' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { status } = body

    if (!status || !['GEACCEPTEERD', 'AFGEWEZEN'].includes(status)) {
      return NextResponse.json(
        { error: 'Ongeldige status' },
        { status: 400 }
      )
    }

    if (status === 'GEACCEPTEERD') {
      // Generate contract number
      const contractNumber = `OH-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`

      // Get opdrachtgever details
      const opdrachtgever = await prisma.user.findUnique({
        where: { id: session.user.id },
      })

      // Generate contract content
      const contractContent = generateContractContent({
        contractNumber,
        opdracht: reactie.opdracht,
        opdrachtgever: opdrachtgever!,
        zzp: reactie.zzp,
        hourlyRate: reactie.hourlyRate || reactie.opdracht.hourlyRate,
      })

      // Update reactie, create contract, and update opdracht status
      await prisma.$transaction([
        prisma.reactie.update({
          where: { id },
          data: { status: 'GEACCEPTEERD' },
        }),
        prisma.reactie.updateMany({
          where: {
            opdrachtId: reactie.opdrachtId,
            id: { not: id },
          },
          data: { status: 'AFGEWEZEN' },
        }),
        prisma.opdracht.update({
          where: { id: reactie.opdrachtId },
          data: { status: 'GEMATCHT' },
        }),
        prisma.contract.create({
          data: {
            contractNumber,
            content: contractContent,
            opdrachtId: reactie.opdrachtId,
            opdrachtgeverId: session.user.id,
            zzpId: reactie.zzpId,
          },
        }),
      ])

      return NextResponse.json({ message: 'Reactie geaccepteerd en contract aangemaakt' })
    } else {
      await prisma.reactie.update({
        where: { id },
        data: { status: 'AFGEWEZEN' },
      })

      return NextResponse.json({ message: 'Reactie afgewezen' })
    }
  } catch (error) {
    console.error('Error updating reactie:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden' },
      { status: 500 }
    )
  }
}

interface ContractParams {
  contractNumber: string
  opdracht: {
    title: string
    description: string
    scope: string
    duration: string
    hourlyRate: { toString(): string }
  }
  opdrachtgever: {
    name: string
    company: string | null
    kvkNumber: string | null
  }
  zzp: {
    name: string
    company: string | null
    kvkNumber: string | null
  }
  hourlyRate: { toString(): string }
}

function generateContractContent(params: ContractParams): string {
  const { contractNumber, opdracht, opdrachtgever, zzp, hourlyRate } = params
  const today = new Date().toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // Calculate end date based on duration
  const startDate = today
  const endDate = opdracht.duration || 'In overleg'

  return `
OVEREENKOMST VAN OPDRACHT – OPDRACHTGEVER – ZZP'ER

Contractnummer: ${contractNumber}
Datum: ${today}

Deze overeenkomst wordt automatisch gegenereerd bij acceptatie van een match.
OpdrachtHub is geen partij bij deze overeenkomst.

═══════════════════════════════════════════════════════════════

PARTIJEN

Opdrachtgever: ${opdrachtgever.company || opdrachtgever.name}
${opdrachtgever.kvkNumber ? `KvK-nummer: ${opdrachtgever.kvkNumber}` : ''}
Vertegenwoordigd door: ${opdrachtgever.name}

Opdrachtnemer (ZZP'er): ${zzp.company || zzp.name}
${zzp.kvkNumber ? `KvK-nummer: ${zzp.kvkNumber}` : ''}
Vertegenwoordigd door: ${zzp.name}

═══════════════════════════════════════════════════════════════

ARTIKEL 1 – OPDRACHTOMSCHRIJVING

Titel: ${opdracht.title}

Omschrijving werkzaamheden:
${opdracht.description}

Scope: ${opdracht.scope}

═══════════════════════════════════════════════════════════════

ARTIKEL 2 – LOOPTIJD

Startdatum: ${startDate}
Einddatum/Duur: ${endDate}

═══════════════════════════════════════════════════════════════

ARTIKEL 3 – VERGOEDING

Tarief: € ${parseFloat(hourlyRate.toString()).toFixed(2)} per uur
Facturatie rechtstreeks tussen partijen.

OpdrachtHub ontvangt geen betalingen namens partijen.

═══════════════════════════════════════════════════════════════

ARTIKEL 4 – ZELFSTANDIGHEID

Opdrachtnemer verricht werkzaamheden zelfstandig.
Er is geen arbeidsovereenkomst of gezagsverhouding.

═══════════════════════════════════════════════════════════════

ARTIKEL 5 – VERVANGING

Opdrachtnemer mag zich laten vervangen door een gelijkwaardig professional.

═══════════════════════════════════════════════════════════════

ARTIKEL 6 – AANSPRAKELIJKHEID

Iedere partij is verantwoordelijk voor eigen schade.

═══════════════════════════════════════════════════════════════

ARTIKEL 7 – INTELLECTUEEL EIGENDOM

Resultaten komen toe aan Opdrachtgever, tenzij anders overeengekomen.

═══════════════════════════════════════════════════════════════

ARTIKEL 8 – GEHEIMHOUDING

Vertrouwelijke informatie wordt niet gedeeld met derden.

═══════════════════════════════════════════════════════════════

ARTIKEL 9 – ROL OPDRACHTHUB

OpdrachtHub faciliteert uitsluitend:
- matching;
- contractering;
- administratie.

OpdrachtHub is geen partij bij de uitvoering.

De bemiddelingsvergoeding (15% van de opdrachtsom) wordt separaat
gefactureerd aan de opdrachtgever door OpdrachtHub.

═══════════════════════════════════════════════════════════════

ONDERTEKENING

Digitale ondertekening via het platform geldt als rechtsgeldige handtekening.

Opdrachtgever: _____________________ Datum: _____
Opdrachtnemer: _____________________ Datum: _____
`.trim()
}
