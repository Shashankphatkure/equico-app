import {
  UserGroupIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    name: "Social Community",
    description:
      "Connect with fellow equestrians, share experiences, and build lasting friendships.",
    icon: UserGroupIcon,
  },
  {
    name: "Horse Management",
    description:
      "Track medical records, training progress, and important appointments for your horses.",
    icon: ClipboardDocumentListIcon,
  },
  {
    name: "Event Planning",
    description:
      "Organize and join equestrian events, competitions, and meetups.",
    icon: CalendarIcon,
  },
  {
    name: "Messaging System",
    description: "Stay connected with private messaging and group chats.",
    icon: ChatBubbleLeftRightIcon,
  },
  {
    name: "Marketplace",
    description:
      "Buy and sell equestrian equipment in our dedicated marketplace.",
    icon: ShoppingBagIcon,
  },
  {
    name: "Training Logs",
    description:
      "Record and share training sessions, track progress, and celebrate achievements.",
    icon: HeartIcon,
  },
];

export default function Features() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            Everything You Need
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            The Complete Platform for Horse Enthusiasts
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Eqvico brings together everything you need to manage your equestrian
            lifestyle in one place.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon
                    className="h-5 w-5 flex-none text-indigo-600"
                    aria-hidden="true"
                  />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
