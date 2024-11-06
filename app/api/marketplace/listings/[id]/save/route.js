import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req, { params }) {
  try {
    const listingId = params.id;
    const userId = req.user.id;

    const savedListing = await prisma.savedListing.create({
      data: {
        userId,
        listingId,
      },
    });

    return NextResponse.json(savedListing);
  } catch (error) {
    console.error("Error saving listing:", error);
    return NextResponse.json(
      { error: "Error saving listing" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const listingId = params.id;
    const userId = req.user.id;

    await prisma.savedListing.delete({
      where: {
        userId_listingId: {
          userId,
          listingId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error unsaving listing:", error);
    return NextResponse.json(
      { error: "Error unsaving listing" },
      { status: 500 }
    );
  }
}
