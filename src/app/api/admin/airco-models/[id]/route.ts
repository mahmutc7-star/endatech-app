import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

async function requireAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  return session === process.env.ADMIN_SESSION_SECRET;
}

// PATCH: Update an airco model
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { brand, model, type, coolingCapacity, heatingCapacity, energyLabel, price, installationPrice, description, imageUrl, active } = body;

  const existing = await prisma.aircoModel.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Model niet gevonden" }, { status: 404 });
  }

  const updated = await prisma.aircoModel.update({
    where: { id },
    data: {
      ...(brand !== undefined && { brand }),
      ...(model !== undefined && { model }),
      ...(type !== undefined && { type }),
      ...(coolingCapacity !== undefined && { coolingCapacity: coolingCapacity || null }),
      ...(heatingCapacity !== undefined && { heatingCapacity: heatingCapacity || null }),
      ...(energyLabel !== undefined && { energyLabel: energyLabel || null }),
      ...(price !== undefined && { price: price ? Number(price) : null }),
      ...(installationPrice !== undefined && { installationPrice: installationPrice ? Number(installationPrice) : null }),
      ...(description !== undefined && { description: description || null }),
      ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
      ...(active !== undefined && { active }),
    },
  });

  return NextResponse.json({
    ...updated,
    price: updated.price ? Number(updated.price) : null,
    installationPrice: updated.installationPrice ? Number(updated.installationPrice) : null,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  });
}

// DELETE: Remove an airco model
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.aircoModel.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Model niet gevonden" }, { status: 404 });
  }

  await prisma.aircoModel.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
