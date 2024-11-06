"use client";
import { useState, useEffect } from "react";
import {
  PlusIcon,
  ChartBarIcon,
  CogIcon,
  CheckBadgeIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import CreateListingModal from "./CreateListingModal";
import ShopSettingsModal from "./ShopSettingsModal";

export default function TackShop() {
  const [shop, setShop] = useState(null);
  const [listings, setListings] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    fetchShopData();
  }, []);

  const fetchShopData = async () => {
    try {
      const [shopResponse, listingsResponse] = await Promise.all([
        fetch("/api/marketplace/shop"),
        fetch("/api/marketplace/shop/listings"),
      ]);

      if (shopResponse.ok && listingsResponse.ok) {
        const [shopData, listingsData] = await Promise.all([
          shopResponse.json(),
          listingsResponse.json(),
        ]);
        setShop(shopData);
        setListings(listingsData);
      }
    } catch (error) {
      console.error("Error fetching shop data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings.filter((listing) => {
    if (activeTab === "active") return listing.status === "active";
    if (activeTab === "sold") return listing.status === "sold";
    if (activeTab === "archived") return listing.status === "archived";
    return true;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg mb-8" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Shop Header */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600" />
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="-mt-16">
                {shop?.profileImage ? (
                  <Image
                    src={shop.profileImage}
                    alt={shop.name}
                    width={96}
                    height={96}
                    className="rounded-lg border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-lg bg-gray-200 border-4 border-white shadow-lg" />
                )}
              </div>
              <div>
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {shop?.name}
                  </h1>
                  {shop?.isVerified && (
                    <CheckBadgeIcon className="ml-2 h-6 w-6 text-blue-500" />
                  )}
                  {shop?.isPremium && (
                    <SparklesIcon className="ml-2 h-6 w-6 text-yellow-500" />
                  )}
                </div>
                <p className="text-gray-500">{listings.length} listings</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/dashboard/marketplace/shop/analytics"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <ChartBarIcon className="h-5 w-5 mr-2 text-gray-500" />
                Analytics
              </Link>
              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <CogIcon className="h-5 w-5 mr-2 text-gray-500" />
                Settings
              </button>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                New Listing
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {["active", "sold", "archived"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
            >
              {tab} ({listings.filter((l) => l.status === tab).length})
            </button>
          ))}
        </nav>
      </div>

      {/* Listings Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredListings.map((listing) => (
          <div
            key={listing.id}
            className="relative bg-white rounded-lg shadow overflow-hidden group"
          >
            <div className="aspect-square relative">
              <Image
                src={listing.images[0]}
                alt={listing.title}
                fill
                className="object-cover group-hover:opacity-75"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900">
                {listing.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                ${listing.price.toFixed(2)}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {listing.views} views
                </span>
                <Link
                  href={`/dashboard/marketplace/listings/${listing.id}/edit`}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Edit
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CreateListingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchShopData}
      />
      <ShopSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        shop={shop}
        onUpdate={setShop}
      />
    </div>
  );
}
