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
            [0.7, 1]
          );

          return (
            <motion.span
              key={index}
              style={{ opacity }}
              className="inline-block will-change-transform"
            >
              {word}{index < words.length - 1 ? ' ' : ''}
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

        return (
          <motion.div
            key={index}
            style={{ opacity }}
            className="will-change-transform"
          >
            {line}
          </motion.div>
        );
      })}
    </div>
  );
}