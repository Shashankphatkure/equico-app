import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const listingId = params.id;
    const userId = req.user?.id;

    // Increment views
    await prisma.listing.update({
      where: { id: listingId },
      data: { views: { increment: 1 } },
    });

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            description: true,
            isVerified: true,
            isPremium: true,
            owner: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              },
            },
            _count: {
              select: {
                listings: true,
              },
            },
          },
        },
        _count: {
          select: {
            savedBy: true,
          },
        },
      },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // Check if the current user has saved this listing
    let isSaved = false;
    if (userId) {
      const savedListing = await prisma.savedListing.findUnique({
        where: {
          userId_listingId: {
            userId,
            listingId,
          },
        },
      });
      isSaved = !!savedListing;
    }

    // Get similar listings
    const similarListings = await prisma.listing.findMany({
      where: {
        AND: [
          { category: listing.category },
          { id: { not: listingId } },
          { status: "active" },
        ],
      },
      include: {
        shop: {
          select: {
            name: true,
            isVerified: true,
          },
        },
      },
      take: 4,
    });

    return NextResponse.json({
      ...listing,
      isSaved,
      similarListings,
    });
  } catch (error) {
    console.error("Error fetching listing:", error);
    return NextResponse.json(
      { error: "Error fetching listing" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const listingId = params.id;
    const formData = await req.formData();
    const userId = req.user.id;

    // Verify ownership
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        shop: true,
      },
    });

    if (!listing || listing.shop.ownerId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Handle new images
    const images = [...listing.images];
    const imageFiles = formData.getAll("images");
    for (const file of imageFiles) {
      try {
        const imageUrl = await uploadToS3(file, "listings");
        images.push(imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    // Remove deleted images
    const deletedImages = formData.get("deletedImages")?.split(",") || [];
    const updatedImages = images.filter((img) => !deletedImages.includes(img));

    const updatedListing = await prisma.listing.update({
      where: { id: listingId },
      data: {
        title: formData.get("title"),
        description: formData.get("description"),
        price: parseFloat(formData.get("price")),
        condition: formData.get("condition"),
        category: formData.get("category"),
        images: updatedImages,
        status: formData.get("status"),
      },
      include: {
        shop: {
          select: {
            name: true,
            isVerified: true,
          },
        },
      },
    });

    return NextResponse.json(updatedListing);
  } catch (error) {
    console.error("Error updating listing:", error);
    return NextResponse.json(
      { error: "Error updating listing" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const listingId = params.id;
    const userId = req.user.id;

    // Verify ownership
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        shop: true,
      },
    });

    if (!listing || listing.shop.ownerId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.listing.delete({
      where: { id: listingId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting listing:", error);
    return NextResponse.json(
      { error: "Error deleting listing" },
      { status: 500 }
    );
  }
}
