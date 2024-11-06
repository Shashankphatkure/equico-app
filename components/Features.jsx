import {
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  GlobeAltIcon,
  SparklesIcon,
  ShieldCheckIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";

export default function Features() {
  const features = [
    {
      name: "Global Community",
      description:
        "Connect with people worldwide who share your interests and passions.",
      icon: GlobeAltIcon,
      color: "from-[#E2FF3F] to-[#d4f129]",
    },
    {
      name: "Real-time Chat",
      description:
        "Instant messaging with multimedia sharing and fun interactive features.",
      icon: ChatBubbleLeftRightIcon,
      color: "from-[#E2FF3F] to-[#d4f129]",
    },
    {
      name: "Group Activities",
      description:
        "Create or join groups based on shared interests and activities.",
      icon: UserGroupIcon,
      color: "from-[#E2FF3F] to-[#d4f129]",
    },
    {
      name: "Smart Matching",
      description:
        "Our AI helps you find the perfect connections based on your interests.",
      icon: SparklesIcon,
      color: "from-[#E2FF3F] to-[#d4f129]",
    },
    {
      name: "Privacy First",
      description:
        "Advanced security features to keep your conversations private and secure.",
      icon: ShieldCheckIcon,
      color: "from-[#E2FF3F] to-[#d4f129]",
    },
    {
      name: "Quick Connect",
      description:
        "Find and connect with nearby friends instantly using location features.",
      icon: BoltIcon,
      color: "from-[#E2FF3F] to-[#d4f129]",
    },
  ];

  return (
    <div className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to connect
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Discover amazing features that make socializing fun and meaningful
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r ${feature.color}`}
                  >
                    <feature.icon className="h-6 w-6 text-gray-900" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {feature.name}
                  </h3>
                </div>
                <p className="mt-4 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
