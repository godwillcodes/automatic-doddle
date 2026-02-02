'use client'

import { useState, ReactNode, Children, isValidElement } from 'react'
import { motion } from 'framer-motion'

interface TabProps {
  label: string
  children: ReactNode
}

interface TabsProps {
  children: ReactNode
  defaultTab?: number
}

export function Tab({ children }: TabProps) {
  return <>{children}</>
}

export function Tabs({ children, defaultTab = 0 }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  // Extract tab labels and content from children
  const tabs = Children.toArray(children).filter(
    (child): child is React.ReactElement<TabProps> =>
      isValidElement(child) && (child.type as { displayName?: string }).displayName === 'Tab'
  )

  return (
    <div className="my-8 rounded-xl border border-black/10 overflow-hidden bg-white">
      {/* Tab headers */}
      <div className="flex border-b border-black/5 bg-black/[0.02] overflow-x-auto">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`relative px-5 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === index
                ? 'text-black'
                : 'text-black/40 hover:text-black/60'
            }`}
          >
            {tab.props.label}
            {activeTab === index && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="p-5 [&>pre]:my-0 [&>pre]:border-0 [&>pre]:shadow-none [&>div]:my-0"
      >
        {tabs[activeTab]}
      </motion.div>
    </div>
  )
}

Tab.displayName = 'Tab'
