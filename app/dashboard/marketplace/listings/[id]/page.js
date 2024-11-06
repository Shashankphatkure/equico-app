"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import MessageModal from "./MessageModal";

export default function ListingDetail({ params }) {
  const [listing, setListing] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListing();
  }, [params.id]);

  const fetchListing = async () => {
    try {
      const response = await fetch(`/api/marketplace/listings/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setListing(data);
        setSelectedImage(0);
      }
    } catch (error) {
      console.error("Error fetching listing:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `/api/marketplace/listings/${params.id}/save`,
        {
          method: listing.isSaved ? "DELETE" : "POST",
        }
      );

      if (response.ok) {
        setListing({ ...listing, isSaved: !listing.isSaved });
      }
    } catch (error) {
      console.error("Error saving listing:", error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-lg" />
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square relative rounded-lg overflow-hidden">
            <Image
              src={listing.images[selectedImage]}
              alt={listing.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {listing.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square relative rounded-lg overflow-hidden ${
                  selectedImage === index ? "ring-2 ring-indigo-500" : ""
                }`}
              >
                <Image
                  src={image}
                  alt={`${listing.title} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Listing Details */}
        <div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {listing.title}
              </h1>
              <p className="mt-1 text-3xl font-semibold text-gray-900">
                ${listing.price.toFixed(2)}
              </p>
            </div>
            <button
              onClick={handleSave}
              className="rounded-full p-2 text-gray-400 hover:text-gray-500"
            >
              {listing.isSaved ? (
                <HeartSolid className="h-6 w-6 text-red-500" />
              ) : (
                <HeartOutline className="h-6 w-6" />
              )}
            </button>
          </div>

          <div className="mt-4">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
            <span className="ml-2 text-sm text-gray-500">
              {listing.views} views
            </span>
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-medium text-gray-900">Description</h2>
            <p className="mt-2 text-sm text-gray-500 whitespace-pre-wrap">
              {listing.description}
            </p>
          </div>

          {/* Shop Info */}
          <div className="mt-8 border-t border-gray-200 pt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {listing.shop.owner.profileImage ? (
                    <Image
                      src={listing.shop.owner.profileImage}
                      alt={listing.shop.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {listing.shop.name}
                    {listing.shop.isVerified && (
                      <CheckBadgeIcon className="ml-1 h-4 w-4 text-blue-500 inline" />
                    )}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {listing.shop._count.listings} listings
                  </p>
                </div>
              </div>
              <Link
                href={`/dashboard/marketplace/shops/${listing.shop.id}`}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                View Shop
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <button
                onClick={() => setIsMessageModalOpen(true)}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Message Seller
              </button>
              <Link
                href={`/dashboard/marketplace/shops/${listing.shop.id}`}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                View More Items
              </Link>
            </div>
          </div>

          {/* Similar Listings */}
          {listing.similarListings?.length > 0 && (
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h2 className="text-sm font-medium text-gray-900">
                Similar Items
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {listing.similarListings.map((item) => (
                  <Link
                    key={item.id}
                    href={`/dashboard/marketplace/listings/${item.id}`}
                    className="group relative"
                  >
                    <div className="aspect-square relative rounded-lg overflow-hidden">
                      <Image
                        src={item.images[0]}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:opacity-75"
                      />
                    </div>
                    <p className="mt-2 text-sm font-medium text-gray-900 truncate">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      ${item.price.toFixed(2)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        listing={listing}
      />
    </div>
  );
}
