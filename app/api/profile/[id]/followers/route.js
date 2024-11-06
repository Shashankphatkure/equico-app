import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const userId = params.id;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;

    const followers = await prisma.follow.findMany({
      where: {
        followingId: userId,
      },
      include: {
        follower: {
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

    const formattedFollowers = followers.map((follow) => ({
      ...follow.follower,
      followers: follow.follower._count.followers,
      following: follow.follower._count.following,
      followedAt: follow.createdAt,
    }));

    return NextResponse.json(formattedFollowers);
  } catch (error) {
    console.error("Error fetching followers:", error);
    return NextResponse.json(
      { error: "Error fetching followers" },
      { status: 500 }
    );
  }
}
