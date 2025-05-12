'use client'

import PageTransition from '../components/transitions/PageTransition';
import { getTransitionForRoute } from '../components/transitions/routeTransitions';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname() || '';
  const [mounted, setMounted] = useState(false);
  const transitionVariant = getTransitionForRoute(pathname);

  // Only enable transitions after initial mount to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR and initial render, return children without transitions
  if (!mounted) {
    return <>{children}</>;
  }

  // After hydration is complete, use transitions
  return (
    <PageTransition variant={transitionVariant}>
      {children}
    </PageTransition>
  );
}