import { ArrowRightIcon, PlayCircleIcon } from "@heroicons/react/24/solid";
import {
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

export default function Hero() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-[500px] h-[500px]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#E2FF3F] to-[#d4f129] opacity-20 blur-3xl animate-blob"></div>
        </div>
        <div className="absolute top-40 -left-32 w-[500px] h-[500px]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#E2FF3F] to-[#d4f129] opacity-20 blur-3xl animate-blob animation-delay-2000"></div>
        </div>
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #e2ff3f 1px, transparent 0)",
          backgroundSize: "40px 40px",
          opacity: 0.2,
        }}
      ></div>

      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
          {/* Floating feature cards */}
          <div className="absolute top-20 left-10 hidden lg:block">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-[#E2FF3F]">
                  <UserGroupIcon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">2M+ Users</p>
                  <p className="text-sm text-gray-600">Join the community</p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute top-40 right-10 hidden lg:block">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-[#E2FF3F]">
                  <ChatBubbleLeftRightIcon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Real-time Chat</p>
                  <p className="text-sm text-gray-600">Connect instantly</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="bg-[#E2FF3F] text-black px-4 py-1 rounded-full inline-flex items-center gap-2 mb-8">
              <SparklesIcon className="w-4 h-4" />
              <span className="text-sm font-medium">
                New Features Available
              </span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-bold text-gray-900 tracking-tight">
              Where Friendships
              <span className="block mt-2 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Come to Life
              </span>
            </h1>

            <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
              Experience a new way of connecting with people worldwide. Share
              moments, build relationships, and create lasting memories
              together.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
              <a
                href="/register"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 transition-all duration-300"
              >
                Get Started Free
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#demo"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#E2FF3F] px-8 py-4 text-base font-semibold text-gray-900 hover:bg-[#d4f129] transition-all duration-300"
              >
                <PlayCircleIcon className="w-5 h-5" />
                Watch Demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
