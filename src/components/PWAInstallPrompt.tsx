'use client'

import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }
    
    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
  }

  if (!showInstallPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Install App
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Add this app to your home screen for quick access
          </p>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={handleDismiss}
            className="px-3 py-1 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Dismiss
          </button>
          <button
            onClick={handleInstallClick}
            className="px-3 py-1 text-sm bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded hover:bg-zinc-800 dark:hover:bg-zinc-200"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  )
}
