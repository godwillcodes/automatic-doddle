# Blog Setup Documentation

This document explains the MDX blog implementation with SEO-friendly routing.

## 🎯 What Changed

### 1. **MDX Blog System**
- Replaced TypeScript array-based blog content with MDX files
- Blog posts now live in `content/blog/` directory
- Each post is a standalone `.mdx` file with frontmatter metadata

### 2. **SEO-Friendly URLs**
- **Before:** `/blog/1`, `/blog/2`, `/blog/3`
- **After:** `/blog/building-high-performance-pipelines`, `/blog/performance-profiling`, `/blog/design-systems`

### 3. **Enhanced SEO**
- Added comprehensive metadata to all pages
- Implemented JSON-LD structured data for blog posts
- Added OpenGraph and Twitter Card support
- Proper canonical URLs and keywords

### 4. **New Components**
- `BlogList.tsx` - Displays list of blog posts
- `BlogPostLayout.tsx` - Layout wrapper for individual blog posts
- `Footer.tsx` - Site-wide footer with navigation and social links

### 5. **Updated Pages**
- **Skills page** (`/skills`) - Now a dedicated page with full content
- **Contact page** (`/contact`) - Now a dedicated page with contact form
- **Home page** - Shows Hero + 3 most recent blog posts
- **Blog page** (`/blog`) - Shows all blog posts

## 📁 Project Structure

```
automatic-doddle/
├── content/
│   └── blog/
│       ├── building-high-performance-pipelines.mdx
│       ├── performance-profiling.mdx
│       └── design-systems.mdx
├── lib/
│   └── mdx.ts                    # MDX utility functions
├── components/
│   ├── BlogList.tsx              # Blog listing component
│   ├── BlogPostLayout.tsx        # Blog post layout
│   ├── Footer.tsx                # Site footer
│   ├── Hero.tsx
│   ├── Skills.tsx
│   ├── Contact.tsx
│   └── Header.tsx
├── app/
│   ├── layout.tsx                # Root layout with SEO metadata
│   ├── page.tsx                  # Home page
│   ├── blog/
│   │   ├── page.tsx              # Blog listing page
│   │   └── [slug]/
│   │       ├── page.tsx          # Individual blog post
│   │       └── not-found.tsx     # 404 page for missing posts
│   ├── skills/
│   │   └── page.tsx              # Skills page
│   └── contact/
│       └── page.tsx              # Contact page
```

## 📝 Creating New Blog Posts

1. Create a new `.mdx` file in `content/blog/`:

```mdx
---
title: "Your Blog Post Title"
excerpt: "A brief description of your post"
date: "2024-01-20"
readTime: "5 min read"
category: "Category Name"
author: "Godwill Barasa"
slug: "your-post-slug"
image: "/blog/your-image.jpg"
keywords: ["keyword1", "keyword2", "keyword3"]
---

Your blog post content goes here. You can use:

## Headings

Regular paragraphs with **bold** and *italic* text.

- Bullet points
- More items

```javascript
// Code blocks with syntax highlighting
const example = "code";
```

And much more!
```

2. The post will automatically appear on:
   - Home page (if it's one of the 3 most recent)
   - Blog listing page (`/blog`)
   - Individual post page (`/blog/your-post-slug`)

## 🔧 Key Features

### MDX Support
- Write in Markdown with React component support
- Syntax highlighting for code blocks (via `rehype-pretty-code`)
- GitHub Flavored Markdown support (via `remark-gfm`)

### SEO Optimization
- Automatic sitemap generation (Next.js built-in)
- Meta tags for social media sharing
- JSON-LD structured data for search engines
- Semantic HTML structure
- Proper heading hierarchy

### Performance
- Static generation for all blog posts
- Optimized images with Next.js Image component
- Code splitting and lazy loading
- Fast page loads

## 🚀 Development

```bash
# Install dependencies (already done)
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📊 SEO Best Practices Implemented

1. **Metadata**
   - Unique title and description for each page
   - Keywords relevant to content
   - Author information

2. **Structured Data**
   - JSON-LD for blog posts
   - Article schema with author, date, and keywords

3. **Social Sharing**
   - OpenGraph tags for Facebook/LinkedIn
   - Twitter Card tags
   - Proper image dimensions

4. **URLs**
   - Clean, descriptive slugs
   - Canonical URLs to prevent duplicate content
   - Proper 404 handling

5. **Content**
   - Semantic HTML (article, section, header tags)
   - Proper heading hierarchy (h1 → h2 → h3)
   - Alt text for images

## 🎨 Design System

The blog maintains the existing minimalist design:
- Clean typography with DM Sans font
- Subtle animations with Framer Motion
- Consistent spacing and layout
- Responsive design for all screen sizes
- Accessible color contrast

## 📦 Dependencies Added

- `next-mdx-remote` - MDX rendering
- `gray-matter` - Frontmatter parsing
- `remark-gfm` - GitHub Flavored Markdown
- `rehype-pretty-code` - Syntax highlighting
- `shiki` - Code highlighting themes

## 🔗 Navigation Structure

```
Home (/)
├── Hero Section
└── Recent Blog Posts (3 most recent)

Blog (/blog)
└── All Blog Posts

Skills (/skills)
└── Skills & Capabilities

Contact (/contact)
└── Contact Form

About (/about)
└── About Page (existing)
```

## 🌐 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SITE_URL=https://godwill.codes
```

## 📱 Footer Links

Update the social links in `components/Footer.tsx`:
- GitHub
- LinkedIn
- Twitter
- Email

## ✅ Checklist for Going Live

- [ ] Update social media links in Footer.tsx
- [ ] Add actual images for blog posts (optional)
- [ ] Set NEXT_PUBLIC_SITE_URL in production
- [ ] Test all blog post links
- [ ] Verify SEO metadata with tools like:
  - Google Rich Results Test
  - Twitter Card Validator
  - Facebook Sharing Debugger
- [ ] Submit sitemap to Google Search Console
- [ ] Set up analytics (GA4, etc.)

## 🎯 Next Steps

1. **Add More Blog Posts** - Create more `.mdx` files
2. **Add Blog Images** - Place images in `public/blog/`
3. **Set up Newsletter** - Add email capture
4. **Add Comments** - Integrate Giscus or similar
5. **Add Search** - Implement blog search functionality
6. **Add Tags** - Create tag-based filtering

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [MDX Documentation](https://mdxjs.com/)
- [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)
- [Schema.org](https://schema.org/) - Structured data reference
