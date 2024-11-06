"use client";
import { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import ListingCard from "./ListingCard";
import FilterSidebar from "./FilterSidebar";
import { useDebounce } from "@/hooks/useDebounce";

const categories = [
  "All",
  "Saddles",
  "Bridles",
  "Riding Wear",
  "Grooming",
  "Safety Gear",
  "Accessories",
];

export default function Marketplace() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filters, setFilters] = useState({
    condition: [],
    minPrice: "",
    maxPrice: "",
    sortBy: "newest",
  });
  const [showFilters, setShowFilters] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    fetchListings();
  }, [debouncedSearch, selectedCategory, filters]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        search: debouncedSearch,
        category: selectedCategory !== "All" ? selectedCategory : "",
        ...filters,
      });

      const response = await fetch(`/api/marketplace/listings?${queryParams}`);
      if (response.ok) {
        const data = await response.json();
        setListings(data);
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Marketplace</h1>
          <a
            href="/dashboard/marketplace/shop"
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            My Tack Shop
          </a>
        </div>

        {/* Search and Filters */}
        <div className="mt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -mt-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search listings..."
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Categories */}
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCategory === category
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-8 flex">
          {/* Filters Sidebar */}
          <FilterSidebar
            show={showFilters}
            onClose={() => setShowFilters(false)}
            filters={filters}
            onFilterChange={setFilters}
          />

          {/* Listings Grid */}
          <div className={`flex-1 ${showFilters ? "ml-0 sm:ml-64" : ""}`}>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg h-48" />
                    <div className="mt-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
