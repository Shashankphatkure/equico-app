import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { listingId, reason, description } = await req.json();
    const userId = req.user.id;

    const dispute = await prisma.dispute.create({
      data: {
        reason,
        description,
        userId,
        listingId,
        status: "open",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        listing: {
          include: {
            shop: {
              include: {
                owner: true,
              },
            },
          },
        },
      },
    });

    // Notify shop owner
    await prisma.notification.create({
      data: {
        userId: dispute.listing.shop.ownerId,
        type: "dispute",
        content: `A dispute has been opened for your listing`,
        fromUserId: userId,
        listingId,
      },
    });

    // Send email notifications (implement email service)

    return NextResponse.json(dispute);
  } catch (error) {
    console.error("Error creating dispute:", error);
    return NextResponse.json(
      { error: "Error creating dispute" },
      { status: 500 }
    );
  }
}
