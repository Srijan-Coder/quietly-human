import { defineField, defineType, defineArrayMember } from 'sanity'

export const bookType = defineType({
  name: 'book',
  title: 'Book (Unified)',
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
      name: 'bookFormat',
      title: 'Book Format',
      type: 'string',
      options: {
        list: [
          { title: 'Free Ebook', value: 'free' },
          { title: 'Premium Ebook', value: 'premium' },
          { title: 'Physical Book', value: 'physical' }
        ],
        layout: 'radio'
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline (Short Description for Cards)',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Full Description',
      type: 'blockContent',
      description: 'The long-form emotional description for the dedicated book page.',
    }),

    // -- FREE EBOOK FIELDS --
    defineField({
      name: 'ebookFile',
      title: 'Upload Ebook File (PDF, DOC, EPUB)',
      type: 'file',
      description: 'Used only for Free Ebooks. Direct download link.',
      options: { storeOriginalFilename: true },
      hidden: ({ document }) => document?.bookFormat !== 'free',
    }),
    defineField({
      name: 'notionUrl',
      title: 'Notion Embed URL',
      type: 'url',
      description: 'Used only for Free Ebooks. Link out to Notion.',
      hidden: ({ document }) => document?.bookFormat !== 'free',
    }),
    defineField({
      name: 'chapters',
      title: 'Full Text Chapters',
      type: 'array',
      description: 'Used only for Free Ebooks if you want built-in reading.',
      hidden: ({ document }) => document?.bookFormat !== 'free',
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

    // -- PREMIUM EBOOK FIELDS --
    defineField({
      name: 'price',
      title: 'Price ($)',
      type: 'number',
      hidden: ({ document }) => document?.bookFormat !== 'premium',
    }),
    defineField({
      name: 'purchaseUrl',
      title: 'Gumroad/Payhip Purchase Link',
      type: 'url',
      hidden: ({ document }) => document?.bookFormat !== 'premium',
    }),
    defineField({
      name: 'whatsIncluded',
      title: 'What\'s Included',
      type: 'array',
      description: 'Bullet points for Premium Ebooks.',
      hidden: ({ document }) => document?.bookFormat !== 'premium',
      of: [defineArrayMember({ type: 'string' })],
    }),

    // -- PHYSICAL BOOK FIELDS --
    defineField({
      name: 'purchaseLinks',
      title: 'Purchase Links',
      type: 'array',
      description: 'E.g. Paperback on Amazon, Hardcover on B&N, Kindle.',
      hidden: ({ document }) => document?.bookFormat !== 'physical',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'format', type: 'string', title: 'Format (e.g. Paperback, Hardcover, Kindle)' }),
            defineField({ name: 'store', type: 'string', title: 'Store (e.g. Amazon, Barnes & Noble)' }),
            defineField({ name: 'url', type: 'url', title: 'Link' }),
          ],
        }),
      ],
    }),

    // -- SHARED PREMIUM/PHYSICAL FIELDS --
    defineField({
      name: 'demoChapter',
      title: 'Demo Chapter',
      type: 'blockContent',
      description: 'A beautifully styled demo chapter for readers to preview before buying.',
      hidden: ({ document }) => document?.bookFormat === 'free', // Only for premium and physical
    }),
  ],
})
