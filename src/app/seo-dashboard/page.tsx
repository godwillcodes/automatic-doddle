'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/Card'

export default function SEODashboard() {
  const [seoScore, setSeoScore] = useState(0)
  const [coreWebVitals, setCoreWebVitals] = useState({
    lcp: 0,
    fid: 0,
    cls: 0
  })

  useEffect(() => {
    // Simulate SEO score calculation
    const calculateSEOScore = () => {
      let score = 0
      
      // Check for essential SEO elements
      if (document.querySelector('meta[name="description"]')) score += 20
      if (document.querySelector('meta[property="og:title"]')) score += 15
      if (document.querySelector('meta[property="og:description"]')) score += 15
      if (document.querySelector('link[rel="canonical"]')) score += 10
      if (document.querySelector('meta[name="robots"]')) score += 10
      if (document.querySelector('script[type="application/ld+json"]')) score += 15
      if (document.querySelector('link[rel="manifest"]')) score += 10
      if (document.querySelector('meta[name="theme-color"]')) score += 5
      
      setSeoScore(score)
    }

    calculateSEOScore()
  }, [])

  const seoRecommendations = [
    {
      title: 'Add Schema Markup',
      description: 'Implement structured data for better search understanding',
      priority: 'High',
      status: 'completed'
    },
    {
      title: 'Optimize Images',
      description: 'Use WebP/AVIF formats and proper alt text',
      priority: 'High',
      status: 'completed'
    },
    {
      title: 'Improve Core Web Vitals',
      description: 'Optimize LCP, FID, and CLS scores',
      priority: 'High',
      status: 'in-progress'
    },
    {
      title: 'Add Internal Linking',
      description: 'Create related articles and cross-linking',
      priority: 'Medium',
      status: 'completed'
    },
    {
      title: 'Content Optimization',
      description: 'Add more long-form content and keywords',
      priority: 'Medium',
      status: 'pending'
    }
  ]

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">SEO Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <Card.Title>SEO Score</Card.Title>
          <div className="text-3xl font-bold text-green-600">{seoScore}/100</div>
          <Card.Description>Overall SEO optimization score</Card.Description>
        </Card>

        <Card>
          <Card.Title>Core Web Vitals</Card.Title>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>LCP:</span>
              <span className="text-green-600">Good</span>
            </div>
            <div className="flex justify-between">
              <span>FID:</span>
              <span className="text-green-600">Good</span>
            </div>
            <div className="flex justify-between">
              <span>CLS:</span>
              <span className="text-green-600">Good</span>
            </div>
          </div>
        </Card>

        <Card>
          <Card.Title>PWA Score</Card.Title>
          <div className="text-3xl font-bold text-green-600">95/100</div>
          <Card.Description>Progressive Web App optimization</Card.Description>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <Card.Title>SEO Recommendations</Card.Title>
          <div className="space-y-4">
            {seoRecommendations.map((rec, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                <div>
                  <h3 className="font-medium">{rec.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{rec.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded ${
                    rec.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {rec.priority}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded ${
                    rec.status === 'completed' ? 'bg-green-100 text-green-800' : 
                    rec.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {rec.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <Card.Title>Quick Actions</Card.Title>
          <div className="space-y-3">
            <button className="w-full p-3 text-left bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
              <div className="font-medium">Test with Google PageSpeed</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Check Core Web Vitals</div>
            </button>
            <button className="w-full p-3 text-left bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
              <div className="font-medium">Submit to Google Search Console</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Monitor search performance</div>
            </button>
            <button className="w-full p-3 text-left bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
              <div className="font-medium">Check Mobile Usability</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Test mobile experience</div>
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}
