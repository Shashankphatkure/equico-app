import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function FAQ() {
  const faqs = [
    {
      question: "How do I get started?",
      answer:
        "Getting started is easy! Download the app, create your profile, and start connecting with new friends who share your interests.",
    },
    {
      question: "Is it free to use?",
      answer:
        "Yes, Pipel is completely free to use! We offer premium features for enhanced experiences, but the core functionality is free for everyone.",
    },
    {
      question: "How does matching work?",
      answer:
        "Our smart algorithm matches you with people based on shared interests, location preferences, and compatibility factors.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Absolutely! We use state-of-the-art encryption and security measures to protect your personal information and conversations.",
    },
    {
      question: "Can I meet people from other countries?",
      answer:
        "Yes! Pipel connects you with people worldwide. You can set your preferences to match with people from specific regions or globally.",
    },
  ];

  return (
    <div className="relative overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[#E2FF3F]/5"></div>

      <div className="relative mx-auto max-w-4xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Common Questions
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Everything you need to know about Pipel
          </p>
        </div>

        <dl className="mt-16 space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 hover:shadow-md transition-all duration-300"
            >
              <dt>
                <div className="flex items-center justify-between text-gray-900">
                  <span className="text-lg font-semibold">{faq.question}</span>
                  <span className="ml-6 flex h-7 w-7 items-center justify-center rounded-full bg-[#E2FF3F] group-hover:bg-[#d4f129] transition-colors">
                    <ChevronDownIcon className="h-5 w-5" />
                  </span>
                </div>
              </dt>
              <dd className="mt-4 text-base leading-7 text-gray-600">
                {faq.answer}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
