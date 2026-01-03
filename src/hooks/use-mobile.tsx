import * as React from "react"

const MOBILE_BREAKPOINT = 950

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < MOBILE_BREAKPOINT
    }
    return false
  })

  React.useEffect(() => {
    let lastWidth = window.innerWidth
    let wasPortrait = window.innerHeight > window.innerWidth

    const checkAndUpdate = () => {
      const currentWidth = window.innerWidth
      const isPortrait = window.innerHeight > window.innerWidth
      const orientationChanged = wasPortrait !== isPortrait
      const widthChanged = Math.abs(currentWidth - lastWidth) > 5

      // Only update if width changed significantly OR orientation changed
      if (widthChanged || orientationChanged) {
        lastWidth = currentWidth
        wasPortrait = isPortrait
        setIsMobile(currentWidth < MOBILE_BREAKPOINT)
      }
    }

    window.addEventListener('resize', checkAndUpdate)
    window.addEventListener('orientationchange', checkAndUpdate)
    
    return () => {
      window.removeEventListener('resize', checkAndUpdate)
      window.removeEventListener('orientationchange', checkAndUpdate)
    }
  }, [])

  return isMobile
}
