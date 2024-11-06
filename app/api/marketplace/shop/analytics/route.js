import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  try {
    const userId = req.user.id;
    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "30d"; // 7d, 30d, 90d, all

    // Get user's shop
    const shop = await prisma.tackShop.findFirst({
      where: { ownerId: userId },
    });

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    switch (period) {
      case "7d":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(now.getDate() - 90);
        break;
      case "all":
        startDate = new Date(0); // Beginning of time
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Get analytics data
    const [
      totalListings,
      activeListings,
      soldListings,
      totalViews,
      savedCount,
      viewsOverTime,
      salesByCategory,
      topListings,
    ] = await Promise.all([
      // Total listings count
      prisma.listing.count({
        where: { shopId: shop.id },
      }),

      // Active listings count
      prisma.listing.count({
        where: {
          shopId: shop.id,
          status: "active",
        },
      }),

      // Sold listings in period
      prisma.listing.findMany({
        where: {
          shopId: shop.id,
          status: "sold",
          updatedAt: {
            gte: startDate,
          },
        },
        select: {
          price: true,
          updatedAt: true,
        },
      }),

      // Total views in period
      prisma.listing.aggregate({
        where: {
          shopId: shop.id,
          createdAt: {
            gte: startDate,
          },
        },
        _sum: {
          views: true,
        },
      }),

      // Total saves in period
      prisma.savedListing.count({
        where: {
          listing: {
            shopId: shop.id,
          },
          createdAt: {
            gte: startDate,
          },
        },
      }),

      // Views over time
      prisma.listing.findMany({
        where: {
          shopId: shop.id,
          createdAt: {
            gte: startDate,
          },
        },
        select: {
          views: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),

      // Sales by category
      prisma.listing.groupBy({
        by: ["category"],
        where: {
          shopId: shop.id,
          status: "sold",
          updatedAt: {
            gte: startDate,
          },
        },
        _count: true,
        _sum: {
          price: true,
        },
      }),

      // Top performing listings
      prisma.listing.findMany({
        where: {
          shopId: shop.id,
          createdAt: {
            gte: startDate,
          },
        },
        orderBy: {
          views: "desc",
        },
        take: 5,
        include: {
          _count: {
            select: {
              savedBy: true,
            },
          },
        },
      }),
    ]);

    // Calculate sales metrics
    const totalSales = soldListings.reduce(
      (sum, listing) => sum + listing.price,
      0
    );
    const averagePrice =
      soldListings.length > 0 ? totalSales / soldListings.length : 0;

    // Group views by day for the chart
    const viewsByDay = viewsOverTime.reduce((acc, { views, createdAt }) => {
      const date = createdAt.toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + views;
      return acc;
    }, {});

    return NextResponse.json({
      overview: {
        totalListings,
        activeListings,
        soldCount: soldListings.length,
        totalSales,
        averagePrice,
        totalViews: totalViews._sum.views || 0,
        savedCount,
      },
      viewsOverTime: Object.entries(viewsByDay).map(([date, views]) => ({
        date,
        views,
      })),
      salesByCategory: salesByCategory.map((category) => ({
        name: category.category,
        count: category._count,
        revenue: category._sum.price,
      })),
      topListings: topListings.map((listing) => ({
        id: listing.id,
        title: listing.title,
        price: listing.price,
        views: listing.views,
        saves: listing._count.savedBy,
        status: listing.status,
      })),
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Error fetching analytics" },
      { status: 500 }
    );
  }
}
