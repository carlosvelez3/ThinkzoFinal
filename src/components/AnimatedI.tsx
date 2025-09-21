import React from 'react';
import { motion } from 'framer-motion';

export function AnimatedI() {
  return (
    <motion.span
      className="inline-block text-primary-accent"
      animate={{
        scale: [1, 1.1, 1],
        textShadow: [
          "0 0 0px rgba(224, 58, 138, 0)",
          "0 0 20px rgba(224, 58, 138, 0.8)",
          "0 0 0px rgba(224, 58, 138, 0)"
        ]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      i
    </motion.span>
  );
}