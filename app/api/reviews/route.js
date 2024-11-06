import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { listingId, rating, comment } = await req.json();
    const userId = req.user.id;

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        userId,
        listingId,
      },
      include: {
        user: {
          select: {
            name: true,
            profileImage: true,
          },
        },
      },
    });

    // Create notification for shop owner
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { shop: true },
    });

    await prisma.notification.create({
      data: {
        userId: listing.shop.ownerId,
        type: "review",
        content: `${review.user.name} left a review on your listing`,
        fromUserId: userId,
        listingId,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Error creating review" },
      { status: 500 }
    );
  }
}
