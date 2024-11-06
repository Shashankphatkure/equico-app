import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const currentUserId = req.user.id; // Get from authenticated user

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
        NOT: {
          id: currentUserId, // Exclude current user from results
        },
      },
      select: {
        id: true,
        name: true,
        profileImage: true,
        bio: true,
        isOver18: true,
        _count: {
          select: {
            followers: true,
            following: true,
            horses: true,
          },
        },
        followers: {
          where: {
            followerId: currentUserId,
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const formattedUsers = users.map((user) => ({
      ...user,
      followers: user._count.followers,
      following: user._count.following,
      totalHorses: user._count.horses,
      isFollowing: user.followers.length > 0,
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json(
      { error: "Error searching users" },
      { status: 500 }
    );
  }
}
