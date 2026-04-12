import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendContactFormNotification } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, phone, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Vul alle verplichte velden in" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Ongeldig e-mailadres" },
        { status: 400 }
      );
    }

    // Create the contact request
    await prisma.contactRequest.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        message,
      },
    });

    // Send email notification to admin
    try {
      await sendContactFormNotification({ name, email, phone, subject, message });
    } catch (emailError) {
      console.error("Failed to send contact form email:", emailError);
      // Don't fail the request if email fails — the data is already saved
    }

    return NextResponse.json({
      success: true,
      message: "Bericht verzonden",
    });
  } catch (error) {
    console.error("Error creating contact request:", error);
    return NextResponse.json(
      { error: "Er is iets misgegaan bij het verzenden van het bericht" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
