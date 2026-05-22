import { defineField, defineType } from 'sanity'

export const blogSeriesType = defineType({
  name: 'blogSeries',
  title: 'Blog Series',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Series Title', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: Rule => Rule.required() }),
    defineField({ name: 'description', title: 'Series Description', type: 'text' }),
    defineField({ name: 'coverImage', title: 'Cover Image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'guides', title: 'Guides in this Series (in order)',
      type: 'array', of: [{ type: 'reference', to: [{ type: 'guide' }] }]
    }),
    defineField({
      name: 'letters', title: 'Letters in this Series',
      type: 'array', of: [{ type: 'reference', to: [{ type: 'letter' }] }]
    }),
    defineField({ name: 'emotionTag', title: 'Primary Emotion', type: 'string' }),
  ],
  preview: { select: { title: 'title', media: 'coverImage' } }
})
