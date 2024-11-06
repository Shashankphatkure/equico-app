"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { XMarkIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { pusherClient } from "@/lib/pusher";

export default function ChatWindow({ userId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    subscribeToMessages();

    return () => {
      pusherClient.unsubscribe(`private-chat-${userId}`);
    };
  }, [userId]);

  const subscribeToMessages = () => {
    const channel = pusherClient.subscribe(`private-chat-${userId}`);
    channel.bind("new-message", (message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });
  };

  const fetchMessages = async () => {
    try {
      const [messagesResponse, userResponse] = await Promise.all([
        fetch(`/api/messages?userId=${userId}`),
        fetch(`/api/users/${userId}`),
      ]);

      if (messagesResponse.ok && userResponse.ok) {
        const [messagesData, userData] = await Promise.all([
          messagesResponse.json(),
          userResponse.json(),
        ]);
        setMessages(messagesData.reverse()); // Reverse to show oldest first
        setUser(userData);
      }
    } catch (error) {
      console.error("Error fetching chat data:", error);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverId: userId,
          content: newMessage,
        }),
      });

      if (response.ok) {
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 bg-gray-50 flex flex-col">
        <div className="h-16 border-b border-gray-200 px-6 flex items-center animate-pulse">
          <div className="h-10 w-10 rounded-full bg-gray-200" />
          <div className="ml-3 h-4 w-24 bg-gray-200 rounded" />
        </div>
        <div className="flex-1 p-6 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-end space-x-2">
              <div className="h-8 w-8 rounded-full bg-gray-200" />
              <div className="h-10 w-48 bg-gray-200 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex-1 bg-gray-50 flex flex-col">
      {/* Chat Header */}
      <div className="h-16 border-b border-gray-200 px-6 flex items-center justify-between bg-white">
        <div className="flex items-center">
          <Link href={`/profile/${user.id}`} className="flex items-center">
            {user.profileImage ? (
              <Image
                src={user.profileImage}
                alt={user.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xl font-medium text-gray-600">
                  {user.name[0]}
                </span>
              </div>
            )}
            <span className="ml-3 font-medium text-gray-900">{user.name}</span>
          </Link>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-1 text-gray-400 hover:text-gray-500"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-end space-x-2 ${
                message.senderId === userId ? "justify-start" : "justify-end"
              }`}
            >
              {message.senderId === userId && (
                <div className="flex-shrink-0">
                  {message.sender.profileImage ? (
                    <Image
                      src={message.sender.profileImage}
                      alt={message.sender.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {message.sender.name[0]}
                      </span>
                    </div>
                  )}
                </div>
              )}
              <div
                className={`rounded-lg px-4 py-2 max-w-sm ${
                  message.senderId === userId
                    ? "bg-gray-100 text-gray-900"
                    : "bg-indigo-600 text-white"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                {message.listing && (
                  <Link
                    href={`/dashboard/marketplace/listings/${message.listing.id}`}
                    className="mt-2 block rounded bg-white/10 p-2 text-sm"
                  >
                    <p className="font-medium">{message.listing.title}</p>
                    <p>${message.listing.price.toFixed(2)}</p>
                  </Link>
                )}
                <p className="mt-1 text-xs opacity-75">
                  {format(new Date(message.createdAt), "HH:mm")}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 px-6 py-4 bg-white">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 p-2 text-white hover:bg-indigo-500"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
