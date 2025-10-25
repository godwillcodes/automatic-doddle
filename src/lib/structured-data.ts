export function generatePersonStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Godwill Barasa",
    "url": "https://godwillbarasa.com",
    "image": "https://godwillbarasa.com/images/portrait.jpg",
    "description": "Senior Frontend Engineer with 5+ years experience building fast, accessible, and human-centered web experiences. Expert in React, Vue.js, TypeScript, and Ruby on Rails.",
    "jobTitle": "Senior Frontend Engineer",
    "worksFor": {
      "@type": "Organization",
      "name": "Piedmont Global Language Solutions"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Nairobi",
      "addressCountry": "Kenya"
    },
    "sameAs": [
      "https://twitter.com/godwill_codes",
      "https://www.linkedin.com/in/godwillcodes/",
      "https://github.com/godwillcodes",
      "https://www.instagram.com/godwill.codes"
    ],
    "knowsAbout": [
      "Frontend Development",
      "React",
      "Vue.js",
      "TypeScript",
      "Ruby on Rails",
      "Accessibility",
      "WCAG 2.1",
      "Core Web Vitals",
      "Full Stack Development",
      "JavaScript",
      "Node.js",
      "Docker",
      "Kubernetes"
    ],
    "alumniOf": "University of Nairobi",
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Senior Frontend Engineer",
      "description": "Building scalable web applications and leading technical teams"
    }
  }
}

export function generateArticleStructuredData(article: {
  title: string
  description: string
  date: string
  slug: string
  author: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "image": "https://godwillbarasa.com/images/portrait.jpg",
    "author": {
      "@type": "Person",
      "name": article.author,
      "url": "https://godwillbarasa.com"
    },
    "publisher": {
      "@type": "Person",
      "name": "Godwill Barasa",
      "url": "https://godwillbarasa.com"
    },
    "datePublished": article.date,
    "dateModified": article.date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://godwillbarasa.com/articles/${article.slug}`
    },
    "url": `https://godwillbarasa.com/articles/${article.slug}`,
    "articleSection": "Technology",
    "keywords": [
      "software engineering",
      "web development",
      "technical leadership",
      "product management"
    ]
  }
}

export function generateWebsiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Godwill Barasa - Senior Frontend Engineer",
    "url": "https://godwillbarasa.com",
    "description": "Senior Frontend Engineer passionate about building fast, accessible, and human-centered web experiences.",
    "author": {
      "@type": "Person",
      "name": "Godwill Barasa"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://godwillbarasa.com/articles?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }
}

export function generateBreadcrumbStructuredData(items: Array<{name: string, url: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://godwillbarasa.com${item.url}`
    }))
  }
}
