"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { pusherClient } from "@/lib/pusher";
import ChatWindow from "./ChatWindow";

export default function Messages() {
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(
    searchParams.get("userId")
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();

    // Subscribe to real-time updates
    const channel = pusherClient.subscribe("private-user-messages");
    channel.bind("new-message", handleNewMessage);

    return () => {
      pusherClient.unsubscribe("private-user-messages");
    };
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/messages");
      if (response.ok) {
        const messages = await response.json();
        // Group messages by conversation
        const grouped = groupMessagesByConversation(messages);
        setConversations(grouped);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessage = (message) => {
    setConversations((current) => {
      const updated = [...current];
      const conversationIndex = updated.findIndex(
        (conv) =>
          conv.userId === message.sender.id ||
          conv.userId === message.receiver.id
      );

      if (conversationIndex > -1) {
        updated[conversationIndex].lastMessage = message;
        updated[conversationIndex].unreadCount += 1;
      } else {
        updated.unshift({
          userId: message.sender.id,
          user: message.sender,
          lastMessage: message,
          unreadCount: 1,
        });
      }

      return updated;
    });
  };

  const groupMessagesByConversation = (messages) => {
    const grouped = {};
    messages.forEach((message) => {
      const otherUser =
        message.sender.id === currentUserId ? message.receiver : message.sender;
      if (!grouped[otherUser.id]) {
        grouped[otherUser.id] = {
          userId: otherUser.id,
          user: otherUser,
          lastMessage: message,
          unreadCount: message.isRead ? 0 : 1,
        };
      } else {
        if (!message.isRead) {
          grouped[otherUser.id].unreadCount += 1;
        }
        if (
          new Date(message.createdAt) >
          new Date(grouped[otherUser.id].lastMessage.createdAt)
        ) {
          grouped[otherUser.id].lastMessage = message;
        }
      }
    });
    return Object.values(grouped).sort(
      (a, b) =>
        new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
    );
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Conversation List */}
      <div className="w-96 border-r border-gray-200 bg-white">
        <div className="h-16 border-b border-gray-200 px-6 flex items-center">
          <h2 className="text-lg font-medium text-gray-900">Messages</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          {loading ? (
            <div className="space-y-4 p-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 animate-pulse"
                >
                  <div className="h-12 w-12 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            conversations.map((conversation) => (
              <button
                key={conversation.userId}
                onClick={() => setSelectedUserId(conversation.userId)}
                className={`w-full p-4 hover:bg-gray-50 flex items-center space-x-4 ${
                  selectedUserId === conversation.userId ? "bg-gray-50" : ""
                }`}
              >
                <div className="relative flex-shrink-0">
                  {conversation.user.profileImage ? (
                    <Image
                      src={conversation.user.profileImage}
                      alt={conversation.user.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xl font-medium text-gray-600">
                        {conversation.user.name[0]}
                      </span>
                    </div>
                  )}
                  {conversation.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {conversation.user.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(
                        new Date(conversation.lastMessage.createdAt),
                        "MMM d"
                      )}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.lastMessage.content}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Window */}
      {selectedUserId ? (
        <ChatWindow
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <p className="text-gray-500">
            Select a conversation to start messaging
          </p>
        </div>
      )}
    </div>
  );
}
