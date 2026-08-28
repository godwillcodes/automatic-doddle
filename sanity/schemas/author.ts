import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'jobTitle',
      title: 'Job title',
      type: 'string',
      description: 'Feeds the Person structured data.',
    }),
    defineField({ name: 'bio', title: 'Bio', type: 'text', rows: 4 }),
    defineField({
      name: 'image',
      title: 'Portrait',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
    }),
    defineField({
      name: 'sameAs',
      title: 'Profile URLs',
      type: 'array',
      of: [{ type: 'url' }],
      description: 'GitHub, LinkedIn, Medium and so on. Emitted as schema.org sameAs, which is how Google ties these profiles to one person.',
    }),
  ],
  preview: { select: { title: 'name', subtitle: 'jobTitle', media: 'image' } },
})
