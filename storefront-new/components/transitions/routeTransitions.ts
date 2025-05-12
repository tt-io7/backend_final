type RouteTransitionMap = {
  [key: string]: 'fade' | 'slide-up' | 'slide-right' | 'scale';
};

export const routeTransitions: RouteTransitionMap = {
  '/': 'fade',
  '/categories': 'slide-right',
  '/products': 'scale',
  '/cart': 'slide-up',
  '/login': 'fade',
  '/register': 'fade',
  '/deals': 'scale',
};

export function getTransitionForRoute(pathname: string): 'fade' | 'slide-up' | 'slide-right' | 'scale' {
  // Check for exact matches
  if (routeTransitions[pathname]) {
    return routeTransitions[pathname];
  }
  
  // Check for partial matches (for nested routes)
  for (const route in routeTransitions) {
    if (pathname.startsWith(route) && route !== '/') {
      return routeTransitions[route];
    }
  }
  
  // Default transition
  return 'fade';
}