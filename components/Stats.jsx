import {
  UsersIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export default function Stats() {
  const stats = [
    {
      stat: "2M+",
      label: "Active Users",
      change: "+25% from last year",
      icon: UsersIcon,
    },
    {
      stat: "150+",
      label: "Countries",
      change: "Global reach",
      icon: GlobeAltIcon,
    },
    {
      stat: "500K+",
      label: "Daily Messages",
      change: "+180% growth",
      icon: CurrencyDollarIcon,
    },
    {
      stat: "99.9%",
      label: "Success Rate",
      change: "Industry leading",
      icon: ChartBarIcon,
    },
  ];

  return (
    <div className="relative py-24 sm:py-32 overflow-hidden bg-white">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Connect Globally
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Join millions of users worldwide
            </p>
          </div>

          <dl className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
              <div
                key={item.label}
                className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute top-0 right-0 -mt-4 -mr-4 h-20 w-20 rounded-full bg-[#E2FF3F] opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                <item.icon className="h-8 w-8 text-gray-900" />
                <dt className="mt-4 text-sm font-medium text-gray-600">
                  {item.label}
                </dt>
                <dd className="mt-2">
                  <div className="text-3xl font-semibold text-gray-900">
                    {item.stat}
                  </div>
                  <div className="mt-2 text-sm text-gray-600 font-medium">
                    {item.change}
                  </div>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
