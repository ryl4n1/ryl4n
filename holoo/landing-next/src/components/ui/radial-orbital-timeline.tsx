"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

export default function RadialOrbitalTimeline({
  timelineData,
}: RadialOrbitalTimelineProps) {
  const [viewMode, setViewMode] = useState<"orbital">("orbital");
  const [rotationAngle, setRotationAngle] = useState<number>(90);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [centerOffset, setCenterOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setAutoRotate(true);
    }
  };

  useEffect(() => {
    let rotationTimer: NodeJS.Timeout;

    if (autoRotate && viewMode === "orbital") {
      rotationTimer = setInterval(() => {
        setRotationAngle((prev) => {
          const newAngle = (prev + 0.3) % 360;
          return Number(newAngle.toFixed(3));
        });
      }, 50);
    }

    return () => {
      if (rotationTimer) {
        clearInterval(rotationTimer);
      }
    };
  }, [autoRotate, viewMode]);

  const calculateNodePosition = (index: number, total: number) => {
    // Start from the right side (90 degrees) and distribute evenly
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 240;
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian) + centerOffset.x;
    const y = radius * Math.sin(radian) + centerOffset.y;

    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(
      0.4,
      Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2))
    );

    return { x, y, angle, zIndex, opacity };
  };

  const getStatusStyles = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completed":
        return "text-white bg-black border-white";
      case "in-progress":
        return "text-black bg-white border-black";
      case "pending":
        return "text-white bg-black/40 border-white/50";
      default:
        return "text-white bg-black/40 border-white/50";
    }
  };

  return (
    <div
      className="w-full h-[300px] flex flex-col items-center justify-center overflow-hidden"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="relative w-full max-w-2xl h-full flex items-center justify-center">
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{
            perspective: "1000px",
            transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,
          }}
        >
          <div className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 animate-pulse flex items-center justify-center z-10">
            <div className="absolute w-12 h-12 rounded-full border border-gray-300/40 animate-ping opacity-70"></div>
            <div
              className="absolute w-16 h-16 rounded-full border border-gray-300/30 animate-ping opacity-50"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div className="w-4 h-4 rounded-full bg-white/90 backdrop-blur-md"></div>
          </div>

          <div className="absolute w-56 h-56 rounded-full border border-gray-300/50"></div>

          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const Icon = item.icon;

            const nodeStyle = {
              transform: `translate(${position.x * 0.5}px, ${position.y * 0.5}px)`,
              zIndex: position.zIndex,
              opacity: position.opacity,
            };

            return (
              <div
                key={item.id}
                ref={(el) => {
                  nodeRefs.current[item.id] = el;
                }}
                className="absolute transition-all duration-700"
                style={nodeStyle}
              >
                <div
                  className="absolute rounded-full -inset-1"
                  style={{
                    background: `radial-gradient(circle, rgba(156,163,175,0.1) 0%, rgba(156,163,175,0) 70%)`,
                    width: `${item.energy * 0.3 + 24}px`,
                    height: `${item.energy * 0.3 + 24}px`,
                    left: `-${(item.energy * 0.3 + 24 - 24) / 2}px`,
                    top: `-${(item.energy * 0.3 + 24 - 24) / 2}px`,
                  }}
                ></div>

                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center bg-white text-gray-600 border-2 border-gray-200"
                >
                  <Icon size={12} />
                </div>

                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap text-[10px] font-semibold tracking-wider text-gray-500"
                >
                  {item.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
