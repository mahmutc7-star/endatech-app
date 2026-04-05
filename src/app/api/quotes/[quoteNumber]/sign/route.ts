import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ quoteNumber: string }> }
) {
  try {
    const { quoteNumber } = await params;

    const quote = await prisma.quote.findUnique({
      where: { quoteNumber },
    });

    if (!quote) {
      return NextResponse.json(
        { error: "Offerte niet gevonden" },
        { status: 404 }
      );
    }

    if (quote.signed) {
      return NextResponse.json(
        { error: "Deze offerte is al ondertekend" },
        { status: 400 }
      );
    }

    if (quote.status === "PENDING") {
      return NextResponse.json(
        { error: "Deze offerte is nog niet gereed voor ondertekening" },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { signature, device, location } = body as {
      signature?: string;
      device?: {
        userAgent: string;
        platform: string;
        language: string;
        screenWidth: number;
        screenHeight: number;
        pixelRatio: number;
        touchSupport: boolean;
        deviceType: string;
        timestamp: string;
      };
      location?: {
        latitude: number;
        longitude: number;
        accuracy: number;
      } | null;
    };

    // Get client IP
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Build device info object
    const deviceInfo = device
      ? {
          ...device,
          // Also store server-side user agent for verification
          serverUserAgent: userAgent,
          signedAt: new Date().toISOString(),
        }
      : {
          userAgent,
          signedAt: new Date().toISOString(),
        };

    // Build location info
    const locationInfo = location
      ? {
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy,
          capturedAt: new Date().toISOString(),
        }
      : null;

    const updatedQuote = await prisma.quote.update({
      where: { quoteNumber },
      data: {
        signed: true,
        signedAt: new Date(),
        signedIp: ip,
        signedDevice: JSON.stringify(deviceInfo),
        signedLocation: locationInfo ? JSON.stringify(locationInfo) : null,
        signature: signature ?? null,
        status: "SIGNED",
      },
    });

    return NextResponse.json({
      success: true,
      signedAt: updatedQuote.signedAt?.toISOString(),
    });
  } catch (error) {
    console.error("Error signing quote:", error);
    return NextResponse.json(
      { error: "Er is iets misgegaan bij het ondertekenen" },
      { status: 500 }
    );
  }
}
