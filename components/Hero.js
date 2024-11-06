export default function Hero() {
  return (
    <div className="relative bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
          <h1 className="mt-10 max-w-lg text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Connect with the equestrian community
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Join Eqvico - Your all-in-one platform for horse management, social
            networking, and equestrian marketplace.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <a
              href="/register"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Get started
            </a>
            <a
              href="/about"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0">
          <img
            className="rounded-xl shadow-xl ring-1 ring-gray-400/10"
            src="/hero-image.jpg"
            alt="Equestrian community"
          />
        </div>
      </div>
    </div>
  );
}
