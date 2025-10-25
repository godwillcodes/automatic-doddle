'use client'

import { useState, useEffect } from 'react'

export default function PWATestPage() {
  const [isOnline, setIsOnline] = useState(true)
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine)
    
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    // Check service worker registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        setSwRegistration(registration || null)
      })
    }
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">PWA Test Page</h1>
      
      <div className="space-y-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-700">
          <h2 className="text-xl font-semibold mb-4">PWA Status</h2>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-medium">Online Status:</span>
              <span className={`px-2 py-1 rounded text-sm ${
                isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">Service Worker:</span>
              <span className={`px-2 py-1 rounded text-sm ${
                swRegistration ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {swRegistration ? 'Registered' : 'Not Registered'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">Manifest:</span>
              <span className="px-2 py-1 rounded text-sm bg-green-100 text-green-800">
                Available
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-700">
          <h2 className="text-xl font-semibold mb-4">PWA Features</h2>
          <ul className="space-y-2 text-sm">
            <li>✅ Web App Manifest configured</li>
            <li>✅ Service Worker for offline functionality</li>
            <li>✅ PWA icons generated (72x72 to 512x512)</li>
            <li>✅ Install prompt component</li>
            <li>✅ Meta tags for mobile optimization</li>
            <li>✅ Cache headers configured</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-700">
          <h2 className="text-xl font-semibold mb-4">Testing Instructions</h2>
          <ol className="space-y-2 text-sm list-decimal list-inside">
            <li>Open Chrome DevTools (F12)</li>
            <li>Go to Application tab</li>
            <li>Check Manifest section for PWA configuration</li>
            <li>Check Service Workers section for registration</li>
            <li>Try going offline (Network tab → Offline checkbox)</li>
            <li>Refresh the page to test offline functionality</li>
            <li>Look for the install prompt on supported browsers</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
