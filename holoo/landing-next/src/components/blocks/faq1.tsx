import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqItem {
  question: string;
  answer: string;
}

interface Faq1Props {
  heading?: string;
  items?: FaqItem[];
}

const Faq1 = ({
  heading = "Frequently asked questions",
  items = [
    {
      question: "What is a FAQ?",
      answer:
        "A FAQ is a list of frequently asked questions and answers on a particular topic.",
    },
    {
      question: "What is the purpose of a FAQ?",
      answer:
        "The purpose of a FAQ is to provide answers to common questions and help users find the information they need quickly and easily.",
    },
    {
      question: "How do I create a FAQ?",
      answer:
        "To create a FAQ, you need to compile a list of common questions and answers on a particular topic and organize them in a clear and easy-to-navigate format.",
    },
    {
      question: "What are the benefits of a FAQ?",
      answer:
        "The benefits of a FAQ include providing quick and easy access to information, reducing the number of support requests, and improving the overall user experience.",
    },
  ],
}: Faq1Props) => {
  return (
    <section className="py-32">
      <div className="container mx-auto max-w-3xl">
        <h1 className="mb-4 text-3xl font-semibold md:mb-11 md:text-5xl">
          {heading}
        </h1>
        <div className="space-y-4">
          {items.map((item, index) => (
            <Accordion key={index} type="single" collapsible className="border rounded-lg">
              <AccordionItem value={`item-${index}`} className="border-none">
                <AccordionTrigger className="px-4 py-3 hover:text-foreground/60 hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-3 text-muted-foreground">
                  <div className="min-h-[1.5rem]">
                    {item.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Faq1 };
