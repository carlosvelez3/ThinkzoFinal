import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxTextProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  containerClassName?: string;
  direction?: 'up' | 'down';
}

export function ParallaxText({
  children,
  speed = 0.5,
  className = '',
  containerClassName = ''
}: ParallaxTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [50 * speed, -50 * speed]
  );

  return (
    <div ref={ref} className={`relative h-full ${className}`}>
      <motion.div
        style={{ y }}
        className={`will-change-transform h-full ${containerClassName}`}
      >
        {children}
      </motion.div>
    </div>
  );
}

interface ParallaxImageProps {
  src: string;
  alt: string;
  speed?: number;
  className?: string;
}

export function ParallaxImage({
  speed = 0.3
}: Omit<ParallaxImageProps, 'src' | 'alt' | 'className'>) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  useTransform(scrollYProgress, [0, 1], [50 * speed, -50 * speed]);

  return null;
}