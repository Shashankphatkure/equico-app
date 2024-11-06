"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

export default function ListingCard({ listing }) {
  const [isSaved, setIsSaved] = useState(listing.isSaved);

  const handleSave = async (e) => {
    e.preventDefault(); // Prevent navigation when clicking the save button
    try {
      const response = await fetch(
        `/api/marketplace/listings/${listing.id}/save`,
        {
          method: isSaved ? "DELETE" : "POST",
        }
      );

      if (response.ok) {
        setIsSaved(!isSaved);
      }
    } catch (error) {
      console.error("Error saving listing:", error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <Link href={`/dashboard/marketplace/listings/${listing.id}`}>
      <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
        {/* Image */}
        <div className="aspect-square relative overflow-hidden rounded-t-lg">
          {listing.images[0] ? (
            <Image
              src={listing.images[0]}
              alt={listing.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
          <button
            onClick={handleSave}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm z-10"
          >
            {isSaved ? (
              <HeartSolid className="h-5 w-5 text-red-500" />
            ) : (
              <HeartOutline className="h-5 w-5 text-gray-600" />
            )}
          </button>
          {listing.isBoosted && (
            <span className="absolute top-2 left-2 px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
              Featured
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 truncate">
            {listing.title}
          </h3>
          <p className="mt-1 text-xl font-semibold text-gray-900">
            {formatPrice(listing.price)}
          </p>
          <div className="mt-1 flex items-center space-x-2">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                listing.condition === "new"
                  ? "bg-green-100 text-green-800"
                  : listing.condition === "like-new"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {listing.condition.charAt(0).toUpperCase() +
                listing.condition.slice(1)}
            </span>
            <span className="text-sm text-gray-500">{listing.category}</span>
          </div>

          {/* Shop Info */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {listing.shop.owner.profileImage ? (
                <Image
                  src={listing.shop.owner.profileImage}
                  alt={listing.shop.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-200" />
              )}
              <span className="text-sm text-gray-600 truncate">
                {listing.shop.name}
              </span>
              {listing.shop.isVerified && (
                <svg
                  className="h-4 w-4 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <span className="text-sm text-gray-500">
              {new Date(listing.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
