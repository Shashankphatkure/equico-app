import {
  UserGroupIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

const stats = [
  { name: "Total Horses", value: "12", icon: UserGroupIcon },
  { name: "Upcoming Events", value: "3", icon: CalendarIcon },
  { name: "Unread Messages", value: "24", icon: ChatBubbleLeftRightIcon },
  { name: "Active Listings", value: "8", icon: ShoppingBagIcon },
];

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

      {/* Stats */}
      <dl className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {stat.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">
                {stat.value}
              </p>
            </dd>
          </div>
        ))}
      </dl>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow">
          <div className="p-6">
            <p className="text-gray-500">
              Your recent activity will appear here
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Upcoming Events</h2>
        <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow">
          <div className="p-6">
            <p className="text-gray-500">
              Your upcoming events will appear here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
