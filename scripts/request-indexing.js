// Script to help with Google indexing requests
// Run this after your site is live and verified in Google Search Console

const keyPages = [
  'https://godwillbarasa.com/',
  'https://godwillbarasa.com/about',
  'https://godwillbarasa.com/articles',
  'https://godwillbarasa.com/projects',
  'https://godwillbarasa.com/speaking',
  'https://godwillbarasa.com/uses',
  // Add your most important articles
  'https://godwillbarasa.com/articles/web-accessibility-wcag-compliance-inclusive-design',
  'https://godwillbarasa.com/articles/ruby-rails-best-practices-modern-web-development',
  'https://godwillbarasa.com/articles/impact-driven-prioritization-faster-smarter-product-decisions',
  'https://godwillbarasa.com/articles/building-retaining-high-performing-engineering-teams'
]

console.log('🔍 Pages to request indexing for:')
console.log('Copy these URLs and use Google Search Console "URL Inspection" tool:')
console.log('')

keyPages.forEach((url, index) => {
  console.log(`${index + 1}. ${url}`)
})

console.log('')
console.log('📋 Instructions:')
console.log('1. Go to Google Search Console')
console.log('2. Use the "URL Inspection" tool')
console.log('3. Enter each URL above')
console.log('4. Click "Request Indexing" for each page')
console.log('5. Wait 24-48 hours for indexing')
