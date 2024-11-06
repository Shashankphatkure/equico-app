import {
  UserGroupIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

const stats = [
  {
    name: "Total Horses",
    value: "12",
    change: "+2 this month",
    icon: UserGroupIcon,
    color: "bg-pink-500",
  },
  {
    name: "Upcoming Events",
    value: "3",
    change: "Next event in 2 days",
    icon: CalendarIcon,
    color: "bg-blue-500",
  },
  {
    name: "Unread Messages",
    value: "24",
    change: "5 new today",
    icon: ChatBubbleLeftRightIcon,
    color: "bg-indigo-500",
  },
  {
    name: "Active Listings",
    value: "8",
    change: "3 items sold this week",
    icon: ShoppingBagIcon,
    color: "bg-green-500",
  },
];

const recentActivities = [
  {
    id: 1,
    type: "message",
    content: "New message from Sarah about Thunder's training schedule",
    timestamp: "5 minutes ago",
    icon: ChatBubbleLeftRightIcon,
    iconColor: "text-blue-500",
  },
  {
    id: 2,
    type: "event",
    content: "Upcoming vet appointment for Storm",
    timestamp: "2 hours ago",
    icon: CalendarIcon,
    iconColor: "text-green-500",
  },
  {
    id: 3,
    type: "sale",
    content: "Your listing 'English Saddle' was sold",
    timestamp: "1 day ago",
    icon: ShoppingBagIcon,
    iconColor: "text-purple-500",
  },
];

const upcomingEvents = [
  {
    id: 1,
    title: "Vet Check-up",
    date: "Tomorrow, 10:00 AM",
    horse: "Thunder",
    type: "medical",
  },
  {
    id: 2,
    title: "Training Session",
    date: "Wed, 2:00 PM",
    horse: "Storm",
    type: "training",
  },
  {
    id: 3,
    title: "Farrier Visit",
    date: "Fri, 11:00 AM",
    horse: "Both",
    type: "maintenance",
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Welcome back, Alex
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Here's what's happening with your horses and listings
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <BellIcon className="h-5 w-5 mr-2 text-gray-500" />
              Notifications
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <dt>
                <div className={`absolute rounded-md p-3 ${stat.color}`}>
                  <stat.icon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </div>
                <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                  {stat.name}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
                <p className="ml-2 flex items-baseline text-sm text-gray-600">
                  {stat.change}
                </p>
              </dd>
              <div className="absolute bottom-0 inset-x-0 bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <Link
                    href="#"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    View all<span className="sr-only"> {stat.name}</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 3-Column Layout */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Recent Activity */}
          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Recent Activity
              </h3>
              <div className="mt-6 flow-root">
                <ul className="-mb-8">
                  {recentActivities.map((activity, index) => (
                    <li key={activity.id}>
                      <div className="relative pb-8">
                        {index !== recentActivities.length - 1 && (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        )}
                        <div className="relative flex space-x-3">
                          <div>
                            <span
                              className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${activity.iconColor.replace(
                                "text",
                                "bg"
                              )}/10`}
                            >
                              <activity.icon
                                className={`h-5 w-5 ${activity.iconColor}`}
                              />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                {activity.content}
                              </p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              {activity.timestamp}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Upcoming Events
              </h3>
              <div className="mt-6 space-y-6">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-100">
                        <CalendarIcon className="h-6 w-6 text-blue-600" />
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {event.title}
                      </p>
                      <p className="text-sm text-gray-500">{event.date}</p>
                      <p className="text-xs text-gray-400">
                        Horse: {event.horse}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Quick Actions
              </h3>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <Link
                  href="/dashboard/horses/add"
                  className="inline-flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <UserGroupIcon className="h-8 w-8 text-gray-600" />
                  <span className="mt-2 text-sm font-medium text-gray-900">
                    Add Horse
                  </span>
                </Link>
                <Link
                  href="/dashboard/marketplace/create"
                  className="inline-flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ShoppingBagIcon className="h-8 w-8 text-gray-600" />
                  <span className="mt-2 text-sm font-medium text-gray-900">
                    New Listing
                  </span>
                </Link>
                <Link
                  href="/dashboard/events/schedule"
                  className="inline-flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <CalendarIcon className="h-8 w-8 text-gray-600" />
                  <span className="mt-2 text-sm font-medium text-gray-900">
                    Schedule Event
                  </span>
                </Link>
                <Link
                  href="/dashboard/messages"
                  className="inline-flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ChatBubbleLeftRightIcon className="h-8 w-8 text-gray-600" />
                  <span className="mt-2 text-sm font-medium text-gray-900">
                    Messages
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
