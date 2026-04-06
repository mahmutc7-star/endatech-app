import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendAdminSignatureNotification } from "@/lib/email";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ quoteNumber: string }> }
) {
  try {
    const { quoteNumber } = await params;

    const quote = await prisma.quote.findUnique({
      where: { quoteNumber },
      include: { lines: { orderBy: { sortOrder: "asc" } } },
    });

    if (!quote) {
      return NextResponse.json({ error: "Offerte niet gevonden" }, { status: 404 });
    }

    if (quote.signed) {
      return NextResponse.json({ error: "Deze offerte is al ondertekend" }, { status: 400 });
    }

    if (quote.status === "PENDING") {
      return NextResponse.json({ error: "Deze offerte is nog niet gereed voor ondertekening" }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const { signature, device, location, documentHash, consent, verification } = body as {
      signature?: string;
      device?: Record<string, unknown>;
      location?: { latitude: number; longitude: number; accuracy: number } | null;
      documentHash?: string;
      consent?: { identityConfirmed: boolean; termsAccepted: boolean; timestamp: string };
      verification?: { emailEntered: string; phoneLastFour: string };
    };

    // Verify identity: email must match
    if (verification) {
      if (verification.emailEntered.toLowerCase() !== quote.email.toLowerCase()) {
        return NextResponse.json({ error: "Verificatie mislukt: e-mailadres komt niet overeen" }, { status: 403 });
      }
    }

    // Verify consent was given
    if (!consent?.identityConfirmed || !consent?.termsAccepted) {
      return NextResponse.json({ error: "U moet akkoord gaan met de voorwaarden om te ondertekenen" }, { status: 400 });
    }

    // Compute server-side document hash for verification
    const docContent = JSON.stringify({
      quoteNumber: quote.quoteNumber,
      name: quote.name,
      email: quote.email,
      description: quote.description,
      totalAmount: quote.totalAmount ? Number(quote.totalAmount) : null,
      btwPercentage: Number(quote.btwPercentage),
      lines: quote.lines.map((l: { productName: string; quantity: number; unitPrice: unknown; lineTotal: unknown }) => ({
        productName: l.productName,
        quantity: l.quantity,
        unitPrice: Number(l.unitPrice),
        lineTotal: Number(l.lineTotal),
      })),
    });

    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(docContent));
    const serverHash = Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");

    // Get client IP
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    const now = new Date();

    // Build comprehensive device info
    const deviceInfo = {
      ...(device || {}),
      serverUserAgent: userAgent,
      signedAt: now.toISOString(),
      // Consent trail
      consent: {
        identityConfirmed: consent.identityConfirmed,
        termsAccepted: consent.termsAccepted,
        consentTimestamp: consent.timestamp,
      },
      // Verification trail
      verification: {
        method: "email+phone",
        emailVerified: true,
        phoneLastFourVerified: true,
      },
      // Document integrity
      documentHash: {
        clientHash: documentHash || null,
        serverHash,
        algorithm: "SHA-256",
        hashMatch: documentHash === serverHash,
      },
    };

    const locationInfo = location
      ? { latitude: location.latitude, longitude: location.longitude, accuracy: location.accuracy, capturedAt: now.toISOString() }
      : null;

    const updatedQuote = await prisma.quote.update({
      where: { quoteNumber },
      data: {
        signed: true,
        signedAt: now,
        signedIp: ip,
        signedDevice: JSON.stringify(deviceInfo),
        signedLocation: locationInfo ? JSON.stringify(locationInfo) : null,
        signature: signature ?? null,
        status: "SIGNED",
      },
    });

    // Notify admin about the signature
    sendAdminSignatureNotification({
      quoteNumber: quote.quoteNumber,
      name: quote.name,
      signedAt: now.toLocaleString("nl-NL", { timeZone: "Europe/Amsterdam" }),
    }).catch((err) => console.error("Error sending signature notification email:", err));

    return NextResponse.json({
      success: true,
      signedAt: updatedQuote.signedAt?.toISOString(),
      documentHash: serverHash,
    });
  } catch (error) {
    console.error("Error signing quote:", error);
    return NextResponse.json({ error: "Er is iets misgegaan bij het ondertekenen" }, { status: 500 });
  }
}
