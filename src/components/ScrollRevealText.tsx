import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollRevealTextProps {
  children: string;
  className?: string;
  staggerDelay?: number;
}

export function ScrollRevealText({ 
  children, 
  className = '',
  staggerDelay = 0.05
}: ScrollRevealTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "start 0.2"]
  });

  // Split text into words
  const words = children.split(' ');

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className="flex flex-wrap">
        {words.map((word, index) => {
          const start = index / words.length;
          const end = start + (1 / words.length);
          
          const opacity = useTransform(
            scrollYProgress,
            [start, end],
            [0.3, 1]
          );
          
          const y = useTransform(
            scrollYProgress,
            [start, end],
            [20, 0]
          );

          return (
            <motion.span
              key={index}
              style={{ opacity, y }}
              className="inline-block mr-2 will-change-transform"
            >
              {word}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}

interface ScrollRevealLinesProps {
  lines: string[];
  className?: string;
  lineDelay?: number;
}

export function ScrollRevealLines({ 
  lines, 
  className = '',
  lineDelay = 0.1
}: ScrollRevealLinesProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.1"]
  });

  return (
    <div ref={ref} className={`relative ${className}`}>
      {lines.map((line, index) => {
        const start = index / lines.length;
        const end = start + (1 / lines.length);
        
        const opacity = useTransform(
          scrollYProgress,
          [start, end],
          [0, 1]
        );
        
        const x = useTransform(
          scrollYProgress,
          [start, end],
          [-50, 0]
        );

        return (
          <motion.div
            key={index}
            style={{ opacity, x }}
            className="will-change-transform"
          >
            {line}
          </motion.div>
        );
      })}
    </div>
  );
}