"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRightIcon } from "lucide-react";

interface AnnouncementProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Announcement({ children, className, ...props }: AnnouncementProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-[#E4E4E4] bg-[#F4F4F4] px-4 py-1.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface AnnouncementTagProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AnnouncementTag({ children, className, ...props }: AnnouncementTagProps) {
  return (
    <div
      className={cn(
        "text-xs font-medium text-[#929292]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface AnnouncementTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AnnouncementTitle({ children, className, ...props }: AnnouncementTitleProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 text-sm font-medium text-[#929292]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
} 