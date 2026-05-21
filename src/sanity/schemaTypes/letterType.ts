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
      title: 'Published At',
      type: 'datetime',
    }),
    defineField({
      name: 'body',
      title: 'Letter Content',
      type: 'blockContent',
    }),
  ],
})
