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
      name: 'emotionTags',
      title: 'Emotional Tags',
      type: 'array',
      description: 'Used for the Emotional Search Engine',
      of: [{ type: 'string' }],
      options: { layout: 'tags' }
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: { type: 'category' } })],
    }),
    defineField({
      name: 'ebookFile',
      title: 'Upload Ebook File (PDF, DOC, EPUB)',
      type: 'file',
      description: 'Upload a direct file for the user to download or view.',
      options: { storeOriginalFilename: true },
    }),
    defineField({
      name: 'notionUrl',
      title: 'Notion Embed URL',
      type: 'url',
      description: 'If you want to link out to a Notion page instead of a file or text.',
    }),
    defineField({
      name: 'chapters',
      title: 'Text Chapters (Optional)',
      type: 'array',
      description: 'If you want to use the built-in E-Reader, type the chapters here.',
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
