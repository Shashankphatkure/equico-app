import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToS3 } from "@/lib/s3";

export async function GET(req) {
  try {
    const userId = req.user.id; // Get from authenticated user

    const profile = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        bio: true,
        isOver18: true,
        _count: {
          select: {
            followers: true,
            following: true,
            horses: true,
            posts: true,
          },
        },
        horses: {
          select: {
            id: true,
            name: true,
            breed: true,
            color: true,
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...profile,
      followers: profile._count.followers,
      following: profile._count.following,
      totalHorses: profile._count.horses,
      totalPosts: profile._count.posts,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Error fetching profile" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const userId = req.user.id; // Get from authenticated user
    const formData = await req.formData();

    let profileImage = formData.get("profileImage");
    let profileImageUrl = null;

    if (profileImage) {
      try {
        profileImageUrl = await uploadToS3(profileImage, "profiles");
      } catch (uploadError) {
        console.error("Error uploading profile image:", uploadError);
        return NextResponse.json(
          { error: "Error uploading profile image" },
          { status: 500 }
        );
      }
    }

    const updatedProfile = await prisma.user.update({
      where: { id: userId },
      data: {
        name: formData.get("name"),
        bio: formData.get("bio"),
        ...(profileImageUrl && { profileImage: profileImageUrl }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        bio: true,
        isOver18: true,
        _count: {
          select: {
            followers: true,
            following: true,
            horses: true,
            posts: true,
          },
        },
      },
    });

    return NextResponse.json({
      ...updatedProfile,
      followers: updatedProfile._count.followers,
      following: updatedProfile._count.following,
      totalHorses: updatedProfile._count.horses,
      totalPosts: updatedProfile._count.posts,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Error updating profile" },
      { status: 500 }
    );
  }
}
