'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, Pause, Play, Square, ChevronDown, ChevronUp } from 'lucide-react'

interface ReadArticleProps {
  title: string
  content: string
}

export default function ReadArticle({ title, content }: ReadArticleProps) {
  const [isSupported, setIsSupported] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [rate, setRate] = useState(1.0)
  const [showControls, setShowControls] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const textRef = useRef<string>('')
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Check if speech synthesis is supported
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true)
    }

    // Cleanup on unmount
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [])

  // Extract text from HTML content
  const extractText = (htmlContent: string): string => {
    if (typeof window === 'undefined') return ''
    const div = document.createElement('div')
    div.innerHTML = htmlContent
    return div.textContent || div.innerText || ''
  }

  const startProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }

    progressIntervalRef.current = setInterval(() => {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        // Estimate progress based on time (this is approximate)
        const estimatedDuration = textRef.current.length / (rate * 15) // roughly 15 chars per second at rate 1.0
        const elapsed = (Date.now() - startTimeRef.current) / 1000
        const currentProgress = Math.min((elapsed / estimatedDuration) * 100, 99)
        setProgress(currentProgress)
      }
    }, 100)
  }

  const startTimeRef = useRef<number>(0)

  const handlePlay = () => {
    if (!isSupported) return

    const textToRead = `${title}. ${extractText(content)}`
    textRef.current = textToRead

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(textToRead)
    utterance.rate = rate
    utterance.pitch = 1
    utterance.volume = 1

    // Get available voices and prefer English voices
    const voices = window.speechSynthesis.getVoices()
    const englishVoice = voices.find(voice => 
      voice.lang.startsWith('en-') && voice.name.includes('Google')
    ) || voices.find(voice => 
      voice.lang.startsWith('en-')
    )
    
    if (englishVoice) {
      utterance.voice = englishVoice
    }

    utterance.onstart = () => {
      setIsPlaying(true)
      setIsPaused(false)
      startTimeRef.current = Date.now()
      startProgressTracking()
    }

    utterance.onend = () => {
      setIsPlaying(false)
      setIsPaused(false)
      setProgress(100)
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
      setTimeout(() => setProgress(0), 1000)
    }

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event)
      setIsPlaying(false)
      setIsPaused(false)
      setProgress(0)
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }

  const handlePause = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause()
      setIsPaused(true)
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }

  const handleResume = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
      setIsPaused(false)
      startProgressTracking()
    }
  }

  const handleStop = () => {
    window.speechSynthesis.cancel()
    setIsPlaying(false)
    setIsPaused(false)
    setProgress(0)
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }
  }

  const handleRateChange = (newRate: number) => {
    setRate(newRate)
    
    // If currently playing, restart with new rate
    if (isPlaying) {
      const wasPlaying = !isPaused
      handleStop()
      
      setTimeout(() => {
        if (wasPlaying) {
          handlePlay()
        }
      }, 100)
    }
  }

  if (!isSupported) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative mb-12"
    >
      <div className="border border-black/10 rounded-2xl bg-white overflow-hidden">
        {/* Main Control Bar */}
        <div className="p-6">
          <div className="flex items-center gap-4">
            {/* Icon */}
            <motion.div
              className="flex-shrink-0 w-12 h-12 rounded-full bg-black/5 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Volume2 size={20} className="text-black/70" strokeWidth={2} />
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-black mb-1">
                Listen to article
              </h3>
              <p className="text-xs text-black/40 font-light">
                {isPlaying ? (isPaused ? 'Paused' : 'Playing...') : 'Text-to-speech available'}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {!isPlaying ? (
                <motion.button
                  onClick={handlePlay}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-black text-white text-sm font-medium hover:bg-black/90 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Play size={16} strokeWidth={2} fill="white" />
                  <span>Play</span>
                </motion.button>
              ) : (
                <>
                  {isPaused ? (
                    <motion.button
                      onClick={handleResume}
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Play size={16} strokeWidth={2} fill="currentColor" />
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={handlePause}
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Pause size={16} strokeWidth={2} />
                    </motion.button>
                  )}
                  <motion.button
                    onClick={handleStop}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Square size={16} strokeWidth={2} />
                  </motion.button>
                </>
              )}

              {/* Settings Toggle */}
              <motion.button
                onClick={() => setShowControls(!showControls)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {showControls ? (
                  <ChevronUp size={16} strokeWidth={2} />
                ) : (
                  <ChevronDown size={16} strokeWidth={2} />
                )}
              </motion.button>
            </div>
          </div>

          {/* Progress Bar */}
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <div className="w-full h-1 bg-black/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-black"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="mt-2 text-xs text-black/40 text-right">
                {Math.round(progress)}% complete
              </div>
            </motion.div>
          )}
        </div>

        {/* Advanced Controls */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="border-t border-black/5 overflow-hidden"
            >
              <div className="p-6 pt-5">
                <div className="space-y-4">
                  {/* Speed Control */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs font-medium text-black/60">
                        Playback Speed
                      </label>
                      <span className="text-xs font-semibold text-black">
                        {rate.toFixed(1)}x
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={rate}
                      onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                      className="w-full h-1 bg-black/5 rounded-lg appearance-none cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:w-4
                        [&::-webkit-slider-thumb]:h-4
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-black
                        [&::-webkit-slider-thumb]:cursor-pointer
                        [&::-webkit-slider-thumb]:hover:scale-110
                        [&::-webkit-slider-thumb]:transition-transform
                        [&::-moz-range-thumb]:w-4
                        [&::-moz-range-thumb]:h-4
                        [&::-moz-range-thumb]:rounded-full
                        [&::-moz-range-thumb]:bg-black
                        [&::-moz-range-thumb]:border-0
                        [&::-moz-range-thumb]:cursor-pointer
                        [&::-moz-range-thumb]:hover:scale-110
                        [&::-moz-range-thumb]:transition-transform"
                    />
                    <div className="flex justify-between mt-2">
                      <button
                        onClick={() => handleRateChange(0.5)}
                        className="text-xs text-black/40 hover:text-black/70 transition-colors"
                      >
                        0.5x
                      </button>
                      <button
                        onClick={() => handleRateChange(1.0)}
                        className="text-xs text-black/40 hover:text-black/70 transition-colors"
                      >
                        1.0x
                      </button>
                      <button
                        onClick={() => handleRateChange(1.5)}
                        className="text-xs text-black/40 hover:text-black/70 transition-colors"
                      >
                        1.5x
                      </button>
                      <button
                        onClick={() => handleRateChange(2.0)}
                        className="text-xs text-black/40 hover:text-black/70 transition-colors"
                      >
                        2.0x
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="pt-3 border-t border-black/5">
                    <p className="text-xs text-black/40 leading-relaxed">
                      This feature uses your browser&apos;s built-in text-to-speech engine. 
                      Voice quality may vary depending on your device and browser.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
