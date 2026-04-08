import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { sendQuoteReadyNotification } from "@/lib/email";

async function requireAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  return session === process.env.ADMIN_SESSION_SECRET;
}

function serializeQuote(quote: Record<string, unknown>, lines: Record<string, unknown>[]) {
  return {
    ...quote,
    totalAmount: quote.totalAmount ? Number(quote.totalAmount) : null,
    btwPercentage: Number(quote.btwPercentage ?? 21),
    validUntil: quote.validUntil ? (quote.validUntil as Date).toISOString() : null,
    signedAt: quote.signedAt ? (quote.signedAt as Date).toISOString() : null,
    createdAt: (quote.createdAt as Date).toISOString(),
    updatedAt: (quote.updatedAt as Date).toISOString(),
    lines: lines.map((l) => ({
      id: l.id,
      productName: l.productName,
      description: l.description,
      quantity: Number(l.quantity),
      unitPrice: Number(l.unitPrice),
      lineTotal: Number(l.lineTotal),
      sortOrder: Number(l.sortOrder),
    })),
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ quoteNumber: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  const { quoteNumber } = await params;
  const quote = await prisma.quote.findUnique({
    where: { quoteNumber },
    include: { lines: { orderBy: { sortOrder: "asc" } } },
  });

  if (!quote) {
    return NextResponse.json({ error: "Offerte niet gevonden" }, { status: 404 });
  }

  const { lines, ...rest } = quote;
  return NextResponse.json(serializeQuote(rest as Record<string, unknown>, lines as unknown as Record<string, unknown>[]));
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ quoteNumber: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  const { quoteNumber } = await params;
  const body = await request.json();

  const { description, validUntil, status, btwPercentage, lines } = body as {
    description?: string;
    validUntil?: string | null;
    status?: string;
    btwPercentage?: number;
    lines?: { productName: string; description?: string; quantity: number; unitPrice: number }[];
  };

  const quote = await prisma.quote.findUnique({ where: { quoteNumber } });
  if (!quote) {
    return NextResponse.json({ error: "Offerte niet gevonden" }, { status: 404 });
  }

  // Calculate totals from lines if provided
  let totalAmount: number | undefined;
  if (lines !== undefined) {
    totalAmount = lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0);
  }

  const updated = await prisma.quote.update({
    where: { quoteNumber },
    data: {
      ...(description !== undefined && { description: description || null }),
      ...(totalAmount !== undefined && { totalAmount }),
      ...(btwPercentage !== undefined && { btwPercentage }),
      ...(validUntil !== undefined && {
        validUntil: validUntil ? new Date(validUntil) : null,
      }),
      ...(status !== undefined && { status: status as never }),
    },
  });

  // Replace lines if provided
  if (lines !== undefined) {
    await prisma.quoteLine.deleteMany({ where: { quoteId: quote.id } });
    if (lines.length > 0) {
      await prisma.quoteLine.createMany({
        data: lines.map((l, i) => ({
          quoteId: quote.id,
          productName: l.productName,
          description: l.description || null,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
          lineTotal: l.quantity * l.unitPrice,
          sortOrder: i,
        })),
      });
    }
  }

  // Send email when status changes to SENT
  if (status === "SENT" && quote.status !== "SENT") {
    try {
      await sendQuoteReadyNotification(quote.email, {
        name: quote.name,
        quoteNumber: quote.quoteNumber,
      });
    } catch (err) {
      console.error("Error sending quote ready email:", err);
    }
  }

  const newLines = await prisma.quoteLine.findMany({
    where: { quoteId: quote.id },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(serializeQuote(updated as unknown as Record<string, unknown>, newLines as unknown as Record<string, unknown>[]));
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ quoteNumber: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  const { quoteNumber } = await params;
  const quote = await prisma.quote.findUnique({ where: { quoteNumber } });

  if (!quote) {
    return NextResponse.json({ error: "Offerte niet gevonden" }, { status: 404 });
  }

  // Cascade delete handles QuoteLines automatically
  await prisma.quote.delete({ where: { quoteNumber } });

  return NextResponse.json({ success: true });
}
