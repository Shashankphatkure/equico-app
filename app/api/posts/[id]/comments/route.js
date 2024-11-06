import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req, { params }) {
  try {
    const postId = params.id;
    const { content } = await req.json();
    const userId = req.user.id; // Get from authenticated user

    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: userId,
        postId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Error creating comment" },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  try {
    const postId = params.id;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    const comments = await prisma.comment.findMany({
      where: {
        postId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Error fetching comments" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { commentId } = await req.json();
    const userId = req.user.id; // Get from authenticated user

    // Verify comment belongs to user before deleting
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment || comment.authorId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Error deleting comment" },
      { status: 500 }
    );
  }
}
