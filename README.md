# Godwill Barasa - Portfolio Website

A modern, SEO-optimized Progressive Web App (PWA) portfolio website built with Next.js, TypeScript, and Tailwind CSS.

## Live Demo

**Website**: [https://godwillbarasa.netlify.app/](https://godwillbarasa.netlify.app/)

## Features

### Progressive Web App (PWA)
- Offline functionality with service worker
- Installable on mobile and desktop devices
- App shortcuts for quick navigation
- Push notifications ready
- Responsive design optimized for all devices

### SEO Optimized
- Structured data (Schema.org markup)
- Open Graph and Twitter Card meta tags
- XML sitemap with image optimization
- Robots.txt configuration
- Core Web Vitals optimized
- Google Search Console ready

### Modern Web Technologies
- Next.js 13 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- MDX for rich content
- Dark/Light mode support
- Accessibility (WCAG 2.1 compliant)

## Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-13.4.16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.1.6-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.3-38B2AC?style=flat-square&logo=tailwind-css)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=flat-square&logo=netlify)

**Framework**: Next.js 13.4.16  
**Language**: TypeScript  
**Styling**: Tailwind CSS  
**Content**: MDX with rehype-prism  
**Deployment**: Netlify  
**Analytics**: Google Analytics (optional)  
**SEO**: Google Search Console

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── articles/          # Blog articles (MDX)
│   ├── projects/          # Projects showcase
│   ├── speaking/          # Speaking engagements
│   ├── uses/              # Tools and tech stack
│   ├── layout.tsx         # Root layout with PWA features
│   └── page.tsx           # Homepage
├── components/            # Reusable components
│   ├── ArticleLayout.tsx  # Article layout
│   ├── PWAInstallPrompt.tsx # PWA install prompt
│   └── Analytics.tsx     # Analytics integration
├── lib/                   # Utility functions
│   ├── articles.ts       # Article management
│   ├── metadata.ts       # SEO metadata
│   └── structured-data.ts # Schema.org markup
└── styles/               # Global styles
    ├── tailwind.css      # Tailwind CSS
    └── prism.css         # Code syntax highlighting
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your configuration:
   ```bash
   NEXT_PUBLIC_SITE_URL=https://godwillbarasa.netlify.app
   GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX  # Optional
   GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXX  # Optional
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## Content Management

### Adding New Articles
1. Create a new MDX file in `src/app/articles/[slug]/page.mdx`
2. Add the article metadata:
   ```javascript
   export const article = {
     author: 'Godwill Barasa',
     date: '2024-12-20',
     title: 'Your Article Title',
     description: 'Article description for SEO',
   }
   ```

### Updating Projects
Edit the projects data in `src/app/projects/page.tsx`

### Managing Speaking Engagements
Update speaking data in `src/app/speaking/page.tsx`

## SEO Features

### Structured Data
- Person schema for author information
- Article schema for blog posts
- Website schema for site information
- Breadcrumb schema for navigation

### Performance Optimization
- Image optimization with Next.js Image component
- Code splitting for faster loading
- Service worker for offline functionality
- Caching strategies for static assets

### PWA Features
- Web App Manifest for app installation
- Service Worker for offline functionality
- App shortcuts for quick access
- Install prompts for better UX

## Deployment

### Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Deploy!

### Environment Variables for Production
```bash
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXX
```

## Analytics & Monitoring

### Google Search Console
1. Add your site to Google Search Console
2. Verify ownership with the provided meta tag
3. Submit your sitemap: `/sitemap.xml`
4. Monitor search performance

### Built-in SEO Dashboard
Visit `/seo-dashboard` to monitor:
- SEO score and recommendations
- Core Web Vitals status
- PWA optimization score
- Performance metrics

## Customization

### Styling
- Modify `tailwind.config.ts` for theme customization
- Update colors in `src/styles/tailwind.css`
- Customize components in `src/components/`

### Content
- Update personal information in `src/app/layout.tsx`
- Modify social links in `src/components/SocialIcons.tsx`
- Add new sections by creating new pages

## PWA Testing

### Desktop
1. Open Chrome DevTools (F12)
2. Go to Application tab
3. Check Manifest and Service Workers sections
4. Test offline functionality

### Mobile
1. Open the site on mobile
2. Look for "Add to Home Screen" prompt
3. Test app shortcuts
4. Verify offline functionality

## SEO Testing

### Google PageSpeed Insights
Test your site: [PageSpeed Insights](https://pagespeed.web.dev/)

### Mobile-Friendly Test
Check mobile optimization: [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

### Rich Results Test
Test structured data: [Rich Results Test](https://search.google.com/test/rich-results)

## Performance Metrics

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **Core Web Vitals**: All metrics in "Good" range
- **PWA Score**: 95+ (Installable, PWA Optimized)
- **SEO Score**: 90+ (Meta tags, structured data, sitemap)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Author

**Godwill Barasa**
- Website: [https://godwillbarasa.netlify.app](https://godwillbarasa.netlify.app)
- Twitter: [@godwill_codes](https://twitter.com/godwill_codes)
- LinkedIn: [godwillcodes](https://linkedin.com/in/godwillcodes)
- GitHub: [godwillcodes](https://github.com/godwillcodes)

---

**Star this repository if you found it helpful!**