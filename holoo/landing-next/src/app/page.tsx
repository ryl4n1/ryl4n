"use client";

import Preloader from "@/components/ui/preloader";
import { HeroSection } from "@/components/ui/hero-section";
import { Feature108 } from "@/components/blocks/shadcnblocks-com-feature108";
import { Faq1 } from "@/components/blocks/faq1";
import { useEffect, useState } from "react";
import { GradientText } from "@/components/ui/gradient-text";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between pt-20">
      <section id="top">
        <HeroSection
          title={
            <>
              Predictive intelligence for eCom, live in{" "}
              <GradientText gradient="from-red-500 via-blue-500 to-green-500">minutes</GradientText>
            </>
          }
          description="Holo brings predictive analytics and actionable insights to e-commerce companies of all sizes."
        />
      </section>
      <section id="features">
        <Feature108 
          heading="Plug In. See the future." 
          description="Predictive modules built to drive results, reduce friction, and eliminate the guesswork along the way."
        />
      </section>
      <section id="faq">
        <Faq1 
          heading="Frequently Asked Questions"
          items={[
            {
              question: "How is this different from what Shopify or my analytics tool already provides?",
              answer: "Shopify and traditional analytics tools show you what happened in the past, Holo predicts what will happen next. We analyze patterns across your customer behavior, market trends, and external signals to provide actionable predictions that help you stay ahead of demand and make proactive business decisions."
            },
            {
              question: "Do I need a developer or data team to use Holo?",
              answer: "Holo is designed to be set up and used by anyone in minutes, regardless of technical expertise."
            },
            {
              question: "Can Holo work with both online and physical store data?",
              answer: "During the beta phase, Holo is only compatible with online stores. In the near future, there will be support for physical stores."
            },
            {
              question: "Will this slow down my store or impact performance?",
              answer: "Holo processes all data analysis in the background, so your customers' shopping experience remains fast and seamless."
            },
            {
              question: "Which storefront providers does Holo support?",
              answer: "For the beta phase, Holo is compatible with Shopify, WooCommerce, and BigCommerce, and BigCommerce storefronts. More support will be added in the future"
            }
          ]}
        />
      </section>
    </main>
  );
}
