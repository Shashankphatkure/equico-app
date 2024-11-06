import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { targetUserId } = await req.json();
    const userId = req.user.id; // Get from authenticated user

    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      return NextResponse.json(
        { error: "Already following this user" },
        { status: 400 }
      );
    }

    const follow = await prisma.follow.create({
      data: {
        followerId: userId,
        followingId: targetUserId,
      },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
      },
    });

    return NextResponse.json(follow);
  } catch (error) {
    console.error("Error following user:", error);
    return NextResponse.json(
      { error: "Error following user" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { targetUserId } = await req.json();
    const userId = req.user.id; // Get from authenticated user

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return NextResponse.json(
      { error: "Error unfollowing user" },
      { status: 500 }
    );
  }
}
