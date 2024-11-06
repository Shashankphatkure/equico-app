"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckIcon,
  SparklesIcon,
  ChartBarIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    name: "Verified Shop Status",
    description: "Get a verified badge to build trust with buyers",
    icon: ShieldCheckIcon,
  },
  {
    name: "Boosted Listings",
    description: "Your listings appear at the top of search results",
    icon: RocketLaunchIcon,
  },
  {
    name: "Advanced Analytics",
    description: "Get detailed insights about your shop performance",
    icon: ChartBarIcon,
  },
  {
    name: "Priority Support",
    description: "24/7 priority customer support",
    icon: SparklesIcon,
  },
];

const plans = [
  {
    name: "Monthly",
    price: 29.99,
    interval: "month",
    description: "Perfect for getting started",
  },
  {
    name: "Annual",
    price: 299.99,
    interval: "year",
    description: "Best value - save 17%",
    featured: true,
  },
];

export default function UpgradeShop() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState(plans[1]);
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      // Here you would integrate with your payment provider (e.g., Stripe)
      const response = await fetch("/api/marketplace/shop/upgrade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: selectedPlan.name.toLowerCase(),
        }),
      });

      if (response.ok) {
        router.push("/dashboard/marketplace/shop?upgraded=true");
      }
    } catch (error) {
      console.error("Error upgrading shop:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Upgrade Your Shop
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          Take your tack shop to the next level with premium features
        </p>
      </div>

      {/* Features */}
      <div className="mt-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.name} className="relative">
              <div className="absolute flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 text-white">
                <feature.icon className="h-8 w-8" aria-hidden="true" />
              </div>
              <div className="ml-16">
                <h3 className="text-lg font-medium text-gray-900">
                  {feature.name}
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="mt-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              onClick={() => setSelectedPlan(plan)}
              className={`relative rounded-2xl p-8 shadow-sm flex flex-col cursor-pointer ${
                plan === selectedPlan
                  ? "bg-indigo-600 text-white ring-2 ring-indigo-600"
                  : "bg-white text-gray-900 hover:bg-gray-50"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 right-8 inline-flex items-center rounded-full bg-indigo-100 px-4 py-1 text-xs font-medium text-indigo-600">
                  Popular
                </div>
              )}
              <div className="flex items-center justify-between">
                <h3
                  className={`text-lg font-semibold ${
                    plan === selectedPlan ? "text-white" : "text-gray-900"
                  }`}
                >
                  {plan.name}
                </h3>
                {plan === selectedPlan && (
                  <CheckIcon className="h-5 w-5 text-white" />
                )}
              </div>
              <p
                className={`mt-4 text-sm ${
                  plan === selectedPlan ? "text-indigo-100" : "text-gray-500"
                }`}
              >
                {plan.description}
              </p>
              <div className="mt-6">
                <p className="flex items-baseline">
                  <span
                    className={`text-4xl font-bold tracking-tight ${
                      plan === selectedPlan ? "text-white" : "text-gray-900"
                    }`}
                  >
                    ${plan.price}
                  </span>
                  <span
                    className={`ml-1 text-sm ${
                      plan === selectedPlan
                        ? "text-indigo-100"
                        : "text-gray-500"
                    }`}
                  >
                    /{plan.interval}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading
            ? "Processing..."
            : `Upgrade Now - $${selectedPlan.price}/${selectedPlan.interval}`}
        </button>
      </div>

      {/* Money Back Guarantee */}
      <p className="mt-4 text-center text-sm text-gray-500">
        30-day money-back guarantee • Cancel anytime
      </p>
    </div>
  );
}
