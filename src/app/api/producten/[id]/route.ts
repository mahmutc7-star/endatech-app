import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const model = await prisma.aircoModel.findUnique({ where: { id } });
  if (!model) {
    return NextResponse.json({ error: "Product niet gevonden" }, { status: 404 });
  }

  // Find related products (same brand + same series)
  const seriesName = (model.description || "").split("|")[0].trim();
  const related = await prisma.aircoModel.findMany({
    where: {
      brand: model.brand,
      description: { startsWith: seriesName },
      active: true,
      id: { not: model.id },
    },
    orderBy: { model: "asc" },
    take: 6,
  });

  return NextResponse.json({
    ...model,
    price: model.price ? Number(model.price) : null,
    installationPrice: model.installationPrice ? Number(model.installationPrice) : null,
    related: related.map((r) => ({
      ...r,
      price: r.price ? Number(r.price) : null,
      installationPrice: r.installationPrice ? Number(r.installationPrice) : null,
    })),
  });
}
