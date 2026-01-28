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

  return `
OVEREENKOMST VAN OPDRACHT

Contractnummer: ${contractNumber}
Datum: ${today}

---

PARTIJEN

1. Opdrachtgever:
   Naam: ${opdrachtgever.company || opdrachtgever.name}
   ${opdrachtgever.kvkNumber ? `KvK-nummer: ${opdrachtgever.kvkNumber}` : ''}
   Vertegenwoordigd door: ${opdrachtgever.name}

2. Opdrachtnemer:
   Naam: ${zzp.company || zzp.name}
   ${zzp.kvkNumber ? `KvK-nummer: ${zzp.kvkNumber}` : ''}
   Vertegenwoordigd door: ${zzp.name}

---

OPDRACHT

Titel: ${opdracht.title}

Omschrijving:
${opdracht.description}

Scope: ${opdracht.scope}
Duur: ${opdracht.duration}

---

VERGOEDING

Uurtarief: € ${parseFloat(hourlyRate.toString()).toFixed(2)}
Facturatie: Opdrachtnemer factureert direct aan opdrachtgever.
Betalingstermijn: 30 dagen na factuurdatum.

---

BEMIDDELING

Deze overeenkomst is tot stand gekomen via OpdrachtHub.
OpdrachtHub treedt uitsluitend op als bemiddelaar en is geen partij bij deze overeenkomst.
De bemiddelingsvergoeding (15% van de opdrachtsom) wordt separaat gefactureerd aan de opdrachtgever.

---

VOORWAARDEN

1. Opdrachtnemer voert de werkzaamheden zelfstandig uit, zonder gezagsverhouding.
2. Opdrachtnemer is vrij in de wijze waarop de opdracht wordt uitgevoerd.
3. Opdrachtnemer is zelf verantwoordelijk voor het afdragen van belastingen en premies.
4. Deze overeenkomst betreft geen arbeidsovereenkomst.

---

ONDERTEKENING

Door digitale ondertekening via OpdrachtHub gaan beide partijen akkoord met de voorwaarden van deze overeenkomst.

Opdrachtgever: _____________________ Datum: _____
Opdrachtnemer: _____________________ Datum: _____
`.trim()
}
