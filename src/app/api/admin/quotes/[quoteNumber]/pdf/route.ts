import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { generateQuotePDF } from "@/lib/pdf";

async function requireAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  return session === process.env.ADMIN_SESSION_SECRET;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ quoteNumber: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  try {
    const { quoteNumber } = await params;

    const quote = await prisma.quote.findUnique({
      where: { quoteNumber },
      include: { lines: { orderBy: { sortOrder: "asc" } } },
    });

    if (!quote) {
      return NextResponse.json({ error: "Offerte niet gevonden" }, { status: 404 });
    }

    const pdfBuffer = generateQuotePDF({
      quoteNumber: quote.quoteNumber,
      name: quote.name,
      email: quote.email,
      phone: quote.phone,
      address: quote.address,
      postalCode: quote.postalCode,
      city: quote.city,
      propertyType: quote.propertyType,
      rooms: quote.rooms,
      description: quote.description,
      totalAmount: quote.totalAmount ? Number(quote.totalAmount) : null,
      btwPercentage: Number(quote.btwPercentage),
      validUntil: quote.validUntil?.toISOString() ?? null,
      status: quote.status,
      signed: quote.signed,
      signedAt: quote.signedAt?.toISOString() ?? null,
      signature: quote.signature,
      signedIp: quote.signedIp,
      signedDevice: quote.signedDevice,
      signedLocation: quote.signedLocation,
      lines: quote.lines.map((l) => ({
        productName: l.productName,
        description: l.description,
        quantity: l.quantity,
        unitPrice: Number(l.unitPrice),
        lineTotal: Number(l.lineTotal),
      })),
      createdAt: quote.createdAt.toISOString(),
    });

    const filename = quote.signed
      ? `EndaTech-Overeenkomst-${quote.quoteNumber}.pdf`
      : `EndaTech-Offerte-${quote.quoteNumber}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Er is iets misgegaan bij het genereren van de PDF" },
      { status: 500 }
    );
  }
}
