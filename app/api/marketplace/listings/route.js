import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const conditions =
      searchParams.get("condition")?.split(",").filter(Boolean) || [];
    const minPrice = parseFloat(searchParams.get("minPrice")) || undefined;
    const maxPrice = parseFloat(searchParams.get("maxPrice")) || undefined;
    const sortBy = searchParams.get("sortBy") || "newest";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 12;

    // Build where clause
    const where = {
      status: "active",
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(category && { category }),
      ...(conditions.length > 0 && { condition: { in: conditions } }),
      ...(minPrice !== undefined && { price: { gte: minPrice } }),
      ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
    };

    // Build orderBy
    const orderBy = {
      ...(sortBy === "newest" && { createdAt: "desc" }),
      ...(sortBy === "oldest" && { createdAt: "asc" }),
      ...(sortBy === "price-low" && { price: "asc" }),
      ...(sortBy === "price-high" && { price: "desc" }),
      ...(sortBy === "most-viewed" && { views: "desc" }),
    };

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          shop: {
            select: {
              id: true,
              name: true,
              isVerified: true,
              owner: {
                select: {
                  id: true,
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
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.listing.count({ where }),
    ]);

    // Check if current user has saved any of these listings
    const userId = req.user?.id;
    let savedListings = [];
    if (userId) {
      savedListings = await prisma.savedListing.findMany({
        where: {
          userId,
          listingId: {
            in: listings.map((listing) => listing.id),
          },
        },
        select: {
          listingId: true,
        },
      });
    }

    const savedListingIds = new Set(savedListings.map((sl) => sl.listingId));

    const formattedListings = listings.map((listing) => ({
      ...listing,
      isSaved: savedListingIds.has(listing.id),
      savedCount: listing._count.savedBy,
    }));

    return NextResponse.json({
      listings: formattedListings,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching listings:", error);
    return NextResponse.json(
      { error: "Error fetching listings" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const userId = req.user.id;

    // Get or create user's shop
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
        isBoosted: shop.isPremium,
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
