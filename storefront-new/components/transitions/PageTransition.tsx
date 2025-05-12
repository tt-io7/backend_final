'use client'

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { fadeIn, slideUp, slideFromRight, scale } from './variants';

interface PageTransitionProps {
  children: ReactNode;
  variant?: 'fade' | 'slide-up' | 'slide-right' | 'scale';
}

export default function PageTransition({ 
  children, 
  variant = 'fade' 
}: PageTransitionProps) {
  const pathname = usePathname();
  
  // Select the appropriate variant
  const getVariant = () => {
    switch (variant) {
      case 'slide-up':
        return slideUp;
      case 'slide-right':
        return slideFromRight;
      case 'scale':
        return scale;
      case 'fade':
      default:
        return fadeIn;
    }
  };
  
  const selectedVariant = getVariant();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={selectedVariant.initial}
        animate={selectedVariant.animate}
        exit={selectedVariant.exit}
        transition={selectedVariant.transition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}