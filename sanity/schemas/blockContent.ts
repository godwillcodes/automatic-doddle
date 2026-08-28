import { defineType, defineArrayMember } from 'sanity'

/**
 * The article body. Portable Text plus the block types the posts actually use:
 * code samples, figures, callouts and pull quotes.
 */
export default defineType({
  title: 'Body',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Code', value: 'code' },
        ],
        annotations: [
          {
            title: 'Link',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
                validation: (rule) =>
                  rule.uri({ scheme: ['http', 'https', 'mailto', 'tel'] }),
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({ type: 'code', name: 'code', title: 'Code block' }),
    defineArrayMember({
      type: 'image',
      name: 'figure',
      title: 'Figure',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          description: 'Required for accessibility and image SEO.',
          validation: (rule) => rule.required(),
        },
        { name: 'caption', type: 'string', title: 'Caption' },
      ],
    }),
    defineArrayMember({
      type: 'object',
      name: 'callout',
      title: 'Callout',
      fields: [
        {
          name: 'tone',
          type: 'string',
          title: 'Tone',
          options: {
            list: [
              { title: 'Note', value: 'note' },
              { title: 'Tip', value: 'tip' },
              { title: 'Warning', value: 'warning' },
            ],
            layout: 'radio',
          },
          initialValue: 'note',
        },
        { name: 'title', type: 'string', title: 'Title' },
        { name: 'body', type: 'text', rows: 4, title: 'Body' },
      ],
      preview: {
        select: { title: 'title', subtitle: 'body' },
      },
    }),
  ],
})
