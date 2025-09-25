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
  containerClassName = '',
  direction = 'up'
}: ParallaxTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'up' ? [100 * speed, -100 * speed] : [-100 * speed, 100 * speed]
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
  src, 
  alt, 
  speed = 0.3,
  className = ''
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50 * speed, -50 * speed]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y, scale }}
        className="w-full h-full object-cover will-change-transform"
        loading="lazy"
      />
    </div>
  );
}