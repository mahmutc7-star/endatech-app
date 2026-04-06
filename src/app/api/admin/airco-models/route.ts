import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

async function requireAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  return session === process.env.ADMIN_SESSION_SECRET;
}

// GET: List all airco models
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  const models = await prisma.aircoModel.findMany({
    orderBy: [{ brand: "asc" }, { model: "asc" }],
  });

  return NextResponse.json(
    models.map((m) => ({
      ...m,
      price: m.price ? Number(m.price) : null,
      installationPrice: m.installationPrice ? Number(m.installationPrice) : null,
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString(),
    }))
  );
}

// POST: Create a new airco model
export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  const body = await request.json();
  const { brand, model, type, coolingCapacity, heatingCapacity, energyLabel, price, installationPrice, description, imageUrl } = body;

  if (!brand || !model || !type) {
    return NextResponse.json({ error: "Merk, model en type zijn verplicht" }, { status: 400 });
  }

  const existing = await prisma.aircoModel.findUnique({
    where: { brand_model: { brand, model } },
  });

  if (existing) {
    return NextResponse.json({ error: "Dit model bestaat al voor dit merk" }, { status: 409 });
  }

  const created = await prisma.aircoModel.create({
    data: {
      brand,
      model,
      type,
      coolingCapacity: coolingCapacity || null,
      heatingCapacity: heatingCapacity || null,
      energyLabel: energyLabel || null,
      price: price ? Number(price) : null,
      installationPrice: installationPrice ? Number(installationPrice) : null,
      description: description || null,
      imageUrl: imageUrl || null,
    },
  });

  return NextResponse.json({
    ...created,
    price: created.price ? Number(created.price) : null,
    installationPrice: created.installationPrice ? Number(created.installationPrice) : null,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  });
}
