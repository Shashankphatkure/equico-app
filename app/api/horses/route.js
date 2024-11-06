import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const data = await req.json();
    const horse = await prisma.horse.create({
      data: {
        ...data,
        ownerId: req.user.id, // You'll need to get this from the authenticated user
      },
    });
    return NextResponse.json(horse);
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating horse" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const horses = await prisma.horse.findMany({
      where: {
        ownerId: req.user.id, // You'll need to get this from the authenticated user
      },
    });
    return NextResponse.json(horses);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching horses" },
      { status: 500 }
    );
  }
}
