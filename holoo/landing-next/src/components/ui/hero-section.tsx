"use client";

import { cn } from "@/lib/utils";
import {
  Announcement,
  AnnouncementTag,
  AnnouncementTitle,
} from "@/components/ui/announcement";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpRightIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

interface HeroSectionProps {
  title: React.ReactNode;
  description: string;
  className?: string;
}

export function HeroSection({
  title,
  description,
  className,
}: HeroSectionProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async () => {
    setError("");
    
    if (!email) {
      setError("Please enter your email");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      toast.success(data.message || "Thanks for signing up! We'll be in touch soon.");
      setEmail("");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <section className={cn("py-12 sm:py-16 flex items-start justify-center", className)}>
      <div className="container max-w-4xl mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Announcement>
              <AnnouncementTitle>
                Sign up to be a beta tester!
                <ArrowUpRightIcon size={16} className="shrink-0 text-[#929292]" />
              </AnnouncementTitle>
            </Announcement>
          </motion.div>
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl max-w-3xl">
              {title}
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              {description}
            </p>
          </motion.div>
          <motion.div 
            className="w-full max-w-xl relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          >
            <div className="relative">
              <Input
                type="email"
                placeholder="Enter your email"
                className={cn(
                  "h-12 text-base pr-48",
                  error && "border-red-500 focus-visible:ring-red-500"
                )}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
              <Button 
                className="absolute right-1 top-1 h-10 px-4 bg-gradient-to-r from-[#0052FE] to-[#3B82F6] text-white hover:from-[#0052FE]/90 hover:to-[#3B82F6]/90 border border-white/10 text-sm whitespace-nowrap"
                onClick={handleSubmit}
              >
                Signup for free beta
              </Button>
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-2 text-left">{error}</p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
} 