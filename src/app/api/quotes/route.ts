import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendQuoteRequestConfirmation, sendAdminNewQuoteNotification } from "@/lib/email";

function generateQuoteNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, "0");
  return `END-${year}-${random}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, phone, address, postalCode, city, propertyType, rooms, notes } = body;

    // Validate required fields
    if (!name || !email || !phone || !address || !postalCode || !city || !propertyType || !rooms) {
      return NextResponse.json(
        { error: "Vul alle verplichte velden in" },
        { status: 400 }
      );
    }

    // Generate unique quote number
    let quoteNumber = generateQuoteNumber();
    let exists = await prisma.quote.findUnique({ where: { quoteNumber } });

    // Keep generating until we get a unique one
    while (exists) {
      quoteNumber = generateQuoteNumber();
      exists = await prisma.quote.findUnique({ where: { quoteNumber } });
    }

    // Create the quote
    const quote = await prisma.quote.create({
      data: {
        quoteNumber,
        name,
        email,
        phone,
        address,
        postalCode,
        city,
        propertyType,
        rooms,
        notes: notes || null,
        photos: [],
        status: "PENDING",
      },
    });

    // Send emails (must await on serverless/Vercel)
    try {
      await Promise.all([
        sendQuoteRequestConfirmation(email, { name, quoteNumber }),
        sendAdminNewQuoteNotification({ quoteNumber, name, city, propertyType, rooms, phone }),
      ]);
    } catch (err) {
      console.error("Error sending emails:", err);
    }

    return NextResponse.json({
      success: true,
      quoteNumber: quote.quoteNumber,
    });
  } catch (error) {
    console.error("Error creating quote:", error);
    return NextResponse.json(
      { error: "Er is iets misgegaan bij het aanmaken van de offerte" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
