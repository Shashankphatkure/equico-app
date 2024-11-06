export default function TrustedBy() {
  const partners = [
    {
      name: "TechCrunch",
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/b9/TechCrunch_logo.svg",
    },
    {
      name: "ProductHunt",
      logo: "https://upload.wikimedia.org/wikipedia/commons/8/82/Product_Hunt_Logo.svg",
    },
    {
      name: "Forbes",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Forbes_logo.svg",
    },
    {
      name: "TechRadar",
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/TechRadar.svg",
    },
    {
      name: "Wired",
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Wired_logo.svg",
    },
  ];

  return (
    <div className="relative z-10 -mt-20 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <p className="text-center text-sm font-medium text-gray-500 mb-8">
            Featured in
          </p>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-5 items-center justify-items-center">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="col-span-1 flex justify-center group"
              >
                <img
                  className="h-8 w-auto opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                  src={partner.logo}
                  alt={partner.name}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
