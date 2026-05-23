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
      name: 'guestName',
      title: 'Guest Author Name (Community Submission)',
      type: 'string',
    }),
    defineField({
      name: 'guestEmail',
      title: 'Guest Author Email (Private)',
      type: 'string',
      description: 'Admin only. This is never displayed on the website.',
    }),
    defineField({
      name: 'isApproved',
      title: 'Approved for Public Display',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle this ON to publish. Community submissions default to false.',
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
      options: { layout: 'tags' }
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
    }),
    defineField({
      name: 'body',
      title: 'Letter Body',
      type: 'blockContent',
    }),
    defineField({
      name: 'likes',
      title: 'Likes',
      type: 'number',
      initialValue: 0,
      description: 'Number of hearts/likes from users.',
    }),
  ],
})
