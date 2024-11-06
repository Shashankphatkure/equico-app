import Hero from "@/components/Hero";
import Features from "@/components/Features";

import Testimonials from "@/components/Testimonials";
import HowItWorks from "@/components/HowItWorks";
import Stats from "@/components/Stats";
import TrustedBy from "@/components/TrustedBy";
import FAQ from "@/components/FAQ";
import CallToAction from "@/components/CallToAction";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <HowItWorks />
      <Stats />
      <Testimonials />
      <FAQ />
      <CallToAction />
    </main>
  );
}
