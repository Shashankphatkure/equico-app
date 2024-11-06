"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  HeartIcon as HeartOutline,
  ChatBubbleLeftIcon,
  ShareIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

export default function PostCard({ post }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: isLiked ? "DELETE" : "POST",
      });

      if (response.ok) {
        setIsLiked(!isLiked);
        setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/posts/${post.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: comment }),
      });

      if (response.ok) {
        setComment("");
        // Refresh comments
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full overflow-hidden">
            {post.author.profileImage ? (
              <Image
                src={post.author.profileImage}
                alt={post.author.name}
                width={40}
                height={40}
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gray-200" />
            )}
          </div>
          <div>
            <Link
              href={`/profile/${post.author.id}`}
              className="font-medium text-gray-900 hover:underline"
            >
              {post.author.name}
            </Link>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-500">
          <EllipsisHorizontalIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-2">
        <p className="text-gray-900">{post.content}</p>
      </div>

      {/* Post Media */}
      {post.imageUrl && (
        <div className="relative aspect-video">
          <Image
            src={post.imageUrl}
            alt="Post image"
            fill
            className="object-cover"
          />
        </div>
      )}
      {post.videoUrl && (
        <video controls className="w-full">
          <source src={post.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Post Actions */}
      <div className="px-4 py-2 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 ${
                isLiked ? "text-red-500" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {isLiked ? (
                <HeartSolid className="h-5 w-5" />
              ) : (
                <HeartOutline className="h-5 w-5" />
              )}
              <span>{likesCount}</span>
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
            >
              <ChatBubbleLeftIcon className="h-5 w-5" />
              <span>{post.comments}</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
              <ShareIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 py-2 border-t border-gray-200">
          <form onSubmit={handleComment} className="flex space-x-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 rounded-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
