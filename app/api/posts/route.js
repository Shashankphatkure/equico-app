import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToS3 } from "@/lib/s3";
import { pusherServer } from "@/lib/pusher";

export async function POST(req) {
  try {
    const formData = await req.formData();

    // Handle media upload if present
    let imageUrl = null;
    let videoUrl = null;
    const media = formData.get("media");

    if (media) {
      try {
        const uploadedUrl = await uploadToS3(media);
        if (media.type.startsWith("image/")) {
          imageUrl = uploadedUrl;
        } else if (media.type.startsWith("video/")) {
          videoUrl = uploadedUrl;
        }
      } catch (uploadError) {
        console.error("Error uploading media:", uploadError);
        return NextResponse.json(
          { error: "Error uploading media" },
          { status: 500 }
        );
      }
    }

    const post = await prisma.post.create({
      data: {
        content: formData.get("content"),
        imageUrl,
        videoUrl,
        isPublic: formData.get("isPublic") === "true",
        horseId: formData.get("horseId") || null,
        authorId: req.user.id, // You'll need to get this from the authenticated user
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
      },
    });

    // Trigger real-time update
    await pusherServer.trigger("posts", "new-post", post);

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Error creating post" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { isPublic: true },
          { authorId: req.user.id }, // Show user's own private posts
        ],
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
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Error fetching posts" },
      { status: 500 }
    );
  }
}
