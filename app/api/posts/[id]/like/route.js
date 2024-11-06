import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req, { params }) {
  try {
    const postId = params.id;
    const userId = req.user.id; // Get from authenticated user

    // Check if like already exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      return NextResponse.json(
        { error: "Post already liked" },
        { status: 400 }
      );
    }

    const like = await prisma.like.create({
      data: {
        userId,
        postId,
      },
    });

    return NextResponse.json(like);
  } catch (error) {
    console.error("Error liking post:", error);
    return NextResponse.json({ error: "Error liking post" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const postId = params.id;
    const userId = req.user.id; // Get from authenticated user

    await prisma.like.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error unliking post:", error);
    return NextResponse.json({ error: "Error unliking post" }, { status: 500 });
  }
}
