import { defineType, defineField } from 'sanity'

/**
 * The "Currently" section on the homepage. A singleton, edited in Studio,
 * dated. A stale entry is worse than none: the section renders only when the
 * entry is fresh enough (see the query), so letting it lapse hides it rather
 * than shipping a stale date.
 */
export default defineType({
  name: 'now',
  title: 'Currently',
  type: 'document',
  fields: [
    defineField({
      name: 'updatedAt',
      title: 'As of',
      type: 'date',
      validation: (rule) => rule.required(),
      description: 'The month this entry describes. Update it when you update the items.',
    }),
    defineField({
      name: 'items',
      title: 'What is in progress',
      type: 'array',
      of: [{ type: 'text', rows: 2 }],
      validation: (rule) => rule.required().min(1).max(6),
      description: 'One short plain sentence per item. Mechanisms, not promises.',
    }),
  ],
  preview: {
    select: { subtitle: 'updatedAt' },
    prepare: ({ subtitle }) => ({ title: 'Currently', subtitle }),
  },
})
