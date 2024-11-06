import {
  UserPlusIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

export default function HowItWorks() {
  const steps = [
    {
      title: "Create Profile",
      description:
        "Sign up and customize your profile in minutes. Add your interests, photos, and connect your social accounts.",
      icon: UserPlusIcon,
      image:
        "https://images.unsplash.com/photo-1534958644247-f41311c829ad?q=80&w=300&h=200&auto=format&fit=crop",
      color: "from-[#E2FF3F] to-[#d4f129]",
      features: ["Quick signup", "Profile customization", "Interest tags"],
    },
    {
      title: "Connect & Chat",
      description:
        "Start meaningful conversations with people who share your interests. Our smart matching helps you find the perfect connections.",
      icon: ChatBubbleLeftRightIcon,
      image:
        "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=300&h=200&auto=format&fit=crop",
      color: "from-[#E2FF3F] to-[#d4f129]",
      features: ["Real-time chat", "Voice messages", "Media sharing"],
    },
    {
      title: "Make Friends",
      description:
        "Join groups, attend events, and build lasting friendships. Connect with people from around the world who share your passions.",
      icon: UserGroupIcon,
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=300&h=200&auto=format&fit=crop",
      color: "from-[#E2FF3F] to-[#d4f129]",
      features: ["Group activities", "Event planning", "Friend suggestions"],
    },
  ];

  return (
    <div className="relative py-24 sm:py-32 overflow-hidden bg-white">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519389950473-47ba0277781c')] bg-fixed bg-cover bg-center opacity-[0.03]"></div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center justify-center p-2 bg-[#E2FF3F]/10 rounded-full mb-4">
            <span className="text-sm font-medium text-gray-900">
              Simple Steps
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Start Your Journey
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Begin connecting with new friends in three easy steps
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#E2FF3F]/20 to-transparent rounded-3xl blur-xl group-hover:opacity-75 transition-opacity duration-500 opacity-0"></div>
                <div className="relative bg-white rounded-3xl shadow-sm ring-1 ring-gray-200 hover:shadow-xl transition-all duration-300">
                  {/* Image section */}
                  <div className="h-48 overflow-hidden rounded-t-3xl relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40 z-10"></div>
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm rounded-full py-1 px-3">
                      <span className="text-sm font-semibold text-gray-900">
                        Step {index + 1}
                      </span>
                    </div>
                  </div>

                  {/* Content section */}
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r ${step.color}`}
                      >
                        <step.icon className="h-6 w-6 text-gray-900" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {step.title}
                      </h3>
                    </div>

                    <p className="text-gray-600 mb-6">{step.description}</p>

                    {/* Feature list */}
                    <ul className="space-y-3">
                      {step.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm text-gray-600"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-[#E2FF3F]"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
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
