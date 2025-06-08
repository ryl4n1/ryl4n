import { cn } from "@/lib/utils"

interface TiltedScrollItem {
  id: string;
  text: string;
}

interface TiltedScrollProps {
  items?: TiltedScrollItem[];
  className?: string;
}

export function TiltedScroll({ 
  items = defaultItems,
  className 
}: TiltedScrollProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="relative overflow-hidden [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent,black_5rem),linear-gradient(to_left,transparent,black_5rem),linear-gradient(to_bottom,transparent,black_5rem),linear-gradient(to_top,transparent,black_5rem)]">
        <div className="grid h-[400px] w-[250px] gap-4 animate-skew-scroll grid-cols-1">
          {[...items, ...items].map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="group flex items-start gap-2 cursor-pointer rounded-md border border-border/40 bg-gradient-to-b from-background/80 to-muted/80 p-4 pt-3 shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-xl dark:border-border h-full"
            >
              <AlertCircleIcon className="h-4 w-4 mt-1 stroke-foreground/40 transition-colors group-hover:stroke-foreground" />
              <div className="flex flex-col justify-between h-full">
                <p className="text-[10px] text-foreground/80 transition-colors group-hover:text-foreground">
                  {item.text.split('\n')[0]}
                </p>
                <div className="flex flex-col gap-1 mt-auto">
                  <p className="text-[10px] text-foreground/60 transition-colors group-hover:text-foreground/80 font-light">
                    {item.text.split('\n')[1]}
                  </p>
                  <p className="text-[10px] text-blue-500 underline cursor-pointer hover:text-blue-600 mt-auto">
                    View Suggestion
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AlertCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

const defaultItems: TiltedScrollItem[] = [
  { id: "1", text: "New customers who buy a stand bag are likely to purchase irons next.\n715 customers bought a stand bag in the last 30d" },
  { id: "2", text: "Glove buyers often return for balls or shoes within 10 days.\n122 customers bought gloves in the last 30d" },
  { id: "3", text: "First-time customers who buy apparel show higher brand loyalty.\n385 first-time buyers bought apparel in the last 30d" },
  { id: "4", text: "Customers who only buy a putter are more likely to churn.\n192 first-time buyers bought a putter in the last 30d" },
  { id: "5", text: "The Bag → Irons → Apparel path leads to highest LTV.\n94 customers completed this journey in the last 30d with a 300% higher LTV than average." }
]