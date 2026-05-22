import { defineField, defineType } from 'sanity'

export const quoteType = defineType({
  name: 'quote',
  title: 'Quotes',
  type: 'document',
  fields: [
    defineField({ name: 'text', title: 'Quote Text', type: 'text', validation: Rule => Rule.required() }),
    defineField({ name: 'author', title: 'Author (leave blank for your own)', type: 'string' }),
    defineField({
      name: 'emotionTags', title: 'Emotional Tags', type: 'array', of: [{ type: 'string' }],
      description: 'e.g. tired, overthinking, behind, lonely'
    }),
    defineField({
      name: 'cardColor', title: 'Card Background', type: 'string',
      options: { list: ['warm', 'dark', 'sage', 'blush', 'midnight'] }
    }),
    defineField({ name: 'featured', title: 'Feature on Homepage', type: 'boolean', initialValue: false }),
  ],
  preview: { select: { title: 'text' }, prepare: ({ title }) => ({ title: title?.slice(0, 80) + '...' }) }
})
