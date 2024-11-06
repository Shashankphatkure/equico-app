import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  try {
    const userId = req.user.id;
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;

    // Get user's shop
    const shop = await prisma.tackShop.findFirst({
      where: { ownerId: userId },
    });

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    // Build where clause
    const where = {
      shopId: shop.id,
      ...(status && { status }),
    };

    // Get listings with counts
    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          _count: {
            select: {
              savedBy: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.listing.count({ where }),
    ]);

    // Get status counts
    const statusCounts = await prisma.listing.groupBy({
      by: ["status"],
      where: {
        shopId: shop.id,
      },
      _count: true,
    });

    const counts = statusCounts.reduce(
      (acc, curr) => {
        acc[curr.status] = curr._count;
        return acc;
      },
      {
        active: 0,
        sold: 0,
        archived: 0,
      }
    );

    return NextResponse.json({
      listings,
      total,
      pages: Math.ceil(total / limit),
      counts,
    });
  } catch (error) {
    console.error("Error fetching shop listings:", error);
    return NextResponse.json(
      { error: "Error fetching shop listings" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const userId = req.user.id;
    const formData = await req.formData();

    // Get user's shop
    const shop = await prisma.tackShop.findFirst({
      where: { ownerId: userId },
    });

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    // Handle image uploads
    const images = [];
    const imageFiles = formData.getAll("images");
    for (const file of imageFiles) {
      try {
        const imageUrl = await uploadToS3(file, "listings");
        images.push(imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    const listing = await prisma.listing.create({
      data: {
        title: formData.get("title"),
        description: formData.get("description"),
        price: parseFloat(formData.get("price")),
        condition: formData.get("condition"),
        category: formData.get("category"),
        images,
        shopId: shop.id,
        isBoosted: shop.isPremium, // Auto-boost listings for premium shops
      },
      include: {
        shop: {
          select: {
            name: true,
            isVerified: true,
            owner: {
              select: {
                name: true,
                profileImage: true,
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

    return NextResponse.json(listing);
  } catch (error) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      { error: "Error creating listing" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const userId = req.user.id;
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const listingIds = await req.json();

    // Get user's shop
    const shop = await prisma.tackShop.findFirst({
      where: { ownerId: userId },
    });

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    // Verify ownership of all listings
    const listings = await prisma.listing.findMany({
      where: {
        id: { in: listingIds },
        shopId: shop.id,
      },
    });

    if (listings.length !== listingIds.length) {
      return NextResponse.json(
        { error: "Unauthorized or listings not found" },
        { status: 403 }
      );
    }

    // Perform bulk action
    let updatedListings;
    switch (action) {
      case "archive":
        updatedListings = await prisma.listing.updateMany({
          where: { id: { in: listingIds } },
          data: { status: "archived" },
        });
        break;
      case "activate":
        updatedListings = await prisma.listing.updateMany({
          where: { id: { in: listingIds } },
          data: { status: "active" },
        });
        break;
      case "markSold":
        updatedListings = await prisma.listing.updateMany({
          where: { id: { in: listingIds } },
          data: { status: "sold" },
        });
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json(updatedListings);
  } catch (error) {
    console.error("Error updating listings:", error);
    return NextResponse.json(
      { error: "Error updating listings" },
      { status: 500 }
    );
  }
}
