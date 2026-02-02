'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Info, AlertTriangle, CheckCircle, XCircle, Lightbulb, Zap } from 'lucide-react'

type CalloutType = 'info' | 'warning' | 'success' | 'error' | 'tip' | 'note'

interface CalloutProps {
  type?: CalloutType
  title?: string
  children: ReactNode
}

const calloutConfig: Record<CalloutType, { 
  icon: typeof Info
  bgColor: string
  borderColor: string
  iconColor: string
  titleColor: string
}> = {
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-500',
    titleColor: 'text-blue-900',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    iconColor: 'text-amber-500',
    titleColor: 'text-amber-900',
  },
  success: {
    icon: CheckCircle,
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    iconColor: 'text-emerald-500',
    titleColor: 'text-emerald-900',
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconColor: 'text-red-500',
    titleColor: 'text-red-900',
  },
  tip: {
    icon: Lightbulb,
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    iconColor: 'text-purple-500',
    titleColor: 'text-purple-900',
  },
  note: {
    icon: Zap,
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    iconColor: 'text-gray-500',
    titleColor: 'text-gray-900',
  },
}

export default function Callout({ type = 'info', title, children }: CalloutProps) {
  const config = calloutConfig[type]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`my-8 rounded-xl border ${config.borderColor} ${config.bgColor} overflow-hidden`}
    >
      <div className="p-5">
        <div className="flex gap-4">
          <div className={`flex-shrink-0 ${config.iconColor}`}>
            <Icon size={22} strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className={`font-semibold ${config.titleColor} mb-2 text-base`}>
                {title}
              </h4>
            )}
            <div className="text-black/70 text-base leading-relaxed [&>p]:m-0 [&>p:not(:last-child)]:mb-3 [&>ul]:my-2 [&>ol]:my-2">
              {children}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
