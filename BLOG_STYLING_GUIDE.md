# Blog Styling Guide

This guide shows all the enhanced styling features available in your blog posts.

## Text Formatting

### Headings
```markdown
# H1 Heading (4xl - 5xl)
## H2 Heading (3xl - 4xl)
### H3 Heading (2xl - 3xl)
#### H4 Heading (xl - 2xl)
```

### Text Styles
```markdown
**Bold text** - Semibold, black color
*Italic text* - Italic, black/80 opacity
`Inline code` - Monospace, light background, rounded
```

### Links
```markdown
[Link text](https://example.com)
```
- Black text with underline
- Hover effect with darker underline
- Smooth transitions

## Lists

### Unordered Lists
```markdown
▸ First item
▸ Second item
  ▸ Nested item
  ▸ Another nested item
▸ Third item
```

**Features:**
- Custom arrow markers (▸)
- Proper spacing between items (0.75rem)
- Support for nested lists
- Large, readable text (lg - xl)

### Ordered Lists
```markdown
1. First step
2. Second step
   1. Sub-step A
   2. Sub-step B
3. Third step
```

**Features:**
- Numbered list items
- Same spacing as unordered lists
- Nested numbering support

## Code Blocks

### Inline Code
```markdown
Use `const variable = value` for inline code
```

**Styling:**
- Light gray background
- Rounded corners
- Padding for readability
- Monospace font

### Code Blocks
````markdown
```javascript
async function compressImage(buffer) {
  return await sharp(buffer)
    .webp({ quality: 90 })
    .toBuffer();
}
```
````

**Styling:**
- Syntax highlighting
- Light background with border
- Rounded corners (12px)
- Horizontal scrolling for long lines
- Proper padding
- Shadow effect

## Images

### Basic Image
```markdown
![Alt text](/path/to/image.jpg)
```

**Styling:**
- Rounded corners (12px)
- Shadow effect
- Hover animation (lift effect)
- Full width, auto height
- Responsive

### GIFs
```markdown
![Animation](/path/to/animation.gif)
```

**Additional Features:**
- Border for emphasis
- Same hover effects as images

### Image with Caption
```markdown
![Description](/path/to/image.jpg)
*Caption text appears here*
```

or using HTML:

```html
<figure>
  <img src="/path/to/image.jpg" alt="Description" />
  <figcaption>Your caption text here</figcaption>
</figure>
```

**Caption Styling:**
- Centered text
- Small font size
- Italic style
- Muted color (black/50)
- Margin top for spacing

## Videos

### HTML5 Video
```html
<video controls>
  <source src="/path/to/video.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
```

**Styling:**
- Rounded corners (12px)
- Shadow effect
- Full width responsive
- Vertical margins

### Video with Caption
```html
<figure>
  <video controls>
    <source src="/path/to/video.mp4" type="video/mp4">
  </video>
  <figcaption>Video demonstration of the feature</figcaption>
</figure>
```

## Embedded Videos (YouTube, Vimeo, etc.)

### Responsive 16:9 Container
```html
<div class="video-container">
  <iframe src="https://www.youtube.com/embed/VIDEO_ID" 
          frameborder="0" 
          allowfullscreen>
  </iframe>
</div>
```

or

```html
<div class="embed-container">
  <iframe src="https://player.vimeo.com/video/VIDEO_ID" 
          frameborder="0" 
          allowfullscreen>
  </iframe>
</div>
```

**Features:**
- Maintains 16:9 aspect ratio
- Fully responsive
- Rounded corners
- Shadow effect

## Blockquotes

```markdown
> This is a blockquote
> It can span multiple lines
```

**Styling:**
- Left border (4px, black/20)
- Italic text
- Muted color
- Padding left
- Light font weight

## Tables

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

**Styling:**
- Full width
- Headers: bold, left-aligned
- Border under headers
- Borders between rows
- Proper padding in cells

## Horizontal Rules

```markdown
---
```

**Styling:**
- Light gray color (black/10)
- Large vertical margins (3rem)

## Complete Example

Here's a complete blog post example using all features:

```markdown
---
title: "My Blog Post"
excerpt: "A comprehensive example"
date: "2024-01-20"
---

# Introduction

This is a **bold statement** with some *italic emphasis* and `inline code`.

## Main Content

Here's a list of features:

▸ Feature one with details
▸ Feature two with more info
  ▸ Nested feature A
  ▸ Nested feature B
▸ Feature three

### Code Example

```javascript
const example = async () => {
  return await process();
};
```

### Visual Content

![Hero image](/blog/hero.jpg)
*This is the caption for the hero image*

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/VIDEO_ID" 
          frameborder="0" 
          allowfullscreen>
  </iframe>
</div>

> "This is an important quote that adds credibility to the article."

## Conclusion

For more information, check out [this link](https://example.com).
```

## Best Practices

1. **Images**: Always include alt text for accessibility
2. **Captions**: Use captions to provide context
3. **Lists**: Keep items concise and parallel in structure
4. **Code blocks**: Specify language for syntax highlighting
5. **Videos**: Provide fallback text for accessibility
6. **Headings**: Use proper hierarchy (don't skip levels)

## Spacing Guidelines

- **Paragraphs**: 1.5rem between paragraphs
- **Headings**: 
  - H2: 4rem top, 1.5rem bottom
  - H3: 3rem top, 1.25rem bottom
  - H4: 2rem top, 1rem bottom
- **Lists**: 2rem vertical margins, 0.75rem between items
- **Code blocks**: 2rem vertical margins
- **Images/Videos**: 2.5rem - 3rem vertical margins
- **Figures**: 3rem vertical margins

## Color Palette

- **Text**: `black/80` (80% opacity)
- **Headings**: `black` (100% opacity)
- **Links**: `black` with `black/30` underline
- **Code background**: `black/6` (6% opacity)
- **Borders**: `black/10` (10% opacity)
- **Captions**: `black/50` (50% opacity)
- **List markers**: `black/50` (50% opacity)

## Responsive Design

All elements are fully responsive:
- Font sizes scale with viewport (lg -> xl on larger screens)
- Images are full width with auto height
- Videos maintain aspect ratio
- Tables scroll horizontally on mobile
- Proper padding on all screen sizes
