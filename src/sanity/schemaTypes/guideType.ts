import { defineField, defineType } from 'sanity'

export const guideType = defineType({
  name: 'guide',
  title: 'SEO Pillar Guide',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'emotionTags',
      title: 'Emotional Tags',
      type: 'array',
      description: 'Used for the Emotional Search Engine (e.g., "exhausted", "burnout", "lonely")',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
    }),
  ],
})
