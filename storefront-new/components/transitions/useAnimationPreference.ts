'use client'

import { useReducedMotion } from 'framer-motion';

export function useAnimationPreference() {
  const prefersReducedMotion = useReducedMotion();
  
  return {
    shouldAnimate: !prefersReducedMotion,
    duration: prefersReducedMotion ? 0 : 0.3,
    delay: prefersReducedMotion ? 0 : 0.1,
  };
}