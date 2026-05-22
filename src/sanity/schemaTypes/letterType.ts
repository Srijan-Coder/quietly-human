import { defineField, defineType } from 'sanity'

export const letterType = defineType({
  name: 'letter',
  title: 'Midnight Letter',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Subject Line / Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Date Sent',
      type: 'datetime',
    }),
    defineField({
      name: 'emotionTags',
      title: 'Emotional Tags',
      type: 'array',
      description: 'Used for the Emotional Search Engine (e.g., "overthinking", "anxious", "behind")',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'body',
      title: 'Letter Body',
      type: 'blockContent',
    }),
  ],
})
