import { defineField, defineType, defineArrayMember } from 'sanity'

export const ebookType = defineType({
  name: 'ebook',
  title: 'Ebook',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Book Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      initialValue: 'Srijan Pandey'
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'chapters',
      title: 'Chapters',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'chapterTitle', type: 'string', title: 'Chapter Title' }),
            defineField({ name: 'content', type: 'blockContent', title: 'Chapter Content' }),
          ],
        }),
      ],
    }),
  ],
})
