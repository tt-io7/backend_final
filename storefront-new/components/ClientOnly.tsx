'use client'

import { useEffect, useState, ReactNode } from 'react'

export default function ClientOnly({ children }: { children: ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  // During SSR, render a placeholder with the same structure
  // This prevents layout shifts and blank screens
  if (!hasMounted) {
    return (
      <div className="opacity-0" aria-hidden="true">
        {children}
      </div>
    )
  }

  // Once the component has mounted on the client, render children normally
  return <>{children}</>
}
