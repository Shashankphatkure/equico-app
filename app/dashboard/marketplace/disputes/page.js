"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Disputes() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      const response = await fetch("/api/disputes");
      if (response.ok) {
        const data = await response.json();
        setDisputes(data);
      }
    } catch (error) {
      console.error("Error fetching disputes:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900">Disputes</h1>

      <div className="mt-8 space-y-6">
        {disputes.map((dispute) => (
          <div
            key={dispute.id}
            className="bg-white shadow rounded-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {dispute.reason}
                </h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    dispute.status === "open"
                      ? "bg-yellow-100 text-yellow-800"
                      : dispute.status === "resolved"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {dispute.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {dispute.description}
              </p>
              <div className="mt-4">
                <Link
                  href={`/dashboard/marketplace/listings/${dispute.listingId}`}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  View Listing
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
