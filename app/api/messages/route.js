import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export async function POST(req) {
  try {
    const { receiverId, content, listingId } = await req.json();
    const senderId = req.user.id; // Get from authenticated user

    // Create the message
    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        receiverId,
        listingId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        listing: {
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
          },
        },
      },
    });

    // Trigger real-time notification
    await pusherServer.trigger(`private-user-${receiverId}`, "new-message", {
      message,
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Error sending message" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const userId = req.user.id;
    const { searchParams } = new URL(req.url);
    const otherUserId = searchParams.get("userId");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;

    // If otherUserId is provided, get conversation with that user
    // Otherwise, get all conversations
    const messages = otherUserId
      ? await prisma.message.findMany({
          where: {
            OR: [
              { senderId: userId, receiverId: otherUserId },
              { senderId: otherUserId, receiverId: userId },
            ],
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              },
            },
            listing: {
              select: {
                id: true,
                title: true,
                price: true,
                images: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          skip: (page - 1) * limit,
          take: limit,
        })
      : await prisma.message.findMany({
          where: {
            OR: [{ senderId: userId }, { receiverId: userId }],
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              },
            },
            receiver: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              },
            },
            listing: {
              select: {
                id: true,
                title: true,
                price: true,
                images: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          skip: (page - 1) * limit,
          take: limit,
        });

    // If getting conversation with specific user, mark their messages as read
    if (otherUserId) {
      await prisma.message.updateMany({
        where: {
          senderId: otherUserId,
          receiverId: userId,
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });
    }

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Error fetching messages" },
      { status: 500 }
    );
  }
}
