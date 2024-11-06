"use client";
import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce";

export default function Search() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      searchUsers();
    } else {
      setUsers([]);
    }
  }, [debouncedQuery]);

  const searchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/search/users?q=${encodeURIComponent(debouncedQuery)}`
      );
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      const response = await fetch("/api/profile/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ targetUserId: userId }),
      });

      if (response.ok) {
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, isFollowing: true } : user
          )
        );
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      const response = await fetch("/api/profile/follow", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ targetUserId: userId }),
      });

      if (response.ok) {
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, isFollowing: false } : user
          )
        );
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Search Bar */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="block w-full rounded-lg border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Search users..."
        />
      </div>

      {/* Results */}
      <div className="mt-8 space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse flex items-center space-x-4"
              >
                <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 relative">
                  {user.profileImage ? (
                    <Image
                      src={user.profileImage}
                      alt={user.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xl font-medium text-gray-600">
                        {user.name[0]}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <Link
                    href={`/profile/${user.id}`}
                    className="font-medium text-gray-900 hover:underline"
                  >
                    {user.name}
                  </Link>
                  <p className="text-sm text-gray-500">
                    {user.followers} followers · {user.totalHorses} horses
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  user.isFollowing
                    ? handleUnfollow(user.id)
                    : handleFollow(user.id)
                }
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  user.isFollowing
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-indigo-600 text-white hover:bg-indigo-500"
                }`}
              >
                {user.isFollowing ? "Unfollow" : "Follow"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
