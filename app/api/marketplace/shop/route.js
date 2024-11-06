import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToS3 } from "@/lib/s3";

export async function GET(req) {
  try {
    const userId = req.user.id; // Get from authenticated user

    const shop = await prisma.tackShop.findFirst({
      where: { ownerId: userId },
      include: {
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
    });

    if (!shop) {
      // Create a default shop for the user if they don't have one
      const newShop = await prisma.tackShop.create({
        data: {
          name: `${req.user.name}'s Tack Shop`,
          ownerId: userId,
        },
        include: {
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
      });
      return NextResponse.json(newShop);
    }

    return NextResponse.json(shop);
  } catch (error) {
    console.error("Error fetching shop:", error);
    return NextResponse.json({ error: "Error fetching shop" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const userId = req.user.id;
    const formData = await req.formData();

    // Handle profile image upload
    let profileImageUrl = undefined;
    const profileImage = formData.get("profileImage");
    if (profileImage) {
      try {
        profileImageUrl = await uploadToS3(profileImage, "shops");
      } catch (uploadError) {
        console.error("Error uploading profile image:", uploadError);
        return NextResponse.json(
          { error: "Error uploading profile image" },
          { status: 500 }
        );
      }
    }

    const shop = await prisma.tackShop.findFirst({
      where: { ownerId: userId },
    });

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    const updatedShop = await prisma.tackShop.update({
      where: { id: shop.id },
      data: {
        name: formData.get("name"),
        description: formData.get("description"),
        ...(profileImageUrl && { profileImage: profileImageUrl }),
      },
      include: {
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
    });

    return NextResponse.json(updatedShop);
  } catch (error) {
    console.error("Error updating shop:", error);
    return NextResponse.json({ error: "Error updating shop" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const userId = req.user.id;

    const shop = await prisma.tackShop.findFirst({
      where: { ownerId: userId },
    });

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    // Delete all listings first
    await prisma.listing.deleteMany({
      where: { shopId: shop.id },
    });

    // Then delete the shop
    await prisma.tackShop.delete({
      where: { id: shop.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting shop:", error);
    return NextResponse.json({ error: "Error deleting shop" }, { status: 500 });
  }
}
