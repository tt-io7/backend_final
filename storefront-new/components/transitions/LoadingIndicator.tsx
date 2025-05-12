'use client'

import { motion } from 'framer-motion';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoadingIndicator() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleStart = () => {
      setIsLoading(true);
    };
    
    const handleComplete = () => {
      // Add a small delay to ensure the animation is visible
      timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 300);
    };
    
    // In Next.js App Router, we need to watch for pathname and searchParams changes
    // This is a simplified approach - in a production app, you might want to use
    // a more robust solution or a custom hook
    
    handleStart();
    handleComplete();
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [pathname, searchParams]);
  
  if (!isLoading) return null;
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200">
      <motion.div
        className="h-full bg-[var(--primary)]"
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}