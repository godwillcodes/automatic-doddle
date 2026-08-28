import { defineType, defineField } from 'sanity'

/**
 * Form submissions land here first. Email notification is a nice-to-have on
 * top; the document is the record, so a mail outage can never lose an enquiry.
 */
export default defineType({
  name: 'submission',
  title: 'Form submission',
  type: 'document',
  readOnly: true,
  fields: [
    defineField({
      name: 'form',
      title: 'Form',
      type: 'string',
      options: {
        list: [
          { title: 'Contact', value: 'contact' },
          { title: 'Newsletter', value: 'newsletter' },
          { title: 'CV request', value: 'cv' },
        ],
      },
    }),
    defineField({ name: 'name', title: 'Name', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'message', title: 'Message', type: 'text', rows: 6 }),
    defineField({ name: 'submittedAt', title: 'Submitted at', type: 'datetime' }),
    defineField({ name: 'notified', title: 'Email sent', type: 'boolean' }),
  ],
  orderings: [
    { title: 'Newest first', name: 'newest', by: [{ field: 'submittedAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'email', subtitle: 'form', description: 'submittedAt' },
    prepare: ({ title, subtitle }) => ({
      title: title ?? 'Unknown sender',
      subtitle: subtitle ?? '',
    }),
  },
})
