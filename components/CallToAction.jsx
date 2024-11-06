import { ArrowDownIcon } from "@heroicons/react/24/outline";

export default function CallToAction() {
  return (
    <div className="relative isolate overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Ready to make new friends?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
            Join millions of people who are already connecting and making
            meaningful relationships on Pipel
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/download"
              className="rounded-full bg-[#E2FF3F] px-8 py-4 text-base font-semibold text-gray-900 shadow-sm hover:bg-[#d4f129] transition-all duration-300 flex items-center gap-2"
            >
              Download Now
              <ArrowDownIcon className="h-5 w-5" />
            </a>
            <a
              href="/learn-more"
              className="rounded-full bg-white px-8 py-4 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-gray-900/10 hover:ring-gray-900/20 transition-all duration-300"
            >
              Learn more
            </a>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div
        className="absolute -top-24 right-0 -z-10 transform-gpu blur-3xl"
        aria-hidden="true"
      >
        <div
          className="aspect-[1404/767] w-[87.75rem] bg-gradient-to-r from-[#E2FF3F] to-[#d4f129] opacity-25"
          style={{
            clipPath:
              "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
          }}
        />
      </div>
    </div>
  );
}
