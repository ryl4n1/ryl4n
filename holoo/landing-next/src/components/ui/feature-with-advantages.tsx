"use client";

import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function Feature() {
  return (
    <div className="w-full py-2 lg:py-4 mt-[100px]">
      <div className="container mx-auto">
        <div className="flex gap-2 py-2 lg:py-4 flex-col items-center text-center">
          <div>
            <Badge>Features</Badge>
          </div>
          <div className="flex gap-2 flex-col items-center">
            <h2 className="text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular">
              Something new!
            </h2>
            <p className="text-lg max-w-xl lg:max-w-xl leading-relaxed tracking-tight text-muted-foreground">
              Managing a small business today is already tough.
            </p>
          </div>
          <div className="flex gap-6 pt-8 flex-col w-full">
            <div className="grid grid-cols-2 items-center lg:grid-cols-3 gap-8">
              <div className="flex flex-col gap-2 items-center text-center">
                <Check className="w-4 h-4 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>Easy to use</p>
                  <p className="text-muted-foreground text-sm">
                    We&apos;ve made it easy to use and understand.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-center text-center">
                <Check className="w-4 h-4 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>Fast and reliable</p>
                  <p className="text-muted-foreground text-sm">
                    We&apos;ve made it fast and reliable.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-center text-center">
                <Check className="w-4 h-4 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>Beautiful and modern</p>
                  <p className="text-muted-foreground text-sm">
                    We&apos;ve made it beautiful and modern.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-center text-center">
                <Check className="w-4 h-4 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>Easy to use</p>
                  <p className="text-muted-foreground text-sm">
                    We&apos;ve made it easy to use and understand.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-center text-center">
                <Check className="w-4 h-4 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>Fast and reliable</p>
                  <p className="text-muted-foreground text-sm">
                    We&apos;ve made it fast and reliable.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-center text-center">
                <Check className="w-4 h-4 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>Beautiful and modern</p>
                  <p className="text-muted-foreground text-sm">
                    We&apos;ve made it beautiful and modern.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Feature };
