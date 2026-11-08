import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { AnalyticsService } from '@/services/contentService'

export const usePageTracking = () => {
  const location = useLocation()
  const lastPath = useRef<string>('')

  useEffect(() => {
    const fullPath = location.pathname + location.search
    if (fullPath !== lastPath.current) {
      lastPath.current = fullPath
      AnalyticsService.trackPageView(fullPath)
    }
  }, [location.pathname, location.search])
}
