import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const userId = params.id;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;

    const following = await prisma.follow.findMany({
      where: {
        followerId: userId,
      },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            profileImage: true,
            bio: true,
            _count: {
              select: {
                followers: true,
                following: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const formattedFollowing = following.map((follow) => ({
      ...follow.following,
      followers: follow.following._count.followers,
      following: follow.following._count.following,
      followedAt: follow.createdAt,
    }));

    return NextResponse.json(formattedFollowing);
  } catch (error) {
    console.error("Error fetching following:", error);
    return NextResponse.json(
      { error: "Error fetching following" },
      { status: 500 }
    );
  }
}
