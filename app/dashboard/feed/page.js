"use client";
import { useState, useEffect } from "react";
import { PhotoIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import CreatePostModal from "./CreatePostModal";
import PostCard from "./PostCard";
import { pusherClient } from "@/lib/pusher";

export default function Feed() {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();

    // Subscribe to real-time updates
    const channel = pusherClient.subscribe("posts");

    channel.bind("new-post", (newPost) => {
      setPosts((currentPosts) => [newPost, ...currentPosts]);
    });

    channel.bind("new-like", ({ postId, likesCount }) => {
      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === postId ? { ...post, likes: likesCount } : post
        )
      );
    });

    channel.bind("new-comment", ({ postId, commentsCount }) => {
      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === postId ? { ...post, comments: commentsCount } : post
        )
      );
    });

    return () => {
      pusherClient.unsubscribe("posts");
    };
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Create Post Card */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gray-200" />
          </div>
          <div className="min-w-0 flex-1">
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="w-full text-left px-4 py-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50"
            >
              What's on your mind?
            </button>
          </div>
        </div>
        <div className="mt-4 flex justify-between border-t pt-4">
          <button
            onClick={() => setIsPostModalOpen(true)}
            className="flex items-center text-gray-700 hover:text-gray-900"
          >
            <PhotoIcon className="h-6 w-6 mr-2" />
            Photo
          </button>
          <button
            onClick={() => setIsPostModalOpen(true)}
            className="flex items-center text-gray-700 hover:text-gray-900"
          >
            <VideoCameraIcon className="h-6 w-6 mr-2" />
            Video
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white shadow rounded-lg p-4 animate-pulse"
            >
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      <CreatePostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onPost={(newPost) => {
          setPosts([newPost, ...posts]);
          setIsPostModalOpen(false);
        }}
      />
    </div>
  );
}
