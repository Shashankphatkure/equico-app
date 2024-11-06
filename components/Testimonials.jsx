import { StarIcon } from "@heroicons/react/24/solid";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";

export default function Testimonials() {
  const testimonials = [
    {
      content:
        "This app completely changed how I connect with people! The interface is so intuitive, and I've made amazing friends from all over the world.",
      author: "Sarah Johnson",
      role: "Digital Nomad",
      location: "Tokyo, Japan",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop",
      rating: 5,
    },
    {
      content:
        "The best social platform I've used. The matching algorithm is spot-on, and the community is incredibly welcoming and diverse.",
      author: "Michael Chen",
      role: "Tech Enthusiast",
      location: "San Francisco, USA",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&auto=format&fit=crop",
      rating: 5,
    },
    {
      content:
        "I love how easy it is to find people with similar interests. The group features are fantastic for organizing meetups and events!",
      author: "Emma Rodriguez",
      role: "Community Builder",
      location: "Barcelona, Spain",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop",
      rating: 5,
    },
  ];

  return (
    <div className="relative py-24 sm:py-32 overflow-hidden bg-white">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-y-0 left-0 -translate-x-1/2 w-[300px] h-full">
          <div className="absolute inset-0 bg-gradient-to-r from-[#E2FF3F] to-[#d4f129] opacity-20 blur-3xl"></div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <div className="inline-flex items-center justify-center p-2 bg-[#E2FF3F]/10 rounded-full mb-4">
            <ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-gray-900" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Loved by Users Worldwide
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Join our growing community of happy users
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-gray-900 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative rounded-3xl bg-white p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ring-1 ring-gray-200"
            >
              {/* Quote decoration */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#E2FF3F] rounded-full flex items-center justify-center shadow-lg">
                <span className="text-lg font-serif">"</span>
              </div>

              <div className="relative">
                <blockquote className="text-gray-700 leading-7">
                  {testimonial.content}
                </blockquote>

                <div className="flex gap-1 mt-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-[#E2FF3F]" />
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <img
                      className="h-12 w-12 rounded-full object-cover ring-4 ring-white"
                      src={testimonial.image}
                      alt={testimonial.author}
                    />
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonial.author}
                      </div>
                      <div className="text-sm text-gray-600">
                        {testimonial.role}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof numbers */}
        <div className="mt-16 grid grid-cols-2 gap-8 border-t border-gray-200 pt-16 sm:grid-cols-4">
          {[
            ["50K+", "Reviews"],
            ["4.9/5", "Average Rating"],
            ["150+", "Countries"],
            ["1M+", "Happy Users"],
          ].map(([stat, label]) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-bold text-gray-900">{stat}</div>
              <div className="mt-1 text-sm text-gray-600">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
