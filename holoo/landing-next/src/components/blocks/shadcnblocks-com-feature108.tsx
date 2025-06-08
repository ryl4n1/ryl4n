import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Layout, Pointer, Zap, Users, Tag, UserPlus, Gift, Heart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DisplayCards from "@/components/ui/display-cards";
import { TiltedScroll } from "@/components/ui/tilted-scroll";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

interface TabContent {
  badge: string;
  title: string;
  description: string;
  buttonText?: string;
  imageContent: React.ReactNode;
  imageAlt: string;
}

interface Tab {
  value: string;
  icon: React.ReactNode;
  label: string;
  content: TabContent;
}

interface Feature108Props {
  badge?: string;
  heading?: string;
  description?: string;
  tabs?: Tab[];
}

const Feature108 = ({
  badge = "shadcnblocks.com",
  heading = "A Collection of Components Built With Shadcn & Tailwind",
  description = "Join us to build flawless web solutions.",
  tabs = [
    {
      value: "tab-1",
      icon: <Layout className="h-auto w-4 shrink-0" />,
      label: "Trend Signals",
      content: {
        badge: "Day 1 Feature",
        title: "Turn real-world signals into commerce decisions",
        description:
          "Holo detects cultural, media, and real-world signals related to your brand that will impact buying behavior so you can act before the spike.",
        imageContent: <DisplayCards cards={[
          {
            className: "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0 [&>p]:whitespace-normal [&>p]:text-sm",
            title: "News",
            description: "Your competitor's driver was named best value by Golf Digest",
            date: "Suggested: Increase inventory by 30%",
          },
          {
            className: "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0 [&>p]:whitespace-normal [&>p]:text-sm",
            title: "Real-World Events",
            description: "Pro player's unexpected win sparks surge in interest for blade-style putters",
            date: "Suggestion: Increase inventory by 30%",
          },
          {
            className: "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10 [&>p]:whitespace-normal [&>p]:text-sm",
            title: "Social Media",
            description: "Comments on latest Instagram post suggests high demand for upcoming putter drop",
            date: "Suggested: Increase product stock by 30%",
          },
        ]} />,
        imageAlt: "Trend Signals Display",
      },
    },
    {
      value: "tab-2",
      icon: <Pointer className="h-auto w-4 shrink-0" />,
      label: "Product Journey",
      content: {
        badge: "Day 1 Feature",
        title: "Map customer movement across your SKUs",
        description:
          "Holo tracks how customers flow through your products, what they buy next, where they stall, and what builds loyalty.",
        imageContent: <TiltedScroll />,
        imageAlt: "Product Journey Display",
      },
    },
    {
      value: "tab-3",
      icon: <Zap className="h-auto w-4 shrink-0" />,
      label: "Customer Archetypes",
      content: {
        badge: "Day 1 Feature",
        title: "Turn customer behavior into actionable segments",
        description:
          "From discount hunters to diehard fans, Holo analyzes how each segment of your customers behave and how to act on it.",
        imageContent: <RadialOrbitalTimeline timelineData={[
          {
            id: 1,
            title: "Diehard Fans",
            date: "2024",
            content: "These are the most passionate customers who are deeply invested in the brand and its community. They actively participate in discussions, share content, and are often early adopters of new features.",
            category: "Customer Type",
            icon: Users,
            relatedIds: [2, 3],
            status: "completed",
            energy: 95
          },
          {
            id: 2,
            title: "Discount Hunters",
            date: "2024",
            content: "Price-sensitive customers who primarily engage with the platform during sales and promotions. They're valuable for volume but may have lower brand loyalty.",
            category: "Customer Type",
            icon: Tag,
            relatedIds: [1, 3],
            status: "in-progress",
            energy: 75
          },
          {
            id: 3,
            title: "New Customers",
            date: "2024",
            content: "Recent additions to the customer base who are still exploring the platform. They represent growth potential and need guidance to become more engaged.",
            category: "Customer Type",
            icon: UserPlus,
            relatedIds: [1, 2],
            status: "pending",
            energy: 60
          },
          {
            id: 4,
            title: "Gifters",
            date: "2024",
            content: "Customers who primarily use the platform to purchase gifts for others. They value convenience, gift wrapping options, and personalized recommendations.",
            category: "Customer Type",
            icon: Gift,
            relatedIds: [1, 3],
            status: "in-progress",
            energy: 80
          },
          {
            id: 5,
            title: "Explorers",
            date: "2024",
            content: "Long-term customers who consistently engage with the platform and have high lifetime value. They appreciate loyalty rewards and exclusive benefits.",
            category: "Customer Type",
            icon: Heart,
            relatedIds: [1, 4],
            status: "completed",
            energy: 90
          }
        ]} />,
        imageAlt: "Customer Archetypes Display",
      },
    },
  ],
}: Feature108Props) => {
  return (
    <section className="py-32">
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="max-w-2xl text-3xl font-semibold md:text-4xl">
            {heading}
          </h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <Tabs defaultValue={tabs[0].value} className="mt-8">
          <TabsList className="container mx-auto flex flex-col items-center justify-center gap-4 sm:flex-row md:gap-10 max-w-3xl">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-primary"
              >
                {tab.icon} {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="mx-auto mt-8 max-w-screen-xl rounded-2xl bg-gray-50 p-6 lg:p-16">
            {tabs.map((tab) => (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="grid place-items-center gap-20 lg:grid-cols-2 lg:gap-10"
              >
                <div className="flex flex-col gap-5">
                  <Badge variant="outline" className="w-fit bg-background">
                    {tab.content.badge}
                  </Badge>
                  <h3 className="text-3xl font-semibold lg:text-5xl">
                    {tab.content.title}
                  </h3>
                  <p className="text-muted-foreground lg:text-lg">
                    {tab.content.description}
                  </p>
                  {tab.content.buttonText && (
                    <Button className="mt-2.5 w-fit gap-2" size="lg">
                      {tab.content.buttonText}
                    </Button>
                  )}
                </div>
                {tab.content.imageContent}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export { Feature108 };
