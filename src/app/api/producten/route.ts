import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: List all active airco models (public, no auth required)
export async function GET() {
  const models = await prisma.aircoModel.findMany({
    where: { active: true },
    orderBy: [{ brand: "asc" }, { model: "asc" }],
    select: {
      id: true,
      brand: true,
      model: true,
      type: true,
      coolingCapacity: true,
      heatingCapacity: true,
      energyLabel: true,
      price: true,
      installationPrice: true,
      description: true,
      imageUrl: true,
    },
  });

  return NextResponse.json(
    models.map((m) => ({
      ...m,
      price: m.price ? Number(m.price) : null,
      installationPrice: m.installationPrice ? Number(m.installationPrice) : null,
    }))
  );
}
