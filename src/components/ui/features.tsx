"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface FeaturesProps {
  features: {
    id: number;
    icon: React.ElementType;
    title: string;
    description: string;
  }[];
}

export function Features({ features }: FeaturesProps) {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [progress, setProgress] = useState(0);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 1));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => {
        setCurrentFeature((prev) => (prev + 1) % features.length);
        setProgress(0);
      }, 200);
    }
  }, [progress, features.length]);

  useEffect(() => {
    const activeFeatureElement = featureRefs.current[currentFeature];
    const container = containerRef.current;
    if (activeFeatureElement && container) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = activeFeatureElement.getBoundingClientRect();
      container.scrollTo({
        left: activeFeatureElement.offsetLeft - (containerRect.width - elementRect.width) / 2,
        behavior: "smooth",
      });
    }
  }, [currentFeature]);

  return (
    <div
      ref={containerRef}
      className="lg:space-y-8 md:space-x-6 lg:space-x-0 overflow-x-auto no-scrollbar lg:overflow-visible flex lg:flex-col flex-row pb-4 lg:pb-0 scroll-smooth"
    >
      {features.map((feature, index) => {
        const Icon = feature.icon;
        const isActive = currentFeature === index;

        return (
          <div
            key={feature.id}
            ref={(el) => { featureRefs.current[index] = el; }}
            className="relative cursor-pointer flex-shrink-0"
            onClick={() => { setCurrentFeature(index); setProgress(0); }}
          >
            <div
              className={`
                flex lg:flex-row flex-col items-start space-x-4 p-3 max-w-sm md:max-w-sm lg:max-w-2xl transition-all duration-300
                ${isActive
                  ? "bg-white md:shadow-xl rounded-xl md:border border-border"
                  : ""}
              `}
            >
              {/* Icon */}
              <div
                className={`
                  p-3 hidden md:block rounded-full transition-all duration-300
                  ${isActive ? "bg-dark text-primary" : "bg-light-bg text-muted"}
                `}
              >
                <Icon size={24} />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3
                  className={`
                    text-lg md:mt-4 lg:mt-0 font-semibold mb-2 transition-colors duration-300
                    ${isActive ? "text-dark" : "text-body"}
                  `}
                >
                  {feature.title}
                </h3>
                <p
                  className={`
                    transition-colors duration-300 text-sm
                    ${isActive ? "text-muted" : "text-muted/60"}
                  `}
                >
                  {feature.description}
                </p>
                <div className="mt-4 bg-light-bg rounded-sm h-1 overflow-hidden">
                  {isActive && (
                    <motion.div
                      className="h-full bg-primary rounded-sm"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.1, ease: "linear" }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
