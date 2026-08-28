'use client'

import { useEffect, useRef, useState } from 'react'

import { useClientFeature } from '@/lib/use-client-feature'

interface ReadArticleProps {
  title: string
  /**
   * Plain prose, already stripped of markup by the server — the speech engine
   * reads sentences, never markdown syntax or code blocks.
   */
  text: string
}

/** Compact text-to-speech row using the browser's built-in engine. */
export default function ReadArticle({ title, text }: ReadArticleProps) {
  const isSupported = useClientFeature(() => 'speechSynthesis' in window)
  const [state, setState] = useState<'idle' | 'playing' | 'paused'>('idle')
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  if (!isSupported) return null

  const play = () => {
    const utterance = new SpeechSynthesisUtterance(`${title}. ${text}`)
    const voices = window.speechSynthesis.getVoices()
    const english =
      voices.find((v) => v.lang.startsWith('en-') && v.name.includes('Google')) ??
      voices.find((v) => v.lang.startsWith('en-'))
    if (english) utterance.voice = english
    utterance.onend = () => setState('idle')
    utterance.onerror = () => setState('idle')
    utteranceRef.current = utterance
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
    setState('playing')
  }

  const pause = () => {
    window.speechSynthesis.pause()
    setState('paused')
  }

  const resume = () => {
    window.speechSynthesis.resume()
    setState('playing')
  }

  const stop = () => {
    window.speechSynthesis.cancel()
    setState('idle')
  }

  return (
    <div className="rule-t rule-b mb-10 flex flex-wrap items-baseline justify-between gap-3 py-4">
      <p className="meta">
        Listen — {state === 'playing' ? 'playing' : state === 'paused' ? 'paused' : 'text-to-speech'}
      </p>
      <div className="flex gap-5">
        {state === 'idle' ? (
          <button type="button" onClick={play} className="meta meta-ink hover:text-accent-lo">
            Play ▸
          </button>
        ) : (
          <>
            {state === 'playing' ? (
              <button type="button" onClick={pause} className="meta meta-ink hover:text-accent-lo">
                Pause
              </button>
            ) : (
              <button type="button" onClick={resume} className="meta meta-ink hover:text-accent-lo">
                Resume ▸
              </button>
            )}
            <button type="button" onClick={stop} className="meta hover:text-accent-lo">
              Stop
            </button>
          </>
        )}
      </div>
    </div>
  )
}
