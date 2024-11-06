"use client";
import { useState, useEffect } from "react";
import {
  CurrencyDollarIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  EyeIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const periods = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "all", label: "All time" },
];

export default function Analytics() {
  const [period, setPeriod] = useState("30d");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(
        `/api/marketplace/shop/analytics?period=${period}`
      );
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
              <div className="h-8 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="h-64 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const { overview, viewsOverTime, salesByCategory, topListings } = analytics;

  const viewsChartData = {
    labels: viewsOverTime.map((item) => item.date),
    datasets: [
      {
        label: "Views",
        data: viewsOverTime.map((item) => item.views),
        borderColor: "rgb(79, 70, 229)",
        backgroundColor: "rgba(79, 70, 229, 0.1)",
        fill: true,
      },
    ],
  };

  const salesChartData = {
    labels: salesByCategory.map((item) => item.name),
    datasets: [
      {
        label: "Sales",
        data: salesByCategory.map((item) => item.revenue),
        backgroundColor: "rgb(79, 70, 229)",
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Period Selector */}
      <div className="flex justify-end mb-8">
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          {periods.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-6 w-6 text-indigo-600" />
            <h3 className="ml-2 text-sm font-medium text-gray-500">
              Total Sales
            </h3>
          </div>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            ${overview.totalSales.toFixed(2)}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {overview.soldCount} items sold
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ShoppingBagIcon className="h-6 w-6 text-indigo-600" />
            <h3 className="ml-2 text-sm font-medium text-gray-500">
              Active Listings
            </h3>
          </div>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {overview.activeListings}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            of {overview.totalListings} total
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <EyeIcon className="h-6 w-6 text-indigo-600" />
            <h3 className="ml-2 text-sm font-medium text-gray-500">
              Total Views
            </h3>
          </div>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {overview.totalViews}
          </p>
          <p className="mt-1 text-sm text-gray-500">across all listings</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <HeartIcon className="h-6 w-6 text-indigo-600" />
            <h3 className="ml-2 text-sm font-medium text-gray-500">
              Saved Items
            </h3>
          </div>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {overview.savedCount}
          </p>
          <p className="mt-1 text-sm text-gray-500">by potential buyers</p>
        </div>
      </div>

      {/* Charts */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Views Over Time</h3>
          <div className="mt-4 h-64">
            <Line
              data={viewsChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">
            Sales by Category
          </h3>
          <div className="mt-4 h-64">
            <Bar
              data={salesChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Top Listings */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Top Performing Listings
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {topListings.map((listing) => (
              <div key={listing.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {listing.title}
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      ${listing.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="ml-6 flex items-center space-x-8">
                    <div className="flex items-center">
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                      <span className="ml-2 text-sm text-gray-500">
                        {listing.views}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <HeartIcon className="h-5 w-5 text-gray-400" />
                      <span className="ml-2 text-sm text-gray-500">
                        {listing.saves}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
