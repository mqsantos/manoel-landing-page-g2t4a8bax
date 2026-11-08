/* Layout Component - A component that wraps the main content of the app
   - Use this file to add a header, footer, or other elements that should be present on every page
   - This component is used in the App.tsx file to wrap the main content of the app */

import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { usePageTracking } from '@/hooks/use-page-tracking'

export default function Layout() {
  usePageTracking()

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground antialiased selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
